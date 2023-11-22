import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../types/user.interface";
import { variables } from "../../variables";
import { ICollection } from "../../types/collection.interface";


export interface userState {
    user?: IUser
}

const initialState: userState = {
    user: JSON.parse(localStorage.getItem(variables.USER_LOCALSTORAGE)!) || undefined
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem(variables.USER_LOCALSTORAGE);
            state.user = undefined;
        },
        setUser: (state, { payload: user }: PayloadAction<IUser>) => {
            state.user = user;
            localStorage.setItem(variables.USER_LOCALSTORAGE, JSON.stringify(user));
        },
        setCollections: (state, { payload: collections }: PayloadAction<ICollection[]>) => {
            if (state.user)
                state.user.collections = collections;
        }
    },
})

export const { actions, reducer } = userSlice