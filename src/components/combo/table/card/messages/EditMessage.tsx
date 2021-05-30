import React, { useState } from "react";

interface Props {
    removeContent: (contentId: string) => void;
    updateContent: (contentId: string, content: string) => boolean;
    contentId: string;
    content: string;
    name: string;
    timestamp: number;
}
const EditMessage = ({
    removeContent,
    updateContent,
    contentId,
    timestamp,
    content,
    name,
}: Props): JSX.Element => {
    const [isEdit, setIsEdit] = useState(false);
    const [editContent, setEditContent] = useState(content);

    const handleShowEdit = () => {
        setIsEdit(!isEdit);
    };

    const handleRemove = () => {
        removeContent(contentId);
    };

    const handleSubmit = () => {
        if (editContent === content) {
            setIsEdit(false);
        } else if (editContent !== "") {
            if (updateContent(contentId, editContent)) {
                setIsEdit(false);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditContent(e.target.value);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    const contentJSX = isEdit ? (
        <>
            <input
                name="AddCardMessage"
                type="text"
                value={editContent}
                onChange={handleChange}
                className="form-control"
                onKeyPress={handleKeyPress}
            />

            <div
                className="functions"
                data-show={editContent.length > 0 ? "" : null}
            >
                <button
                    type="button"
                    className="btn btn_style1 btn-sm"
                    onClick={handleSubmit}
                >
                    儲存
                </button>
                <button
                    type="button"
                    className="btn btn_style2 btn-sm"
                    onClick={handleShowEdit}
                >
                    <i className="bi bi-x"></i>
                </button>
            </div>
        </>
    ) : (
        <>
            <p>{content}</p>
            <div className="functions">
                <button
                    type="button"
                    className="btn btn_style2 btn-sm"
                    onClick={handleShowEdit}
                >
                    編輯
                </button>
                <button
                    type="button"
                    className="btn btn_style3 btn-sm"
                    onClick={handleRemove}
                >
                    刪除
                </button>
            </div>
        </>
    );

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
                <sub>
                    <span>{name}</span>
                    <small>{timestamp}</small>
                </sub>
                {contentJSX}
            </div>
        </div>
    );
};

export default EditMessage;
