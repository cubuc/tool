import React, { useEffect, useRef, useState } from "react";

import { Box, makeStyles } from "@material-ui/core";
import socketIOClient, { Socket } from "socket.io-client";
import { BasicProps } from "../../components";
import { useSelector } from "react-redux";
import { selectCurrentStudy } from "../../redux/editStudySlice";

const ENDPOINT = "http://127.0.0.1:4001";

interface ConductSessionProps extends BasicProps {
    step?: number;
}

const useStyles = makeStyles(() => ({
    wrapper: {
        display: "none",
    },
}));

const ConductSession = (props: ConductSessionProps): React.ReactElement => {
    const classes = useStyles();

    const socket = useRef<Socket>();
    const currentStudy = useSelector(selectCurrentStudy);

    useEffect(() => {
        socket.current = socketIOClient(ENDPOINT);

        // CLEAN UP THE EFFECT
        return () => {
            socket.current?.disconnect();
        };
    }, []);

    useEffect(() => {
        const link =
            currentStudy.procedurePlan[
                Math.max(0, Math.min(currentStudy.procedurePlan.length - 1, props.step || 0))
            ].link;
        if (socket.current) socket.current.emit("step", link)
    }, [props.step])

    return <Box className={classes.wrapper}></Box>;
};

export default ConductSession;
