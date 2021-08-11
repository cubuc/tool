import React from "react";
import { createMuiTheme } from "@material-ui/core";

// 'patch' palette module to add custom colors
declare module "@material-ui/core/styles/createPalette" {
    // add light blue background color
    interface TypeBackground {
        lightBlue: React.CSSProperties["color"];
    }
    interface TypeBackgroundOptions {
        lightBlue: React.CSSProperties["color"];
    }
}

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#49c7eb",
            dark: "#00a9e0",
            light: "#a6e1f4",
        },
        background: {
            lightBlue: "#cceef9",
        },
        text: {
            secondary: "#595959",
        },
    },
});
