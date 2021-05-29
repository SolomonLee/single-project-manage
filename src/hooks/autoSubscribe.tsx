import { useEffect, useRef, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { useIfSingIn } from "./authHook";
import { useGetMount } from "./controlComponent";

export interface Member {
    id: string;
    name: string;
    onlineTimestamp: number;
}

export interface MemberSimple {
    name: string;
    onlineTimestamp: number;
}

export interface MemberSimpleList {
    [uid: string]: MemberSimple;
}

export const useSubMemberList = (): Member[] => {
    const refIsMount = useGetMount();
    const refSubMember = useRef<undefined | (() => void)>(undefined);
    const [memberList, setMemberList] = useState<Member[]>([]);

    useIfSingIn(
        () => {
            if (typeof refSubMember.current === "undefined") {
                setTimeout(() => {
                    refSubMember.current = firebase
                        .firestore()
                        .collection("users-simple-infos")
                        .orderBy("onlineTimestamp", "desc")
                        .onSnapshot((querySnapshot) => {
                            const tempMemberList = [] as Member[];

                            querySnapshot.forEach((doc) => {
                                if (!doc.exists || refIsMount.current) {
                                    const memberSimple =
                                        doc.data() as MemberSimple;

                                    tempMemberList.push({
                                        id: doc.id,
                                        name: memberSimple.name,
                                        onlineTimestamp:
                                            memberSimple.onlineTimestamp,
                                    });
                                }
                            });

                            setMemberList(tempMemberList);
                        });
                });
            } else {
                if (memberList.length) {
                    if (refIsMount.current) {
                        setMemberList([]);
                    }
                }
            }
        },
        () => {
            if (typeof refSubMember.current !== "undefined") {
                refSubMember.current();
                refSubMember.current = undefined;
            }
        }
    );

    return memberList;
};

export interface CardMember {
    memberName: string;
    uid: string;
}
export interface CardSnapshot {
    content: string;
    listId: string;
    messageId: string;
    name: string;
    nextCardId: string;
    members: CardMember[];
}
export interface Card extends CardSnapshot {
    cardId: string;
    prevCardId: string;
    index: number;
}
export interface ListSnapshot {
    name: string;
    nextListId: string;
}
export interface List extends ListSnapshot {
    listId: string;
    prevListId: string;
    index: number;
}
export interface ListCardDatas {
    list: List;
    cards: Card[];
}
export interface ListCardDatasCollection {
    lists: List[];
    cards: Card[];
    listCardDatas: ListCardDatas[];
}
/** List 建立鏈結陣列, 並重新建立 index, 透過 NextId 建立 index */
const sortListsByNextId = (
    listCardDatas: ListCardDatas[],
    lists: List[]
): void => {
    const sortLists = [] as List[];
    const existListId = [] as string[];

    lists.forEach((list) => {
        if (sortLists.length === lists.length) return;

        if (existListId.findIndex((listId) => listId === list.listId) === -1) {
            /** is unsort list */
            const tempSortLists = [] as List[];

            let sortListFirstId = "";

            if (sortLists.length > 0) {
                sortListFirstId = sortLists[0].listId;
            }

            tempSortLists.push(list);
            let nextList = list;
            for (;;) {
                if (nextList.nextListId === sortListFirstId) {
                    for (let i = tempSortLists.length - 1; i >= 0; i--) {
                        sortLists.unshift(tempSortLists[i]);
                    }

                    break;
                }

                const findNextList = lists.find(
                    (fList) => fList.listId === nextList.nextListId
                );

                if (typeof findNextList !== "undefined") {
                    existListId.push(findNextList.listId);
                    tempSortLists.push(findNextList);
                    nextList = findNextList;
                } else {
                    throw "ERROR";
                }
            }
        }
    });

    if (sortLists.length > 1) {
        for (let i = 1; i < sortLists.length; i++) {
            sortLists[i].prevListId = sortLists[i - 1].listId;
            sortLists[i].index = i;
        }
    }

    if (sortLists.length > 0) {
        sortLists[0].prevListId = "";
        sortLists[0].index = 0;
        for (let i = 0; i < sortLists.length; i++) {
            listCardDatas.push({
                list: sortLists[i],
                cards: [],
            });
        }
    }
};

/** Card 建立鏈結陣列, 並重新建立 index */
const sortCardsByNextId = (
    listCardDatas: ListCardDatas[],
    cards: Card[]
): void => {
    /** 依照每個 List, 建立 Cards 鏈結陣列 */
    listCardDatas.forEach((listCard) => {
        const filterListCards = cards.filter(
            (card) => card.listId === listCard.list.listId
        );
        const existListCardId = [] as string[];
        const sortListCards = [] as Card[];

        filterListCards.forEach((fListCard) => {
            if (sortListCards.length === filterListCards.length) return;

            if (
                existListCardId.findIndex(
                    (cardId) => cardId === fListCard.cardId
                ) === -1
            ) {
                const tempSortListCards = [] as Card[];

                let sortListCardsFirstId = "";

                if (sortListCards.length > 0) {
                    sortListCardsFirstId = sortListCards[0].cardId;
                }

                tempSortListCards.push(fListCard);
                let nextListCard = fListCard as Card;
                for (;;) {
                    if (nextListCard.nextCardId === sortListCardsFirstId) {
                        for (
                            let i = tempSortListCards.length - 1;
                            i >= 0;
                            i--
                        ) {
                            sortListCards.unshift(tempSortListCards[i]);
                        }

                        break;
                    }

                    const findNextListCard = filterListCards.find(
                        (fListCard) =>
                            fListCard.listId === nextListCard.nextCardId
                    );

                    if (typeof findNextListCard !== "undefined") {
                        existListCardId.push(findNextListCard.cardId);
                        tempSortListCards.push(findNextListCard);
                        nextListCard = findNextListCard;
                    } else {
                        throw "ERROR";
                    }
                }
            }
        });

        if (sortListCards.length > 1) {
            for (let i = 1; i < sortListCards.length; i++) {
                sortListCards[i].prevCardId = sortListCards[i - 1].cardId;
            }
        }

        if (sortListCards.length > 0) {
            for (let i = 0; i < sortListCards.length; i++) {
                sortListCards[i].index = i;
            }
        }

        listCard.cards = sortListCards;
    });
};

/** 當藉由修改 ListCardDatas 順序時, 更新列表順序 */
export const resortListCardDatasByListCardDatas = (
    listCardDatasCollection: ListCardDatasCollection
): void => {
    if (listCardDatasCollection.listCardDatas.length > 0) {
        for (
            let i = 1;
            i <= listCardDatasCollection.listCardDatas.length - 2;
            i++
        ) {
            listCardDatasCollection.listCardDatas[i].list.index = i;
            listCardDatasCollection.listCardDatas[i].list.nextListId =
                listCardDatasCollection.listCardDatas[i + 1].list.listId;
            listCardDatasCollection.listCardDatas[i].list.prevListId =
                listCardDatasCollection.listCardDatas[i - 1].list.listId;
        }

        listCardDatasCollection.listCardDatas[0].list.index = 0;
        listCardDatasCollection.listCardDatas[0].list.nextListId =
            listCardDatasCollection.listCardDatas[1].list.listId;
        listCardDatasCollection.listCardDatas[0].list.prevListId = "";

        const lastIndex = listCardDatasCollection.listCardDatas.length - 1;
        listCardDatasCollection.listCardDatas[lastIndex].list.index = lastIndex;
        listCardDatasCollection.listCardDatas[lastIndex].list.nextListId = "";

        listCardDatasCollection.listCardDatas[lastIndex].list.prevListId =
            listCardDatasCollection.listCardDatas[
                listCardDatasCollection.listCardDatas.length - 2
            ].list.listId;
    }
};

/** 當藉由修改 ListCardDatas 內的 Cards 順序時, 更新列表順序 */
export const resortListCards = (cards1: Card[], cards2: Card[]): void => {
    console.log("in resortListCards");
    const sortCards = (cards: Card[]) => {
        console.log("resortListCards before", JSON.stringify(cards));
        if (cards.length > 1) {
            for (let i = 1; i <= cards.length - 2; i++) {
                cards[i].index = i;
                cards[i].nextCardId = cards[i + 1].cardId;
                cards[i].prevCardId = cards[i - 1].cardId;
            }

            cards[0].index = 0;
            cards[0].prevCardId = "";
            cards[0].nextCardId = cards[1].cardId;

            const lastIndex = cards.length - 1;
            cards[lastIndex].index = lastIndex;
            cards[lastIndex].prevCardId = cards[lastIndex - 1].cardId;
            cards[lastIndex].nextCardId = "";
        }
        console.log("resortListCards after", JSON.stringify(cards));
    };

    if (cards1.length > 0) {
        console.log("resortListCards sortCards cards1", cards1);
        sortCards(cards1);
    }

    if (cards1 != cards2 && cards2.length > 0) {
        console.log("resortListCards sortCards cards2", cards1);
        sortCards(cards2);
    }
};

export const useSubListCardDatas = (): ListCardDatasCollection | null => {
    const refIsMount = useGetMount();
    const refSubLists = useRef<undefined | (() => void)>(undefined);
    const refSubCards = useRef<undefined | (() => void)>(undefined);

    const [lists, setLists] = useState<List[]>([]);
    const [cards, setCards] = useState<Card[]>([]);
    const [listCardDatas, setListCardDatas] =
        useState<ListCardDatasCollection | null>(null);

    useIfSingIn(
        () => {
            setTimeout(() => {
                refSubLists.current = firebase
                    .firestore()
                    .collection("lists")
                    .onSnapshot((querySnapshot) => {
                        const tempLists = [] as List[];

                        querySnapshot.forEach((doc) => {
                            if (!doc.exists || refIsMount.current) {
                                const listSnapshot = doc.data() as ListSnapshot;

                                tempLists.push({
                                    listId: doc.id,
                                    name: listSnapshot.name,
                                    nextListId: listSnapshot.nextListId,
                                    prevListId: "",
                                    index: 0,
                                });
                            }
                        });

                        console.log("tempLists2", tempLists);
                        setLists(tempLists);
                    });

                refSubCards.current = firebase
                    .firestore()
                    .collection("cards")
                    .onSnapshot((querySnapshot) => {
                        const tempCards = [] as Card[];

                        querySnapshot.forEach((doc) => {
                            if (!doc.exists || refIsMount.current) {
                                const cardSnapshot = doc.data() as CardSnapshot;

                                tempCards.push({
                                    cardId: doc.id,
                                    content: cardSnapshot.content,
                                    listId: cardSnapshot.listId,
                                    messageId: cardSnapshot.messageId,
                                    name: cardSnapshot.name,
                                    nextCardId: cardSnapshot.nextCardId,
                                    members: cardSnapshot.members,
                                    prevCardId: "",
                                    index: 0,
                                });
                            }
                        });

                        console.log("tempCards", tempCards);
                        setCards(tempCards);
                    });
            });
        },
        () => {
            if (typeof refSubLists.current !== "undefined") {
                refSubLists.current();
                refSubLists.current = undefined;
            }

            if (typeof refSubCards.current !== "undefined") {
                refSubCards.current();
                refSubCards.current = undefined;
            }
        }
    );

    useEffect(() => {
        try {
            const tempListCardDatas = [] as ListCardDatas[];
            sortListsByNextId(tempListCardDatas, lists);
            sortCardsByNextId(tempListCardDatas, cards);
            setListCardDatas({
                cards: cards,
                lists: lists,
                listCardDatas: tempListCardDatas,
            });
        } catch (error) {
            console.log(error);
        }
    }, [lists, cards]);

    return listCardDatas;
};
