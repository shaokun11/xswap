import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getEip712, provider } from '../utils/api'
import { useSelector } from 'react-redux'
import { AppState } from './index'

const getMyAmount = createAsyncThunk<{ amount: number }, string>('getMyAmount',
    async (addr) => {
        const amount = (await getEip712().amounts(addr)).toNumber()
        return {
            amount,
        }
    })

const getMyNonce = createAsyncThunk<{ nonce: number }, string>('getMyNonce',
    async (addr) => {
        return {
            nonce: (await getEip712().nonces(addr)).toNumber(),
        }
    })

export function checkTxResult(tx: string, dispatch: any, account: string) {
    let requestCount = 0
    setTimeout(function request() {
        provider.getTransactionReceipt(tx).then(res => {
            if (res) {
                requestCount++
                if (res.status === 1) {
                    dispatch(signActions.getMyNonce(account))
                    dispatch(signActions.getMyAmount(account))
                }
                if (requestCount >= 3) {
                    dispatch(signActions.updateTxResult({
                        status: res.status !== 0 ? 1 : 2,
                        hash: tx,
                    }))
                } else {
                    setTimeout(request, 2000)
                }
            } else {
                setTimeout(request, 2000)
            }
        })
    }, 1000)
}

const updateAmount = createAsyncThunk<{ hash: string }, {
    player: string,
    amount: number,
    v: number,
    r: string,
    s: string,
}>('updateAmount',
    async (obj, { getState, dispatch }) => {
        const result = await getEip712().testEIP712(...Object.values(obj))
        let state = getState() as any
        checkTxResult(result.hash, dispatch, state.app.account)
        return {
            hash: result.hash,
            from: state.app.account,
        }
    })


const signSlice = createSlice({
    name: 'SIGN',
    initialState: {
        amount: 0,
        nonce: 0,
        hashArr: [] as { hash: string, from: string, txResult: 0 | 1 | 2 }[],
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
                txResult: 0,
                from: action.payload.from,
            })
        },
    },
})
export const useSignState = () => useSelector((s: AppState) => s.sign)
export const signActions = {
    getMyAmount,
    getMyNonce,
    updateAmount,
    ...signSlice.actions,
}
export const signReducer = signSlice.reducer
