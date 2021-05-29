import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import DndCard, { DndCardDataType } from "../card/Card";

interface DndListItemsType {
    listId: string;
    cards: DndCardDataType[];
}
const DndListBoxContent = ({
    cards,
    listId,
}: DndListItemsType): JSX.Element => {
    return (
        <Droppable droppableId={listId} type="CARD">
            {(provided) => (
                <div
                    className="box_content"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    {cards.map((card, index) => (
                        <DndCard key={card.id} data={card} index={index} />
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

export interface DndListType {
    index: number;
    listId: string;
    listType: string;
    listName: string;
    cards: DndCardDataType[];
    isScrollable: boolean;
    isCombineEnabled: boolean;
}

const DndList = ({
    cards,
    listId,
    listName,
    index,
}: DndListType): JSX.Element => {
    return (
        <Draggable draggableId={listId} index={index}>
            {(provided) => (
                <div
                    className="dnd_list_box"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <div className="box_title" {...provided.dragHandleProps}>
                        <h1>{listName}</h1>
                    </div>

                    <DndListBoxContent cards={cards} listId={listId} />
                </div>
            )}
        </Draggable>
    );
};

export default DndList;
