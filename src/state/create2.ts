import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { AppState } from './index'
import { getApple, getAppleFactory } from '../utils/api'

interface IAppleInfo {
    id: number,
    memory: number,
    disk: number,
    count: number,
    color: string,
    player: string,
    contract: string
}

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
const makeApple = createAsyncThunk<boolean, { color: string, memory: number, disk: number }>('makeApple',
    async ({ color, memory, disk }) => {
        console.log('---makeApple----', color, memory, disk)
        await getAppleFactory().makeApple(memory, disk, color)
        return true
    })

const getAppleInfo = createAsyncThunk<IAppleInfo, string>('getAppleInfo',
    async (contract, { getState }) => {
        const state = getState() as any
        let item = state['create2'].cacheAppInfo.find(item => item.contract === contract)
        if (item) return item
        const contracts = await getApple(contract).getApple()
        return {
            id: contracts[0].toNumber(),
            memory: contracts[1].toNumber(),
            disk: contracts[2].toNumber(),
            count: contracts[3].toNumber(),
            player: contracts[4],
            color: contracts[5],
            contract,
        }
    })
const slicer = createSlice({
    name: 'create2',
    initialState: {
        apples: 0,
        appleAddress: [] as string[],
        cacheAppInfo: [] as IAppleInfo[],
    },
    reducers: {},
    extraReducers: {
        [getApples.fulfilled.toString()]: (state, action) => {
            if (state.apples !== action.payload.amount)
                state.apples = action.payload.amount
        },
        [getAppleContract.fulfilled.toString()]: (state, action) => {
            state.appleAddress = action.payload.contracts
        },
        [getAppleInfo.fulfilled.toString()]: (state, action) => {
            if (!state.cacheAppInfo.some(item => item.contract === action.payload.contract)) {
                state.cacheAppInfo.push(action.payload)

            }
        },
    },
})

export function useCreate2() {
    return useSelector((s: AppState) => s.create2)
}

export const create2Action = { ...slicer.actions, getApples, getAppleContract, getAppleInfo, makeApple }

export const create2Reducer = slicer.reducer
