import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Card, ListCardDatas } from "../../../../hooks/autoSubscribe";
import DndCard from "../card/Card";

interface DndListBoxContentProps {
    listId: string;
    cards: Card[];
}
const DndListBoxContent = ({
    cards,
    listId,
}: DndListBoxContentProps): JSX.Element => {
    return (
        <Droppable droppableId={listId} type="CARD">
            {(provided) => (
                <div
                    className="box_content"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    {cards.map((card) => (
                        <DndCard key={card.cardId} card={card} />
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

interface Props {
    list: ListCardDatas;
}
const DndList = ({ list }: Props): JSX.Element => {
    return (
        <Draggable draggableId={list.listId} index={list.index}>
            {(provided) => (
                <div
                    className="dnd_list_box"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <div className="box_title" {...provided.dragHandleProps}>
                        <h1>{list.name}</h1>
                    </div>

                    <DndListBoxContent
                        cards={list.cards}
                        listId={list.listId}
                    />
                </div>
            )}
        </Draggable>
    );
};

export default DndList;
