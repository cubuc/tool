/**
 * Basic interfaces that are used in the tool
 */

import { RawDraftContentState } from "draft-js";

export interface Study extends Identifiable {
    participantsNeeded: number;
    participantsDone: number;
    estimatedTimePerParticipant: number;
    name: string;
    status: "preparation" | "pilot" | "conduct" | "done";
    procedurePlan: ProcedurePlanItem[];
    IV: IndependentVariable[];
    DV: DependentVariable[];
    hypotheses: IdentifiableRawContentState[];
}

export type IdentifiableRawContentState = RawDraftContentState & Identifiable;

export interface ProcedurePlanItem extends Identifiable {
    title: string;
    estimatedTime: number;
    description?: string;
    checklist: string[];
    link?: string;
    isCondition: number; // non conditions are 0
}

export interface IndependentVariable extends Identifiable {
    name: string;
    levels: string[];
    balancing: "none" | "latin" | "balanced" | "complete";
    design: "within" | "between";
    description?: string;
}

export interface DependentVariable extends Identifiable {
    name: string;
    measures: string[];
    meansOfMeasure?: string;
    description?: string;
}

// If screen size has an influence on performance
// https://www.csub.edu/~ddodenhoff/Bio100/Bio100sp04/formattingahypothesis.htm
//export interface Hypothesis extends Identifiable {
//    ivIDs: string[],
//    dvIDs: string[],
//}

export interface Identifiable {
    id: string;
}
