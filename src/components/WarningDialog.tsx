import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import React from "react";
import BasicProps from "./BasicProps";

export interface ConfirmationDialogRawProps extends BasicProps {
    open: boolean;
    onClose: (cont?: boolean) => void;
}

export const WarningDialog = (props: ConfirmationDialogRawProps): React.ReactElement => {
    const { onClose, open, ...other } = props;

    const handleCancel = () => {
        onClose();
    };

    const handleOk = () => {
        onClose(true);
    };

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            fullWidth
            aria-labelledby="warning-dialog-title"
            open={open}
            keepMounted
            {...other}
        >
            <DialogTitle id="warning-dialog-title">Warning</DialogTitle>
            <DialogContent dividers>{props.children}</DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel} variant="contained" color="primary">
                    Cancel
                </Button>
                <Button onClick={handleOk} color="primary">
                    Continue
                </Button>
            </DialogActions>
        </Dialog>
    );
};
