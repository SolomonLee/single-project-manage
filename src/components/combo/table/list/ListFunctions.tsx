import React from "react";

interface Props {
    isOpen: boolean;
    handleIsEditListName: () => void;
    handleRemoveThisList: () => void;
}
const ListFunctions = ({
    isOpen,
    handleIsEditListName,
    handleRemoveThisList,
}: Props): JSX.Element | null => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="functions">
            <button
                className="btn btn_style2 btn-sm"
                onClick={handleIsEditListName}
            >
                編輯名稱
            </button>
            <button
                className="btn btn_style3 btn-sm"
                onClick={handleRemoveThisList}
            >
                移除列表
            </button>
        </div>
    );
};

export default ListFunctions;
