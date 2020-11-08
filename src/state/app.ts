import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { AppState } from './index'
import { getApple, getERC20Instance, getPairInstance, xSwapABPair } from '../utils/api'
import { ethers } from 'ethers'

const getReserve = createAsyncThunk('getReserve', async (v, { dispatch }) => {
    let ins = getPairInstance(xSwapABPair)
    let reserve = await ins.getReserves()
    dispatch(
        appAction.updateReserve({
            token: xSwapABPair,
            reserve0: parseFloat(reserve._reserve0.div(ethers.constants.WeiPerEther).toString()).toFixed(0),
            reserve1: parseFloat(reserve._reserve1.div(ethers.constants.WeiPerEther).toString()).toFixed(0),
        })
    )
})

const getBalance = createAsyncThunk<void, { token: string; account: string }>(
    'getBalance',
    async ({ token, account }, { dispatch }) => {
        let ins = getERC20Instance(token)
        let balance = await ins.balanceOf(account)
        dispatch(
            appAction.updateBalance({
                token,
                amount: parseFloat(balance.div(ethers.constants.WeiPerEther).toString()).toFixed(0),
            })
        )
    }
)

const updateLP = createAsyncThunk<
    { total: string; amount: string; percent: string; token: string; account: string },
    { token: string; account: string }
>('updateLP', async ({ token, account }) => {
    let ins = getPairInstance(token)
    let total = await ins.totalSupply()
    let balance = await ins.balanceOf(account)
    return {
        total: total.toString(),
        amount: balance.toString(),
        token,
        account,
        percent: (parseFloat(balance.mul(10000).div(total).toString()) / 100).toFixed(2),
    }
})

const faucetToken = createAsyncThunk<void, string>('faucetToken', async token => {
    let ins = getERC20Instance(token)
    await ins.faucet()
})

const appSlice = createSlice({
    name: 'APP',
    initialState: {
        theme: 'light',
        account: '0x',
        reserve: {} as { [token: string]: { reserve0: string; reserve1: string } },
        balance: {} as { [token: string]: { amount: string } },
        liquidity: {} as { amount: string; total: string; percent: string },
    },
    reducers: {
        changeTheme: (state, action) => {
            state.theme = action.payload.theme
        },
        updateAccount: (state, action) => {
            state.account = action.payload
        },
        updateReserve: (state, action) => {
            if (!state.reserve) state.reserve = {}
            if (!state.reserve[action.payload.token])
                state.reserve[action.payload.token] = { reserve0: '0', reserve1: '0' }
            if (state.reserve[action.payload.token].reserve0 !== action.payload.reserve0) {
                state.reserve[action.payload.token].reserve0 = action.payload.reserve0
            }
            if (state.reserve[action.payload.token].reserve1 !== action.payload.reserve1) {
                state.reserve[action.payload.token].reserve1 = action.payload.reserve1
            }
        },
        updateBalance: (state, action) => {
            if (!state.balance) state.balance = {}
            if (!state.balance[action.payload.token]) state.balance[action.payload.token] = { amount: '0' }
            state.balance[action.payload.token].amount = action.payload.amount
        },
    },
    extraReducers: {
        [updateLP.fulfilled.toString()]: (state, action) => {
            state.liquidity = action.payload
        },
    },
})

export function useApp() {
    return useSelector((s: AppState) => s.app)
}

export const appAction = { ...appSlice.actions, getReserve, getBalance, faucetToken, updateLP }

export const appReducer = appSlice.reducer
