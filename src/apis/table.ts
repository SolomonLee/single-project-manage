import firebase from "firebase/app";
import { resultError, resultOk, Result } from "./result";
import "firebase/functions";
import addMessage from "../components/combo/message/Message";

export const createList = async (
    listId: string,
    name: string,
    nextListId: string
): Promise<Result<null>> => {
    try {
        firebase
            .functions()
            .httpsCallable("createList")({
                listId,
                name,
                nextListId,
            })
            .then((result) => {
                if (!result.data.result) {
                    addMessage("建立 List 失敗, 請重新整理頁面", "Fail");
                } else {
                    addMessage(`建立 ${name} 成功!`, "Ok");
                }
            });

        return resultOk(null);
    } catch (e) {
        console.log("新建 List 發生錯誤 ", e);
    }

    return resultError("新建 List 發生錯誤", null);
};

interface UpdateListData {
    id: string;
    name: string;
    nextListId: string;
}
export const updateBatchList = async (
    arrList: UpdateListData[]
): Promise<Result<null>> => {
    try {
        firebase
            .functions()
            .httpsCallable("updateBatchList")({
                arrList,
            })
            .then((result) => {
                if (!result.data.result) {
                    addMessage("更新 List 失敗, 請重新整理頁面", "Fail");
                } else {
                    addMessage(`更新 List 成功!`, "Ok");
                }
            });

        return resultOk(null);
    } catch (e) {
        console.log("更新 List 發生錯誤 ", e);
    }

    return resultError("更新 List 發生錯誤", null);
};

export const removeList = async (
    prevListId: string,
    removeListId: string,
    nextListId: string,
    cardIds: string[]
): Promise<Result<null>> => {
    try {
        firebase
            .functions()
            .httpsCallable("removeList")({
                prevListId,
                removeListId,
                nextListId,
                cardIds,
            })
            .then((result) => {
                if (!result.data.result) {
                    addMessage("移除 List 失敗, 請重新整理頁面", "Fail");
                } else {
                    addMessage(`移除 List 成功!`, "Ok");
                }
            });

        return resultOk(null);
    } catch (e) {
        console.log("移除 List 失敗 ", e);
    }

    return resultError("移除 List 失敗", null);
};

export const createCard = async (
    cardId: string,
    name: string,
    listId: string,
    nextCardId: string
): Promise<Result<null>> => {
    try {
        firebase
            .functions()
            .httpsCallable("createCard")({
                cardId,
                name,
                listId,
                nextCardId,
            })
            .then((result) => {
                if (!result.data.result) {
                    addMessage("新增 Card 失敗, 請重新整理頁面", "Fail");
                } else {
                    addMessage(`新增 Card 成功!`, "Ok");
                }
            });

        return resultOk(null);
    } catch (e) {
        console.log("新增 Card 失敗 ", e);
    }

    return resultError("新增 Card 失敗", null);
};

export interface UpdateBatchCardData {
    id: string;
    content: string;
    listId: string;
    name: string;
    nextCardId: string;
}
export const updateBatchCard = async (
    arrList: UpdateBatchCardData[]
): Promise<Result<null>> => {
    try {
        firebase
            .functions()
            .httpsCallable("updateBatchCard")({
                arrList,
            })
            .then((result) => {
                if (!result.data.result) {
                    addMessage("更新 Card 失敗, 請重新整理頁面", "Fail");
                } else {
                    addMessage(`更新 Card 成功!`, "Ok");
                }
            });

        return resultOk(null);
    } catch (e) {
        console.log("更新 Card 失敗 ", e);
    }

    return resultError("更新 Card 失敗", null);
};

export interface CardMemberData {
    memberName: string;
    /** member ID */
    uid: string;
}
export interface UpdateCardData {
    id: string;
    content: string;
    name: string;
    members: CardMemberData[];
}
export const updateCard = async ({
    id,
    content,
    name,
    members,
}: UpdateCardData): Promise<Result<null>> => {
    try {
        firebase
            .functions()
            .httpsCallable("updateCard")({
                id,
                content,
                name,
                members,
            })
            .then((result) => {
                if (!result.data.result) {
                    addMessage("更新 Card 失敗, 請重新整理頁面", "Fail");
                } else {
                    addMessage(`更新 Card 成功!`, "Ok");
                }
            });

        return resultOk(null);
    } catch (e) {
        console.log("更新 Card 失敗 ", e);
    }

    return resultError("更新 Card 失敗", null);
};

export const removeCard = async (
    prevCardId: string,
    removeCardId: string,
    nextCardId: string
): Promise<Result<null>> => {
    try {
        firebase
            .functions()
            .httpsCallable("removeCard")({
                prevCardId,
                removeCardId,
                nextCardId,
            })
            .then((result) => {
                if (!result.data.result) {
                    addMessage("移除 Card 失敗, 請重新整理頁面", "Fail");
                } else {
                    addMessage(`移除 Card 成功!`, "Ok");
                }
            });

        return resultOk(null);
    } catch (e) {
        console.log("移除 Card 失敗 ", e);
    }

    return resultError("移除 Card 失敗", null);
};

export const createMessage = async (
    messageId: string,
    content: string
): Promise<Result<null>> => {
    try {
        firebase
            .functions()
            .httpsCallable("createMessage")({
                messageId,
                content,
            })
            .then((result) => {
                if (!result.data.result) {
                    addMessage("新增 訊息 失敗, 請重新整理頁面", "Fail");
                } else {
                    addMessage(`新增 訊息 成功!`, "Ok");
                }
            });

        return resultOk(null);
    } catch (e) {
        console.log("新增 訊息 失敗 ", e);
    }

    return resultError("新增 訊息 失敗", null);
};

export const updateMessage = async (
    messageId: string,
    contentId: string,
    content: string
): Promise<Result<null>> => {
    try {
        firebase
            .functions()
            .httpsCallable("updateMessage")({
                messageId,
                contentId,
                content,
            })
            .then((result) => {
                if (!result.data.result) {
                    addMessage("修改 訊息 失敗, 請重新整理頁面", "Fail");
                } else {
                    addMessage(`修改 訊息 成功!`, "Ok");
                }
            });

        return resultOk(null);
    } catch (e) {
        console.log("修改 訊息 失敗 ", e);
    }

    return resultError("修改 訊息 失敗", null);
};

export const removeMessage = async (
    messageId: string,
    contentId: string
): Promise<Result<null>> => {
    try {
        firebase
            .functions()
            .httpsCallable("removeMessage")({
                messageId,
                contentId,
            })
            .then((result) => {
                if (!result.data.result) {
                    addMessage("移除 訊息 失敗, 請重新整理頁面", "Fail");
                } else {
                    addMessage(`移除 訊息 成功!`, "Ok");
                }
            });

        return resultOk(null);
    } catch (e) {
        console.log("移除 訊息 失敗 ", e);
    }

    return resultError("移除 訊息 失敗", null);
};
