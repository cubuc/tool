import React, { useCallback } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash.debounce";

import { InputBase, makeStyles } from "@material-ui/core";

import { Header } from "./components";
import { ClientSession, Conduct, Overview, Preparation } from "./container";
import { changeName, selectName } from "./redux/editStudySlice";

const useStyles = makeStyles((theme) => ({
    app: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
    },
    content: {
        background: theme.palette.background.lightBlue,
        overflow: "auto",
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },
    headerInput: {
        fontSize: theme.typography.h4.fontSize,
        fontWeight: theme.typography.h4.fontWeight,
        minWidth: 50,
        "&.Mui-focused": {
            backgroundColor: theme.palette.primary.light,
        },
    },
}));

const App = (): React.ReactElement => {
    const classes = useStyles();

    const dispatch = useDispatch();
    const location = useLocation();
    const studyTitle = useSelector(selectName);

    // headerNav not needed with quit button in preparation footer
    //const headerNav = location.pathname != "/"
    //    && <Button color="inherit" onClick={onBackButtonClick}>Back to overview</Button>;

    // debouncing update on redux store
    const debouncedChangeName = useCallback(
        debounce((variable) => dispatch(changeName(variable)), 200),
        []
    );

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        debouncedChangeName(event.target.value);
    };

    // set title of study if in one of the four modes
    const title =
        location.pathname == "/" ? (
            "Overview"
        ) : (
            <InputBase
                className={classes.headerInput}
                defaultValue={studyTitle}
                inputProps={{ "aria-label": "title of study" }}
                onChange={handleNameChange}
            />
        );

    return (
        <div className={classes.app}>
            <Switch>
                <Route path="/participant">
                    <ClientSession />
                </Route>
                <Route path="/">
                    <Header title={title || ""} />
                    <div className={classes.content}>
                        <Switch>
                            <Route path="/:studyId/pilot">
                                <Conduct />
                            </Route>
                            <Route path="/:studyId/conduct">
                                <Conduct />
                            </Route>
                            <Route path="/:studyId/preparation">
                                <Preparation />
                            </Route>
                            <Route path="/">
                                <Overview />
                            </Route>
                        </Switch>
                    </div>
                </Route>
            </Switch>
        </div>
    );
};

export default App;
