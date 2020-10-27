import { createSlice } from '@reduxjs/toolkit'
import {  useSelector } from 'react-redux'
import { AppState } from './index'
const appSlice = createSlice({
    name: 'APP',
    initialState: {
        theme: 'light',
    },
    reducers: {
        changeTheme: (state, action) => {
            state.theme = action.payload.theme
        },
    },
})

export function useApp() {
    return useSelector((s: AppState) => s.app)
}

export const appAction = appSlice.actions

export const appReducer = appSlice.reducer
