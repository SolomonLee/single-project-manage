import React, { useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
    DropResult,
    ResponderProvided,
} from "react-beautiful-dnd";
import {
    ListCardDatas,
    useSubListCardDatas,
} from "../../../hooks/autoSubscribe";
import DndList from "./list/List";

const Table = (): JSX.Element => {
    const subListCardDatas = useSubListCardDatas();
    const [listCardDatas, setListCardDatas] = useState<ListCardDatas[]>([]);

    useEffect(() => {
        console.log("listCardDatas", subListCardDatas);
        setListCardDatas(subListCardDatas);
    }, [subListCardDatas]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
        console.log(result);
        if (result.type === "LIST") {
            console.log("LIST MOVE");
        }
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
                        {listCardDatas.map((listCardData) => (
                            <DndList
                                key={listCardData.listId}
                                list={listCardData}
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
