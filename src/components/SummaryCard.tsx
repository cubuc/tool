import React from "react";

import { Box, makeStyles, Paper, Typography } from "@material-ui/core";

import { BasicProps } from "./BasicProps";

export interface SummaryCardProps extends BasicProps {
    addonBefore?: React.ReactNode;
    addonAfter?: React.ReactNode;
    title: React.ReactNode;
    onClick?: () => void;
    highlight?: boolean;
    bodyNode?: React.ReactNode;
}

const useStyles = makeStyles((theme) => ({
    paper: {
        display: "flex",
        flexDirection: "column",
        padding: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    paperHead: {
        display: "flex",
        minHeight: 48,
    },
    clickable: {
        cursor: "pointer",
    },
    title: {
        display: "flex",
        alignItems: "center",
        flexGrow: 1,
    },
    addon: {
        minWidth: theme.spacing(4),
        display: "flex",
        alignItems: "center",
    },
    highlighted: {
        backgroundColor: theme.palette.primary.light,
    },
}));

const SummaryCard = (props: SummaryCardProps): React.ReactElement => {
    const classes = useStyles();

    const classNames = [
        classes.paper,
        props.onClick ? classes.clickable : "",
        props.highlight ? classes.highlighted : "",
    ].join(" ");

    return (
        <Paper className={classNames} onClick={props.onClick}>
            <Box className={classes.paperHead}>
                {props.addonBefore && <Box className={classes.addon}>{props.addonBefore}</Box>}
                <Typography variant="subtitle1" className={classes.title}>
                    {props.title}
                </Typography>
                {props.addonAfter && <Box className={classes.addon}>{props.addonAfter}</Box>}
            </Box>
            {props.bodyNode && (
                <Box>
                    <Typography variant="body2">{props.bodyNode}</Typography>
                </Box>
            )}
        </Paper>
    );
};

export default SummaryCard;
