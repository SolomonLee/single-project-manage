import React, { useState } from "react";
import { ListCardDatas } from "../../../../hooks/autoSubscribe";
import addMessage from "../../message/Message";

interface Props {
    setIsEditListName: (isEditListName: boolean) => void;
    isEditListName: boolean;
    listCardDatas: ListCardDatas;
    updateListName: () => void;
}
const EditListName = ({
    isEditListName,
    listCardDatas,
    setIsEditListName,
    updateListName,
}: Props): JSX.Element => {
    const [editName, setEditName] = useState(listCardDatas.list.name);

    const handleEditListNameChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setEditName(e.target.value);
    };

    const handleEditListNameKeyPress = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Enter") {
            if (editName.length === 0) {
                addMessage("列表名稱不得為空");
            }

            if (editName !== listCardDatas.list.name) {
                listCardDatas.list.name = editName;
                updateListName();
            }

            setIsEditListName(false);
        }
    };

    if (isEditListName) {
        return (
            <input
                name="EditListName"
                type="text"
                className="form-control"
                value={editName}
                onChange={handleEditListNameChange}
                onKeyPress={handleEditListNameKeyPress}
            />
        );
    }

    return <span className="name">{listCardDatas.list.name}</span>;
};

export default EditListName;
