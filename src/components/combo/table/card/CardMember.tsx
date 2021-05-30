import React from "react";

interface Props {
    memberName: string;
    memberId: string;
    handleRemoveMember: (memberId: string) => void;
}
const CardMember = ({
    memberName,
    memberId,
    handleRemoveMember,
}: Props): JSX.Element => {
    const handleClick = () => {
        handleRemoveMember(memberId);
    };

    return (
        <span className="card_member" onClick={handleClick}>
            <div className="user">
                <span className="name">
                    <span>{memberName}</span>
                </span>
            </div>
        </span>
    );
};

export default CardMember;
