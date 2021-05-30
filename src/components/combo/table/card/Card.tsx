import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { UpdateCardData } from "../../../../apis/table";
import { Card } from "../../../../hooks/autoSubscribe";
import Modal from "../../modal/Modal";
import CardEditForm from "./CardEditForm";

export interface Props {
    card: Card;
    handleRemoveThisCard: (card: Card) => void;
    updateCard: (card: UpdateCardData) => void;
    addCardMember: (
        cardId: string,
        memberId: string,
        memberName: string
    ) => void;
    remoCardveMember: (cardId: string, memberId: string) => void;
}
const DndCard = ({
    card: data,
    handleRemoveThisCard,
    updateCard,
    addCardMember,
    remoCardveMember,
}: Props): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);

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
        remoCardveMember(data.cardId, memberId);
    };

    return (
        <>
            <Modal isOpen={isOpen} setClose={handleClose} stylenum={1}>
                <CardEditForm
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
                        <div className="name" onClick={handleOpen}>
                            {data.name}
                        </div>
                        <div className="functions">
                            <button className="btn btn_style3 btn-sm">
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
