import React, { useMemo } from "react";

interface OnlineState {
    state: "Online" | "Offline";
    message: string;
}

interface Props {
    timestamp: number;
}

const getOnlineState = (timestamp: number): OnlineState => {
    const distanceMinute = Math.floor(
        (Date.now() - timestamp) / 60000
    ); /*  / 1000 / 60  */

    if (distanceMinute > 5) {
        if (distanceMinute > 40) {
            return {
                state: "Offline",
                message: "離線中",
            };
        } else {
            return {
                state: "Offline",
                message: `${distanceMinute} 分鐘前上線`,
            };
        }
    } else {
        return {
            state: "Online",
            message: "上線中",
        };
    }
};

const MemberOnlineState = ({ timestamp }: Props): JSX.Element => {
    const onlineState = useMemo(() => getOnlineState(timestamp), [timestamp]);

    return (
        <div className="online_state" data-type={onlineState.state}>
            {onlineState.message}
        </div>
    );
};

export default MemberOnlineState;
