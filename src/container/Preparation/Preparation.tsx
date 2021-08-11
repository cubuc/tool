import React, { ReactElement, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    AppBar,
    Box,
    Button,
    ButtonGroup,
    ClickAwayListener,
    Grow,
    Icon,
    makeStyles,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    Snackbar,
    Tab,
    Tabs,
} from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

import Procedure from "./Procedure";
import Variables from "./Variables";
import Hypotheses from "./Hypotheses";

import { selectCurrentStudy, selectTotalTime } from "../../redux/editStudySlice";
import { addStudy } from "../../redux/studiesSlice";
import { updateStudy } from "../../Helpers";
import { Footer } from "../../components";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

// styles for material ui
const useStyles = makeStyles((theme) => ({
    preparationWrapper: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
    },
    tabWrapper: {
        display: "flex",
        flex: 1,
        height: 1, // needed for overflow behaviour
    },
    preparationContent: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },
    iconTextWrapper: {
        display: "flex",
        alignItems: "center",
    },
    footerButton: {
        marginLeft: theme.spacing(1),
    },
}));

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            style={{ width: "100%" }}
        >
            {value === index && children}
        </div>
    );
}

const Preparation: React.FC = (): ReactElement => {
    const classes = useStyles();

    const dispatch = useDispatch();
    const currentStudy = useSelector(selectCurrentStudy);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const totalTime = useSelector(selectTotalTime);
    const history = useHistory();

    const [value, setValue] = React.useState(0);

    // for the split button
    const splitButtonRef = useRef<HTMLDivElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleExportButton = () => {
        // creating data string
        const dataStr =
            "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentStudy));
        // using an display:none element to initiate download
        const dlAnchorElem = document.getElementById("downloadAnchorElem");
        if (dlAnchorElem) {
            dlAnchorElem.setAttribute("href", dataStr);
            dlAnchorElem.setAttribute("download", currentStudy.name + ".json");
            dlAnchorElem.click();
        }
    };

    const handleSaveButton = () => {
        dispatch(addStudy(currentStudy));
        setSnackbarOpen(true);
    };

    const handlePilotButton = () => {
        updateStudy(dispatch, {
            ...currentStudy,
            status: "pilot",
        });
        history.push("/" + currentStudy.id + "/pilot");
    };

    const handleMenuToggle = () => {
        setMenuOpen((prev) => !prev);
    };

    const handleMenuClose = (event: React.MouseEvent<Document, MouseEvent>) => {
        if (
            splitButtonRef.current &&
            splitButtonRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setMenuOpen(false);
    };

    const handleChange = (event: React.ChangeEvent<unknown>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box className={classes.preparationWrapper}>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                    <Tab label="Procedure" />
                    <Tab label="Variables" />
                    <Tab label="Hypotheses" />
                </Tabs>
            </AppBar>
            <Box className={classes.tabWrapper}>
                <TabPanel value={value} index={0}>
                    <Procedure />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Variables />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Hypotheses />
                </TabPanel>
            </Box>
            <Footer
                leftContent={
                    <>
                        <Box className={classes.iconTextWrapper} p={1}>
                            <Icon>people_alt</Icon>
                            {currentStudy.participantsNeeded}
                        </Box>
                        <Box className={classes.iconTextWrapper} p={1}>
                            <Icon>access_time</Icon> {totalTime}
                        </Box>
                    </>
                }
                rightContent={
                    <>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => history.push("/")}
                        >
                            Quit
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Icon>download</Icon>}
                            onClick={handleExportButton}
                            className={classes.footerButton}
                        >
                            Export
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Icon>save</Icon>}
                            onClick={handleSaveButton}
                            className={classes.footerButton}
                        >
                            Save
                        </Button>
                        <ButtonGroup
                            variant="contained"
                            color="primary"
                            ref={splitButtonRef}
                            aria-label="split button"
                            className={classes.footerButton}
                        >
                            <Button onClick={handlePilotButton}>start pilot</Button>
                            <Button
                                color="primary"
                                size="small"
                                aria-controls={menuOpen ? "split-button-menu" : undefined}
                                aria-expanded={menuOpen ? "true" : undefined}
                                aria-haspopup="menu"
                                onClick={handleMenuToggle}
                            >
                                <Icon>arrow_drop_down</Icon>
                            </Button>
                        </ButtonGroup>
                    </>
                }
            />
            <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Study Saved!
                </Alert>
            </Snackbar>
            <Popper
                open={menuOpen}
                anchorEl={splitButtonRef.current}
                role={undefined}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === "bottom" ? "center top" : "center bottom",
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleMenuClose}>
                                <MenuList id="split-button-menu">
                                    {["Start Conduct", "Close Study"].map((option, index) => (
                                        <MenuItem key={option} disabled={index === 2}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
            <a id="downloadAnchorElem" style={{ display: "none" }}></a>
        </Box>
    );
};

export default Preparation;
