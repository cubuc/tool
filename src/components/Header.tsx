import React from "react";

import { AppBar, Toolbar, makeStyles, Typography } from "@material-ui/core";

import { BasicProps } from "./BasicProps";

const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.appBar + 1, // position head bar over tab bar
    },
    title: {
        flexGrow: 1,
    },
}));

interface HeaderProps extends BasicProps {
    title: React.ReactNode;
}

const Header = (props: HeaderProps):React.ReactElement => {
    const classes = useStyles();

    return (
        <AppBar position="static" className={classes.appBar}>
            <Toolbar>
                <Typography variant="h4" className={classes.title}>
                    {props.title}
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
