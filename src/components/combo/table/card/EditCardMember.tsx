import React, { useState } from "react";
import { Card } from "../../../../hooks/autoSubscribe";
import addMessage from "../../message/Message";
import AddCardMember from "./AddCardMember";
import CardMember from "./CardMember";

interface Props {
    card: Card;
    addMember: (memberId: string, memberName: string) => void;
    removeMember: (memberId: string) => void;
}
const EditCardMember = ({
    card,
    addMember,
    removeMember,
}: Props): JSX.Element => {
    const handleAddMember = (memberId: string, memberName: string) => {
        console.log(card.cardId, memberId, memberName);
        addMember(memberId, memberName);
    };

    const handleRemoveMember = (memberId: string) => {
        console.log(card.cardId, memberId);
        removeMember(memberId);
    };

    return (
        <div className="card_member_list">
            {card.members.map((member) => {
                return (
                    <CardMember
                        key={member.uid}
                        memberId={member.uid}
                        memberName={member.memberName}
                        handleRemoveMember={handleRemoveMember}
                    />
                );
            })}
            <AddCardMember
                memberIds={card.members.map((member) => member.uid)}
                handleAddMember={handleAddMember}
            />
            <div className="member">Solomon</div>
        </div>
    );
};

export default EditCardMember;
