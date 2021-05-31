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
import { useGetMount } from "../../../hooks/controlComponent";
import AddListBox from "./list/AddListBox";
import DndList from "./list/List";

/** 比對新舊 listCardDatasCol 是否為相同資料 */
const comparisonListCardDatasCol = (
    orgLCDC: ListCardDatasCollection,
    newLCDC: ListCardDatasCollection
) => {
    if (
        orgLCDC.listCardDatas.length != newLCDC.listCardDatas.length ||
        orgLCDC.lists.length != newLCDC.lists.length ||
        orgLCDC.cards.length != newLCDC.cards.length
    ) {
        return false;
    } else {
        let isSameData = true;
        orgLCDC.listCardDatas.forEach((orgLCD) => {
            if (!isSameData) return;
            const newLCD = newLCDC.listCardDatas.find(
                (newLCD) => newLCD.list.listId === orgLCD.list.listId
            );

            if (typeof newLCD === "undefined") {
                isSameData = false;
                return;
            }

            if (
                newLCD.list.index !== orgLCD.list.index ||
                newLCD.list.name !== orgLCD.list.name ||
                newLCD.list.nextListId !== orgLCD.list.nextListId ||
                newLCD.list.prevListId !== orgLCD.list.prevListId
            ) {
                isSameData = false;
                return;
            }

            if (newLCD.cards.length != orgLCD.cards.length) {
                isSameData = false;
                return;
            }

            orgLCD.cards.forEach((orgCard) => {
                if (!isSameData) return;
                const newCard = newLCD.cards.find(
                    (newCard) => newCard.cardId === orgCard.cardId
                );

                if (typeof newCard === "undefined") {
                    isSameData = false;
                    return;
                }

                if (
                    newCard.content !== orgCard.content ||
                    newCard.name !== orgCard.name ||
                    newCard.nextCardId !== orgCard.nextCardId ||
                    newCard.prevCardId !== orgCard.prevCardId
                ) {
                    isSameData = false;
                    return;
                }

                if (newCard.members.length !== orgCard.members.length) {
                    isSameData = false;
                    return;
                }

                orgCard.members.forEach((orgMbr) => {
                    if (!isSameData) return;
                    const newMbr = newCard.members.find(
                        (newMbr) =>
                            newMbr.uid === orgMbr.uid &&
                            newMbr.memberName === orgMbr.memberName
                    );

                    if (typeof newMbr === "undefined") {
                        isSameData = false;
                        return;
                    }
                });
            });
        });

        return isSameData;
    }
};

const Table = (): JSX.Element | null => {
    const subListCardDatasCol = useSubListCardDatas();
    const isMount = useGetMount();
    const [listCardDatasCol, setListCardDatasCol] =
        useState<ListCardDatasCollection>({
            listCardDatas: [],
            lists: [],
            cards: [],
        });

    useEffect(() => {
        if (isMount.current) {
            if (
                !comparisonListCardDatasCol(
                    listCardDatasCol,
                    subListCardDatasCol
                )
            ) {
                setListCardDatasCol(subListCardDatasCol);
            }
        }
    }, [subListCardDatasCol]);

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

            resortListCards(sourceListCardData, destinationListCardData);
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
