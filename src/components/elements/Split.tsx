import React from "react";

interface Props {
    content: string | JSX.Element | null;
}

const Split = ({ content = null }: Props): JSX.Element => (
    <div className="split_item">
        {content ? (
            <div className="item_content">
                <span>{content}</span>
            </div>
        ) : null}
    </div>
);

export default Split;
