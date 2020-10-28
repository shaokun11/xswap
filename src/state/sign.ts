import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getContractIns, provider } from '../utils/api'
import { useSelector } from 'react-redux'
import { AppState } from './index'

const getMyAmount = createAsyncThunk<{ amount: number }, string>('getMyAmount',
    async (addr) => {
        const amount = (await getContractIns().amounts(addr)).toNumber()
        return {
            amount,
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
    async (obj, { dispatch }) => {
        const result = await getContractIns().testEIP712(...Object.values(obj))
        setTimeout(function xx() {
            provider.getTransactionReceipt(result.hash).then(res => {
                if (res) {
                    dispatch(signActions.updateTxResult({
                        status: res.status !== 0,
                        hash: result.hash,
                    }))
                } else {
                    setTimeout(xx, 2000)
                }
            })
        }, 2000)
        return {
            hash: result.hash,
        }
    })


const signSlice = createSlice({
    name: 'SIGN',
    initialState: {
        amount: 0,
        nonce: 0,
        hashArr: [] as { hash: string, txResult: boolean }[],
    },
    reducers: {
        updateTxResult: ((state, action) => {
            let index = state.hashArr.findIndex(item => item.hash === action.payload.hash)
            if (index > -1) {
                state.hashArr[index].txResult = action.payload.status
            }
        }),
    },
    extraReducers: {
        [getMyAmount.fulfilled.toString()]: (state, action) => {
            state.amount = action.payload.amount
        },
        [getMyNonce.fulfilled.toString()]: (state, action) => {
            state.nonce = action.payload.nonce
        },
        [updateAmount.fulfilled.toString()]: (state, action) => {
            state.hashArr.push({
                hash: action.payload.hash,
                txResult: false,
            })
        },
    },
})
export const useSignState = () => useSelector((s: AppState) => s.sign)
export const signActions = {
    updateAmount: getMyAmount,
    updateNonce: getMyNonce,
    exeUpdateAmount: updateAmount,
    ...signSlice.actions,
}
export const signReducer = signSlice.reducer
