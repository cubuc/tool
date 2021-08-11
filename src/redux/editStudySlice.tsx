import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AppThunk, RootState } from "./store";
import { calculateParticipantsNeeded } from "./studiesSlice";

import {
    DependentVariable,
    IdentifiableRawContentState,
    IndependentVariable,
    ProcedurePlanItem,
    Study,
} from "../StudyDataType";
import { DummyStudy } from "../DummyData";
import { generateId } from "../Helpers";

const initialState: Study = DummyStudy;

//TODO split slice if it gets to convoluted

export const editStudySlice = createSlice({
    name: "editStore",
    initialState,
    reducers: {
        setStudy: (state, action: PayloadAction<Study>) => {
            return action.payload;
        },
        changeName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        addProcedureItem: (state, action: PayloadAction<ProcedurePlanItem>) => {
            const idx = state.procedurePlan.findIndex((s) => s.id == action.payload.id);
            // replace plan item ...
            if (idx >= 0) state.procedurePlan[idx] = action.payload;
            else {
                // ... or add new item
                const id = generateId();
                state.procedurePlan.push({
                    ...action.payload,
                    id: id,
                });
            }
        },
        deleteProcedureItem: (state, action: PayloadAction<string>) => {
            const idx = state.procedurePlan.findIndex((s) => s.id == action.payload);
            if (idx >= 0) state.procedurePlan.splice(idx, 1);
        },
        setProcedurePlan: (state, action: PayloadAction<ProcedurePlanItem[]>) => {
            state.procedurePlan = action.payload;
        },
        addChecklistItem: (state, action: PayloadAction<{ id: string; text: string }>) => {
            const item = state.procedurePlan.find((item) => item.id == action.payload.id);
            if (item) item.checklist.push(action.payload.text);
        },
        deleteChecklistItem: (state, action: PayloadAction<{ id: string; index: number }>) => {
            const item = state.procedurePlan.find((item) => item.id == action.payload.id);
            if (item) item.checklist.splice(action.payload.index, 1);
        },
        addIndependentVariable: (state, action: PayloadAction<IndependentVariable>) => {
            const idx = state.IV.findIndex((v) => v.id == action.payload.id);
            if (idx >= 0) {
                state.IV[idx] = action.payload;
                state.procedurePlan = updateProcedurePlan(state.procedurePlan, state.IV);
            } else {
                const id = generateId();
                state.IV.push({
                    ...action.payload,
                    id: id,
                });
            }
            state.participantsNeeded = calculateParticipantsNeeded(state.IV);
        },
        deleteIndependentVariable: (state, action: PayloadAction<string>) => {
            const idx = state.IV.findIndex((iv) => iv.id == action.payload);
            if (idx >= 0) {
                state.IV.splice(idx, 1);
                state.procedurePlan = updateProcedurePlan(state.procedurePlan, state.IV);
            }
        },
        addDependentVariable: (state, action: PayloadAction<DependentVariable>) => {
            const idx = state.DV.findIndex((v) => v.id == action.payload.id);
            if (idx >= 0) state.DV[idx] = action.payload;
            else {
                const id = generateId();
                state.DV.push({
                    ...action.payload,
                    id: id,
                });
            }
        },
        deleteDependentVariable: (state, action: PayloadAction<string>) => {
            const idx = state.DV.findIndex((iv) => iv.id == action.payload);
            if (idx >= 0) state.DV.splice(idx, 1);
        },
        addHypothesis: (state, action: PayloadAction<IdentifiableRawContentState>) => {
            const idx = state.hypotheses.findIndex((h) => h.id == action.payload.id);
            if (idx >= 0) state.hypotheses[idx] = action.payload;
            else {
                state.hypotheses.push(action.payload);
            }
        },
        deleteHypothesis: (state, action: PayloadAction<string>) => {
            const idx = state.hypotheses.findIndex((h) => h.id == action.payload);
            if (idx >= 0) {
                state.hypotheses.splice(idx, 1);
            }
        },
    },
});

const updateProcedurePlan = (plan: ProcedurePlanItem[], ivs: IndependentVariable[]) => {
    // current amount of condition sets in plan
    let numOfSets = plan.filter((item) => item.isCondition).length;
    // desired number of condition sets (new ivs are created 0 levels, thus the Math.max function in the reducer)
    const numberOfConditionSets = ivs
        .filter((iv) => iv.design == "within")
        .reduce((value, iv) => value * Math.max(iv.levels.length, 1), 1);

    // add items to plan
    if (numOfSets < numberOfConditionSets) {
        for (let i = numOfSets + 1; i <= numberOfConditionSets; i++)
            plan.push({
                id: generateId(),
                title: "Condition set " + i,
                estimatedTime: 5,
                description: "",
                checklist: [],
                isCondition: i,
            });
    }

    // remove items from plan
    if (numOfSets > numberOfConditionSets) {
        let index = plan.length;
        while (numOfSets > numberOfConditionSets) {
            index--;
            if (plan[index].isCondition) {
                plan[index].isCondition = 0;
                numOfSets--;
            }
        }
    }

    return plan;
};

export const {
    setStudy,
    setProcedurePlan,
    addChecklistItem,
    addDependentVariable,
    addIndependentVariable,
    addHypothesis,
    addProcedureItem,
    changeName,
    deleteChecklistItem,
    deleteDependentVariable,
    deleteIndependentVariable,
    deleteHypothesis,
    deleteProcedureItem,
} = editStudySlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectName = (state: RootState): string => state.editStore.name;
export const selectCurrentStudy = (state: RootState): Study => state.editStore;
export const selectTotalTime = (state: RootState): number => {
    return state.editStore.procedurePlan.reduce((value, item) => item.estimatedTime + value, 0);
};
export const selectProcedurePlan = (state: RootState): ProcedurePlanItem[] =>
    state.editStore.procedurePlan;
export const selectIndependentVariables = (state: RootState): IndependentVariable[] =>
    state.editStore.IV;
export const selectDependentVariables = (state: RootState): DependentVariable[] =>
    state.editStore.DV;
export const selectHypotheses = (state: RootState): IdentifiableRawContentState[] =>
    state.editStore.hypotheses ? state.editStore.hypotheses : [];

export default editStudySlice.reducer;
