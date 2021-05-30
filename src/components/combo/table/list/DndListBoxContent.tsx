import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { UpdateCardData } from "../../../../apis/table";
import { Card } from "../../../../hooks/autoSubscribe";
import DndCard from "../card/Card";

interface DndListBoxContentProps {
    listId: string;
    cards: Card[];
    handleRemoveThisCard: (card: Card) => void;

    /** 更新 Card name, content 使用 */
    updateCard: (card: UpdateCardData) => void;
    /** 增加 Card member 使用 */
    addCardMember: (
        cardId: string,
        memberId: string,
        memberName: string
    ) => void;
    /** 移除 Card member 使用 */
    removeCardMember: (cardId: string, memberId: string) => void;
}
const DndListBoxContent = ({
    cards,
    listId,
    handleRemoveThisCard,
    updateCard,
    addCardMember,
    removeCardMember,
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
                                updateCard={updateCard}
                                addCardMember={addCardMember}
                                removeCardMember={removeCardMember}
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

export default DndListBoxContent;
