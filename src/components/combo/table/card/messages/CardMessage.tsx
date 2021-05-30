import React from "react";

interface Props {
    name: string;
    children: string;
    timeStr: string;
}
const CardMessage = ({ name, children, timeStr }: Props): JSX.Element => {
    return (
        <div className="card_message_item">
            <div className="item_title">
                <div className="user">
                    <span className="name">
                        <span>{name === "" ? "未知" : name}</span>
                    </span>
                </div>
            </div>
            <div className="item_content">
                <sub>
                    <span>{name === "" ? "未知" : name}</span>
                    <small>{timeStr}</small>
                </sub>
                <p>{children}</p>
            </div>
        </div>
    );
};

export default CardMessage;
