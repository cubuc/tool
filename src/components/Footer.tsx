import React from "react";

import { Toolbar, makeStyles, Box } from "@material-ui/core";

import { BasicProps } from "./BasicProps";

const useStyles = makeStyles((theme) => ({
    footer: {
        boxShadow: "0px -2px 2px 0px rgba(0,0,0,0.14),0px -1px 5px 0px rgba(0,0,0,0.12)",
        background: theme.palette.background.default,
        display: "flex",
        justifyContent: "space-between",
    },
    footerItem: {
        display: "flex",
        alignItems: "center",
    },
}));

interface FooterProps extends BasicProps {
    leftContent?: React.ReactNode;
    rightContent?: React.ReactNode;
}

const Footer = (props: FooterProps):React.ReactElement => {
    const classes = useStyles();

    return (
        <Toolbar className={classes.footer}>
            <Box className={classes.footerItem}>{props.leftContent}</Box>
            <Box className={classes.footerItem}>{props.rightContent}</Box>
        </Toolbar>
    );
};

export default Footer;
