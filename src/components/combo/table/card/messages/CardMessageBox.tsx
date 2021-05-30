import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
    createMessage,
    removeMessage,
    updateMessage,
} from "../../../../../apis/table";
import {
    MessageContent,
    useSubMessageContent,
} from "../../../../../hooks/autoSubscribe";
import { useGetMount } from "../../../../../hooks/controlComponent";
import {
    selectUserUid,
    selectUserName,
} from "../../../../../reducers/userRedux";
import AddCardMessage from "./AddCardMessage";
import CardMessage from "./CardMessage";
import EditMessage from "./EditMessage";

const getTimeStr = (timestamp1: number, now: number) => {
    let td = Math.floor((now - timestamp1) / 1000);

    if (td < 60) {
        return "剛剛";
    } else {
        td = Math.floor(td / 60);

        if (td < 60) {
            return `${td} 分鐘以前`;
        } else {
            td = Math.floor(td / 24);

            if (td < 24) {
                return `${td} 小時以前`;
            } else {
                td = Math.floor(td / 7);

                if (td < 7) {
                    return `${td} 天之前`;
                }
            }
        }
    }

    const date = new Date(timestamp1);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${year}年 ${month}月 ${day}日`;
};

interface Props {
    messageId: string;
}
const CardMessageBox = ({ messageId }: Props): JSX.Element => {
    const subMessageContents = useSubMessageContent(messageId);
    const [messageContents, setMessageContents] = useState<MessageContent[]>(
        []
    );
    const isMount = useGetMount();
    /** 讓迅速更新時畫面不會一直閃爍 */
    const refTimerUpdateBatch = useRef<number | null>(null);

    // console.log("messageContents", messageContents);
    const userUid = useSelector(selectUserUid);
    const userName = useSelector(selectUserName);

    useEffect(() => {
        if (refTimerUpdateBatch.current === null) {
            refTimerUpdateBatch.current = -2;
            setMessageContents(subMessageContents);
        } else if (refTimerUpdateBatch.current === -2) {
            refTimerUpdateBatch.current = -1;
            setMessageContents(subMessageContents);
        } else {
            clearTimeout(refTimerUpdateBatch.current);

            refTimerUpdateBatch.current = window.setTimeout(() => {
                if (isMount.current) {
                    setMessageContents(subMessageContents);
                }
            }, 3000);
        }

        return () => {
            if (
                refTimerUpdateBatch.current !== null &&
                refTimerUpdateBatch.current > -1
            ) {
                clearTimeout(refTimerUpdateBatch.current);
                refTimerUpdateBatch.current = null;
            }
        };
    }, [subMessageContents]);

    const addContent = (content: string): boolean => {
        console.log("add content :", messageId, content);
        const timestamp = Date.now();
        const contentId = `Content_${userUid}_${timestamp}`;

        messageContents.unshift({
            contentId,
            content,
            timestamp,
            uid: userUid,
            userName: userName,
        });

        if (content !== "") {
            createMessage(messageId, contentId, content);
            setMessageContents([...messageContents]);
            return true;
        }

        return false;
    };

    const editContent = (contentId: string, content: string) => {
        console.log("edit content :", messageId, contentId, content);
        const messageContent = messageContents.find(
            (messageContent) => messageContent.contentId === contentId
        );

        if (typeof messageContent === "undefined") return false;

        messageContent.content = content;

        updateMessage(messageId, contentId, content);
        setMessageContents([...messageContents]);
        return true;
    };

    const removeContent = (contentId: string) => {
        console.log("remove content :", messageId, contentId);
        const index = messageContents.findIndex(
            (messageContent) => messageContent.contentId === contentId
        );

        if (index === -1) {
            return false;
        }

        messageContents.splice(index, 1);

        removeMessage(messageId, contentId);
        setMessageContents([...messageContents]);
    };

    const messageContentJSX = useMemo(() => {
        const now = Date.now();
        return messageContents.map((messageContent) => {
            if (userUid !== messageContent.uid) {
                return (
                    <CardMessage
                        key={messageContent.contentId}
                        name={messageContent.userName}
                        timeStr={getTimeStr(messageContent.timestamp, now)}
                    >
                        {messageContent.content}
                    </CardMessage>
                );
            } else {
                return (
                    <EditMessage
                        key={messageContent.contentId}
                        name={messageContent.userName}
                        contentId={messageContent.contentId}
                        removeContent={removeContent}
                        updateContent={editContent}
                        content={messageContent.content}
                        timeStr={getTimeStr(messageContent.timestamp, now)}
                    ></EditMessage>
                );
            }
        });
    }, [messageContents]);

    return (
        <div className="card_message_box">
            <div className="box_content">
                <AddCardMessage addContent={addContent} name={userName} />
                <div className="card_message_item_group">
                    {messageContentJSX}
                </div>
            </div>
        </div>
    );
};

export default CardMessageBox;
