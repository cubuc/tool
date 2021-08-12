import { CreatedStudy, Evaluation, MockStudy } from "./Data";
import {
    DependentVariable,
    IndependentVariable,
    ProcedurePlanItem,
    Study,
} from "./StudyDataType";

export const ConductProcedure: ProcedurePlanItem[] = [
    {
        id: "pre",
        title: "Preparation",
        description: "Prepare for next participant",
        estimatedTime: 5,
        checklist: [
            "Disinfect devices",
            "Reset and check devices",
            "Start screen capture",
        ],
        isCondition: 0,
    },
    {
        id: "int",
        title: "Introduction",
        description: "Greet the participant, explain the procedure",
        estimatedTime: 5,
        checklist: ["Consent form", "Welcome letter"],
        isCondition: 0,
    },
    {
        id: "testCond",
        title: "Test Condition ",
        description: "See if participant understood the task",
        estimatedTime: 5,
        checklist: [],
        isCondition: 0,
    },
    {
        id: "cond1",
        title: "Condition 1",
        description: "First test condition",
        estimatedTime: 10,
        checklist: [],
        isCondition: 1,
    },
    {
        id: "question1",
        title: "Questionnaire 1",
        description: "First Questionnaire",
        estimatedTime: 5,
        checklist: [],
        isCondition: 0,
    },
    {
        id: "cond2",
        title: "Condition 2",
        description: "Second test condition",
        estimatedTime: 10,
        checklist: [],
        isCondition: 2,
    },
    {
        id: "question2",
        title: "Questionnaire 2",
        description: "Second questionnaire",
        estimatedTime: 5,
        checklist: [],
        isCondition: 0,
    },
    {
        id: "de",
        title: "Debriefing",
        description: "",
        estimatedTime: 10,
        checklist: ["Ask if the participant has questions", "Compensation"],
        isCondition: 0,
    },
    {
        id: "post",
        title: "Post participant",
        description: "Done stuff when the participant is gone",
        estimatedTime: 5,
        checklist: [
            "Stop screen capture",
            "Save data to cloud",
            "Plug in the devices",
            "Double check documents",
        ],
        isCondition: 0,
    },
];

export const DummyProcedureData: ProcedurePlanItem[] = [
    {
        id: "int",
        title: "Introduction",
        description: "Greet the participant and explain stuff",
        estimatedTime: 5,
        checklist: ["Consent form", "Free space"],
        isCondition: 0,
    },
    {
        id: "testCond",
        title: "Test Condition",
        description: "See if participant understood the task",
        estimatedTime: 5,
        checklist: ["Adapt inputs", "Prepare cards"],
        isCondition: 0,
    },
    {
        id: "cond1",
        title: "Condition 1",
        description: "First combination of test conditions",
        estimatedTime: 10,
        checklist: ["Reset app"],
        isCondition: 1,
    },
    {
        id: "question1",
        title: "Questionnaire 1",
        description: "First Questionnaire, e.g. NASA TLX",
        estimatedTime: 5,
        checklist: [],
        isCondition: 0,
    },
    {
        id: "cond2",
        title: "Condition 2",
        description: "Second combination of test conditions",
        estimatedTime: 10,
        checklist: [],
        isCondition: 2,
    },
    {
        id: "question2",
        title: "Questionnaire 2",
        description: "Second questionnaire, again NASA TLX",
        estimatedTime: 5,
        checklist: [],
        isCondition: 0,
    },
    {
        id: "cond3",
        title: "Condition 3",
        description: "First combination of test conditions",
        estimatedTime: 10,
        checklist: ["Reset app"],
        isCondition: 3,
    },
    {
        id: "cond4",
        title: "Condition 4",
        description: "First combination of test conditions",
        estimatedTime: 10,
        checklist: ["Reset app"],
        isCondition: 4,
    },
    {
        id: "de",
        title: "Debriefing",
        description: "Cooldown",
        estimatedTime: 10,
        checklist: [],
        isCondition: 0,
    },
];

const startingIvs: IndependentVariable[] = [
    {
        id: "screenSize",
        name: "Screen Sizes",
        levels: ["phone", "tablet", "watch", "screen"],
        balancing: "balanced",
        design: "within",
    },
];

const startingDvs: DependentVariable[] = [
    {
        id: "timeTask",
        name: "Time on task",
        measures: ["Screen Size"],
    },
    {
        id: "errorRate",
        name: "Error Rate",
        measures: ["Screen Size"],
    },
];

export const DummyStudy: Study = {
    id: "1",
    participantsNeeded: 16,
    participantsDone: 0,
    estimatedTimePerParticipant: 60,
    name: "Study 1",
    procedurePlan: DummyProcedureData,
    status: "preparation",
    IV: startingIvs,
    DV: startingDvs,
    hypotheses: [],
};

export const ConductStudy: Study = {
    id: "0",
    participantsNeeded: 2,
    participantsDone: 0,
    estimatedTimePerParticipant: 60,
    name: "Screen Size",
    procedurePlan: ConductProcedure,
    status: "conduct",
    IV: startingIvs,
    DV: startingDvs,
    hypotheses: [],
};

export const DummyStudies: Study[] = [
    Evaluation,
    MockStudy,
];
