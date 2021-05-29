import React from "react";
import ReactDOM from "react-dom";

interface MessageDataBase {
    state: "Common" | "Fail" | "Ok";
    context: string;
}

interface MessageData extends MessageDataBase {
    id: string;
}

let elementMessageBox = document.getElementById("MessageBox");

const MessageList = (messageDatas: MessageData[]): void => {
    const element = messageDatas.map((messageData) => (
        <div className="message_item" key={messageData.id}>
            <div className="item_title">
                <span
                    className="message_state"
                    data-state={messageData.state}
                />
            </div>
            <div className="item_content">{messageData.context}</div>
        </div>
    ));

    if (elementMessageBox === null) {
        elementMessageBox = document.getElementById("MessageBox");
    }

    if (elementMessageBox !== null) {
        ReactDOM.render(element, elementMessageBox);
    }
};

const messageDatas: MessageData[] = [];

const addMessage = (
    context: string,
    state: "Common" | "Fail" | "Ok" = "Common"
): void => {
    const now = Date.now().toString();
    messageDatas.push({
        state,
        context,
        id: now,
    });

    setTimeout(() => {
        messageDatas.splice(
            messageDatas.findIndex((messageData) => messageData.id === now),
            1
        );

        MessageList(messageDatas);
    }, 5000);

    MessageList(messageDatas);
};

export default addMessage;
