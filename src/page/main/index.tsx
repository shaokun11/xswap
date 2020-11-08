import React, { useState } from 'react'

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Header from '../header'
import { Box, Card, Container, Paper, Tab, Tabs } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import AddLiquidity from '../add'
import SwapToken from '../swap'
import EIP712 from '../sign'
import Create2 from '../create2'
import { useInterval } from 'react-use'
import { useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import { appAction } from '../../state/app'
import { xSwapABPair, xSwapTokenA, xSwapTokenB } from '../../utils/api'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            height: '100vh',
            alignItems: 'center',
            justifyContent: 'center',

        },
        body: {
            marginTop: '70px',
        },
        main: {
            width: '60vw',
            height: '80vh',
        },
    }),
)

const XTabs = withStyles((theme: Theme) => ({
    indicator: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',

        backgroundColor: 'transparent',
        '& > span': {
            maxWidth: 80,
            width: '100%',
            //@ts-ignore
            backgroundColor: theme.palette.indicator,
        },
    },
}))(((props: any) => <Tabs  {...props} TabIndicatorProps={{ children: <span /> }} />))

export default function() {
    const classes = useStyles()
    const [v, setV] = useState('swap')
    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setV(newValue)
    }
    const web3 = useWeb3React()
    const dispatch = useDispatch()
    useInterval(function() {
        if (web3.account) {
            dispatch(appAction.getReserve())
            dispatch(appAction.getBalance({ token: xSwapTokenA, account: web3.account }))
            dispatch(appAction.getBalance({ token: xSwapTokenB, account: web3.account }))
            dispatch(appAction.updateLP({ token: xSwapABPair, account: web3.account }))
        }
    }, 5000)

    return (
        <div className={classes.root}>
            <Header />
            <Paper className={classes.body}>
                <Card className={classes.main}>
                    <XTabs value={v}
                           onChange={handleChange}
                           centered
                           scrollButtons="off"
                           variant="fullWidth">
                        {['add', 'swap', 'eip712', 'create2'].map(a => <Tab
                            value={a}
                            key={a}
                            label={a.toUpperCase()} />)}
                    </XTabs>
                    <AddLiquidity value={v} />
                    <SwapToken value={v} />
                    <EIP712 value={v} />
                    <Create2 value={v} />
                </Card>
            </Paper>
        </div>
    )
}
