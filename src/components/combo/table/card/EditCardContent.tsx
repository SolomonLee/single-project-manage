import React, { useState } from "react";
import { Card } from "../../../../hooks/autoSubscribe";
import TextareaAutosize from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";

interface Props {
    card: Card;
    updateCardContent: () => void;
}
const EditCardContent = ({ card, updateCardContent }: Props): JSX.Element => {
    const [editContent, setEditContent] = useState(card.content);
    const [isEdit, setIsEdit] = useState(false);

    const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditContent(e.target.value);
    };

    const handleIsEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsEdit(!isEdit);
    };

    const handleSaveEdit = () => {
        if (editContent !== card.content) {
            card.content = editContent;
            updateCardContent();
        }

        setIsEdit(false);
    };

    if (isEdit) {
        return (
            <>
                <TextareaAutosize
                    className="form-control"
                    value={editContent}
                    onChange={handleEditChange}
                />
                <div className="functions">
                    <button
                        type="button"
                        className="btn btn_style1 btn-sm"
                        onClick={handleSaveEdit}
                    >
                        儲存
                    </button>
                    <button
                        type="button"
                        className="btn btn_style2 btn-sm"
                        onClick={handleIsEdit}
                    >
                        <i className="bi bi-x"></i>
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="card_content">
                <ReactMarkdown>{card.content}</ReactMarkdown>
            </div>
            <button
                type="button"
                className="btn btn_style1 btn-sm"
                onClick={handleIsEdit}
            >
                編輯
            </button>
        </>
    );
};

export default EditCardContent;
