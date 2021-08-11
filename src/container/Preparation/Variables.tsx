import React, { SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Box,
    Button,
    Chip,
    DialogProps,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Icon,
    IconButton,
    InputAdornment,
    InputLabel,
    makeStyles,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Tooltip,
    Typography,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import debounce from "lodash.debounce";

import { ExpandableItem } from "../../components";
import { DependentVariable, IndependentVariable } from "../../StudyDataType";
import {
    addDependentVariable,
    addIndependentVariable,
    deleteDependentVariable,
    deleteIndependentVariable,
    selectDependentVariables,
    selectIndependentVariables,
} from "../../redux/editStudySlice";
import { scrollToElement } from "../../Helpers";

/* INTERFACES */
export interface AddModalProps extends DialogProps {
    onClose?: () => void; // use to give dialog posibility to close itself. workaround for now, might become a feature
}

/* STYLING */
const useStyles = makeStyles((theme) => ({
    addButtonWrapper: {
        padding: theme.spacing(1),
    },
    itemWrapper: {
        flexGrow: 1,
        height: 1,
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        overflow: "auto",
        paddingTop: theme.spacing(1),
    },
    columnWrapper: {
        display: "flex",
        flexDirection: "column",
    },
    varsHeader: {
        background: theme.palette.background.lightBlue,
        padding: theme.spacing(1),
    },
    wrapper: {
        height: "100%",
    },
}));

/* COMPONENTS */
export const DependentVarItem = (
    props: DependentVariable & { defaultExpanded?: boolean }
): React.ReactElement => {
    const dispatch = useDispatch();
    const ivs = useSelector(selectIndependentVariables);

    const [name, setName] = useState(props.name);
    const [linkedIVs, setLinkedIVs] = useState(props.measures);
    const [meansOfMeasure, setMeansOfMeasure] = useState(props.meansOfMeasure);
    const [description, setDescription] = useState(props.description);

    // debouncing update on redux store
    const debouncedAddVar = useCallback(
        debounce((variable) => dispatch(addDependentVariable(variable)), 100),
        []
    );

    useEffect(() => {
        const newVar: DependentVariable = {
            id: props.id,
            name: name,
            measures: linkedIVs,
            meansOfMeasure: meansOfMeasure,
            description: description,
        };
        debouncedAddVar(newVar);
    }, [name, linkedIVs, description, meansOfMeasure]);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleMeasureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMeansOfMeasure(event.target.value);
    };

    const handleLinksChange = (
        event: React.ChangeEvent<Record<string, unknown>>,
        value: string[],
        reason: string
    ) => {
        setLinkedIVs(value as string[]);
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    };

    const handleDelete = () => {
        dispatch(deleteDependentVariable(props.id));
    };

    return (
        <ExpandableItem
            title={props.name}
            description={
                props.measures.length > 0
                    ? "Measuring " + props.measures.join(", ")
                    : "No IV Linked"
            }
            defaultExpanded={props.defaultExpanded}
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Variable name"
                        id="dv-name"
                        onChange={handleNameChange}
                        defaultValue={props.name}
                        fullWidth
                        variant="outlined"
                        autoFocus
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Autocomplete
                        multiple
                        id="linked-ivs"
                        options={ivs.map((iv) => iv.name)}
                        fullWidth
                        onChange={handleLinksChange}
                        defaultValue={props.measures}
                        renderTags={(value: string[], getTagProps) =>
                            value.map((option: string, index) => (
                                <Chip
                                    key={index}
                                    variant="outlined"
                                    label={option}
                                    {...getTagProps({ index })}
                                />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Is measuring"
                                placeholder=""
                                helperText="Which independent variable is this dependent variable measuring?"
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        id="operationalisation"
                        variant="outlined"
                        label="Means of measuring"
                        defaultValue={props.meansOfMeasure}
                        fullWidth
                        helperText="How will this variable be measured? E.g. amount of errors on a task."
                        onChange={handleMeasureChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Notes"
                        id="dv-notes"
                        multiline
                        fullWidth
                        defaultValue={props.description}
                        onChange={handleDescriptionChange}
                        rowsMax={4}
                        rows={4}
                        variant="outlined"
                    />
                </Grid>
                <Grid container item xs={12} direction="row-reverse">
                    <IconButton color="secondary" onClick={handleDelete}>
                        <Icon>delete</Icon>
                    </IconButton>
                </Grid>
            </Grid>
        </ExpandableItem>
    );
};

export const IndependentVarItem = (
    props: IndependentVariable & { defaultExpanded?: boolean }
): React.ReactElement => {
    const dispatch = useDispatch();

    const [name, setName] = useState(props.name);
    const [balancing, setBalancing] = useState(props.balancing);
    const [design, setDesign] = useState<"within" | "between">(props.design);
    const [levels, setLevels] = useState(props.levels);

    // debouncing update on redux store
    const debouncedAddVar = useCallback(
        debounce((variable) => dispatch(addIndependentVariable(variable)), 100),
        []
    );

    useEffect(() => {
        const newVar: IndependentVariable = {
            id: props.id,
            name: name,
            balancing: balancing,
            design: design,
            levels: levels,
        };
        debouncedAddVar(newVar);
    }, [name, balancing, design, levels]);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    // called when a chip is added or removed
    const handleLevelsChange = (
        event: React.ChangeEvent<Record<string, unknown>>,
        value: string[],
        reason: string
    ) => {
        setLevels(value as string[]);
    };

    const handleBalancingChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setBalancing(
            event.target.value as SetStateAction<"none" | "latin" | "balanced" | "complete">
        );
    };

    const handleDesignChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setDesign(value as "within" | "between");
    };

    const handleDelete = () => {
        dispatch(deleteIndependentVariable(props.id));
    };

    return (
        <ExpandableItem
            title={props.name}
            description={props.levels.join(", ")}
            defaultExpanded={props.defaultExpanded}
        >
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <TextField
                        label="Variable name"
                        id="iv-name"
                        onChange={handleNameChange}
                        defaultValue={props.name}
                        fullWidth
                        variant="outlined"
                        autoFocus
                    />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        multiple
                        id="levels"
                        options={[] as string[]}
                        freeSolo
                        fullWidth
                        onChange={handleLevelsChange}
                        value={levels}
                        renderTags={(value: string[], getTagProps) =>
                            value.map((option: string, index) => (
                                <Chip
                                    key={index}
                                    variant="outlined"
                                    label={option}
                                    {...getTagProps({ index })}
                                />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Levels"
                                placeholder=""
                                helperText="Press Enter to add a level"
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl variant="outlined">
                        <FormLabel id="design-label">Set Design</FormLabel>
                        <RadioGroup
                            aria-label="design"
                            name="design"
                            value={design}
                            onChange={handleDesignChange}
                        >
                            <FormControlLabel value="within" control={<Radio />} label="Within" />
                            <FormControlLabel value="between" control={<Radio />} label="Between" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="balancing-label">Counterbalancing</InputLabel>
                        <Select
                            labelId="balancing-label"
                            id="balancing-outlined"
                            value={balancing}
                            onChange={handleBalancingChange}
                            label="Counterbalancing"
                            endAdornment={
                                <InputAdornment position="end">
                                    <Tooltip title={"test"}>
                                        <IconButton>
                                            <Icon>help_outline</Icon>
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            }
                        >
                            <MenuItem value={"none"}>None</MenuItem>
                            <MenuItem value={"latin"}>Latin Square</MenuItem>
                            <MenuItem value={"balanced"}>Balanced Latin Square</MenuItem>
                            <MenuItem value={"complete"}>Complete Counterbalancing</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid container item xs={12} direction="row-reverse">
                    <IconButton color="secondary" onClick={handleDelete}>
                        <Icon>delete</Icon>
                    </IconButton>
                </Grid>
            </Grid>
        </ExpandableItem>
    );
};

const Variables = (): React.ReactElement => {
    const classes = useStyles();

    const dispatch = useDispatch();
    const ivs = useSelector(selectIndependentVariables);
    const dvs = useSelector(selectDependentVariables);

    // state to indicate when a new item, that should be expanded, has been added.
    const [lastItemExpand, setLastItemExpand] = useState(false);

    // refs to scroll to when new variable is added
    const endIVDiv = useRef<HTMLDivElement>(null);
    const endDVDiv = useRef<HTMLDivElement>(null);

    // simple effects to scroll to bottom of the list when a new item is added
    useEffect(() => {
        if (lastItemExpand) {
            scrollToElement(endIVDiv);
            setLastItemExpand(false);
        }
    }, [ivs]);

    useEffect(() => {
        if (lastItemExpand) {
            scrollToElement(endDVDiv);
            setLastItemExpand(false);
        }
    }, [dvs]);

    const handleAddIV = () => {
        // the id will be replaced by the redux store
        const newVar: IndependentVariable = {
            id: "test",
            name: "New Independent Variable",
            levels: [],
            balancing: "latin",
            design: "within",
        };
        dispatch(addIndependentVariable(newVar));
        setLastItemExpand(true);
    };

    const handleAddDV = () => {
        // the id will be replaced by the redux store
        const newVar: DependentVariable = {
            id: "test",
            name: "Dependent Variable",
            measures: [],
            description: "",
        };
        dispatch(addDependentVariable(newVar));
        setLastItemExpand(true);
    };

    return (
        <Grid container alignItems="stretch" justify="space-between" className={classes.wrapper}>
            <Grid item xs={12} md={6} className={classes.columnWrapper}>
                <Box className={classes.varsHeader}>
                    <Typography variant="h6">Independent Variables</Typography>
                </Box>
                <Box className={classes.itemWrapper}>
                    <Box>
                        {ivs.map((iv, index) => (
                            <IndependentVarItem
                                {...iv}
                                defaultExpanded={lastItemExpand && index == ivs.length - 1}
                                key={index}
                            />
                        ))}
                    </Box>
                    <div ref={endIVDiv} />
                </Box>
                <Box className={classes.addButtonWrapper}>
                    <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        size="large"
                        startIcon={<Icon fontSize="large">add</Icon>}
                        onClick={handleAddIV}
                    >
                        Add
                    </Button>
                </Box>
            </Grid>
            <Grid item xs={12} md={6} className={classes.columnWrapper}>
                <div className={classes.varsHeader}>
                    <Typography variant="h6">Dependent Variables</Typography>
                </div>
                <Box className={classes.itemWrapper}>
                    <Box>
                        {dvs.map((dv, index) => (
                            <DependentVarItem
                                {...dv}
                                defaultExpanded={lastItemExpand && index == dvs.length - 1}
                                key={index}
                            />
                        ))}
                    </Box>
                    <div ref={endDVDiv} />
                </Box>
                <Box className={classes.addButtonWrapper}>
                    <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        size="large"
                        startIcon={<Icon fontSize="large">add</Icon>}
                        onClick={handleAddDV}
                    >
                        Add
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Variables;
