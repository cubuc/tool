import { useRef, useState } from "react";

/*
 * Hook concept from https://dev.to/abdulbasit313/how-to-develop-a-stopwatch-in-react-js-with-custom-hook-561b
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useTimer = (initialState = 0) => {
    const [timer, setTimer] = useState(initialState);
    const [isActive, setIsActive] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const countRef = useRef(
        setInterval(() => {
            return;
        }, 1000000)
    ); // empty interval to create a reusable countRef with useRef

    const handleStart = () => {
        setIsActive(true);
        setIsRunning(true);
        countRef.current = setInterval(() => {
            setTimer((timer) => timer + 1);
        }, 1000);
    };

    const handlePause = () => {
        clearInterval(countRef.current);
        setIsRunning(false);
    };

    const handleResume = () => {
        setIsRunning(true);
        countRef.current = setInterval(() => {
            setTimer((timer) => timer + 1);
        }, 1000);
    };

    const handleReset = () => {
        clearInterval(countRef.current);
        setIsActive(false);
        setIsRunning(false);
        setTimer(0);
    };

    return {
        timer,
        isActive,
        isRunning,
        handleStart,
        handlePause,
        handleResume,
        handleReset,
    };
};

export const formatTime = (timer: number, long?: boolean): string => {
    const getSeconds = `0${timer % 60}`.slice(-2);
    const minutes = Math.floor(timer / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2);

    if (long || Math.floor(timer / 3600) != 0) return `${getHours}:${getMinutes}:${getSeconds}`;

    return `${getMinutes}:${getSeconds}`;
};
