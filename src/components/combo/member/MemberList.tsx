import React, { useMemo } from "react";
import { Member, MemberInfo } from "./Member";

interface Props {
    list: MemberInfo[];
}

const MemberList = ({ list }: Props): JSX.Element => {
    const memberList = useMemo(
        () => list.map((member) => <Member infos={member} key={member.id} />),
        [list]
    );

    return <div className="member_list_box">{memberList}</div>;
};

export default MemberList;
