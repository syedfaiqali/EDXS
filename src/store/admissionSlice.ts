import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
    fetchAdmissionBoard,
    fetchAdmissionSchools,
    fetchProgramDetail,
    fetchRegister,
    type AdmissionBoard,
    type AdmissionBoardFilters,
    type AdmissionProgramDetail,
    type AdmissionRegister,
    type AdmissionSchool
} from '../api/admission';
import type { RootState } from './index';

/**
 * Admissions data cached across the session.
 *
 * Boards, intakes and programme details are all keyed and kept, so returning to
 * a filter combination or reopening a programme is instant rather than another
 * round trip. Nothing here expires on its own: the board only changes when a
 * school publishes or closes an intake, which is not something a visitor needs
 * to see mid-session.
 */

/** A filter combination, normalised so equivalent filters share one entry. */
export const boardCacheKey = (filters: AdmissionBoardFilters): string =>
    [
        (filters.search ?? '').trim().toLowerCase(),
        filters.schoolCode ?? '',
        filters.city ?? ''
    ].join('|');

export const programCacheKey = (registerId: number, programId: number): string =>
    `${registerId}:${programId}`;

interface AdmissionState {
    boards: Record<string, AdmissionBoard>;
    registers: Record<number, AdmissionRegister>;
    programs: Record<string, AdmissionProgramDetail>;
    schools: AdmissionSchool[] | null;
    /** Keys currently in flight, so a second request does not duplicate the first. */
    pending: string[];
    /** Facets from the first unfiltered load, kept so filters do not narrow them. */
    facets: Pick<AdmissionBoard, 'schools' | 'cities'> | null;
    /** When each cache key was last filled, so a refresh knows what is stale. */
    fetchedAt: Record<string, number>;
}

/** How old a cached entry may be before the background refresh replaces it. */
export const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

const initialState: AdmissionState = {
    boards: {},
    registers: {},
    programs: {},
    schools: null,
    pending: [],
    facets: null,
    fetchedAt: {}
};

/**
 * `force` is set by the background refresh: it bypasses the cache check so a
 * stale entry is replaced, while the in-flight check still prevents a refresh
 * from piling onto a request already running.
 */
export const loadBoard = createAsyncThunk<
    { key: string; board: AdmissionBoard },
    AdmissionBoardFilters & { force?: boolean },
    { state: RootState }
>(
    'admission/loadBoard',
    async (filters, { signal }) => {
        const board = await fetchAdmissionBoard(filters, signal);
        return { key: boardCacheKey(filters), board };
    },
    {
        // Skip the request entirely when the answer is already known, or when an
        // identical one is already on its way.
        condition: (filters, { getState }) => {
            const key = boardCacheKey(filters);
            const state = getState().admission;
            if (state.pending.includes(`board:${key}`)) {
                return false;
            }
            return filters.force === true || !state.boards[key];
        }
    }
);

export const loadRegister = createAsyncThunk<
    AdmissionRegister | null,
    { registerId: number; force?: boolean },
    { state: RootState }
>(
    'admission/loadRegister',
    async ({ registerId }, { signal }) => fetchRegister(registerId, signal),
    {
        condition: ({ registerId, force }, { getState }) => {
            const state = getState().admission;
            if (state.pending.includes(`register:${registerId}`)) {
                return false;
            }
            return force === true || !state.registers[registerId];
        }
    }
);

export const loadProgramDetail = createAsyncThunk<
    { key: string; detail: AdmissionProgramDetail },
    { registerId: number; programId: number; force?: boolean },
    { state: RootState }
>(
    'admission/loadProgramDetail',
    async ({ registerId, programId }, { signal }) => {
        const detail = await fetchProgramDetail(registerId, programId, signal);
        return { key: programCacheKey(registerId, programId), detail };
    },
    {
        condition: ({ registerId, programId, force }, { getState }) => {
            const key = programCacheKey(registerId, programId);
            const state = getState().admission;
            if (state.pending.includes(`program:${key}`)) {
                return false;
            }
            return force === true || !state.programs[key];
        }
    }
);

export const loadSchools = createAsyncThunk<
    AdmissionSchool[],
    { force?: boolean } | undefined,
    { state: RootState }
>(
    'admission/loadSchools',
    async (_, { signal }) => fetchAdmissionSchools(signal),
    {
        condition: (arg, { getState }) => {
            const state = getState().admission;
            if (state.pending.includes('schools')) {
                return false;
            }
            return arg?.force === true || state.schools === null;
        }
    }
);

/**
 * Re-fetches everything already in the cache, in the background.
 *
 * Only keys that are actually cached are refreshed, so this never pulls data
 * nobody has looked at. Results replace the cache in place: components read
 * from the store, so a refreshed board simply re-renders with newer data and
 * no loading state is ever shown.
 */
export const refreshAdmissionCache = createAsyncThunk<void, void, { state: RootState }>(
    'admission/refresh',
    async (_, { dispatch, getState }) => {
        const state = getState().admission;

        const boardKeys = Object.keys(state.boards);
        const refreshes: Promise<unknown>[] = boardKeys.map((key) => {
            const [search, schoolCode, city] = key.split('|');
            return dispatch(loadBoard({ search, schoolCode, city, force: true }));
        });

        Object.keys(state.registers).forEach((registerId) => {
            refreshes.push(dispatch(loadRegister({ registerId: Number(registerId), force: true })));
        });

        Object.keys(state.programs).forEach((key) => {
            const [registerId, programId] = key.split(':').map(Number);
            refreshes.push(
                dispatch(loadProgramDetail({ registerId, programId, force: true }))
            );
        });

        if (state.schools !== null) {
            refreshes.push(dispatch(loadSchools({ force: true })));
        }

        await Promise.allSettled(refreshes);
    }
);

const markPending = (state: AdmissionState, key: string) => {
    if (!state.pending.includes(key)) {
        state.pending.push(key);
    }
};

const clearPending = (state: AdmissionState, key: string) => {
    state.pending = state.pending.filter((entry) => entry !== key);
};

const admissionSlice = createSlice({
    name: 'admission',
    initialState,
    reducers: {
        /** Drops everything, for when a visitor wants to see the board afresh. */
        invalidateAdmissionCache: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadBoard.pending, (state, action) => {
                markPending(state, `board:${boardCacheKey(action.meta.arg)}`);
            })
            .addCase(
                loadBoard.fulfilled,
                (state, action: PayloadAction<{ key: string; board: AdmissionBoard }>) => {
                    state.boards[action.payload.key] = action.payload.board;
                    state.fetchedAt[`board:${action.payload.key}`] = Date.now();
                    clearPending(state, `board:${action.payload.key}`);

                    // The unfiltered board is the facet source, so its facets
                    // describe the whole board and stay put as filters narrow the
                    // results. A refresh of that same board updates them.
                    const isUnfiltered = action.payload.key === '||';
                    if ((state.facets === null || isUnfiltered)
                        && action.payload.board.schools.length > 0) {
                        state.facets = {
                            schools: action.payload.board.schools,
                            cities: action.payload.board.cities
                        };
                    }
                }
            )
            .addCase(loadBoard.rejected, (state, action) => {
                clearPending(state, `board:${boardCacheKey(action.meta.arg)}`);
            })

            .addCase(loadRegister.pending, (state, action) => {
                markPending(state, `register:${action.meta.arg.registerId}`);
            })
            .addCase(loadRegister.fulfilled, (state, action) => {
                if (action.payload) {
                    state.registers[action.payload.id] = action.payload;
                    state.fetchedAt[`register:${action.payload.id}`] = Date.now();
                }
                clearPending(state, `register:${action.meta.arg.registerId}`);
            })
            .addCase(loadRegister.rejected, (state, action) => {
                clearPending(state, `register:${action.meta.arg.registerId}`);
            })

            .addCase(loadProgramDetail.pending, (state, action) => {
                const { registerId, programId } = action.meta.arg;
                markPending(state, `program:${programCacheKey(registerId, programId)}`);
            })
            .addCase(loadProgramDetail.fulfilled, (state, action) => {
                state.programs[action.payload.key] = action.payload.detail;
                state.fetchedAt[`program:${action.payload.key}`] = Date.now();
                clearPending(state, `program:${action.payload.key}`);
            })
            .addCase(loadProgramDetail.rejected, (state, action) => {
                const { registerId, programId } = action.meta.arg;
                clearPending(state, `program:${programCacheKey(registerId, programId)}`);
            })

            .addCase(loadSchools.pending, (state) => {
                markPending(state, 'schools');
            })
            .addCase(loadSchools.fulfilled, (state, action) => {
                state.schools = action.payload;
                state.fetchedAt.schools = Date.now();
                clearPending(state, 'schools');
            })
            .addCase(loadSchools.rejected, (state) => {
                clearPending(state, 'schools');
            });
    }
});

export const { invalidateAdmissionCache } = admissionSlice.actions;

export const selectBoard = (filters: AdmissionBoardFilters) => (state: RootState) =>
    state.admission.boards[boardCacheKey(filters)];

export const selectRegister = (registerId: number) => (state: RootState) =>
    state.admission.registers[registerId];

export const selectProgramDetail = (registerId: number, programId: number) => (state: RootState) =>
    state.admission.programs[programCacheKey(registerId, programId)];

export default admissionSlice.reducer;
