import React, { MouseEvent, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    signOut,
    signInAsync,
    registerAsync,
    getUserInfoAsync,
    selectUserEmail,
    selectUserName,
    selectUserInSignIn,
} from "../../../reducers/userRedux";
import Modal from "../modal/Modal";
import SignInForm from "../form/signIn/SignInForm";
import {
    useAuthStateChanged,
    useAutoUpdateOnlineTime,
} from "../../../hooks/authHook";

const User = (): JSX.Element => {
    const userEmail = useSelector(selectUserEmail);
    const userName = useSelector(selectUserName);
    const inSignIn = useSelector(selectUserInSignIn);
    useAutoUpdateOnlineTime();

    const dispatch = useDispatch();

    const [isOpenSing, setIsOpenSing] = useState(false);

    useAuthStateChanged("autoGetUserInfo", (user) => {
        if (user) {
            // 當登入時
            dispatch(getUserInfoAsync());
        } else {
            setIsOpenSing(true);
        }
    });

    useEffect(() => {
        if (userEmail?.length) {
            setIsOpenSing(false);
        }
    }, [userEmail]);

    const handleSignOut = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        dispatch(signOut());
    };

    const handleShowSignInModal = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        setIsOpenSing(true);
    };

    const handleSignIn = (email: string, password: string): void => {
        dispatch(signInAsync({ email, password }));
    };

    const handleRegister = (email: string, password: string) => {
        dispatch(registerAsync({ email, password }));
    };

    let showJSX = null;
    if (inSignIn) {
        showJSX = (
            <span>
                <span className="material-icons icons-loading" />
                確認中...
            </span>
        );
    } else if (userEmail?.length) {
        showJSX = (
            <>
                <span className="name">
                    <span>{userName}</span>
                </span>
                <div className="functions">
                    <button
                        type="button"
                        className="btn btn_style1"
                        onClick={handleSignOut}
                    >
                        sign out
                    </button>
                </div>
            </>
        );
    } else {
        showJSX = (
            <div className="functions">
                <button
                    type="button"
                    className="btn btn_style1"
                    onClick={handleShowSignInModal}
                >
                    sign in
                </button>
            </div>
        );
    }

    return (
        <div className="user">
            {showJSX}
            <Modal isOpen={isOpenSing} stylenum={0} setClose={undefined}>
                <SignInForm
                    singInFunction={handleSignIn}
                    registerFunction={handleRegister}
                    isWaitingResult={inSignIn}
                />
            </Modal>
        </div>
    );
};

export default User;
