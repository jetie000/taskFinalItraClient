import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ReactElement } from "react";
import { variables } from "../../variables";

export interface optionsState {
    theme: string
    language: string
}

const initialState: optionsState = {
    theme: localStorage.getItem(variables.THEME_LOCALSTORAGE) || 'dark',
    language: localStorage.getItem(variables.LANGUAGE_LOCALSTORAGE) || 'en'
}

export const pageOptionsSlice = createSlice({
    name: 'pageOptions',
    initialState,
    reducers: {
        setTheme: (state, {payload: theme}: PayloadAction<string>) => {
            state.theme = theme;
            localStorage.setItem(variables.THEME_LOCALSTORAGE, theme);
        },
        setLanguage: (state, {payload: language}: PayloadAction<string>) => {
            state.language = language;
            localStorage.setItem(variables.LANGUAGE_LOCALSTORAGE, language);
        }
    }
})

export const {actions, reducer} = pageOptionsSlice