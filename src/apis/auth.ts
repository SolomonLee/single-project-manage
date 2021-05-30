import firebase from "firebase/app";
import { resultError, resultOk, Result } from "./result";
import "firebase/auth";

export const signIn = async (
    email: string,
    password: string
): Promise<Result<string>> => {
    try {
        const result = await firebase
            .auth()
            .signInWithEmailAndPassword(email, password);
        if (result.user) return resultOk(result.user.uid);
    } catch (e) {
        console.log(`signIn error!! ${e}`);
    }

    return resultError("登入失敗");
};

export const signOut = async (): Promise<Result<null>> => {
    try {
        await firebase.auth().signOut();

        return resultOk(null);
    } catch (e) {
        console.log(`signOut error!! ${e}`);
    }

    return resultError("登入失敗");
};

export const register = async (
    email: string,
    password: string
): Promise<Result<null>> => {
    try {
        const resultRegister = await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => resultOk(null, "註冊成功"))
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode === "auth/weak-password") {
                    return resultError("密碼太簡單了!", null);
                }

                return resultError(errorMessage, null);
            });

        return resultRegister;
    } catch (e) {
        console.log(`register error!! ${e}`);
    }

    return resultError("註冊失敗");
};

type AuthCallBack = (user: firebase.User | null) => void;
/** When AuthStateChanged call every one CB */
const mapAuthChangedCBL = new Map<string, AuthCallBack>();
setTimeout(() => {
    firebase.auth().onAuthStateChanged((user) => {
        mapAuthChangedCBL.forEach((cb) => {
            cb(user);
        });
    });
});

export const addAuthStateChangedCallBack = (
    key: string,
    cb: AuthCallBack
): void => {
    mapAuthChangedCBL.set(key, cb);
};

export const removeAuthStateChangedCallBack = (key: string): void => {
    mapAuthChangedCBL.delete(key);
};

export const getUid = (): string => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser === null) return "";

    return currentUser.uid;
};
