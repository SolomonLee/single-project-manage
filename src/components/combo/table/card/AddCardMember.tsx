import React, { useState } from "react";
import { useSubMemberList } from "../../../../hooks/autoSubscribe";

interface AddCardMemberOptProps {
    memberId: string;
    memberName: string;
    handleAddMember: (memberId: string, memberName: string) => void;
}
const AddCardMemberOpt = ({
    memberId,
    memberName,
    handleAddMember,
}: AddCardMemberOptProps): JSX.Element => {
    const handleClick = () => {
        handleAddMember(memberId, memberName);
    };

    return (
        <button type="button" className="btn btn_style2" onClick={handleClick}>
            {memberName} ({memberId})
        </button>
    );
};

interface Props {
    memberIds: string[];
    handleAddMember: (memberId: string, memberName: string) => void;
}
const AddCardMember = ({
    handleAddMember,
    memberIds,
}: Props): JSX.Element | null => {
    const [showCardMemberList, setShowCardMemberList] = useState(false);
    const memberList = useSubMemberList();
    const filterMemberList = memberList.filter(
        (member) => memberIds.indexOf(member.id) === -1
    );

    const handleClick = () => {
        setShowCardMemberList(!showCardMemberList);
    };

    if (filterMemberList.length === 0) return null;

    return (
        <span className="add_card_member" onClick={handleClick}>
            <span className="card_member">
                <i className="bi bi-plus-lg"></i>
            </span>
            {showCardMemberList ? (
                <div className="add_card_member_list">
                    {filterMemberList.map((member) => (
                        <AddCardMemberOpt
                            key={member.id}
                            memberId={member.id}
                            memberName={member.name}
                            handleAddMember={handleAddMember}
                        />
                    ))}
                </div>
            ) : null}
        </span>
    );
};

export default AddCardMember;
