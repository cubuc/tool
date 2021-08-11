import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";

import {
    Divider,
    TextField,
    IconButton,
    Icon,
    List,
    ListItem,
    ListItemText,
    InputAdornment,
} from "@material-ui/core";

import { BasicProps } from "../../components";
import { addChecklistItem, deleteChecklistItem } from "../../redux/editStudySlice";

interface ChecklistProps extends BasicProps {
    id: string;
    items?: string[];
}

interface ChecklistInputProps {
    onKeyUp: (event: React.KeyboardEvent) => void;
    onAddClick: () => void;
}

export const ChecklistInput = React.forwardRef(
    (props: ChecklistInputProps, ref): React.ReactElement => {
        return (
            <TextField
                inputRef={ref}
                variant="outlined"
                placeholder="Item name"
                fullWidth
                margin="dense"
                onKeyUp={props.onKeyUp}
                helperText="Press Enter or the plus button to add an item"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => props.onAddClick()}
                                color="primary"
                                size="small"
                            >
                                <Icon>add</Icon>
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        );
    }
);

ChecklistInput.displayName = "ChecklistInput";

export const Checklist = (props: ChecklistProps): React.ReactElement => {
    const [items, setItems] = useState<string[]>(props.items || []);

    const inputRef = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch();

    const addItem = () => {
        if (inputRef.current && inputRef.current.value != "") {
            dispatch(addChecklistItem({ id: props.id, text: inputRef.current.value }));
            setItems([...items, inputRef.current.value]);
            inputRef.current.value = "";
        }
    };

    const handleKeyUp = (event: React.KeyboardEvent) => {
        if (event.key == "Enter") addItem();
    };

    const handleDelete = (idx: number) => {
        dispatch(deleteChecklistItem({ id: props.id, index: idx }));
        setItems(items.filter((i, index) => index != idx));
    };

    return (
        <>
            <List dense disablePadding>
                {items.map((item, idx) => (
                    <>
                        <ListItem key={idx} disableGutters>
                            <ListItemText primary={item} />
                            <IconButton
                                onClick={() => handleDelete(idx)}
                                size="small"
                                color="secondary"
                                edge="end"
                            >
                                <Icon>delete</Icon>
                            </IconButton>
                        </ListItem>
                        <Divider />
                    </>
                ))}
                <ListItem disableGutters>
                    <ListItemText
                        primary={
                            <ChecklistInput
                                ref={inputRef}
                                onAddClick={addItem}
                                onKeyUp={handleKeyUp}
                            />
                        }
                    />
                </ListItem>
            </List>
        </>
    );
};

export default Checklist;
