import { useEffect, useRef } from "react";
import firebase from "firebase/app";
import * as apiAuth from "../apis/auth";
import { useSelector } from "react-redux";
import { selectUserEmail } from "../reducers/userRedux";
import { updateOnlineTime } from "../apis/user";

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

export const useIfSingIn = (
    isSingInCB: () => void,
    notSingInCB: () => void
): void => {
    const userEmail = useSelector(selectUserEmail);

    useEffect(() => {
        if (userEmail.length) {
            isSingInCB();
        } else {
            notSingInCB();
        }
    }, [userEmail]);
};

export const useAutoUpdateOnlineTime = (): void => {
    const refTimerAutoUpdateOnline = useRef<null | number>(null);

    useIfSingIn(
        () => {
            if (refTimerAutoUpdateOnline.current === null) {
                refTimerAutoUpdateOnline.current = window.setInterval(() => {
                    updateOnlineTime();
                }, 290000);
            }
        },
        () => {
            if (refTimerAutoUpdateOnline.current !== null) {
                clearInterval(refTimerAutoUpdateOnline.current);
                refTimerAutoUpdateOnline.current = null;
            }
        }
    );
};
