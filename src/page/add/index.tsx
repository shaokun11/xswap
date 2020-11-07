import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Reserve, XTextField } from '../../components'
import { Button, Card, List, ListItemText, Slider, withStyles } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useApp } from '../../state/app'
import { getERC20Instance, getPairInstance, xSwapABPair, xSwapTokenA, xSwapTokenB } from '../../utils/api'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'

const useStyles = makeStyles({
    action: {
        display: 'flex',
        height: '200px',
        margin: '10px',
    },
    actionItem: {
        flexGrow: 1,
    },
    add: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        '& > *': {
            maxWidth: '160px',
        },
    },
})
const XSlider = withStyles({
    root: {
        color: '#9c9f9d',
        height: 8,
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: 'grey',
        border: '2px solid grey',
        marginTop: -8,
        marginLeft: -12,
        '&:focus, &:hover, &$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
})(Slider)

export default function AddLiquidity(p: { value: string }) {
    const classes = useStyles()
    const { balance, liquidity } = useApp()
    const disableA = useMemo(() => {
        return balance && Number(balance[xSwapTokenA]?.amount) === 0
    }, [balance])
    const disableB = useMemo(() => {
        return balance && Number(balance[xSwapTokenB]?.amount) === 0
    }, [balance])

    const disableRemoveLP = useMemo(() => {
        return liquidity && Number(liquidity[xSwapABPair]?.amount) === 0
    }, [liquidity])
    const [addAmount, updateAddAmount] = useState(10)
    const addInputChange = e => {
        updateAddAmount(+e.target.value)
    }
    const handleAdd = (type: 1 | 2) => () => {
        let token = type === 1 ? xSwapTokenA : xSwapTokenB
        getERC20Instance(token).transfer(
            xSwapABPair,
            ethers.BigNumber.from(addAmount).mul(ethers.constants.WeiPerEther)
        )
    }
    const web3 = useWeb3React()

    const mint = useCallback(() => {
        web3.account && getPairInstance(xSwapABPair).mint(web3.account)
    }, [web3.account])

    const [removePercent, updateRemovePercent] = useState(1)
    const onRemoveSliderChange = (event: any, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            updateRemovePercent(newValue)
        }
    }
    const handleRemove = useCallback(() => {
        web3.account &&
            getERC20Instance(xSwapABPair).transfer(
                xSwapABPair,
                ethers.BigNumber.from(liquidity.amount).mul(removePercent).div(100)
            )
    }, [removePercent, web3.account, liquidity])
    const takeBackToken = () => {
        web3.account && getPairInstance(xSwapABPair).burn(web3.account)
    }

    return (
        <div role="tabpanel" hidden={p.value !== 'add'}>
            <Reserve />
            <Card className={classes.action}>
                <Card className={classes.actionItem}>
                    <div className={classes.add}>
                        <XTextField value={addAmount} defaultValue={10} onChange={addInputChange} />
                        <Button variant={'outlined'} disabled={disableA ?? true} onClick={handleAdd(1)}>
                            ADD Token/A
                        </Button>
                        <Button variant={'outlined'} disabled={disableB ?? true} onClick={handleAdd(2)}>
                            ADD Token/B
                        </Button>
                    </div>
                </Card>
                <Card className={classes.actionItem}>
                    <div className={classes.add}>
                        <Button variant={'contained'} onClick={mint}>
                            Get Back LP
                        </Button>
                    </div>
                </Card>
                <Card className={classes.actionItem}>
                    <div className={classes.add}>
                        <XSlider
                            step={1}
                            min={1}
                            max={100}
                            defaultValue={1}
                            valueLabelDisplay="on"
                            onChange={onRemoveSliderChange}
                            style={{ marginTop: '30px' }}
                        />
                        <Button
                            variant={'outlined'}
                            onClick={handleRemove}
                            disabled={disableRemoveLP ?? true}
                        >
                            Remove LP
                        </Button>
                        <Button onClick={takeBackToken} variant={'outlined'}>
                            Back Token
                        </Button>
                    </div>
                </Card>
            </Card>
        </div>
    )
}
