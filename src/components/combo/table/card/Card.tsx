import React from "react";
import { Draggable } from "react-beautiful-dnd";

export interface DndCardDataType {
    name: string;
    id: string;
}

export interface DndCardType {
    data: DndCardDataType;
    index: number;
}
const DndCard = ({ data, index }: DndCardType): JSX.Element => {
    return (
        <Draggable key={data.id} draggableId={data.id} index={index}>
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
