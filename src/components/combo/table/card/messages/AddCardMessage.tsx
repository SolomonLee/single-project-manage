import React, { useState } from "react";

interface Props {
    addContent: (content: string) => boolean;
    name: string;
}
const AddCardMessage = ({ name, addContent }: Props): JSX.Element => {
    const [content, setContent] = useState("");

    const handleSubmit = () => {
        if (addContent(content)) {
            setContent("");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <div className="card_message_item">
            <div className="item_title">
                <div className="user">
                    <span className="name">
                        <span>{name}</span>
                    </span>
                </div>
            </div>
            <div className="item_content">
                <input
                    name="AddCardMessage"
                    type="text"
                    value={content}
                    onChange={handleChange}
                    className="form-control"
                    onKeyPress={handleKeyPress}
                />

                <div
                    className="functions"
                    data-show={content.length > 0 ? "" : null}
                >
                    <button
                        type="button"
                        className="btn btn_style1 btn-sm"
                        onClick={handleSubmit}
                    >
                        送出
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCardMessage;
