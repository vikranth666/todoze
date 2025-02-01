import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlices";
import taskReducer from "./slices/taskSlices";

export const store = configureStore ({
    reducer :{
        auth:authReducer,
        tasks:taskReducer,

    }
})