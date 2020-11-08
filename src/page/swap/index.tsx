import React, { useEffect, useState } from 'react'
import { Reserve, XSelect, XTextField } from '../../components'
import { Box, Button, IconButton, MenuItem, Typography } from '@material-ui/core'
import { getERC20Instance, getPairInstance, xSwapABPair, xSwapTokenA, xSwapTokenB } from '../../utils/api'
import { useApp } from '../../state/app'
import BN from 'bignumber.js'
import IconCached from '@material-ui/icons/Cached'
import { ethers } from 'ethers'

function getAmountIn(amountOut: string, reserveIn: string, reserveOut) {
    return new BN('1000')
        .times(amountOut)
        .times(reserveIn)
        .div(new BN(reserveOut).minus(amountOut).times(997).plus(1))
        .toFixed()
}

function getAmountOut(amountIn: string, reserveIn: string, reserveOut: string) {
    let feeIn = new BN(amountIn).times(997)
    return feeIn
        .times(reserveOut)
        .div(feeIn.plus(new BN(1000).times(reserveIn)))
        .toFixed()
}

function SwapItem({
    obj,
    disableKey,
    sel,
    onChange,
    v,
}: {
    obj: { token: string; address: string }[]
    disableKey: string
    sel: number
    v: string
    onChange?: (value: number, index: number) => void
}) {
    const [value, selValue] = useState(sel)
    const [inputV, updateInputV] = useState(1)
    const handleSelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let v = event.target.value as string
        selValue(Number(v))
        if (onChange) {
            onChange(inputV, Number(v))
        }
    }
    useEffect(() => {
        selValue(sel)
        onChange && onChange(inputV, value)
    }, [sel])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateInputV(+event.target.value)
        if (onChange) {
            onChange(+event.target.value, value)
        }
    }

    return (
        <Box>
            <XTextField onChange={handleInputChange} value={v} />
            <XSelect value={value} onChange={handleSelChange}>
                {obj.map((item, i) => {
                    return (
                        <MenuItem key={i} disabled={disableKey === item.address} value={i}>
                            <Typography>
                                {item.token +
                                    ' (' +
                                    item.address.slice(0, 4) +
                                    '****' +
                                    item.address.slice(-4) +
                                    ' )'}
                            </Typography>
                        </MenuItem>
                    )
                })}
            </XSelect>
        </Box>
    )
}

export default function SwapToken(p: { value: string }) {
    const items = [
        {
            token: 'TokenA',
            address: xSwapTokenA,
        },
        {
            token: 'TokenB',
            address: xSwapTokenB,
        },
    ]
    const { reserve, account } = useApp()
    const [isSwitch, updateSwitchState] = useState(false)
    const [selObj, updateSelObj] = useState({
        up: 0,
        down: 1,
    })
    const [inputMsg, updateInputMsg] = useState({
        upV: '1',
        downV: '1',
        upIndex: 0,
        downIndex: 1,
    })
    const switchToken = () => {
        updateSwitchState(true)
        updateSelObj(v => ({
            down: v.up,
            up: v.down,
        }))
    }

    useEffect(() => {
        if (reserve) {
            const downV = getAmountOut(
                String(inputMsg.upV),
                reserve[xSwapABPair].reserve0,
                reserve[xSwapABPair].reserve1
            )
            updateInputMsg(val => ({ ...val, downV }))
        }
    }, [reserve])

    useEffect(() => {
        if (reserve && isSwitch) {
            if (selObj.up === 1) {
                const downV = getAmountOut(
                    String(inputMsg.upV),
                    reserve[xSwapABPair].reserve1,
                    reserve[xSwapABPair].reserve0
                )
                updateInputMsg(val => ({ ...val, upV: inputMsg.upV, downV }))
            } else {
                const downV = getAmountOut(
                    String(inputMsg.upV),
                    reserve[xSwapABPair].reserve0,
                    reserve[xSwapABPair].reserve1
                )
                updateInputMsg(val => ({ ...val, upV: inputMsg.upV, downV }))
            }
            updateSwitchState(false)
        }
    }, [isSwitch, inputMsg, selObj, reserve])

    const handleChange = (type: 'up' | 'down') => (v, i) => {
        if (!reserve) return
        if (isSwitch) return
        if (type === 'up') {
            if (selObj.up === 0) {
                const downV = getAmountOut(
                    String(v),
                    reserve[xSwapABPair].reserve0,
                    reserve[xSwapABPair].reserve1
                )
                updateInputMsg(val => ({ ...val, upV: v, upIndex: i, downV }))
            } else {
                const downV = getAmountOut(
                    String(v),
                    reserve[xSwapABPair].reserve1,
                    reserve[xSwapABPair].reserve0
                )
                updateInputMsg(val => ({ ...val, upV: v, upIndex: i, downV }))
            }
        } else {
            if (selObj.down === 1) {
                const upV = getAmountIn(
                    String(v),
                    reserve[xSwapABPair].reserve0,
                    reserve[xSwapABPair].reserve1
                )
                updateInputMsg(val => ({ ...val, downV: v, downIndex: i, upV }))
            } else {
                const upV = getAmountIn(
                    String(v),
                    reserve[xSwapABPair].reserve1,
                    reserve[xSwapABPair].reserve0
                )
                updateInputMsg(val => ({ ...val, downV: v, downIndex: i, upV }))
            }
        }
    }

    const handleSwap = () => {
        getERC20Instance(items[selObj.up].address).transfer(
            xSwapABPair,
            new BN(inputMsg.upV).times(ethers.constants.WeiPerEther.toString()).toFixed()
        )
    }

    const backSwapToken = () => {
        let amount0Out = '0'
        let amount1Out = '0'
        if (selObj.up === 0) {
            amount1Out = new BN(new BN(inputMsg.downV).times(ethers.constants.WeiPerEther.toString()).toFixed(0)).toFixed()
        } else {
            amount0Out = new BN(new BN(inputMsg.upV).times(ethers.constants.WeiPerEther.toString()).toFixed(0)).toFixed()
        }
        getPairInstance(xSwapABPair).swap(amount0Out, amount1Out, account, '0x')
    }

    return (
        <div role="tabpanel" hidden={p.value !== 'swap'}>
            <Reserve />
            <Box display={'flex'} m={1}>
                <Box m={1} border={1} borderColor="grey.A300" display={'flex'} flexDirection={'column'}>
                    <Box>
                        FROM:
                        <SwapItem
                            v={inputMsg.upV}
                            onChange={handleChange('up')}
                            sel={selObj.up}
                            disableKey={items[selObj.down].address}
                            obj={items}
                        />
                    </Box>
                    <Box display={'flex'} justifyContent={'center'} mt={1}>
                        <IconButton onClick={switchToken}>
                            <IconCached />
                        </IconButton>
                    </Box>
                    <Box>
                        TO:
                        <SwapItem
                            v={inputMsg.downV}
                            sel={selObj.down}
                            onChange={handleChange('down')}
                            disableKey={items[selObj.up].address}
                            obj={items}
                        />
                    </Box>
                </Box>
                <Box
                    border={1}
                    m={1}
                    flexGrow={1}
                    display={'flex'}
                    borderColor="grey.A300"
                    justifyContent={'center'}
                    flexDirection={'column'}
                >
                    <Button variant={'outlined'} onClick={handleSwap}>
                        Swap Token
                    </Button>

                    <Button variant={'outlined'} onClick={backSwapToken}>
                        Back Token
                    </Button>
                </Box>
            </Box>
        </div>
    )
}
