import firebase from "firebase/app";
import { resultError, resultOk, Result } from "./result";
import "firebase/functions";
import promiseTimer from "../common/promiseTimer";

export interface User {
    email: string;
    userName: string;
}

export interface Verification {
    email: string;
    password: string;
}

/** 當註冊完成後 可能尚未 建立好使用者資訊,  */
const getUserInfoLoog = async (): Promise<Result<User>> => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return await promiseTimer(() => getUserInfo(), 1000);
    } catch (e) {
        console.log("載入使用者資料發生錯誤 ", e);
    }

    return resultError("載入使用者資料發生錯誤", <User>{});
};

export const getUserInfo = async (): Promise<Result<User>> => {
    try {
        // eslint-disable-next-line no-shadow
        const getUserInfo = await firebase
            .functions()
            .httpsCallable("getUserInfo")();

        if (typeof getUserInfo.data.result === "undefined") throw new Error();

        if (getUserInfo.data.result !== true) {
            if (getUserInfo.data.resultMsg === "取得使用者資訊發生錯誤!") {
                const result = await promiseTimer(getUserInfoLoog, 1000);
                return result;
            }
        } else if (firebase.auth().currentUser !== null) {
            return resultOk(getUserInfo.data.datas);
        }
    } catch (e) {
        console.log("載入使用者資料發生錯誤 ", e);
    }

    return resultError("載入使用者資料發生錯誤", <User>{});
};

export const updateOnlineTime = async (): Promise<Result<null>> => {
    try {
        // eslint-disable-next-line no-shadow
        const updateOnlineTimeResult = await firebase
            .functions()
            .httpsCallable("updateOnlineTime")();

        if (typeof updateOnlineTimeResult.data.result === "undefined")
            throw new Error();

        return resultOk(null);
    } catch (e) {
        console.log("自動更新使用者上線時間發生錯誤 ", e);
    }

    return resultError("自動更新使用者上線時間發生錯誤", null);
};
