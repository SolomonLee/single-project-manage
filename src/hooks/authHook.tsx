import { useEffect } from "react";
import firebase from "firebase/app";
import * as apiAuth from "../apis/auth";

export const useAuthStateChanged = (
    mapKey: string,
    /** When AuthStateChanged callback function */
    cb: (user: firebase.User | null) => void
): void => {
    useEffect(() => {
        apiAuth.addAuthStateChangedCallBack(mapKey, (user) => {
            if (user) cb(user);
            else cb(null);
        });

        return () => {
            apiAuth.removeAuthStateChangedCallBack(mapKey);
        };
    }, []);
};
