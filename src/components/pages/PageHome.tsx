import React, { useEffect, useState } from "react";
import MemberList from "../combo/member/MemberList";
import { MemberInfo } from "../combo/member/Member";

const PageHome = (): JSX.Element => {
    const [memberList, setMemberList] = useState<MemberInfo[]>([]);

    useEffect(() => {
        setMemberList([
            {
                id: "11111",
                name: "solo1111",
                onlineTimestamp: 1632191873542,
            },
            {
                id: "22222",
                name: "solo2222",
                onlineTimestamp: 1422191873542,
            },
            {
                id: "33333",
                name: "solo3333",
                onlineTimestamp: 1622190873542,
            },
        ]);
    }, []);

    return (
        <div className="container">
            <div className="row justify-content-md-center">
                <div className="col-md-6 col-12">
                    <h2>成員列表</h2>
                    <MemberList list={memberList} />
                </div>
            </div>
        </div>
    );
};

export default PageHome;
