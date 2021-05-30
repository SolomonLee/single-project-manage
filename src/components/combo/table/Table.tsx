import React, { useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
    DropResult,
    /*ResponderProvided,*/
} from "react-beautiful-dnd";
import {
    addCardMember,
    createCard,
    createList,
    removeCard,
    removeCardMember,
    removeList,
    updateBatchCard,
    updateBatchList,
    updateCard,
    UpdateCardData,
    // UpdateCardData,
} from "../../../apis/table";
import {
    resortListCardDatasByListCardDatas,
    ListCardDatasCollection,
    useSubListCardDatas,
    resortListCards,
    Card,
    List,
    ListCardDatas,
} from "../../../hooks/autoSubscribe";
import AddListBox from "./list/AddListBox";
import DndList from "./list/List";

const Table = (): JSX.Element | null => {
    const subListCardDatasCollection = useSubListCardDatas();
    const [listCardDatasCol, setListCardDatasCol] =
        useState<ListCardDatasCollection | null>(null);

    useEffect(() => {
        setListCardDatasCol(subListCardDatasCollection);
    }, [subListCardDatasCollection]);

    // useEffect(() => {
    //     console.log("listCardDatasCol Update");
    // }, [listCardDatasCol]);

    const handleCreateCard = (
        listId: string,
        name: string,
        nextCardId: string
    ) => {
        if (listCardDatasCol === null) {
            return;
        }
        const cardId = `Card_${Date.now()}`;

        const listCardData = listCardDatasCol.listCardDatas.find(
            (listCardData) => {
                return listCardData.list.listId === listId;
            }
        );

        if (typeof listCardData === "undefined") {
            return;
        }

        listCardData.cards.splice(0, 0, {
            cardId,
            name,
            nextCardId,
            listId,
            prevCardId: "",
            index: 0,
            content: "",
            messageId: cardId,
            members: [],
        });

        createCard(cardId, name, listId, nextCardId);
        resortListCards(listCardData, null);
        setListCardDatasCol({ ...listCardDatasCol });
    };

    const handleUpdateCards = (cards1: Card[], cards2: Card[]) => {
        console.log("handleUpdateCards in", cards1, cards2);
        let cards = [...cards1];
        if (cards2 !== cards1 && cards2.length) {
            cards = cards.concat(cards2);
        }

        const updateCards = cards.map((card) => ({
            id: card.cardId,
            content: card.content,
            listId: card.listId,
            name: card.name,
            nextCardId: card.nextCardId,
        }));

        if (updateCards.length) {
            console.log("updateCards", updateCards);
            updateBatchCard(updateCards);
        }
    };

    const handleRemoveCard = (listCardData: ListCardDatas, card: Card) => {
        if (listCardDatasCol === null) return;

        listCardDatasCol.listCardDatas[listCardData.list.index].cards.splice(
            card.index,
            1
        );

        removeCard(card.prevCardId, card.cardId, card.nextCardId);
        resortListCards(
            listCardDatasCol.listCardDatas[listCardData.list.index],
            null
        );
        setListCardDatasCol({ ...listCardDatasCol });
    };

    const handleEditCardNameContent = (card: UpdateCardData) => {
        if (listCardDatasCol === null) {
            return;
        }

        const sourceCard = listCardDatasCol.cards.find(
            (_card) => _card.cardId === card.id
        );
        if (typeof sourceCard === "undefined") {
            return;
        }

        sourceCard.name = card.name;
        sourceCard.content = card.content;
        updateCard(card);
        setListCardDatasCol({ ...listCardDatasCol });
    };

    const handleAddCardMember = (
        cardId: string,
        memberId: string,
        memberName: string
    ) => {
        if (listCardDatasCol === null) {
            return;
        }

        const sourceCard = listCardDatasCol.cards.find(
            (_card) => _card.cardId === cardId
        );
        if (typeof sourceCard === "undefined") {
            return;
        }

        sourceCard.members.push({
            uid: memberId,
            memberName: memberName,
        });

        addCardMember({ id: cardId, uid: memberId, memberName });
        setListCardDatasCol({ ...listCardDatasCol });
    };

    const handleRemoCardveMember = (cardId: string, memberId: string) => {
        if (listCardDatasCol === null) {
            return;
        }

        const sourceCard = listCardDatasCol.cards.find(
            (_card) => _card.cardId === cardId
        );
        if (typeof sourceCard === "undefined") {
            return;
        }

        const index = sourceCard.members.findIndex(
            (member) => member.uid === memberId
        );
        if (index === -1) {
            return;
        }

        sourceCard.members.splice(index, 1);

        removeCardMember({ id: cardId, uid: memberId });
        setListCardDatasCol({ ...listCardDatasCol });
    };

    const handleCreateList = (name: string, nextListId: string) => {
        if (listCardDatasCol === null) {
            return;
        }
        const listId = `List_${Date.now()}`;

        listCardDatasCol.listCardDatas.unshift({
            list: {
                listId,
                name,
                nextListId,
                prevListId: "",
                index: 0,
            },
            cards: [],
        });

        createList(listId, name, nextListId);
        resortListCardDatasByListCardDatas(listCardDatasCol);
        setListCardDatasCol({ ...listCardDatasCol });
    };

    const handleUpdateLists = (lists: List[]) => {
        const updateLists = lists.map((list) => ({
            id: list.listId,
            name: list.name,
            nextListId: list.nextListId,
        }));

        if (updateLists.length) {
            console.log("updateLists", updateLists);
            updateBatchList(updateLists);
        }
    };

    const handleUpdateList = (listCardDatas: ListCardDatas) => {
        handleUpdateLists([listCardDatas.list]);
    };

    const handleRemoveList = (listCardData: ListCardDatas) => {
        if (listCardDatasCol === null) return;

        listCardDatasCol.listCardDatas.splice(listCardData.list.index, 1)[0];
        const cardIds = listCardData.cards.map((card) => card.cardId);

        removeList(
            listCardData.list.prevListId,
            listCardData.list.listId,
            listCardData.list.nextListId,
            cardIds
        );

        resortListCardDatasByListCardDatas(listCardDatasCol);
        setListCardDatasCol({ ...listCardDatasCol });
    };

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
            handleUpdateLists(listCardDatasCol.lists);
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

            console.log("CARD MOVE #3");
            const destinationListCardData = listCardDatas.find(
                (listCardData) => {
                    return listCardData.list.listId === droppableId;
                }
            );

            console.log("CARD MOVE #4");
            if (
                typeof sourceListCardData === "undefined" ||
                typeof destinationListCardData === "undefined"
            ) {
                return;
            }

            const tempCard = sourceListCardData.cards.splice(sourceIndex, 1)[0];
            destinationListCardData.cards.splice(droppableIndex, 0, tempCard);

            console.log("CARD MOVE #5");
            resortListCards(sourceListCardData, destinationListCardData);
            console.log("CARD before Update");
            handleUpdateCards(
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
                        <div className="block_title">
                            <AddListBox
                                nextListId={
                                    listCardDatasCol.listCardDatas.length > 0
                                        ? listCardDatasCol.listCardDatas[0].list
                                              .listId
                                        : ""
                                }
                                handleCreateList={handleCreateList}
                            />
                        </div>
                        <div className="block_content">
                            {listCardDatasCol.listCardDatas.map(
                                (listCardData) => (
                                    <DndList
                                        key={listCardData.list.listId}
                                        listCardDatas={listCardData}
                                        handleCreateCard={handleCreateCard}
                                        handleRemoveList={handleRemoveList}
                                        handleRemoveCard={handleRemoveCard}
                                        handleUpdateList={handleUpdateList}
                                        handleUpdateCard={
                                            handleEditCardNameContent
                                        }
                                        handleAddCardMember={
                                            handleAddCardMember
                                        }
                                        handleRemoveCardMember={
                                            handleRemoCardveMember
                                        }
                                    />
                                )
                            )}
                            {provided.placeholder}
                        </div>
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default Table;
