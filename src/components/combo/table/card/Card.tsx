import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Card } from "../../../../hooks/autoSubscribe";

export interface Props {
    card: Card;
}
const DndCard = ({ card: data }: Props): JSX.Element => {
    return (
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
                    {data.name}
                </div>
            )}
        </Draggable>
    );
};

export default DndCard;
