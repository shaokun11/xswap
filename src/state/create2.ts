import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { AppState } from './index'
import { getAppleFactory } from '../utils/api'


const getApples = createAsyncThunk<{ amount: number }>('getApples',
    async () => {
        const amount = (await getAppleFactory().totalApple()).toNumber()
        return {
            amount,
        }
    })
const getAppleContract = createAsyncThunk<{ contracts: string[] }, { start: number, end: number }>('getAppleContract',
    async ({ start, end }) => {
        const contracts = await getAppleFactory().getAllApples(start, end)
        return {
            contracts,
        }
    })
const slicer = createSlice({
    name: 'create2',
    initialState: {
        apples: 0,
        appleAddress: [],
    },
    reducers: {},
    extraReducers: {
        [getApples.fulfilled.toString()]: (state, action) => {
            state.apples = action.payload.amount
        },
        [getAppleContract.fulfilled.toString()]: (state, action) => {
            state.appleAddress = action.payload.contracts
        },
    },
})

export function useCreate2() {
    return useSelector((s: AppState) => s.create2)
}

export const create2Action = { ...slicer.actions, getApples, getAppleContract }

export const create2Reducer = slicer.reducer
