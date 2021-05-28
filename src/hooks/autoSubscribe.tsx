import { useEffect, useRef } from "react";
import firebase from "firebase/app";

export interface MemberSimple {
    name: string;
    onlineTimestamp: number;
}

export interface MemberSimpleList {
    [uid: string]: MemberSimple;
}

export const useAutoSubscribed = (): void => {
    const refIsMount = useRef(false);
    useEffect(() => {
        refIsMount.current = true;

        firebase
            .firestore()
            .collection("user-simple-info")
            .doc("infos")
            .onSnapshot((doc) => {
                if (refIsMount.current) {
                    const memberSimpleList = doc.data() as
                        | MemberSimpleList
                        | undefined;

                    if (typeof memberSimpleList !== "undefined") {
                        /** TODO member AutoSubscribed */
                    }
                }
            });

        return () => {
            refIsMount.current = false;
        };
    }, []);
};
