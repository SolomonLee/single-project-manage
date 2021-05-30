import React, { useState } from "react";
import FillItem from "../../fillitem/FillItem";

interface AddDndCardBoxProps {
    listId: string;
    nextCardId: string;
    handleCreateCard: (
        listId: string,
        name: string,
        nextCardId: string
    ) => void;
}
const AddDndCardBox = ({
    listId,
    nextCardId,
    handleCreateCard,
}: AddDndCardBoxProps): JSX.Element => {
    const [name, setName] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleSubmit = () => {
        if (name != "") {
            handleCreateCard(listId, name, nextCardId);
            setName("");
        }
    };

    const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <div className="dnd_card_add_box">
            {isOpen ? (
                <FillItem
                    title=""
                    error=""
                    placeholder="請輸入卡片標題"
                    value={name}
                    name="handleAddCard"
                    type="text"
                    onchange={handleChange}
                    onblur={undefined}
                    onkeypress={handleKeypress}
                ></FillItem>
            ) : null}

            <div className="functions" data-open={isOpen ? "" : null}>
                {isOpen ? (
                    <>
                        <button
                            type="button"
                            className="btn btn_style1 btn-sm"
                            onClick={handleSubmit}
                        >
                            新增卡片
                        </button>
                        <button
                            type="button"
                            className="btn btn_style2 btn-sm"
                            onClick={handleOpen}
                        >
                            <i className="bi bi-x"></i>
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        className="btn btn_style1 btn-sm"
                        onClick={handleOpen}
                    >
                        <i className="bi bi-plus"></i>新增另一張卡片
                    </button>
                )}
            </div>
        </div>
    );
};

export default AddDndCardBox;
