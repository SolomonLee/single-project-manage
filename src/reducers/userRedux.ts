import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as apiAuth from "../apis/auth";
import * as apiUser from "../apis/user";
import { resultError /* , resultOk */ } from "../apis/result";
import { RootState } from "./store";

interface UserState extends apiUser.User {
    inSignIn: boolean;
    signInErrorMsg: string;
}

const initialState = <UserState>{
    inSignIn: false,
    signInErrorMsg: "",
    email: "",
    userName: "",
};

export const signInAsync = createAsyncThunk(
    "userRedux/signInAsync",
    async ({ email, password }: apiUser.Verification) => {
        const resultSignIn = await apiAuth.signIn(email, password);

        if (resultSignIn.result) {
            const resultGetUserInfo = await apiUser.getUserInfo();
            return resultGetUserInfo;
        }

        return resultError("登入失敗", <apiUser.User>{});
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

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signOut: (state) => {
            apiAuth.signOut();
            state.email = initialState.email;
            state.userName = initialState.userName;
            state.signInErrorMsg = initialState.signInErrorMsg;
        },
    },
    extraReducers: (builder) => {
        // signInAsync : START
        builder.addCase(signInAsync.pending, (state) => {
            state.email = initialState.email;
            state.userName = initialState.userName;
            state.signInErrorMsg = "";
            state.inSignIn = true;
        });
        builder.addCase(signInAsync.fulfilled, (state, action) => {
            state.inSignIn = false;

            if (action.payload.result) {
                const user = action.payload.datas;

                state.email = user.email;
                state.userName = initialState.userName;
                state.signInErrorMsg = "";
            } else {
                state.signInErrorMsg = action.payload.resultMsg;
            }
        });
        builder.addCase(signInAsync.rejected, (state) => {
            state.inSignIn = false;
            state.signInErrorMsg = "登入時出現未知的錯誤";
        });
        // signInAsync : END

        // registerAsync : START
        builder.addCase(registerAsync.pending, (state) => {
            state.inSignIn = true;
            state.signInErrorMsg = "";
        });
        builder.addCase(registerAsync.fulfilled, (state, action) => {
            if (action.payload.result) {
                state.signInErrorMsg = "";
            } else {
                state.inSignIn = false;
                state.signInErrorMsg = action.payload.resultMsg;
            }
        });

        builder.addCase(registerAsync.rejected, (state) => {
            state.inSignIn = false;
            state.email = "";
            state.userName = initialState.userName;
            state.signInErrorMsg = "註冊時出現未知的錯誤";
        });
        // registerAsync : END
    },
});

export const { signOut } = userSlice.actions;

export const selectUserEmail = (state: RootState): string => state.user.email;
export const selectUserName = (state: RootState): string => state.user.userName;
export const selectUserInSignIn = (state: RootState): boolean =>
    state.user.inSignIn;
export const selectUserSignInErrorMsg = (state: RootState): string =>
    state.user.signInErrorMsg;

export default userSlice.reducer;
