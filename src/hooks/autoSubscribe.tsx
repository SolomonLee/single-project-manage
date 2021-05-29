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
}
export interface ListCardDatas extends List {
    cards: Card[];
    index: number;
}
export const useSubListCardDatas = (): ListCardDatas[] => {
    const refIsMount = useGetMount();
    const refSubLists = useRef<undefined | (() => void)>(undefined);
    const refSubCards = useRef<undefined | (() => void)>(undefined);

    const [lists, setLists] = useState<List[]>([]);
    const [cards, setCards] = useState<Card[]>([]);
    const [listCardDatas, setListCardDatas] = useState<ListCardDatas[]>([]);

    useIfSingIn(
        () => {
            setTimeout(() => {
                refSubLists.current = firebase
                    .firestore()
                    .collection("lists")
                    .orderBy("nextListId", "desc")
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
                                });
                            }
                        });

                        console.log("tempLists", tempLists);
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
        const tempListCardDatas = [] as ListCardDatas[];
        const existListId = [] as string[];
        const sortLists = [] as List[];

        try {
            /** List 建立鏈結陣列 */
            lists.forEach((list) => {
                if (sortLists.length === lists.length) return;

                if (
                    existListId.findIndex(
                        (listId) => listId === list.listId
                    ) === -1
                ) {
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
                            for (
                                let i = tempSortLists.length - 1;
                                i >= 0;
                                i--
                            ) {
                                sortLists.unshift(tempSortLists[i]);
                            }

                            break;
                        }

                        const findNextList = lists.find(
                            (fList) => fList.listId === nextList.nextListId
                        );
                        console.log("findNextList", findNextList);
                        console.log("lists", lists);
                        console.log("nextList.nextListId", nextList.nextListId);

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
                }
            }

            if (sortLists.length > 0) {
                for (let i = 0; i < sortLists.length; i++) {
                    tempListCardDatas.push({
                        ...sortLists[i],
                        cards: [],
                        index: i,
                    });
                }
            }

            /** 依照每個 List, 建立 Cards 鏈結陣列 */
            tempListCardDatas.forEach((listCard) => {
                const filterListCards = cards.filter(
                    (card) => card.listId === listCard.listId
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
                            if (
                                nextListCard.nextCardId === sortListCardsFirstId
                            ) {
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
                        sortListCards[i].prevCardId =
                            sortListCards[i - 1].cardId;
                    }
                }

                if (sortListCards.length > 0) {
                    for (let i = 0; i < sortListCards.length; i++) {
                        sortListCards[i].index = i;
                    }
                }

                listCard.cards = sortListCards;
            });
        } catch (error) {
            console.log(error);
        }

        setListCardDatas(tempListCardDatas);
    }, [lists, cards]);

    return listCardDatas;
};
