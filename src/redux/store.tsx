import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import studiesSlice from "./studiesSlice";
import editStudySlice from "./editStudySlice";

export const store = configureStore({
    reducer: {
        editStore: editStudySlice,
        studyStore: studiesSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
