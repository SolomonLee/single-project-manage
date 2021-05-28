import React from "react";
import MemberOnlineState from "./MemberOnlineState";

export interface MemberInfo {
    id: string;
    name: string;
    /** 上次上線時間 */
    onlineTimestamp: number;
}

interface Props {
    infos: MemberInfo;
}

export const Member = ({ infos: memberInfos }: Props): JSX.Element => {
    return (
        <div className="member_item">
            <div className="item_content">
                <MemberOnlineState timestamp={memberInfos.onlineTimestamp} />
                <div className="name">{memberInfos.name}</div>
            </div>
        </div>
    );
};

export default Member;
