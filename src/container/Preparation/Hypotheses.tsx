import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ContentState, convertToRaw } from "draft-js";

import {
    Box,
    Button,
    Grid,
    Icon,
    IconButton,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@material-ui/core";

import { BasicProps, ExpandableItem, HypothesisEditor } from "../../components";
import {
    addHypothesis,
    deleteHypothesis,
    selectDependentVariables,
    selectHypotheses,
    selectIndependentVariables,
} from "../../redux/editStudySlice";
import { generateId } from "../../Helpers";
import { IdentifiableRawContentState } from "../../StudyDataType";

const useStyles = makeStyles(() => ({
    wrapper: {
        height: "100%",
    },
    code: {
        fontSize: "1.1em",
        padding: ".2em .3em",
        backgroundColor: "#f1f2f4",
        borderRadius: "4px",
        fontFamily: "monospace",
    },
}));

interface HypothesisItemProps extends BasicProps {
    content: IdentifiableRawContentState;
    defaultExpanded?: boolean;
}

export const HypothesisItem = (props: HypothesisItemProps): React.ReactElement => {
    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(deleteHypothesis(props.content.id));
    };

    return (
        <ExpandableItem
            title={props.content.blocks[0].text ? props.content.blocks[0].text : "New Hypothesis"}
            defaultExpanded={props.defaultExpanded}
        >
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <HypothesisEditor {...props.content} />
                </Grid>
                <Grid item xs={12} container direction="row-reverse">
                    <IconButton color="secondary" onClick={handleDelete}>
                        <Icon>delete</Icon>
                    </IconButton>
                </Grid>
            </Grid>
        </ExpandableItem>
    );
};

const Hypotheses = (): React.ReactElement => {
    const classes = useStyles();

    const dispatch = useDispatch();
    const hypotheses = useSelector(selectHypotheses);
    const ivs = useSelector(selectIndependentVariables);
    const dvs = useSelector(selectDependentVariables);
    const [amountOfMentions, setAmountOfMentions] = useState(0);

    const [values] = useState<{ [id: string]: number }>(() => {
        const state: { [id: string]: number } = {};

        ivs.forEach((c) => (state[c.id] = 0)); // add all items to state
        dvs.forEach((c) => (state[c.id] = 0)); // add all items to state

        return state;
    });

    const resetValues = () => {
        ivs.forEach((c) => (values[c.id] = 0)); // add all items to state
        dvs.forEach((c) => (values[c.id] = 0)); // add all items to state
    };

    useEffect(() => {
        const entities = hypotheses.flatMap((h) => {
            return Object.entries(h.entityMap).map((element) => element[1]);
        });
        console.log(entities);
        if (amountOfMentions != entities.length) {
            resetValues();
            setAmountOfMentions(entities.length);
            entities.forEach((element) => {
                values[element.data.mention.id] = values[element.data.mention.id] + 1;
            });
        }
    }, [hypotheses]);

    const handleAddClick = () => {
        dispatch(
            addHypothesis({
                ...convertToRaw(ContentState.createFromText("")),
                id: generateId(),
            })
        );
    };

    return (
        <Grid container className={classes.wrapper}>
            <Grid item xs={12} sm={4}>
                <Box marginBottom={2} padding={1}>
                    <Box marginBottom={2}>
                        <Typography variant="body1">
                            Add a new Hypothesis by pressing the{" "}
                            <code className={classes.code}>ADD</code> button on the bottom right
                            side.
                        </Typography>
                    </Box>
                    <Typography variant="body1">
                        You can add variables to hypotheses by typing{" "}
                        <code className={classes.code}>@</code> for independent variables, or{" "}
                        <code className={classes.code}>#</code> for dependent variables. Tagged
                        variables are counted in the tables.
                    </Typography>
                </Box>
                <Box marginBottom={2}>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant="h6">Independent Variables</Typography>
                                    </TableCell>
                                    <TableCell align="right">Times used</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ivs.map((iv) => (
                                    <TableRow key={iv.id}>
                                        <TableCell component="th" scope="row">
                                            {iv.name}
                                        </TableCell>
                                        <TableCell align="right">{values[iv.id]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="h6">Dependent Variables</Typography>
                                </TableCell>
                                <TableCell align="right">Times used</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dvs.map((dv) => (
                                <TableRow key={dv.id}>
                                    <TableCell component="th" scope="row">
                                        {dv.name}
                                    </TableCell>
                                    <TableCell align="right">{values[dv.id]}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={12} sm={8}>
                <Box height="100%" display="flex" flexDirection="column">
                    <Box p={1} flexGrow="1" height="1px" overflow="auto">
                        {hypotheses.map((item, idx) => (
                            <HypothesisItem
                                key={item.id}
                                content={item}
                                defaultExpanded={idx == hypotheses.length - 1}
                            ></HypothesisItem>
                        ))}
                    </Box>
                    <Box p={1}>
                        <Button
                            variant="contained"
                            fullWidth
                            color="primary"
                            size="large"
                            onClick={handleAddClick}
                            startIcon={<Icon fontSize="large">add</Icon>}
                        >
                            Add
                        </Button>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Hypotheses;
