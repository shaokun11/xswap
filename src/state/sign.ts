import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getContractIns } from '../utils/api'
import { useSelector } from 'react-redux'
import { AppState } from './index'

const getMyAmount = createAsyncThunk<{ amount: number }, string>('getMyAmount',
    async (addr) => {
    const amount = (await getContractIns().amounts(addr)).toNumber()
    console.log("--getMyAmount----",amount)
        return {
            amount
        }
    })

const getMyNonce = createAsyncThunk<{ nonce: number }, string>('getMyNonce',
    async (addr) => {
        return {
            nonce: (await getContractIns().nonces(addr)).toNumber(),
        }
    })


const updateAmount = createAsyncThunk<{ hash: string }, {
    player: string,
    amount: number,
    v: number,
    r: string,
    s: string,
}>('updateAmount',
    async (obj) => {
        const hash = await getContractIns().testEIP712(...Object.values(obj))
        console.log('-----', hash)
        return {
            hash,
        }
    })


const signSlice = createSlice({
    name: 'SIGN',
    initialState: {
        amount: 0,
        nonce: 0,
        hashArr: [] as string[],
    },
    reducers: {},
    extraReducers: {
        [getMyAmount.fulfilled.toString()]: (state, action) => {
            state.amount = action.payload.amount
        },
        [getMyNonce.fulfilled.toString()]: (state, action) => {
            state.nonce = action.payload.nonce
        },
        [updateAmount.fulfilled.toString()]: (state, action) => {
            state.hashArr.push(action.payload.hash)
        },
    },
})
export const useSignState = () => useSelector((s: AppState) => s.sign)
export const signActions = { updateAmount: getMyAmount, updateNonce: getMyNonce, exeUpdateAmount: updateAmount }
export const signReducer = signSlice.reducer
