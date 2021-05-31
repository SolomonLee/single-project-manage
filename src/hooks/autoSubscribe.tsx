import { useEffect, useRef, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { useIfSingIn } from "./authHook";
import { useGetMount } from "./controlComponent";
import addMessage from "../components/combo/message/Message";

export interface Member {
    id: string;
    name: string;
    onlineTimestamp: number;
}

export interface MemberSimple {
    uid: string;
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
                                        id: memberSimple.uid,
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
    const copyLists = [...lists];
    const sortLists = [] as List[];
    const existListId = [] as string[];
    const isExistId = (id: string) =>
        existListId.findIndex((listId) => listId === id) !== -1;
    const addExistId = (id: string) => existListId.push(id);

    if (copyLists.length === 0) return;
    sortLists.push(copyLists[0]);
    let nowList = copyLists[0];
    for (let i = 0; i < copyLists.length; i++) {
        /** 鏈結 向後找 */
        if (nowList.nextListId === "") {
            break;
        }

        const nextList = copyLists.find(
            (list) => list.listId === nowList.nextListId
        );

        if (typeof nextList === "undefined" || isExistId(nextList.listId)) {
            break;
        }

        addExistId(nextList.listId);
        sortLists.push(nextList);
        nowList = nextList;
    }

    if (copyLists.length !== sortLists.length) {
        /** 鏈結 向前找 */
        nowList = sortLists[0] as List;
        for (let i = 0; i < copyLists.length; i++) {
            /** 鏈結 向後找 */
            const prevList = copyLists.find(
                (list) => list.nextListId === nowList.listId
            );

            if (typeof prevList === "undefined" || isExistId(prevList.listId)) {
                break;
            }

            addExistId(prevList.listId);
            sortLists.unshift(prevList);
            nowList = prevList;
        }
    }

    if (copyLists.length !== sortLists.length) {
        /** 剩餘 判斷為 迷路 List */
        addMessage("發現 迷路 List", "Fail");
        copyLists.forEach((copyList) => {
            const index = sortLists.findIndex(
                (sordList) => sordList.listId === copyList.listId
            );

            if (index === -1) {
                /** find lost List */
                sortLists.push(copyList);
            }
        });
    }

    if (sortLists.length > 1) {
        const lastIndex = sortLists.length - 1;
        for (let i = 1; i < lastIndex; i++) {
            sortLists[i].nextListId = sortLists[i + 1].listId;
            sortLists[i].prevListId = sortLists[i - 1].listId;
            sortLists[i].index = i;
        }

        sortLists[0].nextListId = sortLists[1].listId;
        sortLists[0].prevListId = "";
        sortLists[0].index = 0;

        sortLists[lastIndex].nextListId = "";
        sortLists[lastIndex].prevListId = sortLists[lastIndex - 1].listId;
        sortLists[lastIndex].index = lastIndex;
    }

    if (sortLists.length === 0) {
        sortLists[0].nextListId = "";
        sortLists[0].prevListId = "";
        sortLists[0].index = 0;
    }

    for (let i = 0; i < sortLists.length; i++) {
        listCardDatas.push({
            list: sortLists[i],
            cards: [],
        });
    }
};

/** Card 建立鏈結陣列, 並重新建立 index */
const sortCardsByNextId = (
    listCardDatas: ListCardDatas[],
    cards: Card[]
): void => {
    /** 依照每個 List, 建立 Cards 鏈結陣列 */
    listCardDatas.forEach((listCard) => {
        /** 篩選過 屬於此 List 的 Cards */
        const copyCards = cards.filter(
            (card) => card.listId === listCard.list.listId
        );
        const sortCards = [] as Card[];
        const existCardId = [] as string[];
        const isExistId = (id: string) =>
            existCardId.findIndex((cardId) => cardId === id) !== -1;
        const addExistId = (id: string) => existCardId.push(id);

        if (copyCards.length === 0) return;

        sortCards.push(copyCards[0]);
        let nowCard = copyCards[0];
        for (let i = 0; i < copyCards.length; i++) {
            /** 鏈結 向後找 */
            if (nowCard.nextCardId === "") {
                break;
            }

            const nextCard = copyCards.find(
                (card) => card.cardId === nowCard.nextCardId
            );

            if (typeof nextCard === "undefined" || isExistId(nextCard.cardId)) {
                break;
            }

            addExistId(nextCard.cardId);
            sortCards.push(nextCard);
            nowCard = nextCard;
        }

        if (copyCards.length !== sortCards.length) {
            /** 鏈結 向前找 */
            nowCard = sortCards[0] as Card;
            for (let i = 0; i < copyCards.length; i++) {
                /** 鏈結 向後找 */
                const prevCard = copyCards.find(
                    (card) => card.nextCardId === nowCard.cardId
                );

                if (
                    typeof prevCard === "undefined" ||
                    isExistId(prevCard.cardId)
                ) {
                    break;
                }

                addExistId(prevCard.cardId);
                sortCards.unshift(prevCard);
                nowCard = prevCard;
            }
        }

        if (copyCards.length !== sortCards.length) {
            /** 剩餘 判斷為 迷路 Card */
            addMessage(`發現 ${listCard.list.name} 有迷路 Card`, "Fail");
            copyCards.forEach((copyCard) => {
                const index = sortCards.findIndex(
                    (sordCard) => sordCard.cardId === copyCard.cardId
                );

                if (index === -1) {
                    /** find lost Card */
                    sortCards.push(copyCard);
                }
            });
        }

        if (sortCards.length > 1) {
            const lastIndex = sortCards.length - 1;
            for (let i = 1; i < lastIndex; i++) {
                sortCards[i].nextCardId = sortCards[i + 1].cardId;
                sortCards[i].prevCardId = sortCards[i - 1].cardId;
                sortCards[i].index = i;
            }

            sortCards[0].nextCardId = sortCards[1].cardId;
            sortCards[0].prevCardId = "";
            sortCards[0].index = 0;

            sortCards[lastIndex].nextCardId = "";
            sortCards[lastIndex].prevCardId = sortCards[lastIndex - 1].cardId;
            sortCards[lastIndex].index = lastIndex;
        }

        if (sortCards.length === 0) {
            sortCards[0].nextCardId = "";
            sortCards[0].prevCardId = "";
            sortCards[0].index = 0;
        }

        listCard.cards = sortCards;
    });
};

/** 當藉由修改 ListCardDatas 順序時, 更新列表順序 */
export const resortListCardDatasByListCardDatas = (
    listCardDatasCollection: ListCardDatasCollection
): void => {
    if (listCardDatasCollection.listCardDatas.length > 1) {
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
            listCardDatasCollection.listCardDatas[lastIndex - 1].list.listId;
    } else if (listCardDatasCollection.listCardDatas.length === 1) {
        listCardDatasCollection.listCardDatas[0].list.index = 0;
        listCardDatasCollection.listCardDatas[0].list.nextListId = "";
        listCardDatasCollection.listCardDatas[0].list.prevListId = "";
    }
};

/** 當藉由修改 ListCardDatas 內的 Cards 順序時, 更新列表順序 */
export const resortListCards = (
    listCardDatas1: ListCardDatas,
    listCardDatas2: ListCardDatas | null
): void => {
    const sortCards = (cards: Card[], listId: string) => {
        if (cards.length > 1) {
            for (let i = 1; i <= cards.length - 2; i++) {
                cards[i].index = i;
                cards[i].nextCardId = cards[i + 1].cardId;
                cards[i].prevCardId = cards[i - 1].cardId;
                cards[i].prevCardId = cards[i - 1].cardId;
                cards[i].listId = listId;
            }

            cards[0].index = 0;
            cards[0].prevCardId = "";
            cards[0].nextCardId = cards[1].cardId;
            cards[0].listId = listId;

            const lastIndex = cards.length - 1;
            cards[lastIndex].index = lastIndex;
            cards[lastIndex].prevCardId = cards[lastIndex - 1].cardId;
            cards[lastIndex].nextCardId = "";
            cards[lastIndex].listId = listId;
        } else if (cards.length === 1) {
            cards[0].index = 0;
            cards[0].prevCardId = "";
            cards[0].nextCardId = "";
            cards[0].listId = listId;
        }
    };

    if (listCardDatas1.cards.length > 0) {
        sortCards(listCardDatas1.cards, listCardDatas1.list.listId);
    }

    if (
        listCardDatas2 !== null &&
        listCardDatas1 !== listCardDatas2 &&
        listCardDatas2.cards.length > 0
    ) {
        sortCards(listCardDatas2.cards, listCardDatas2.list.listId);
    }
};

export const useSubListCardDatas = (): ListCardDatasCollection => {
    const refIsMount = useGetMount();
    const refSubLists = useRef<undefined | (() => void)>(undefined);
    const refSubCards = useRef<undefined | (() => void)>(undefined);
    const refTimerRefreshListCardDatas = useRef<number>(-3);

    const [lists, setLists] = useState<List[]>([]);
    const [cards, setCards] = useState<Card[]>([]);
    const [listCardDatas, setListCardDatas] = useState<ListCardDatasCollection>(
        {
            listCardDatas: [],
            lists: [],
            cards: [],
        }
    );

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

                        let isSameLists = true;
                        if (tempLists.length != lists.length) {
                            isSameLists = false;
                        } else {
                            tempLists.forEach((tempList) => {
                                if (!isSameLists) return;

                                const matchList = lists.find(
                                    (list) => list.listId === tempList.listId
                                );
                                if (typeof matchList === "undefined") {
                                    isSameLists = false;
                                    return;
                                }

                                if (
                                    matchList.name !== tempList.name ||
                                    matchList.nextListId !== tempList.nextListId
                                ) {
                                    isSameLists = false;
                                    return;
                                }
                            });
                        }

                        if (!isSameLists) setLists(tempLists);
                        else console.log("is same list");
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

                        let isSameCards = true;
                        if (tempCards.length != cards.length) {
                            isSameCards = false;
                        } else {
                            tempCards.forEach((tempCard) => {
                                if (!isSameCards) return;

                                const matchCard = cards.find(
                                    (card) => card.cardId === tempCard.cardId
                                );
                                if (typeof matchCard === "undefined") {
                                    isSameCards = false;
                                    return;
                                }

                                if (
                                    matchCard.name !== tempCard.name ||
                                    matchCard.listId !== tempCard.listId ||
                                    matchCard.content !== tempCard.content ||
                                    matchCard.nextCardId !==
                                        tempCard.nextCardId ||
                                    matchCard.name !== tempCard.name
                                ) {
                                    isSameCards = false;
                                    return;
                                }
                            });
                        }

                        if (!isSameCards) setCards(tempCards);
                        else console.log("is same card");
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
            if (refIsMount.current) {
                if (refTimerRefreshListCardDatas.current < 0) {
                    const tempListCardDatas = [] as ListCardDatas[];
                    sortListsByNextId(tempListCardDatas, lists);
                    sortCardsByNextId(tempListCardDatas, cards);
                    // console.log("tempListCardDatas", tempListCardDatas);
                    setListCardDatas({
                        cards: cards,
                        lists: lists,
                        listCardDatas: tempListCardDatas,
                    });

                    refTimerRefreshListCardDatas.current =
                        refTimerRefreshListCardDatas.current + 1;
                } else {
                    clearTimeout(refTimerRefreshListCardDatas.current);
                    refTimerRefreshListCardDatas.current = window.setTimeout(
                        () => {
                            const tempListCardDatas = [] as ListCardDatas[];
                            sortListsByNextId(tempListCardDatas, lists);
                            sortCardsByNextId(tempListCardDatas, cards);
                            // console.log("tempListCardDatas", tempListCardDatas);
                            setListCardDatas({
                                cards: cards,
                                lists: lists,
                                listCardDatas: tempListCardDatas,
                            });
                        },
                        1000
                    );
                }
            }
        } catch (error) {
            console.log(error);
        }

        return () => {
            if (refTimerRefreshListCardDatas.current > 0) {
                clearTimeout(refTimerRefreshListCardDatas.current);
            }
        };
    }, [lists, cards]);

    return listCardDatas;
};

interface MessageContentSnapshot {
    content: string;
    timestamp: number;
    uid: string;
}
interface MessageContentBasic {
    contentId: string;
    content: string;
    timestamp: number;
    uid: string;
}
export interface MessageContent extends MessageContentBasic {
    userName: string;
}
/** 使用 Message Id, 訂閱 Message資料, 並包裝好 使用者名稱 */
export const useSubMessageContent = (messageId: string): MessageContent[] => {
    const refIsMount = useGetMount();
    const refSubMessageContent = useRef<undefined | (() => void)>(undefined);
    const [messageContentBasics, setMessageContentBasics] = useState<
        MessageContentBasic[]
    >([]);
    const [messageContents, setMessageContents] = useState<MessageContent[]>(
        []
    );
    const memberList = useSubMemberList();
    // console.log("memberList", memberList);

    useIfSingIn(
        () => {
            setTimeout(() => {
                refSubMessageContent.current = firebase
                    .firestore()
                    .collection("messages")
                    .doc(messageId)
                    .collection("contents")
                    .orderBy("timestamp", "desc")
                    .onSnapshot((querySnapshot) => {
                        const tempMessageContents = [] as MessageContentBasic[];

                        querySnapshot.forEach((doc) => {
                            if (!doc.exists || refIsMount.current) {
                                const messageContentSnapshot =
                                    doc.data() as MessageContentSnapshot;

                                tempMessageContents.push({
                                    contentId: doc.id,
                                    content: messageContentSnapshot.content,
                                    timestamp: messageContentSnapshot.timestamp,
                                    uid: messageContentSnapshot.uid,
                                });
                            }
                        });

                        if (refIsMount.current) {
                            setMessageContentBasics(tempMessageContents);
                        }
                    });
            });
        },
        () => {
            if (typeof refSubMessageContent.current !== "undefined") {
                refSubMessageContent.current();
                refSubMessageContent.current = undefined;
            }
        }
    );

    useEffect(() => {
        const tempMessageContents = [] as MessageContent[];

        messageContentBasics.forEach((messageContentBasic) => {
            const member = memberList.find(
                (member) => member.id === messageContentBasic.uid
            );
            if (typeof member !== "undefined") {
                tempMessageContents.push({
                    ...messageContentBasic,
                    userName: member.name,
                });
            } else {
                tempMessageContents.push({
                    ...messageContentBasic,
                    userName: "",
                });
            }
        });

        if (refIsMount.current) {
            setMessageContents(tempMessageContents);
        }
    }, [messageContentBasics, memberList]);

    return messageContents;
};
