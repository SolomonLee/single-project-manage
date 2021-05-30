import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Card } from "../../../../hooks/autoSubscribe";

export interface Props {
    card: Card;
    handleRemoveThisCard: (card: Card) => void;
}
const DndCard = ({ card: data, handleRemoveThisCard }: Props): JSX.Element => {
    const handleRemoveCard = () => {
        handleRemoveThisCard(data);
    };

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
                    <div className="name">{data.name}</div>
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
    );
};

export default DndCard;
