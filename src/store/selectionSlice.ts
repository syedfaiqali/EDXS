import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface SelectionState {
    type: 'school' | 'college' | 'university' | 'training' | 'corporate' | null;
    name: string;
    description: string;
    globalStep: 'hero' | 'selection' | 'info' | 'organization' | 'complete';
}

const initialState: SelectionState = {
    type: null,
    name: '',
    description: '',
    globalStep: 'hero',
};

const selectionSlice = createSlice({
    name: 'selection',
    initialState,
    reducers: {
        setSelection: (state, action: PayloadAction<{ type: SelectionState['type']; name: string; description: string }>) => {
            state.type = action.payload.type;
            state.name = action.payload.name;
            state.description = action.payload.description;
            state.globalStep = 'info';
        },
        setGlobalStep: (state, action: PayloadAction<SelectionState['globalStep']>) => {
            state.globalStep = action.payload;
        },
        clearSelection: (state) => {
            state.type = null;
            state.name = '';
            state.description = '';
        },
        resetFlow: (state) => {
            state.type = null;
            state.name = '';
            state.description = '';
            state.globalStep = 'hero';
        }
    },
});

export const { setSelection, clearSelection, setGlobalStep, resetFlow } = selectionSlice.actions;
export default selectionSlice.reducer;
