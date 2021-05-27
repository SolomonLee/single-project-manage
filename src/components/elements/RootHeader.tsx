import React from "react";

interface Props {
    children: JSX.Element | JSX.Element[] | string | number | null;
}

const RootHeader = ({ children }: Props): JSX.Element => (
    <header>{children}</header>
);

export default RootHeader;
