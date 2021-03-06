import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { UpdateCardData } from "../../../../apis/table";
import { Card } from "../../../../hooks/autoSubscribe";
import { selectUserUid } from "../../../../reducers/userRedux";
import Modal from "../../modal/Modal";
import CardEditForm from "./CardEditForm";

export interface Props {
    listName: string;
    card: Card;
    handleRemoveThisCard: (card: Card) => void;
    updateCard: (card: UpdateCardData) => void;
    addCardMember: (
        cardId: string,
        memberId: string,
        memberName: string
    ) => void;
    removeCardMember: (cardId: string, memberId: string) => void;
}
const DndCard = ({
    listName,
    card: data,
    handleRemoveThisCard,
    updateCard,
    addCardMember,
    removeCardMember,
}: Props): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const userUid = useSelector(selectUserUid);

    const handleRemoveCard = () => {
        handleRemoveThisCard(data);
    };

    const handleUpdateCard = (updateCardData: UpdateCardData) => {
        updateCard(updateCardData);
    };

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleAddMember = (memberId: string, memberName: string) => {
        addCardMember(data.cardId, memberId, memberName);
    };

    const handleRemoveMember = (memberId: string) => {
        removeCardMember(data.cardId, memberId);
    };

    const nameJSX = (
        <div className="name" onClick={handleOpen}>
            <div>{data.name}</div>
            <div>
                {data.members.findIndex((member) => member.uid === userUid) ===
                -1 ? null : (
                    <i className="bi bi-eye"></i>
                )}
            </div>
        </div>
    );

    return (
        <>
            <Modal
                isOpen={isOpen}
                setClose={handleClose}
                stylenum={1}
                className="modal_lg"
            >
                <CardEditForm
                    listName={listName}
                    card={data}
                    updateCard={handleUpdateCard}
                    removeCard={handleRemoveCard}
                    addMember={handleAddMember}
                    removeMember={handleRemoveMember}
                ></CardEditForm>
            </Modal>
            <Draggable
                key={data.cardId}
                draggableId={data.cardId}
                index={data.index}
            >
                {(provided, dragSnapshot) => (
                    <div
                        className="dnd_card"
                        data-isdragging={dragSnapshot.isDragging}
                        data-isgroupedover={dragSnapshot.combineTargetFor}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        {nameJSX}
                        <div className="functions">
                            <button
                                type="button"
                                className="btn btn_style3 btn-sm"
                            >
                                <i
                                    className="bi bi-x"
                                    onClick={handleRemoveCard}
                                ></i>
                            </button>
                        </div>
                    </div>
                )}
            </Draggable>
        </>
    );
};

export default DndCard;
