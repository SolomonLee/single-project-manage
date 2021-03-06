import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { UpdateCardData } from "../../../../apis/table";
import { Card, ListCardDatas } from "../../../../hooks/autoSubscribe";
import AddDndCardBox from "../card/AddCardBox";
import DndListBoxContent from "./DndListBoxContent";
import EditListName from "./EditListName";
import ListFunctions from "./ListFunctions";

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

    /** 更新 Card name, content 使用 */
    handleUpdateCard: (card: UpdateCardData) => void;
    /** 增加 Card member 使用 */
    handleAddCardMember: (
        cardId: string,
        memberId: string,
        memberName: string
    ) => void;
    /** 移除 Card member 使用 */
    handleRemoveCardMember: (cardId: string, memberId: string) => void;
}
const DndList = ({
    listCardDatas,
    handleCreateCard,
    handleRemoveCard,
    handleRemoveList,
    handleUpdateList,
    handleUpdateCard,
    handleAddCardMember,
    handleRemoveCardMember,
}: Props): JSX.Element => {
    // console.log("listCardDatas.list.index", listCardDatas.list.index);
    const [openFunctions, setOpenFunctions] = useState(false);
    const [isEditListName, setIsEditListName] = useState(false);

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

    const handleUpdateListName = () => {
        handleUpdateList(listCardDatas);
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
                            <EditListName
                                setIsEditListName={setIsEditListName}
                                isEditListName={isEditListName}
                                listCardDatas={listCardDatas}
                                updateListName={handleUpdateListName}
                            />
                        </div>
                        <button
                            type="button"
                            className="btn btn_style2 btn-sm"
                            onClick={handleOpenFunctions}
                        >
                            <i className="bi bi-three-dots"></i>
                        </button>
                        <ListFunctions
                            isOpen={openFunctions}
                            handleIsEditListName={handleIsEditListName}
                            handleRemoveThisList={handleRemoveThisList}
                        />
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
                        listName={listCardDatas.list.name}
                        cards={listCardDatas.cards}
                        listId={listCardDatas.list.listId}
                        handleRemoveThisCard={handleRemoveThisCard}
                        updateCard={handleUpdateCard}
                        addCardMember={handleAddCardMember}
                        removeCardMember={handleRemoveCardMember}
                    />
                </div>
            )}
        </Draggable>
    );
};

export default DndList;
