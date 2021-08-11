import React, { useState } from "react";

import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import { AccordionDetails, Box, Icon, makeStyles, Typography, withStyles } from "@material-ui/core";

import { BasicProps } from "./index";

export interface ExpandableItemProps extends BasicProps {
    title?: React.ReactNode;
    description?: string;
    addonBefore?: React.ReactNode;
    addonAfter?: React.ReactNode;
    defaultExpanded?: boolean;
}

// custom styling for Accordion and AccordionSummary using classes
const Accordion = withStyles({
    root: {
        "&$expanded": {
            margin: "auto",
        },
    },
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {},
    content: {
        alignItems: "center",
    },
    expanded: {},
})(MuiAccordionSummary);

// styling for material ui
const useStyles = makeStyles((theme) => ({
    title: {
        flexBasis: "content",
        width: 1, // width set for noWrap prop, gets overwritten by flex-grow
        marginRight: theme.spacing(2),
        minWidth: "20%",
        flexShrink: 0,
    },
    description: {
        color: theme.palette.text.secondary,
        flexGrow: 1,
        width: 1, // width set for noWrap prop, gets overwritten by flex-grow
        marginRight: theme.spacing(1),
    },
    addon: {
        minWidth: theme.spacing(4),
        display: "flex",
        alignItems: "center",
    },
    details: {
        flexDirection: "column",
    },
}));

const ExpandableItem = React.forwardRef((props: ExpandableItemProps, ref): React.ReactElement => {
    const classes = useStyles();

    const [expanded, setExpanded] = useState(props.defaultExpanded);

    return (
        <Accordion expanded={expanded} ref={ref}>
            <AccordionSummary
                expandIcon={<Icon fontSize="large">expand_more</Icon>}
                onClick={() => setExpanded(!expanded)}
            >
                {props.addonBefore && <Box className={classes.addon}>{props.addonBefore}</Box>}
                <Box
                    flexGrow={props.description ? 0 : 1}
                    maxWidth={props.description ? "40%" : "100%"}
                    className={classes.title}
                >
                    <Typography variant="h6" noWrap>
                        {props.title}
                    </Typography>
                </Box>
                {props.description && (
                    <Typography variant="subtitle1" className={classes.description} noWrap>
                        {props.description}
                    </Typography>
                )}
                {props.addonAfter && <Box className={classes.addon}>{props.addonAfter}</Box>}
            </AccordionSummary>
            <AccordionDetails className={classes.details}>{props.children}</AccordionDetails>
        </Accordion>
    );
});

ExpandableItem.displayName = "ExpandableItem";

export default ExpandableItem;
