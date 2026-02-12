import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface SelectionState {
    type: 'school' | 'college' | 'university' | null;
    name: string;
    description: string;
}

const initialState: SelectionState = {
    type: null,
    name: '',
    description: '',
};

const selectionSlice = createSlice({
    name: 'selection',
    initialState,
    reducers: {
        setSelection: (state, action: PayloadAction<{ type: SelectionState['type']; name: string; description: string }>) => {
            state.type = action.payload.type;
            state.name = action.payload.name;
            state.description = action.payload.description;
        },
        clearSelection: (state) => {
            state.type = null;
            state.name = '';
            state.description = '';
        },
    },
});

export const { setSelection, clearSelection } = selectionSlice.actions;
export default selectionSlice.reducer;
