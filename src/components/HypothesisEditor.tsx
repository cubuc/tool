import React, { useRef, useCallback, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditorState, convertFromRaw, RawDraftContentState, convertToRaw } from "draft-js";
import { debounce } from "lodash";

import Editor from "@draft-js-plugins/editor";
import createMentionPlugin, {
    defaultSuggestionsFilter,
    MentionData,
    MentionPluginConfig,
} from "@draft-js-plugins/mention";
import { SubMentionComponentProps } from "@draft-js-plugins/mention/lib/Mention";
import { EntryComponentProps } from "@draft-js-plugins/mention/lib/MentionSuggestions/Entry/Entry";
import { ListItem, ListItemText, Box, makeStyles } from "@material-ui/core";

import {
    selectIndependentVariables,
    selectDependentVariables,
    addHypothesis,
} from "../redux/editStudySlice";
import { IdentifiableRawContentState } from "../StudyDataType";

const useStyles = makeStyles((theme) => ({
    test: {
        backgroundColor: theme.palette.background.paper,
    },
    editor: {
        boxSizing: "border-box",
        border: "1px solid",
        cursor: "text",
        padding: "18.5px 14px",
        borderRadius: theme.shape.borderRadius,
        borderColor: "#0000003A",
        background: theme.palette.background.paper,
        "&:hover": {
            borderColor: "#000000DE",
        },
        "&:focus-within": {
            borderColor: "#49c7eb",
        },
    },
}));

const Entry = (props: EntryComponentProps): React.ReactElement => {
    return (
        <ListItem selected={props.isFocused} dense>
            <ListItemText primary={props.mention.name} />
        </ListItem>
    );
};

const MentionItem = (props: SubMentionComponentProps) => {
    return (
        <Box
            component="span"
            bgcolor="lightblue"
            className={props.className}
            // eslint-disable-next-line no-alert
            onClick={() => alert(props.mention.id)}
        >
            {props.children}
        </Box>
    );
};

export const HypothesisEditor = (props: IdentifiableRawContentState): React.ReactElement => {
    const { id, ...content } = props;

    const classes = useStyles();
    const dispatch = useDispatch();

    // variables as they are in the redux store
    const independentVariables = useSelector(selectIndependentVariables);
    const dependentVariables = useSelector(selectDependentVariables);
    const [open, setOpen] = useState(false);
    const ref = useRef<Editor>(null);

    const [editorState, setEditorState] = useState(() =>
        EditorState.createWithContent(convertFromRaw(content as RawDraftContentState))
    );

    const options: MentionPluginConfig = {
        theme: {
            mentionSuggestionsPopup: classes.test,
        },
        mentionTrigger: ["@", "#"],
        mentionComponent: MentionItem,
    };

    const mentions = {
        "@": independentVariables.map((v) => ({ id: v.id, name: v.name })) as MentionData[],
        "#": dependentVariables.map((v) => ({ id: v.id, name: v.name })) as MentionData[],
    };
    const [suggestions, setSuggestions] = useState(mentions["@"]);

    // debouncing update on redux store
    const debouncedAddHypothesis = useCallback(
        debounce((item) => dispatch(addHypothesis(item)), 50),
        []
    );

    const { MentionSuggestions, plugins } = useMemo(() => {
        const mentionPlugin = createMentionPlugin(options);
        const { MentionSuggestions } = mentionPlugin;
        const plugins = [mentionPlugin];
        return { plugins, MentionSuggestions };
    }, []);

    const onSearchChange = useCallback(({ trigger, value }: { trigger: string; value: string }) => {
        setSuggestions(defaultSuggestionsFilter(value, mentions, trigger));
    }, []);

    const handleEditorChange = (state: EditorState) => {
        setEditorState(state);
        if (ref.current) {
            debouncedAddHypothesis({ ...convertToRaw(state.getCurrentContent()), id });
        }
    };

    return (
        <Box
            className={classes.editor}
            onClick={() => {
                ref.current?.focus();
            }}
        >
            <Editor
                editorKey={"editor"}
                editorState={editorState}
                onChange={handleEditorChange}
                plugins={plugins}
                ref={ref}
            />
            <MentionSuggestions
                open={open}
                onOpenChange={setOpen}
                suggestions={suggestions}
                onSearchChange={onSearchChange}
                entryComponent={Entry}
            />
        </Box>
    );
};

export default HypothesisEditor;
