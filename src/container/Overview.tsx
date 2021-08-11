import React, { ChangeEvent, useRef, useState } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import {
    Box,
    Button,
    ButtonGroup,
    Grid,
    Icon,
    makeStyles,
    Paper,
    Typography,
} from "@material-ui/core";

import { SummaryCard } from "../components";
import { Study } from "../StudyDataType";
import { addStudy, generateNewStudy, selectStudies } from "../redux/studiesSlice";
import { setStudy } from "../redux/editStudySlice";
import { generateId } from "../Helpers";
import AddStudyDialog from "./AddStudyDialog";

const useExtraStyles = makeStyles((theme) => ({
    subtitle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minWidth: theme.spacing(6),
    },
}));

const populatePrepare = (data: Study[], status: string) => {
    const classes = useExtraStyles();

    const history = useHistory();

    const dispatch = useDispatch();

    const handleClick = (item: Study) => {
        let path = item.id + `/${item.status}`;
        if (item.status == "done") path = "/";
        history.push(path);
        dispatch(setStudy(item));
    };

    return data
        .filter((item) => item.status == status)
        .map((item, idx) => {
            return (
                <SummaryCard
                    onClick={() => handleClick(item)}
                    key={idx}
                    title={item.name}
                    highlight={item.status == "pilot"}
                    addonAfter={
                        <>
                            <Typography
                                variant="subtitle1"
                                className={classes.subtitle}
                            >
                                <Icon>people_alt</Icon>
                                {item.status == "conduct" &&
                                    item.participantsDone + "/"}
                                {item.participantsNeeded}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                className={classes.subtitle}
                            >
                                <Icon>access_time</Icon>
                                {item.estimatedTimePerParticipant}
                            </Typography>
                        </>
                    }
                />
            );
        });
};

// styling for material ui
const useStyles = makeStyles((theme) => ({
    overview: {
        display: "flex",
        height: "100%",
    },
    root: {
        flexGrow: 1,
        padding: theme.spacing(1),
        margin: 0,
    },
    paperColumn: {
        height: "100%",
        padding: theme.spacing(1),
        display: "flex",
        flexDirection: "column",
    },
    addButtonWrapper: {
        marginTop: theme.spacing(1),
        paddingTop: theme.spacing(1),
        position: "sticky",
        bottom: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
    },
    itemWrapper: {
        flexGrow: 1,
        overflow: "auto",
    },
    input: {
        display: "none",
    },
}));

const Overview = (): React.ReactElement => {
    const classes = useStyles();

    const dispatch = useDispatch();
    const studies = useSelector(selectStudies);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement>(null);

    // create new study on opening the dialog
    const handleAddButton = () => {
        // insert new plain study in edit study store for the dialog to change
        dispatch(setStudy(generateNewStudy()));
        setModalOpen(true);
    };

    const handleImportButton = () => {
        // Initiating file upload
        if (inputRef.current != null) {
            inputRef.current.click();
        }
    };

    // Called when file is uploaded
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget && event.currentTarget.files) {
            // get uploaded file
            event.currentTarget.files[0].text().then((value) => {
                // read out value
                try {
                    const importedStudy: Study = JSON.parse(value) as Study;
                    importedStudy.id = generateId(); // replace id to avoid potential dublicates
                    dispatch(addStudy(importedStudy));
                } catch (e) {
                    console.log(e); //TODO show warning when file couldn't be read
                }
            });
        }
    };

    return (
        <div className={classes.overview}>
            <Grid
                container
                className={classes.root}
                justify="space-around"
                spacing={1}
                alignItems="stretch"
            >
                <Grid item xs={12} md={4}>
                    <Paper className={classes.paperColumn}>
                        <Typography variant="h5" gutterBottom>
                            Prepare
                        </Typography>
                        <Box
                            className={classes.itemWrapper}
                            style={{ padding: 2, margin: -2 }}
                        >
                            {populatePrepare(studies, "preparation")}
                        </Box>
                        <Box className={classes.addButtonWrapper}>
                            <input
                                id="contained-button-file"
                                accept="text/json"
                                className={classes.input}
                                style={{ display: "none" }}
                                type="file"
                                onChange={handleInputChange}
                                ref={inputRef}
                            />
                            <ButtonGroup fullWidth>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    color="primary"
                                    size="large"
                                    startIcon={
                                        <Icon fontSize="large">add</Icon>
                                    }
                                    onClick={handleAddButton}
                                >
                                    Add
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    component="span"
                                    size="large"
                                    onClick={handleImportButton}
                                    startIcon={
                                        <Icon fontSize="large">
                                            file_upload
                                        </Icon>
                                    }
                                >
                                    Import
                                </Button>
                            </ButtonGroup>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper className={classes.paperColumn}>
                        <Typography variant="h5" gutterBottom>
                            Conduct
                        </Typography>
                        {populatePrepare(studies, "pilot")}
                        {populatePrepare(studies, "conduct")}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper className={classes.paperColumn}>
                        <Typography variant="h5" gutterBottom>
                            Done
                        </Typography>
                        {populatePrepare(studies, "done")}
                    </Paper>
                </Grid>
            </Grid>
            <AddStudyDialog open={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
};

export default Overview;
