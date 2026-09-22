import { configureStore } from '@reduxjs/toolkit';
import selectionReducer from './selectionSlice';
import admissionReducer from './admissionSlice';

export const store = configureStore({
    reducer: {
        selection: selectionReducer,
        admission: admissionReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
