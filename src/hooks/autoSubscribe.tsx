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
