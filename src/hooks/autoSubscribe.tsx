import { useEffect, useRef, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { useSelector } from "react-redux";
import { selectUserEmail } from "../reducers/userRedux";

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
    const refIsMount = useRef(false);
    const refSubMember = useRef<undefined | (() => void)>(undefined);
    const userEmail = useSelector(selectUserEmail);
    const [memberList, setMemberList] = useState<Member[]>([]);

    useEffect(() => {
        refIsMount.current = true;

        if (userEmail.length) {
            if (typeof refSubMember.current === "undefined") {
                setTimeout(() => {
                    refSubMember.current = firebase
                        .firestore()
                        .collection("users-simple-infos")
                        .doc("infos")
                        .onSnapshot((doc) => {
                            console.log("useSubMemberList doc", doc);
                            const tempMemberList = [] as Member[];
                            if (refIsMount.current) {
                                const memberSimpleList = doc.data() as
                                    | MemberSimpleList
                                    | undefined;

                                if (typeof memberSimpleList !== "undefined") {
                                    for (const [
                                        uid,
                                        memberSimple,
                                    ] of Object.entries(memberSimpleList)) {
                                        tempMemberList.push({
                                            id: uid,
                                            name: memberSimple.name,
                                            onlineTimestamp:
                                                memberSimple.onlineTimestamp,
                                        });
                                    }
                                }
                            }

                            setMemberList(tempMemberList);
                        });
                });
            }
        } else {
            if (memberList.length) {
                if (refIsMount.current) {
                    setMemberList([]);
                }
            }
        }

        return () => {
            refIsMount.current = false;

            if (typeof refSubMember.current !== "undefined") {
                refSubMember.current();
                refSubMember.current = undefined;
            }
        };
    }, [userEmail]);

    return memberList;
};
