import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import DndList, { DndListType } from "./list/List";

const Table = (): JSX.Element => {
    const [listDatas, setListDatas] = useState<DndListType[]>([]);

    useEffect(() => {
        setListDatas([
            {
                index: 0,
                listId: "LISTA",
                listType: "LIST",
                listName: "IM LIST A",
                cards: [
                    {
                        name: "Card A",
                        id: "Card A",
                    },
                    {
                        name: "Card B",
                        id: "Card B",
                    },
                    {
                        name: "Card C",
                        id: "Card C",
                    },
                ],
                isScrollable: false,
                isCombineEnabled: false,
            },

            {
                index: 2,
                listId: "LISTB",
                listType: "LIST",
                listName: "IM LIST B",
                cards: [
                    {
                        name: "Card D",
                        id: "Card D",
                    },
                    {
                        name: "Card E",
                        id: "Card E",
                    },
                    {
                        name: "Card F",
                        id: "Card F",
                    },
                ],
                isScrollable: false,
                isCombineEnabled: false,
            },
        ]);
    }, []);

    const onDragEnd = (result: any) => {
        console.log(result);
        // if (result.combine) {
        //   if (result.type === "LIST") {
        //     const shallow = [...this.state.ordered];
        //     shallow.splice(result.source.index, 1);
        //     this.setState({ ordered: shallow });
        //     return;
        //   }
        //   const column = this.state.columns[result.source.droppableId];
        //   const withQuoteRemoved = [...column];
        //   withQuoteRemoved.splice(result.source.index, 1);
        //   const columns = {
        //     ...this.state.columns,
        //     [result.source.droppableId]: withQuoteRemoved
        //   };
        //   this.setState({ columns });
        //   return;
        // }
        // // dropped nowhere
        // if (!result.destination) {
        //   return;
        // }
        // const source = result.source;
        // const destination = result.destination;
        // // did not move anywhere - can bail early
        // if (
        //   source.droppableId === destination.droppableId &&
        //   source.index === destination.index
        // ) {
        //   return;
        // }
        // // reordering column
        // if (result.type === "COLUMN") {
        //   const ordered = reorder(
        //     this.state.ordered,
        //     source.index,
        //     destination.index
        //   );
        //   this.setState({
        //     ordered
        //   });
        //   return;
        // }
        // const data = reorderQuoteMap({
        //   quoteMap: this.state.columns,
        //   source,
        //   destination
        // });
        // this.setState({
        //   columns: data.quoteMap
        // });
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="Table" type="LIST" direction="horizontal">
                {(provided) => (
                    <div
                        className="dnd_table_block"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {listDatas.map((listData, index) => (
                            <DndList
                                key={listData.listId}
                                index={index}
                                listName={listData.listName}
                                listId={listData.listId}
                                listType={listData.listType}
                                cards={listData.cards}
                                isScrollable={false}
                                isCombineEnabled={false}
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
