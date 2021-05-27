import { configureStore } from "@reduxjs/toolkit";
import userRedux from "./userRedux";

export const store = configureStore({
    reducer: {
        user: userRedux,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
