import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { Card } from "../../../../hooks/autoSubscribe";
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

export default DndListBoxContent;
