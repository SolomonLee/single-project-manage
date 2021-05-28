import React from "react";
import MemberList from "../combo/member/MemberList";
import { useSubMemberList } from "../../hooks/autoSubscribe";

const PageHome = (): JSX.Element => {
    const memberList = useSubMemberList();

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
