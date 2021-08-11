import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import update from "immutability-helper";
import { useDrag, useDrop } from "react-dnd";
import debounce from "lodash.debounce";

import {
    Box,
    Button,
    Grid,
    Icon,
    IconButton,
    makeStyles,
    TextField,
} from "@material-ui/core";

import { ExpandableItem } from "../../components";
import {
    addProcedureItem,
    deleteProcedureItem,
    selectProcedurePlan,
    setProcedurePlan,
} from "../../redux/editStudySlice";
import { ProcedurePlanItem } from "../../StudyDataType";
import { scrollToElement } from "../../Helpers";

import { Checklist } from "./Checklists";

interface ProcedureItemProps extends ProcedurePlanItem {
    moveItem: (id: string, to: number) => void;
    findItem: (id: string) => { index: number };
    onDrop: () => void;
    defaultExpanded?: boolean;
}

const DropType = {
    Item: "item", // string identifier for drag and drop
};

const useStyles = makeStyles(() => ({
    procedure: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
    },
    itemWrapper: {
        flexGrow: 1,
        overflowY: "scroll",
    },
}));

interface Item {
    type: string;
    id: string;
    originalIndex: string;
}
const ProcedureItem = (props: ProcedureItemProps) => {
    const dispatch = useDispatch();

    const originalIndex = props.findItem(props.id).index;
    const [time, setTime] = useState(props.estimatedTime);
    const [title, setTitle] = useState(props.title);
    const [description, setDescription] = useState(props.description);
    const [link, setLink] = useState(props.link);

    const [{ isDragging }, drag, preview] = useDrag({
        item: { type: DropType.Item, id: props.id, originalIndex },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (dropResult, monitor) => {
            const { id: droppedId, originalIndex } = monitor.getItem();
            const didDrop = monitor.didDrop();
            if (!didDrop) {
                props.moveItem(droppedId, originalIndex);
            }

            props.onDrop();
        },
    });

    const [, drop] = useDrop({
        accept: DropType.Item,
        canDrop: () => false,
        hover({ id: draggedId }: Item) {
            if (draggedId !== props.id) {
                const { index: overIndex } = props.findItem(props.id);
                props.moveItem(draggedId, overIndex);
            }
        },
    });

    // time text field is a controlled component to enable numbers only as input
    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.validity.valid) setTime(Number(event.target.value));
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    };

    const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLink(event.target.value);
    };

    // debouncing update on redux store
    const debouncedAddProcedure = useCallback(
        debounce((item) => dispatch(addProcedureItem(item)), 100),
        []
    );

    useEffect(() => {
        const item: ProcedurePlanItem = {
            id: props.id,
            checklist: props.checklist,
            isCondition: props.isCondition,
            title: title,
            estimatedTime: time,
            description: description,
            link: link,
        };
        debouncedAddProcedure(item);
    }, [title, time, description, link]);

    const handleDelete = () => {
        // TODO: confirm dialog (low)
        dispatch(deleteProcedureItem(props.id));
    };

    return (
        <ExpandableItem
            ref={(ref: React.RefObject<HTMLDivElement>) => preview(drop(ref))}
            style={{ opacity: isDragging ? 0.4 : 1 }}
            title={props.title}
            description={props.description}
            addonBefore={
                <Icon
                    ref={props.isCondition ? null : drag}
                    style={{
                        cursor: props.isCondition ? "inherit" : "grab",
                    }}
                    color={props.isCondition ? "disabled" : "inherit"}
                >
                    drag_indicator
                </Icon>
            }
            addonAfter={
                <>
                    {props.estimatedTime}
                    <Icon>access_time</Icon>
                </>
            }
            defaultExpanded={props.defaultExpanded}
        >
            <Grid container spacing={2}>
                <Grid item xs={12} sm={10}>
                    <TextField
                        label="Title"
                        id="title"
                        onChange={handleTitleChange}
                        defaultValue={props.title}
                        fullWidth
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <TextField
                        label="Time estimate:"
                        id="time-estimate"
                        onChange={handleTimeChange}
                        value={time}
                        fullWidth
                        variant="outlined"
                        inputProps={{
                            pattern: "[0-9]*",
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Description"
                        id="description"
                        defaultValue={props.description}
                        onChange={handleDescriptionChange}
                        multiline
                        fullWidth
                        rowsMax={4}
                        rows={4}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="URL"
                        id="link"
                        defaultValue={props.link}
                        onChange={handleLinkChange}
                        fullWidth
                        variant="outlined"
                        helperText="When the conduct is at this step the given URL will be displayed at /participant."
                    />
                </Grid>
                <Grid item xs={12}>
                    <ExpandableItem title="Checklist">
                        <Checklist items={props.checklist} id={props.id} />
                    </ExpandableItem>
                </Grid>
                <Grid item xs={12} container direction="row-reverse">
                    <IconButton
                        color="secondary"
                        onClick={handleDelete}
                        disabled={props.isCondition > 0}
                    >
                        <Icon>delete</Icon>
                    </IconButton>
                </Grid>
            </Grid>
        </ExpandableItem>
    );
};

const Procedure = (): React.ReactElement => {
    const classes = useStyles();

    const dispatch = useDispatch();

    // state to indicate when a new item, that should be expanded, has been added.
    const [lastItemExpand, setLastItemExpand] = useState(false);

    // procedure plan as it is in the redux store
    const controlledProcedurePlan = useSelector(selectProcedurePlan);
    // procedure plan that is rendered and changed on drag and drop
    const [proPlan, setProPlan] = useState(controlledProcedurePlan);

    const endListDiv = useRef<HTMLDivElement>(null);

    const [, drop] = useDrop({ accept: DropType.Item });

    // update the rendered plan on changes of the store plan
    useEffect(() => {
        setProPlan(controlledProcedurePlan);
    }, [controlledProcedurePlan]);

    // simple effect to scroll to bottom of the list when a new item is added
    useEffect(() => {
        if (lastItemExpand) {
            scrollToElement(endListDiv);
            setLastItemExpand(false);
        }
    }, [proPlan]);

    const handleAdd = () => {
        const newItem: ProcedurePlanItem = {
            id: "",
            title: "Item Number " + (proPlan.length + 1),
            estimatedTime: 0,
            description: "",
            checklist: [],
            isCondition: 0,
        };
        dispatch(addProcedureItem(newItem));

        setLastItemExpand(true);
    };

    const moveItem = (id: string, atIndex: number) => {
        const { item, index } = findItem(id);
        setProPlan(
            update(proPlan, {
                $splice: [
                    [index, 1],
                    [atIndex, 0, item],
                ],
            })
        );
    };

    const findItem = (id: string) => {
        const item = proPlan.filter((c) => `${c.id}` === id)[0];
        return {
            item,
            index: proPlan.indexOf(item),
        };
    };

    const handleDrop = () => {
        dispatch(setProcedurePlan(proPlan));
    };

    return (
        <Box className={classes.procedure}>
            <Box className={classes.itemWrapper} p={1}>
                <div ref={drop}>
                    {proPlan.map((step, idx) => (
                        <ProcedureItem
                            {...step}
                            key={step.id}
                            moveItem={moveItem}
                            findItem={findItem}
                            onDrop={handleDrop}
                            defaultExpanded={lastItemExpand && idx == proPlan.length - 1}
                        />
                    ))}
                </div>
                <div ref={endListDiv} />
            </Box>
            <Box p={1}>
                <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    size="large"
                    startIcon={<Icon fontSize="large">add</Icon>}
                    onClick={handleAdd}
                >
                    Add
                </Button>
            </Box>
        </Box>
    );
};

export default Procedure;
