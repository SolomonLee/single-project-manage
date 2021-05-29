import React, { useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
    DropResult,
    /*ResponderProvided,*/
} from "react-beautiful-dnd";
import {
    resortListCardDatasByListCardDatas,
    ListCardDatasCollection,
    useSubListCardDatas,
    resortListCards,
} from "../../../hooks/autoSubscribe";
import DndList from "./list/List";

const Table = (): JSX.Element | null => {
    const subListCardDatasCollection = useSubListCardDatas();
    const [listCardDatasCol, setListCardDatasCol] =
        useState<ListCardDatasCollection | null>(null);

    useEffect(() => {
        setListCardDatasCol(subListCardDatasCollection);
    }, [subListCardDatasCollection]);

    useEffect(() => {
        console.log("listCardDatasCol Update");
    }, [listCardDatasCol]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onDragEnd = (
        result: DropResult /*, provided: ResponderProvided*/
    ) => {
        console.log("result", result);
        if (result.type === "LIST") {
            if (
                listCardDatasCol === null ||
                result.source.index === result.destination?.index ||
                typeof result.destination?.index === "undefined"
            ) {
                return;
            }

            const listCardDatas = listCardDatasCol.listCardDatas;
            const tempListCardData = listCardDatas.splice(
                result.source.index,
                1
            )[0];

            listCardDatas.splice(result.destination.index, 0, tempListCardData);

            resortListCardDatasByListCardDatas(listCardDatasCol);
            setListCardDatasCol({ ...listCardDatasCol });
        }

        if (result.type === "CARD") {
            console.log("CARD MOVE");
            if (
                listCardDatasCol === null ||
                typeof result.destination?.droppableId === "undefined" ||
                (result.source.index === result.destination?.index &&
                    result.source.droppableId ===
                        result.destination?.droppableId) ||
                typeof result.destination?.index === "undefined"
            ) {
                return;
            }

            console.log("CARD MOVE #2");

            const sourceId = result.source.droppableId;
            const sourceIndex = result.source.index;
            const droppableId = result.destination.droppableId;
            const droppableIndex = result.destination.index;

            const listCardDatas = listCardDatasCol.listCardDatas;

            const sourceListCardData = listCardDatas.find((listCardData) => {
                return listCardData.list.listId === sourceId;
            });

            const destinationListCardData = listCardDatas.find(
                (listCardData) => {
                    return listCardData.list.listId === droppableId;
                }
            );

            if (
                typeof sourceListCardData === "undefined" ||
                typeof destinationListCardData === "undefined"
            ) {
                return;
            }

            const tempCard = sourceListCardData.cards.splice(sourceIndex, 1)[0];
            destinationListCardData.cards.splice(droppableIndex, 0, tempCard);

            resortListCards(
                sourceListCardData.cards,
                destinationListCardData.cards
            );
            setListCardDatasCol({ ...listCardDatasCol });
        }
    };

    if (listCardDatasCol === null || typeof listCardDatasCol === "undefined") {
        return null;
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="Table" type="LIST" direction="horizontal">
                {(provided) => (
                    <div
                        className="dnd_table_block"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {listCardDatasCol.listCardDatas.map((listCardData) => (
                            <DndList
                                key={listCardData.list.listId}
                                listCardDatas={listCardData}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default Table;
