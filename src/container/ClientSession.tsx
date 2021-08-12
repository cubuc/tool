import React, { useEffect, useRef, useState } from "react";

import { Box, Button, makeStyles, TextField } from "@material-ui/core";
import { Socket, io } from "socket.io-client";

const useStyles = makeStyles(() => ({
    wrapper: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
    },
    frame: {
        height: "100%",
    },
}));

const ClientSession = (): React.ReactElement => {
    const classes = useStyles();

    const [response, setResponse] = useState("");
    const socket = useRef<Socket>();
    const [room, setRoom] = useState("");
    const [joined, setJoined] = useState(false);

    useEffect(() => {
        socket.current = io();
        socket.current.on("FromAPI", (data: string) => {
            setResponse(data);
        });

        // CLEAN UP THE EFFECT
        return () => {
            socket.current?.disconnect();
        };
    }, []);

    const handleButton = () => {
        if (socket.current) {
            socket.current?.emit("join", room);
            setJoined(true);
        }
    };

    return (
        <Box className={classes.wrapper}>
            {!joined && (
                <Box>
                    <TextField onChange={(event) => setRoom(event.target.value)}></TextField>
                    <Button onClick={handleButton}>Join</Button>
                </Box>
            )}
            <iframe src={response} title="Test" className={classes.frame}></iframe>
        </Box>
    );
};
/*
<Dialog
            open={modalOpen}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>Add new hypothesis</DialogTitle>
            <DialogContent>
                {renderInlay(inlay)}
            </DialogContent>
            <DialogActions>
                <Box className={classes.inlaySelectorWrapper}>
                    <FormControl variant="outlined">
                        <InputLabel id="inlay-select">Inlay</InputLabel>
                        <Select
                            labelId="inlay-select"
                            id="inlay-outlined"
                            value={inlay}
                            onChange={handleInlayChange}
                            label="Inlay"
                        >
                            <MenuItem value={"none"}>none</MenuItem>
                            <MenuItem value={"how"}>How does IV change DV?</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleAdd} color="primary" variant="contained">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
 */
export default ClientSession;
