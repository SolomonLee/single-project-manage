import React from "react";

interface Props {
    children: JSX.Element | JSX.Element[] | string | number | null;
}

const RootFooter = ({ children }: Props): JSX.Element => (
    <footer>{children}</footer>
);

export default RootFooter;
