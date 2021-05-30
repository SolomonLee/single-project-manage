import React from "react";
import { Card } from "../../../../hooks/autoSubscribe";
import { UpdateCardData } from "../../../../apis/table";
import EditCardName from "./EditCardName";
import EditCardContent from "./EditCardContent";
import EditCardMember from "./EditCardMember";
import CardMessageBox from "./messages/CardMessageBox";

interface Props {
    listName: string;
    card: Card;
    updateCard: (updateCardData: UpdateCardData) => void;
    removeCard: () => void;
    addMember: (memberId: string, memberName: string) => void;
    removeMember: (memberId: string) => void;
}

const CardEditForm = ({
    listName,
    card,
    updateCard,
    removeCard,
    addMember,
    removeMember,
}: Props): JSX.Element => {
    const handleUpdate = () => {
        updateCard({
            id: card.cardId,
            content: card.content,
            name: card.name,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <form className="form_box" onSubmit={handleSubmit}>
            <div className="box_content">
                <div className="info_box">
                    <div className="box_title">
                        <div className="icon">
                            <i className="bi bi-credit-card-2-back"></i>
                        </div>
                        <EditCardName
                            card={card}
                            updateCardName={handleUpdate}
                        />
                    </div>
                    <div className="box_content">
                        <sub>在「{listName}」列表中</sub>
                    </div>
                </div>
                <div className="info_box">
                    <div className="box_content">
                        {card.members.length > 0 ? (
                            <div>
                                <span>成員</span>
                            </div>
                        ) : null}
                        <EditCardMember
                            card={card}
                            addMember={addMember}
                            removeMember={removeMember}
                        />
                    </div>
                </div>
                <div className="info_box">
                    <div className="box_title">
                        <div className="icon">
                            <i className="bi bi-justify-left"></i>
                        </div>
                        <span className="name">描述</span>
                    </div>
                    <div>
                        <EditCardContent
                            card={card}
                            updateCardContent={handleUpdate}
                        />
                    </div>
                </div>
                <div className="info_box">
                    <div className="box_title">
                        <div className="icon">
                            <i className="bi bi-text-left"></i>
                        </div>
                        <span className="name">活動</span>
                    </div>
                    <div className="box_content">
                        <CardMessageBox messageId={card.messageId} />
                    </div>
                </div>
                <div className="info_box">
                    <div className="box_title">
                        <div className="icon">
                            <i className="bi bi-exclamation"></i>
                        </div>
                        <span className="name">其他</span>
                    </div>
                    <div>
                        <button
                            type="button"
                            className="btn btn_style3 btn-sm"
                            onClick={removeCard}
                        >
                            刪除Card
                        </button>
                    </div>
                </div>
            </div>
            <div className="box_bottom"></div>
        </form>
    );
};

export default CardEditForm;
