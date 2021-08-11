import React from "react";

export interface BasicProps {
    id?: string;
    children?: React.ReactNode;
    classNames?: string;
    style?: React.CSSProperties;
}

export default BasicProps;
