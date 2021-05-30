import React, { useState } from "react";
import { Card } from "../../../../hooks/autoSubscribe";
import addMessage from "../../message/Message";

interface Props {
    card: Card;
    updateCardName: () => void;
}
const EditCardName = ({ card, updateCardName }: Props): JSX.Element => {
    const [editName, setEditName] = useState(card.name);
    const [isEdit, setIsEdit] = useState(false);

    const handleEditNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditName(e.target.value);
    };

    const handleIsEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsEdit(!isEdit);
    };

    const handleEditNameKeyPress = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Enter") {
            if (editName.length === 0) {
                addMessage("卡片名稱不得為空");
            }

            if (editName !== card.name) {
                card.name = editName;
                updateCardName();
            }

            setIsEdit(false);
        }
    };

    if (isEdit) {
        return (
            <>
                <input
                    name="EditListName"
                    type="text"
                    className="form-control"
                    value={editName}
                    onChange={handleEditNameChange}
                    onKeyPress={handleEditNameKeyPress}
                />

                <button
                    className="btn btn_style2 btn-sm"
                    type="button"
                    onClick={handleIsEdit}
                >
                    <i className="bi bi-x"></i>
                </button>
            </>
        );
    }

    return (
        <>
            <span className="name">{card.name}</span>
            <button
                type="button"
                className="btn btn_style2 btn-sm"
                onClick={handleIsEdit}
            >
                編輯
            </button>
        </>
    );
};

export default EditCardName;
