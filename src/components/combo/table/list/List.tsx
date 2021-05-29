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
    listCardDatas: ListCardDatas;
}
const DndList = ({ listCardDatas }: Props): JSX.Element => {
    console.log("listCardDatas.list.index", listCardDatas.list.index);
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
                    <div className="box_title" {...provided.dragHandleProps}>
                        <h1>{listCardDatas.list.name}</h1>
                    </div>

                    <DndListBoxContent
                        cards={listCardDatas.cards}
                        listId={listCardDatas.list.listId}
                    />
                </div>
            )}
        </Draggable>
    );
};

export default DndList;
