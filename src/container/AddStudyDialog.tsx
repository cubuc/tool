import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    Icon,
    IconButton,
    InputAdornment,
    InputLabel,
    makeStyles,
    OutlinedInput,
    Step,
    StepButton,
    Stepper,
    TextField,
    Tooltip,
    Typography,
} from "@material-ui/core";

import {
    selectIndependentVariables,
    selectDependentVariables,
    selectHypotheses,
    addIndependentVariable,
    addDependentVariable,
    changeName,
    selectCurrentStudy,
    addHypothesis,
} from "../redux/editStudySlice";
import { IndependentVariable, DependentVariable } from "../StudyDataType";
import { IndependentVarItem, DependentVarItem } from "./Preparation/Variables";
import { addStudy } from "../redux/studiesSlice";
import { ContentState, convertToRaw } from "draft-js";
import { generateId } from "../Helpers";
import { HypothesisItem } from "./Preparation/Hypotheses";

export interface AddStudyDialog {
    open: boolean;
    onClose: () => void;
}

const useStyles = makeStyles((theme) => ({
    dialogContent: {
        display: "flex",
        flexDirection: "column",
    },
    input: {
        display: "none",
    },
    formInput: {
        marginBottom: theme.spacing(1),
    },
    itemWrapper: {
        height: "500px",
        overflowY: "auto",
        overflowX: "hidden", // needed because of a scrollbar flickering on expansion toggle
    },
    hypothesisWrapper: {
        height: "400px",
        overflowY: "auto",
        overflowX: "hidden", // needed because of a scrollbar flickering on expansion toggle
    },
    code: {
        fontSize: "1.1em",
        padding: ".2em .3em",
        backgroundColor: "#f1f2f4",
        borderRadius: "4px",
        fontFamily: "monospace",
    },
}));

const getSteps = () => {
    return ["General Information", "Independent Variables", "Dependent Variables", "Hypotheses"];
};

const getStepTitle = (step: number) => {
    const openInNewTab = (url: string) => {
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
    };

    switch (step) {
        case 0:
            return (
                <span>
                    Step 1: General Information
                    <Tooltip title={"test"}>
                        <IconButton>
                            <Icon>help_outline</Icon>
                        </IconButton>
                    </Tooltip>
                </span>
            );
        case 1:
            return (
                <span>
                    Step 2: Declare Independent Variables
                    <Tooltip
                        title={
                            "Independent Variables are factors that are set by the researchers. Click the icon for more information"
                        }
                    >
                        <IconButton
                            onClick={() =>
                                openInNewTab(
                                    "https://en.wikipedia.org/wiki/Dependent_and_independent_variables"
                                )
                            }
                        >
                            <Icon>help_outline</Icon>
                        </IconButton>
                    </Tooltip>
                </span>
            );
        case 2:
            return (
                <span>
                    Step 3: Declare Dependent Variables
                    <Tooltip title={"test"}>
                        <IconButton>
                            <Icon>help_outline</Icon>
                        </IconButton>
                    </Tooltip>
                </span>
            );
        case 3:
            return (
                <span>
                    Step 3: Think about hypotheses and research questions
                    <Tooltip title={"test"}>
                        <IconButton>
                            <Icon>help_outline</Icon>
                        </IconButton>
                    </Tooltip>
                </span>
            );
        default:
            return "Unknown step";
    }
};

const getStepContent = (step: number) => {
    // TODO split useStyles?
    const classes = useStyles();
    const dispatch = useDispatch();

    const ivs = useSelector(selectIndependentVariables);
    const dvs = useSelector(selectDependentVariables);
    const hypotheses = useSelector(selectHypotheses);

    const handleAddIV = () => {
        const newVar: IndependentVariable = {
            id: "test",
            name: "Variable " + (ivs.length + 1),
            levels: [],
            balancing: "latin",
            design: "within",
        };
        dispatch(addIndependentVariable(newVar));
    };

    const handleAddDV = () => {
        const newVar: DependentVariable = {
            id: "",
            name: "Variable " + (dvs.length + 1),
            measures: [],
            description: "",
        };
        dispatch(addDependentVariable(newVar));
    };

    const handleAddHypothesis = () => {
        dispatch(
            addHypothesis({
                ...convertToRaw(ContentState.createFromText("")),
                id: generateId(),
            })
        );
    };

    switch (step) {
        case 0:
            return (
                <Box>
                    <FormControl className={classes.formInput} variant="outlined" fullWidth>
                        <InputLabel htmlFor="title">Title</InputLabel>
                        <OutlinedInput
                            id="title"
                            label="Title"
                            onChange={(event) => {
                                dispatch(changeName(event.target.value));
                            }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <Tooltip title={"test"}>
                                        <IconButton>
                                            <Icon>help_outline</Icon>
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <TextField
                        label="Authors"
                        id="authors"
                        fullWidth
                        variant="outlined"
                        className={classes.formInput}
                    />
                    <TextField
                        label="Description"
                        id="description"
                        multiline
                        fullWidth
                        rowsMax={4}
                        rows={4}
                        variant="outlined"
                    />
                </Box>
            );
        case 1:
            return (
                <Grid container spacing={1}>
                    <Grid item xs={12} className={classes.itemWrapper}>
                        {ivs.map((iv, index) => (
                            <IndependentVarItem
                                {...iv}
                                key={index}
                                defaultExpanded={index == ivs.length - 1}
                            />
                        ))}
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            fullWidth
                            color="primary"
                            size="large"
                            startIcon={<Icon fontSize="large">add</Icon>}
                            onClick={handleAddIV}
                        >
                            Add
                        </Button>
                    </Grid>
                </Grid>
            );
        case 2:
            return (
                <Grid container spacing={1}>
                    <Grid item xs={12} className={classes.itemWrapper}>
                        {dvs.map((dv, index) => (
                            <DependentVarItem
                                {...dv}
                                key={index}
                                defaultExpanded={index == dvs.length - 1}
                            />
                        ))}
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            fullWidth
                            color="primary"
                            size="large"
                            startIcon={<Icon fontSize="large">add</Icon>}
                            onClick={handleAddDV}
                        >
                            Add
                        </Button>
                    </Grid>
                </Grid>
            );
        case 3:
            return (
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            You can add variables from the study to a hypothesis by typing{" "}
                            <code className={classes.code}>@</code> for independent variables, or{" "}
                            <code className={classes.code}>#</code> for dependent variables.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className={classes.hypothesisWrapper}>
                        {hypotheses.map((item, idx) => (
                            <HypothesisItem
                                key={item.id}
                                content={item}
                                defaultExpanded={idx == hypotheses.length - 1}
                            ></HypothesisItem>
                        ))}
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            fullWidth
                            color="primary"
                            size="large"
                            startIcon={<Icon fontSize="large">add</Icon>}
                            onClick={handleAddHypothesis}
                        >
                            Add
                        </Button>
                    </Grid>
                </Grid>
            );
        default:
            return "Unknown step";
    }
};

const AddStudyDialog = (props: AddStudyDialog): React.ReactElement => {
    const classes = useStyles();

    const dispatch = useDispatch();
    const currentStudy = useSelector(selectCurrentStudy);

    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();

    // for the dialog
    const totalSteps = () => {
        return steps.length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const handleNext = () => {
        if (isLastStep()) {
            dispatch(addStudy(currentStudy));
            handleClose();
        } else {
            setActiveStep(activeStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    const handleClose = () => {
        setActiveStep(0);
        props.onClose();
    };

    return (
        <Dialog open={props.open} fullWidth maxWidth="lg" disableBackdropClick disableEscapeKeyDown>
            <DialogTitle>{getStepTitle(activeStep)}</DialogTitle>
            <DialogContent className={classes.dialogContent}>
                {getStepContent(activeStep)}
                <Stepper nonLinear activeStep={activeStep}>
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepButton onClick={handleStep(index)}>{label}</StepButton>
                        </Step>
                    ))}
                </Stepper>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                    Back
                </Button>
                <Button variant="contained" color="primary" onClick={handleNext}>
                    {isLastStep() ? "Finish" : "Next"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddStudyDialog;
