import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { AppState } from './index'
import { getApple, getAppleFactory, provider } from '../utils/api'

interface IAppleInfo {
    id: number
    memory: number
    disk: number
    count: number
    color: string
    player: string
    contract: string
}

interface IAppleAction {
    from: string
    to: string
    time: number
    step: number
    player: string
}

const getApples = createAsyncThunk<{ amount: number }>('getApples', async () => {
    const amount = (await getAppleFactory().totalApple()).toNumber()
    return {
        amount,
    }
})
const getAppleContract = createAsyncThunk<{ contracts: string[] }, { start: number; end: number }>(
    'getAppleContract',
    async ({ start, end }) => {
        const contracts = await getAppleFactory().getAllApples(start, end)
        return {
            contracts,
        }
    },
)
const makeApple = createAsyncThunk<boolean, { color: string; memory: number; disk: number }>(
    'makeApple',
    async ({ color, memory, disk }) => {
        await getAppleFactory().makeApple(memory, disk, color)
        return true
    },
)
const processNexStep = createAsyncThunk<{ hash: string; result: 0 | 1 | 2 },
    { contract: string; last: string; current: number }>('processNexStep', async ({ contract, last, current }, { dispatch }) => {
    debugger
    let result = await getApple(contract).processAction(last, 'make/' + (current + 1))
    let requestCount = 0
    setTimeout(function request() {
        provider.getTransactionReceipt(result.hash).then(res => {
            if (res) {
                requestCount++
                if (requestCount < 3) return setTimeout(request, 5000)
                dispatch(
                    create2Action.updateTxResult({
                        status: res.status !== 0 ? 1 : 2,
                        hash: result.hash,
                    }),
                )
                setTimeout(function() {
                    dispatch(create2Action.getAppleActions({ contract, to: current + 1 }))
                }, 3000)
            } else {
                setTimeout(request, 2000)
            }
        })
    }, 5000)
    return {
        hash: result.hash,
        result: 0,
    }
})

const getAppleActions = createAsyncThunk<{ contract: string; actions: IAppleAction[] },
    { contract: string; to: number }>('getAppleActions', async ({ to, contract }) => {
    const result = await getApple(contract).getActions(0, to)
    return {
        contract,
        actions: result.map(item => ({
            from: item.from,
            to: item.to,
            player: item.player,
            time: item.time.toNumber(),
            step: item.step.toNumber(),
        })),
    }
})

const getAppleInfo = createAsyncThunk<IAppleInfo, string>(
    'getAppleInfo',
    async (contract, { getState, dispatch }) => {
        const state = getState() as any
        let item = state['create2'].cacheAppInfo.find(item => item.contract === contract)
        if (item) {
            dispatch(create2Action.getAppleActions({ contract, to: item?.count }))
            return item
        }
        const contracts = await getApple(contract).getApple()
        dispatch(create2Action.getAppleActions({ contract, to: contracts[3].toNumber() }))
        return {
            id: contracts[0].toNumber(),
            memory: contracts[1].toNumber(),
            disk: contracts[2].toNumber(),
            count: contracts[3].toNumber(),
            player: contracts[4],
            color: contracts[5],
            contract,
        }
    },
)
const slicer = createSlice({
    name: 'create2',
    initialState: {
        apples: 0,
        appleAddress: [] as string[],
        cacheAppInfo: [] as IAppleInfo[],
        txResult: [] as { hash: string; result: 0 | 1 | 2 }[],
        actions: {} as { [contract: string]: IAppleAction[] },
    },
    reducers: {
        updateTxResult: (state, action) => {
            let item = state.txResult.find(item => item.hash === action.payload.hash)
            if (item) {
                item.result = action.payload.result
            }
        },
    },
    extraReducers: {
        [getApples.fulfilled.toString()]: (state, action) => {
            if (state.apples !== action.payload.amount) state.apples = action.payload.amount
        },
        [getAppleContract.fulfilled.toString()]: (state, action) => {
            state.appleAddress = action.payload.contracts
        },
        [getAppleInfo.fulfilled.toString()]: (state, action) => {
            if (!state.cacheAppInfo.some(item => item.contract === action.payload.contract)) {
                state.cacheAppInfo.push(action.payload)
            }
        },
        [getAppleActions.fulfilled.toString()]: (state, action) => {
            state.actions[action.payload.contract] = action.payload.actions
        },
        [processNexStep.fulfilled.toString()]: (state, action) => {
            state.txResult.push(action.payload)
        },
    },
})

export function useCreate2() {
    return useSelector((s: AppState) => s.create2)
}

export const create2Action = {
    ...slicer.actions,
    getApples,
    getAppleActions,
    getAppleContract,
    getAppleInfo,
    makeApple,
    processNexStep,
}

export const create2Reducer = slicer.reducer
