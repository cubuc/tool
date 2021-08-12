import { Study } from "./StudyDataType";

export const Evaluation: Study = {
    id: "evaluation",
    participantsNeeded: 2,
    participantsDone: 0,
    estimatedTimePerParticipant: 66,
    name: "Evaluierung",
    status: "preparation",
    procedurePlan: [
        {
            id: "beg",
            title: "Begrüßung",
            description: "kurze begrüßung",
            estimatedTime: 2,
            checklist: ["masken", "geräte desinfizieren", "requisiten bereit"],
            isCondition: 0,
        },
        {
            id: "con",
            title: "Consent form, Erklärung",
            description: "Erklärung der studie, formalitäten",
            estimatedTime: 5,
            checklist: [
                "Consent form",
                "Teilnehmer hat sich bequem eingerichtet",
                "demographic questionnaire",
            ],
            isCondition: 0,
            link: "https://docs.google.com/forms/d/e/1FAIpQLSeclGLmuHWQoAyxqhOf5y_l13k8CXkQ3NPE0O40hTNj3guaIQ/viewform?usp=sf_link",
        },
        {
            id: "studieplan",
            title: "Studie planen",
            description: "Teilnehmer pflegt studie in das program ein.",
            estimatedTime: 20,
            checklist: ["Hinweis auf möglichkeit die studie zu erweitern"],
            isCondition: 1,
            link: "https://mighty-plains-57378.herokuapp.com",
        },
        {
            id: "sus1",
            title: "SUS 1",
            description: "",
            estimatedTime: 2,
            checklist: ["id checken"],
            isCondition: 0,
            link: "https://forms.gle/XH2A1QC5Fp51M3Wv8",
        },
        {
            id: "stuDurch",
            title: "Studie durchführen",
            description:
                "durchführung einer pilot studie mithilfe des programs. Der Teilnehmer soll sich vorstellen das er die Studie eines Kollegen durchführt.\nJeder Punkt auf der Checkliste ist wichtig!",
            estimatedTime: 20,
            checklist: ["studie sessions sind richtig eingestellt"], //TODO nur wenn es steuerbare sessions gibt.
            isCondition: 2,
            link: "https://mighty-plains-57378.herokuapp.com",
        },
        {
            id: "sus2",
            title: "SUS 2",
            description: "",
            estimatedTime: 2,
            checklist: ["id checken", "aufnahme für interview vorbereiten"],
            isCondition: 0,
            link: "https://forms.gle/6RtpWsaDTN2jNhdU8",
        },
        {
            id: "interview",
            title: "Semi structured Interview",
            description: "fragen siehe zettel",
            estimatedTime: 10,
            checklist: ["alle fragen beantwortet"],
            isCondition: 0,
        },
        {
            id: "debrief",
            title: "Debriefing",
            description: "Raum für Fragen",
            estimatedTime: 5,
            checklist: ["danke sagen", "Vergütung"],
            isCondition: 0,
        },
    ],
    IV: [
        {
            id: "tool",
            name: "Mein Tool",
            levels: ["planung", "conduct"],
            balancing: "none",
            design: "within",
        },
        {
            id: "test",
            name: "Mein Tool 2",
            levels: ["foo", "bar"],
            balancing: "none",
            design: "within",
        },
    ],
    DV: [
        {
            id: "sus",
            name: "SUS results",
            measures: ["Mein Tool"],
        },
    ],
    hypotheses: [],
};

// study of participant should be similar to this study
export const CreatedStudy: Study = {
    id: "created",
    participantsNeeded: 2,
    participantsDone: 0,
    estimatedTimePerParticipant: 32,
    name: "Display Size",
    status: "preparation",
    hypotheses: [],
    procedurePlan: [
        {
            id: "gret",
            title: "Greeting",
            description: "greet the participant",
            estimatedTime: 2,
            checklist: [
                "add ids",
                "masks",
                "hands desinfection",
                "desinfect devices",
            ],
            isCondition: 0,
        },
        {
            id: "expl",
            title: "Explanation",
            description: "explain to the participant what happens",
            estimatedTime: 5,
            checklist: ["Consent form signed", "start screen recording"],
            isCondition: 0,
        },
        {
            id: "con1",
            title: "Condition set 1",
            description: "",
            estimatedTime: 5,
            checklist: ["take dvice before questionnaire 1"],
            isCondition: 1,
        },
        {
            id: "sus1",
            title: "Questionnaire 1",
            description: "first questionnaire",
            estimatedTime: 5,
            checklist: [],
            isCondition: 0,
        },
        {
            id: "con2",
            title: "Condition 2",
            description: "",
            estimatedTime: 5,
            checklist: ["note down time"],
            isCondition: 2,
        },
        {
            id: "sus2",
            title: "Questionnaire 2",
            description: "2nd questionnaire",
            estimatedTime: 5,
            checklist: [],
            isCondition: 0,
        },
        {
            id: "debrief",
            title: "Debriefing",
            description: "cooldown, room for questions",
            estimatedTime: 5,
            checklist: [
                "recarge devices",
                "desinfect devices",
                "store data in cloud and delete from devices",
                "compensation",
            ],
            isCondition: 0,
        },
    ],
    IV: [
        {
            id: "tool",
            name: "Mein Tool",
            levels: ["planung", "conduct"],
            balancing: "latin",
            design: "within",
        },
    ],
    DV: [
        {
            id: "sus",
            name: "SUS results",
            measures: ["Mein Tool"],
        },
    ],
};

// study with arbitrary tasks to test conduct mode
export const MockStudy: Study = {
    id: "mock",
    participantsNeeded: 2,
    participantsDone: 0,
    estimatedTimePerParticipant: 17,
    name: "Mock Study",
    status: "conduct",
    procedurePlan: [
        {
            id: "pre",
            title: "Preparation",
            description: "Prepare for next participant",
            estimatedTime: 2,
            checklist: [
                "add ids to paperwork",
                '"desinfect" devices (wipe with a dry towel)',
                "check if sheets are ordered by first letter",
            ],
            isCondition: 0,
        },
        {
            id: "expl",
            title: "Explanation",
            description: "give the study description sheet to the participant",
            estimatedTime: 2,
            checklist: [
                "check masks",
                "desinfect hands (with water)",
                "Consent form signed",
                "participant got description sheet",
            ],
            isCondition: 0,
        },
        {
            id: "con1",
            title: "Condition set 1",
            description:
                "showing the participant a short video OR pick a riddle",
            estimatedTime: 2,
            checklist: [
                "take device before handing out questionnaire 1",
            ], //TODO prepare a 6x6 sudoku
            isCondition: 1,
        },
        {
            id: "q1",
            title: "Questionnaire 1",
            description: "questionnaire with easy knowledge questions",
            estimatedTime: 2,
            checklist: [
                "check answers",
            ],
            isCondition: 0,
        },
        {
            id: "con2",
            title: "Condition 2",
            description: "showing another video OR pick another riddle",
            estimatedTime: 2,
            checklist: [
                "note down elapsed time on completion",
            ],
            isCondition: 2,
        },
        {
            id: "sus2",
            title: "Questionnaire 2",
            description: "questionnaire with easy knowledge questions",
            estimatedTime: 2,
            checklist: [],
            isCondition: 0,
        },
        {
            id: "debrief",
            title: "Debriefing",
            description: "cooldown, room for questions",
            estimatedTime: 5,
            checklist: [
                "sort sheets by the number on the bottom right",
                "elbow check for compensation",
            ],
            isCondition: 0,
        },
    ],
    IV: [
        {
            id: "screenSize",
            name: "Screen Sizes",
            levels: ["phone", "tablet"],
            balancing: "latin",
            design: "within",
        },
    ],
    DV: [
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
    ],
    hypotheses: [],
};

/*
{
            id: ,
            title: ,
            description: ,
            estimatedTime: ,
            checklist: [],
            isCondition: ,
        },
*/
