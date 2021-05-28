import { useRef, useState } from "react";
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

                            tempMemberList.sort((a, b): number => {
                                return b.onlineTimestamp - a.onlineTimestamp;
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
