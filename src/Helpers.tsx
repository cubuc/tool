import { Dispatch, RefObject } from "react";
import { nanoid, customAlphabet } from "nanoid";
import { addStudy } from "./redux/studiesSlice";
import { setStudy } from "./redux/editStudySlice";
import { Study } from "./StudyDataType";

// function to scroll to the bottom of the list with a helper div
export const scrollToElement = (ref: RefObject<HTMLElement>): void => {
    if (ref.current !== null) {
        ref.current.scrollIntoView({ behavior: "smooth" });
    }
};

// function to generated unified ids
export const generateId = (): string => {
    return nanoid(7);
};

// function to generate participant ids
export const generateNumId = (): string => {
    const alphabet = "0123456789";
    const numId = customAlphabet(alphabet, 3);
    return numId();
};

export const updateStudy = (dispatch: Dispatch<unknown>, study: Study): void => {
    dispatch(addStudy(study));
    dispatch(setStudy(study));
};

// based on https://cs.uwaterloo.ca/~dmasson/tools/latin_square/
export const balancedLatinSquare = (conditions: string[], participantNumber: number): string[] => {
    let result = [];
    // Based on "Bradley, J. V. Complete counterbalancing of immediate sequential
    // effects in a Latin square design. J. Amer. Statist. Ass.,.1958, 53, 525-528. "
    for (let i = 0, j = 0, h = 0; i < conditions.length; ++i) {
        let val = 0;
        if (i < 2 || i % 2 != 0) {
            val = j++;
        } else {
            val = conditions.length - h - 1;
            ++h;
        }

        const idx = (val + participantNumber) % conditions.length;
        result.push(conditions[idx]);
    }

    if (conditions.length % 2 != 0 && participantNumber % 2 != 0) {
        result = result.reverse();
    }

    return result;
};
