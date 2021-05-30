import React, { useState } from "react";
import FillItem from "../../fillitem/FillItem";

interface AddListBoxProps {
    nextListId: string;
    handleCreateList: (name: string, nextListId: string) => void;
}
const AddListBox = ({
    nextListId,
    handleCreateList: handleAddList,
}: AddListBoxProps): JSX.Element => {
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
            handleAddList(name, nextListId);
            setName("");
            setIsOpen(false);
        }
    };

    const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <div className="dnd_list_add_box">
            {isOpen ? (
                <FillItem
                    title=""
                    error=""
                    placeholder="請輸入列表標題"
                    value={name}
                    name="handleAddList"
                    type="text"
                    onchange={handleChange}
                    onblur={undefined}
                    onkeypress={handleKeypress}
                ></FillItem>
            ) : null}

            <div className="functions">
                {isOpen ? (
                    <>
                        <button
                            type="button"
                            className="btn btn_style1 btn-sm"
                            onClick={handleSubmit}
                        >
                            新增列表
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
                        <i className="bi bi-plus"></i>新增其他列表
                    </button>
                )}
            </div>
        </div>
    );
};

export default AddListBox;
