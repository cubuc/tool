import React, { ChangeEvent, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import {
    Box,
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    Checkbox,
    Grid,
    Icon,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    Menu,
    MenuItem,
    Paper,
    TextField,
    Typography,
} from "@material-ui/core";

import {
    addChecklistItem,
    addProcedureItem,
    deleteChecklistItem,
    selectCurrentStudy,
} from "../../redux/editStudySlice";
import { Footer, formatTime, useTimer } from "../../components";
import { Identifiable } from "../../StudyDataType";
import { balancedLatinSquare, generateNumId, updateStudy } from "../../Helpers";
import { WarningDialog } from "../../components/WarningDialog";
import ConductSession from "./ConductSession";
import { ChecklistInput } from "../Preparation/Checklists";

// styles for material ui
const useStyles = makeStyles((theme) => ({
    overview: {
        display: "flex",
        height: "100%",
    },
    conductWrapper: {
        height: "100%",
    },
    conductContent: {
        flex: 1,
        padding: theme.spacing(1),
    },
    paperColumnGridItem: {
        padding: theme.spacing(1) / 2,
    },
    paperColumn: {
        height: "100%",
        padding: theme.spacing(1),
        display: "flex",
        flexDirection: "column",
    },
    footerButton: {
        marginLeft: theme.spacing(1),
    },
    scrollPaper: {
        flexGrow: 1,
        overflow: "auto",
        height: 1,
        margin: -2,
        padding: 2,
    },
    procedureCard: {
        marginBottom: theme.spacing(1),
    },
    headerBox: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    highlighted: {
        backgroundColor: theme.palette.primary.light,
    },
    description: {
        color: theme.palette.text.primary,
    },
}));

interface RunData extends Identifiable {
    times?: number[];
    notes?: string[];
    conditions: { [variable: string]: string[] };
}

const Conduct = (): React.ReactElement => {
    const classes = useStyles();

    const dispatch = useDispatch();
    const currentStudy = useSelector(selectCurrentStudy);
    const history = useHistory();

    const isPilot = currentStudy.status == "pilot";

    // ref for checklists text input
    const inputRef = useRef<HTMLInputElement>(null);

    const [desc, setDesc] = useState("");
    const [warningOpen, setWarningOpen] = useState(false);

    // timer components
    const { timer, isActive, isRunning, handleStart, handlePause, handleResume, handleReset } =
        useTimer(0);

    /* in the pilot phase the step to get the setup can be skipped
    /   -2 ~ conduct has to create conditions
    /   -1 ~ study ready to start
    /   0  ~ procedureplan item [0]
    /   x  ~ last procedureplan item
    /   x+1~ conclude study */
    const [currentStep, setCurrentStep] = useState(isPilot ? -1 : -2);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const [realTimes, setRealTimes] = useState<number[]>([]);
    const [runData, setRunData] = useState<null | RunData>(null);

    // object to track all checklist item values
    const [clValues, setClValues] = useState<{ [item: string]: boolean }>(() => {
        const state: { [item: string]: boolean } = {};

        currentStudy.procedurePlan
            .flatMap((item) => item.checklist) // create array of all items
            .forEach((c) => (state[c] = false)); // add all items to state

        return state;
    });

    const currItem =
        currentStep >= 0 && currentStep < currentStudy.procedurePlan.length
            ? currentStudy.procedurePlan[currentStep]
            : undefined;

    // ======= Checklist functions =======

    const addItem = () => {
        if (inputRef.current && inputRef.current.value != "" && currItem) {
            const id = currItem.id;

            // add new checklistitem to value tracking
            setClValues({
                ...clValues,
                [inputRef.current.value]: false,
            });
            dispatch(addChecklistItem({ id: id, text: inputRef.current.value }));
            inputRef.current.value = "";
        }
    };

    // delete checklistitem 'index' from procedureplanitem 'id'
    // delete prop 'item' from clValues
    const handleDelete = (id: string, index: number, item: string) => {
        const newVals = clValues;
        delete newVals[item];
        setClValues(newVals);

        dispatch(deleteChecklistItem({ id, index }));
    };

    const handleLabelClick = (item: string) => {
        setClValues({
            ...clValues,
            [item]: !clValues[item],
        });
    };

    const handleKeyUp = (event: React.KeyboardEvent) => {
        if (event.key == "Enter") addItem();
    };

    // ======= Footer button functions =======

    const handleNextStep = () => {
        if (!isPilot && !checkChecklistComplete()) {
            setWarningOpen(true);
            return;
        }

        if (isActive && !isRunning && currentStep + 2 == realTimes.length) {
            setRealTimes([...realTimes.slice(0, -1)]);
            handleResume();
        }

        switch (currentStep) {
            case -2:
                generateRunData();
                break;
            case -1:
                if (!isActive && !isRunning) handleStart();
                break;
            case currentStudy.procedurePlan.length - 1:
                handlePause();
            // fall through
            // eslint-disable-next-line no-fallthrough
            default:
                if (currentStep == realTimes.length) setRealTimes([...realTimes, timer]);
                break;
        }
        updateDescription();
        setCurrentStep(currentStep + 1);
    };

    const handleStepBack = () => {
        if (isActive && currentStep == realTimes.length) setRealTimes([...realTimes, timer]);

        switch (currentStep) {
            case 0:
                handleReset();
                setRealTimes([]);
                break;
            case -1:
                setRunData(null);
                break;
            default:
                handlePause();
                break;
        }
        updateDescription(true);
        setCurrentStep(currentStep - 1);
    };

    const generateRunData = () => {
        const withinIVs = currentStudy.IV.filter((iv) => iv.design == "within");
        const setOfLevels: { [variable: string]: string[] } = {};

        const none = withinIVs.filter((iv) => iv.balancing == "none");
        none.forEach((iv) => {
            setOfLevels[iv.name] = iv.levels;
        });

        const balanced = withinIVs.filter((iv) => iv.balancing == "balanced");
        balanced.forEach((iv) => {
            setOfLevels[iv.name] = balancedLatinSquare(
                iv.levels,
                currentStudy.participantsDone + 1
            );
        });

        const between = currentStudy.IV.filter((iv) => iv.design == "between");
        between.forEach((iv) => {
            // use procedure plan length as length of array to ensure a value for every condition is read
            setOfLevels[iv.name] = Array.from(Array(currentStudy.procedurePlan.length).keys()).map(
                () => iv.levels[currentStudy.participantsDone % iv.levels.length]
            );
        });

        // setup erstellen:
        // - id generieren
        // - between vars level aussuchen
        // - within vars level verteilen
        // -
        const id = generateNumId();
        setRunData({ id: id, conditions: setOfLevels });
    };

    const updateDescription = (goBack?: boolean) => {
        if (currItem)
            dispatch(
                addProcedureItem({
                    ...currItem,
                    description: desc,
                })
            );
        if (goBack && currentStep - 1 >= 0)
            setDesc(currentStudy.procedurePlan[currentStep - 1].description + "");
        else if (currentStep + 1 >= 0 && currentStep + 1 < currentStudy.procedurePlan.length) {
            setDesc(currentStudy.procedurePlan[currentStep + 1].description + "");
        }
    };

    const handleConclude = () => {
        updateStudy(dispatch, {
            ...currentStudy,
            participantsDone: currentStudy.participantsDone + 1,
        });
        // reseting screen
        setRunData(null);
        handleReset();
        setRealTimes([]);
        setCurrentStep(isPilot ? -1 : -2);
    };

    const handleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClick = (option: "preparation" | "pilot" | "conduct") => {
        setAnchorEl(null);
        history.push(`/${currentStudy.id}/${option}`);

        updateStudy(dispatch, {
            ...currentStudy,
            status: option,
        });

        setRunData(null);
        handleReset();
        setRealTimes([]);

        setCurrentStep(option == "pilot" ? -1 : -2);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // ======= Diverse functions =======

    const checkChecklistComplete = (): boolean => {
        if (!currItem) return true;
        return currItem.checklist.reduce((b: boolean, item) => clValues[item] && b, true);
    };

    const cumulatedTime = (index: number): number => {
        if (index < 0 || index >= currentStudy.procedurePlan.length) return 0;
        return (
            currentStudy.procedurePlan[index].estimatedTime +
            [...currentStudy.procedurePlan]
                .splice(0, index)
                .reduce((v, item) => v + item.estimatedTime, 0)
        );
    };

    const handleDescChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDesc(event.target.value);
    };

    const getConditions = (num: number): React.ReactNode => {
        if (!runData) return undefined;

        const conditions = Object.keys(runData.conditions).map((key) => {
            return runData.conditions[key][num - 1];
        });

        return conditions.join(", ");
    };

    const getTimerElement = (idx: number): React.ReactNode => {
        let time = 0;
        realTimes[idx]
            ? idx > 0
                ? (time = realTimes[idx] - realTimes[idx - 1])
                : (time = realTimes[idx])
            : currentStep == idx
            ? idx > 0
                ? (time = timer - realTimes[idx - 1])
                : (time = timer)
            : (time = 0);

        return (
            <Box
                color={
                    currentStudy.procedurePlan[idx].estimatedTime * 60 < time ? "red" : "inherit"
                }
            >
                {formatTime(time) +
                    "/" +
                    formatTime(currentStudy.procedurePlan[idx].estimatedTime * 60)}
            </Box>
        );
    };

    const handleDialogClose = (cont?: boolean) => {
        if (cont) {
            setRealTimes([...realTimes, timer]);
            updateDescription();
            setCurrentStep(currentStep + 1);
        }

        setWarningOpen(false);
    };

    return (
        <Grid container direction="column" className={classes.conductWrapper}>
            <ConductSession step={currentStep} />
            <Grid
                container
                className={classes.conductContent}
                justify="space-around"
                spacing={0}
                item
                alignItems="stretch"
            >
                <Grid item xs={12} md={9} className={classes.paperColumnGridItem}>
                    <Paper className={classes.paperColumn}>
                        <Typography variant="h5" gutterBottom>
                            Procedure
                        </Typography>
                        <Paper elevation={0} className={classes.scrollPaper}>
                            {currentStudy.procedurePlan.map((item, idx) => {
                                return (
                                    <Card key={item.id} className={classes.procedureCard}>
                                        <CardHeader
                                            className={
                                                currentStep == idx ? classes.highlighted : ""
                                            }
                                            title={
                                                <Box className={classes.headerBox}>
                                                    <span>{item.title}</span>
                                                    <span>{getTimerElement(idx)}</span>
                                                </Box>
                                            }
                                            subheader={
                                                item.isCondition
                                                    ? getConditions(item.isCondition)
                                                    : undefined
                                            }
                                        />
                                        <List dense>
                                            {item.checklist.map((check, iidx) => {
                                                return (
                                                    <ListItem
                                                        key={iidx}
                                                        button
                                                        onClick={() => handleLabelClick(check)}
                                                        disabled={idx != currentStep}
                                                    >
                                                        <ListItemIcon>
                                                            <Checkbox
                                                                id={check}
                                                                edge="start"
                                                                inputProps={{
                                                                    "aria-labelledby": check,
                                                                }}
                                                                disableRipple
                                                                tabIndex={-1}
                                                                checked={clValues[check]}
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText id={check} primary={check} />
                                                        {isPilot && (
                                                            <ListItemSecondaryAction>
                                                                <IconButton
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            item.id,
                                                                            iidx,
                                                                            check
                                                                        )
                                                                    }
                                                                    size="small"
                                                                    color="secondary"
                                                                    edge="end"
                                                                    aria-label="delete-item"
                                                                    disabled={idx != currentStep}
                                                                >
                                                                    <Icon>delete</Icon>
                                                                </IconButton>
                                                            </ListItemSecondaryAction>
                                                        )}
                                                    </ListItem>
                                                );
                                            })}
                                            {isPilot && currentStep == idx && (
                                                <ListItem>
                                                    <ListItemText
                                                        primary={
                                                            <ChecklistInput
                                                                ref={inputRef}
                                                                onAddClick={addItem}
                                                                onKeyUp={handleKeyUp}
                                                            />
                                                        }
                                                    />
                                                </ListItem>
                                            )}
                                        </List>
                                    </Card>
                                );
                            })}
                        </Paper>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3} className={classes.paperColumnGridItem}>
                    <Paper className={classes.paperColumn}>
                        <Typography variant="h5" gutterBottom>
                            {currItem ? currItem.title : "Summary"}
                        </Typography>
                        {currItem ? (
                            <TextField
                                label="Description"
                                id={"description"}
                                value={desc}
                                onChange={handleDescChange}
                                multiline
                                fullWidth
                                rows={4}
                                variant="outlined"
                                disabled={!isPilot}
                                inputProps={{ className: classes.description }}
                            />
                        ) : (
                            <Box>
                                <Typography variant="body1">
                                    Total time: {currentStudy.estimatedTimePerParticipant}
                                </Typography>
                                <Typography variant="body1">
                                    Participants (done/total): {currentStudy.participantsDone}/
                                    {currentStudy.participantsNeeded}
                                </Typography>
                                <Typography variant="body1">
                                    Participant ID: {runData ? runData.id : "---"}
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
            <Grid item>
                <Footer
                    leftContent={
                        <>
                            <Box p={1} marginRight={2}>
                                <Typography
                                    variant="h5"
                                    style={{
                                        color:
                                            timer > cumulatedTime(currentStep) * 60
                                                ? "red"
                                                : "inherit",
                                    }}
                                    component="div"
                                >
                                    {formatTime(
                                        timer,
                                        currentStudy.estimatedTimePerParticipant >= 60
                                    ) +
                                        "/" +
                                        formatTime(currentStudy.estimatedTimePerParticipant * 60)}
                                </Typography>
                            </Box>
                            <Typography variant="h5">ID: {runData ? runData.id : "---"}</Typography>
                        </>
                    }
                    rightContent={
                        <>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => history.push("/")}
                                className={classes.footerButton}
                            >
                                Quit
                            </Button>
                            <Button
                                variant="contained"
                                disabled={isActive}
                                className={classes.footerButton}
                                onClick={handleMenu}
                            >
                                Change Mode
                            </Button>
                            <ButtonGroup
                                variant="contained"
                                color="primary"
                                className={classes.footerButton}
                            >
                                {isPilot && currentStep < currentStudy.procedurePlan.length && (
                                    <Button
                                        size="small"
                                        onClick={handleStepBack}
                                        disabled={currentStep == -2}
                                    >
                                        <Icon>arrow_back</Icon>
                                    </Button>
                                )}
                                {currentStep < currentStudy.procedurePlan.length ? (
                                    <Button onClick={handleNextStep}>
                                        {currentStep == -2
                                            ? "Get Setup"
                                            : currentStep == -1
                                            ? "Start"
                                            : currentStep == currentStudy.procedurePlan.length - 1
                                            ? "Finish"
                                            : "Next"}
                                    </Button>
                                ) : (
                                    <Button onClick={handleConclude}>Conclude</Button>
                                )}
                            </ButtonGroup>
                            <Menu
                                id="mode-menu"
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={() => handleMenuClick("preparation")}>
                                    Preparation
                                </MenuItem>
                                <MenuItem
                                    onClick={() => handleMenuClick("pilot")}
                                    disabled={isPilot}
                                >
                                    Pilot
                                </MenuItem>
                                <MenuItem
                                    onClick={() => handleMenuClick("conduct")}
                                    disabled={!isPilot}
                                >
                                    Conduct
                                </MenuItem>
                            </Menu>
                        </>
                    }
                />
            </Grid>
            <WarningDialog open={warningOpen} onClose={handleDialogClose}>
                <Typography variant="body1">
                    The following items have not been checked off:
                    {currItem ? (
                        <List>
                            {" "}
                            {currItem.checklist.map((item) => {
                                return clValues[item] ? undefined : <ListItem>{item}</ListItem>;
                            })}
                        </List>
                    ) : (
                        "No current Item"
                    )}
                    Do you still want to continue?
                </Typography>
            </WarningDialog>
        </Grid>
    );
};

export default Conduct;
