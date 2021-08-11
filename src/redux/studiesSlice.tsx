import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AppThunk, RootState } from "./store";

import { IndependentVariable, Study } from "../StudyDataType";
import { DummyStudies } from "../DummyData";
import { generateId } from "../Helpers";

const initialState: Study[] = DummyStudies;

export const studiesSlice = createSlice({
    name: "studyStore",
    initialState,
    reducers: {
        addStudy: (state, action: PayloadAction<Study>) => {
            const idx = state.findIndex((s) => s.id == action.payload.id);
            // replace study ...
            if (idx >= 0) {
                const study: Study = {
                    ...action.payload,
                    estimatedTimePerParticipant: action.payload.procedurePlan.reduce(
                        (value, item) => item.estimatedTime + value,
                        0
                    ),
                };
                state[idx] = study;
            } else {
                // ... or add new study
                state.push({
                    ...action.payload,
                    estimatedTimePerParticipant: action.payload.procedurePlan.reduce(
                        (value, item) => item.estimatedTime + value,
                        0
                    ),
                });
            }
        },
        deleteStudy: (state, action: PayloadAction<string>) => {
            const idx = state.findIndex((s) => s.id == action.payload);
            if (idx >= 0) state.splice(idx, 1);
        },
    },
});

export const calculateParticipantsNeeded = (ivs: IndependentVariable[]): number => {
    return ivs
        .filter((iv) => iv.balancing != "none" || iv.design != "within") // design=within && balancing == none
        .reduce((value, item) => item.levels.length * value, 1); 
};

export const generateNewStudy = (): Study => {
    const id = generateId();
    const study: Study = {
        name: "",
        id: id,
        participantsNeeded: 0,
        participantsDone: 0,
        estimatedTimePerParticipant: 0,
        procedurePlan: [],
        status: "preparation",
        IV: [],
        DV: [],
        hypotheses: [],
    };

    return study;
};

export const generateNamedStudy = (name: string): Study => {
    const study = generateNewStudy();

    return {
        ...study,
        name: name,
    };
};

export const { addStudy, deleteStudy } = studiesSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export const selectStudies = (state: RootState): Study[] => state.studyStore;

export default studiesSlice.reducer;
