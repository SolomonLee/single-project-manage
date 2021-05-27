import React from "react";

interface Props {
    children: JSX.Element | JSX.Element[] | string | number | null;
}

const RootBody = ({ children }: Props): JSX.Element => (
    <div className="content">{children}</div>
);

export default RootBody;
