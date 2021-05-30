import React, { useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Card, ListCardDatas } from "../../../../hooks/autoSubscribe";
import addMessage from "../../message/Message";
import AddDndCardBox from "../card/AddCardBox";
import DndCard from "../card/Card";

interface DndListBoxContentProps {
    listId: string;
    cards: Card[];
    handleRemoveThisCard: (card: Card) => void;
}
const DndListBoxContent = ({
    cards,
    listId,
    handleRemoveThisCard,
}: DndListBoxContentProps): JSX.Element => {
    return (
        <Droppable droppableId={listId} type="CARD">
            {(provided) => (
                <div
                    className="box_content"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    {cards.length > 0 ? (
                        cards.map((card) => (
                            <DndCard
                                key={card.cardId}
                                card={card}
                                handleRemoveThisCard={handleRemoveThisCard}
                            />
                        ))
                    ) : (
                        <span>尚無卡片</span>
                    )}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

interface Props {
    listCardDatas: ListCardDatas;
    handleCreateCard: (
        listId: string,
        name: string,
        nextCardId: string
    ) => void;
    handleRemoveCard: (listCardDatas: ListCardDatas, card: Card) => void;
    handleRemoveList: (listCardDatas: ListCardDatas) => void;
    handleUpdateList: (listCardDatas: ListCardDatas) => void;
}
const DndList = ({
    listCardDatas,
    handleCreateCard,
    handleRemoveCard,
    handleRemoveList,
    handleUpdateList,
}: Props): JSX.Element => {
    // console.log("listCardDatas.list.index", listCardDatas.list.index);
    const [openFunctions, setOpenFunctions] = useState(false);
    const [isEditListName, setIsEditListName] = useState(false);
    const [editName, setEditName] = useState(listCardDatas.list.name);

    // 提供 CARD 使用
    const handleRemoveThisCard = (card: Card) => {
        handleRemoveCard(listCardDatas, card);
    };
    // 提供 CARD 使用 : END

    // 提供 LIST 使用
    const handleOpenFunctions = () => {
        setOpenFunctions(!openFunctions);
    };

    const handleRemoveThisList = () => {
        handleOpenFunctions();
        handleRemoveList(listCardDatas);
    };

    const handleIsEditListName = () => {
        handleOpenFunctions();
        setIsEditListName(!isEditListName);
    };

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
                handleUpdateList(listCardDatas);
            }

            handleIsEditListName();
        }
    };
    // 提供 LIST 使用 : END

    return (
        <Draggable
            draggableId={listCardDatas.list.listId}
            index={listCardDatas.list.index}
        >
            {(provided) => (
                <div
                    className="dnd_list_box"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <div className="box_title">
                        <div
                            className="drag_title"
                            {...provided.dragHandleProps}
                        >
                            {isEditListName ? (
                                <input
                                    name="EditListName"
                                    type="text"
                                    className="form-control"
                                    value={editName}
                                    onChange={handleEditListNameChange}
                                    onKeyPress={handleEditListNameKeyPress}
                                />
                            ) : (
                                <span className="name">
                                    {listCardDatas.list.name}
                                </span>
                            )}
                        </div>
                        <button
                            className="btn btn_style2 btn-sm"
                            onClick={handleOpenFunctions}
                        >
                            <i className="bi bi-three-dots"></i>
                        </button>
                        {openFunctions ? (
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
                        ) : null}
                    </div>

                    <AddDndCardBox
                        listId={listCardDatas.list.listId}
                        handleCreateCard={handleCreateCard}
                        nextCardId={
                            listCardDatas.cards.length > 0
                                ? listCardDatas.cards[0].cardId
                                : ""
                        }
                    />

                    <DndListBoxContent
                        cards={listCardDatas.cards}
                        listId={listCardDatas.list.listId}
                        handleRemoveThisCard={handleRemoveThisCard}
                    />
                </div>
            )}
        </Draggable>
    );
};

export default DndList;
