import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as apiAuth from "../apis/auth";
import * as apiUser from "../apis/user";
import { resultError, resultOk } from "../apis/result";
import addMessage from "../components/combo/message/Message";
import { RootState } from "./store";

interface UserState extends apiUser.User {
    inSignIn: boolean;
    uid: string;
}

const initialState = <UserState>{
    inSignIn: false,
    email: "",
    userName: "",
    uid: "",
};

interface UserAuth extends apiUser.User {
    uid: string;
}
export const signInAsync = createAsyncThunk(
    "userRedux/signInAsync",
    async ({ email, password }: apiUser.Verification) => {
        const resultSignIn = await apiAuth.signIn(email, password);

        if (resultSignIn.result) {
            const resultGetUserInfo = await apiUser.getUserInfo();

            return resultOk(<UserAuth>{
                ...resultGetUserInfo.datas,
                uid: resultSignIn.datas,
            });
        }

        return resultError("登入失敗", <UserAuth>{});
    }
); // signInAsync()

/** 不處理 "註冊後 登入" */
export const registerAsync = createAsyncThunk(
    "userRedux/registerAsync",
    async ({ email, password }: apiUser.Verification) => {
        try {
            const resultRegister = await apiAuth.register(email, password);
            return resultRegister;
        } catch (error) {
            console.log("註冊失敗", error);
        }

        return resultError("註冊失敗");
    }
); // registerAsync()

/** 當 firebase auth 自動登入時 */
export const getUserInfoAsync = createAsyncThunk(
    "gamerRedux/getGamerInfoAsync",
    async () => {
        const resultGetUserInfo = await apiUser.getUserInfo();

        return resultOk(<UserAuth>{
            ...resultGetUserInfo.datas,
            uid: apiAuth.getUid(),
        });
    }
); // getUserInfoAsync()

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signOut: (state) => {
            apiAuth.signOut();
            state.email = initialState.email;
            state.userName = initialState.userName;
            state.uid = initialState.uid;
            addMessage("登出成功!", "Ok");
        },
    },
    extraReducers: (builder) => {
        // signInAsync : START
        builder.addCase(signInAsync.pending, (state) => {
            state.email = initialState.email;
            state.userName = initialState.userName;
            state.inSignIn = true;
        });
        builder.addCase(signInAsync.fulfilled, (state, action) => {
            state.inSignIn = false;

            if (action.payload.result) {
                const user = action.payload.datas;

                state.email = user.email;
                state.userName = user.userName;
                state.uid = user.uid;
                addMessage("登入成功!", "Ok");
            } else {
                addMessage(action.payload.resultMsg, "Fail");
            }
        });
        builder.addCase(signInAsync.rejected, (state) => {
            state.inSignIn = false;
            addMessage("登入時出現未知的錯誤", "Fail");
        });
        // signInAsync : END

        // registerAsync : START
        builder.addCase(registerAsync.pending, (state) => {
            state.inSignIn = true;
        });
        builder.addCase(registerAsync.fulfilled, (state, action) => {
            if (action.payload.result) {
                addMessage("註冊成功!", "Ok");
            } else {
                state.inSignIn = false;
                addMessage(action.payload.resultMsg, "Fail");
            }
        });

        builder.addCase(registerAsync.rejected, (state) => {
            state.inSignIn = false;
            state.email = "";
            state.userName = initialState.userName;
            addMessage("註冊時出現未知的錯誤", "Fail");
        });
        // registerAsync : END

        // getUserInfoAsync : START
        builder.addCase(getUserInfoAsync.pending, (state) => {
            state.inSignIn = true;
        });
        builder.addCase(getUserInfoAsync.fulfilled, (state, action) => {
            state.inSignIn = false;

            if (action.payload.result) {
                const user = action.payload.datas;
                state.email = user.email;
                state.userName = user.userName;
                state.uid = user.uid;
                addMessage("自動登入成功!", "Ok");
            }
        });

        builder.addCase(getUserInfoAsync.rejected, (state) => {
            state.inSignIn = false;
            state.email = "";
            addMessage("取得玩家資訊時出現未知的錯誤", "Fail");
        });
        // getUserInfoAsync : END
    },
});

export const { signOut } = userSlice.actions;

export const selectUserEmail = (state: RootState): string => state.user.email;
export const selectUserName = (state: RootState): string => state.user.userName;
export const selectUserInSignIn = (state: RootState): boolean =>
    state.user.inSignIn;

export default userSlice.reducer;
