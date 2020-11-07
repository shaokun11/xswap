import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { AppBar, Box, Button, Grid, Toolbar, Typography, IconButton } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { appAction, useApp } from '../../state/app'
import { useDispatch } from 'react-redux'
import { initProvider } from '../../utils/api'
import { signActions, useSignState } from '../../state/sign'
import IconTheme from '@material-ui/icons/Brightness6'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            background: theme.palette.background.default,
            height: '70px',
            color: theme.palette.text.primary,
        },
        title: {
            [theme.breakpoints.down('sm')]: {
                flexGrow: 1,
            },
        },
        account: {
            flexGrow: 1,
            marginLeft: 30,
            justifyContent: 'start',
            display: 'none',
            [theme.breakpoints.up('sm')]: {
                display: 'flex',
            },
        },
    }),
)

export default function Header() {
    const classes = useStyles()
    const web3 = useWeb3React()
    const dispatch = useDispatch()
    const { theme } = useApp()
    const injected = new InjectedConnector({ supportedChainIds: [4] })
    const connect = function() {
        web3.activate(injected)
    }
    const switchTheme = () => {
        dispatch(appAction.changeTheme({ theme: theme === 'light' ? 'dark' : 'light' }))
    }
    useEffect(() => {
        web3.account && initProvider(web3.library, web3.account)
    }, [web3.library])

    useEffect(() => {
        web3.account && dispatch(signActions.getMyAmount(web3.account))
        web3.account && dispatch(signActions.getMyNonce(web3.account))
        web3.account && dispatch(appAction.updateAccount(web3.account))
    }, [web3.library, web3.account])

    useEffect(function() {
        connect()
    }, [])
    return (
        <AppBar>
            <Toolbar className={classes.root}>
                <Typography variant="h6" className={classes.title}>
                    X-SWAP
                </Typography>
                <Grid item className={classes.account}>
                    {web3.account}
                </Grid>
                <IconButton onClick={switchTheme}>
                    <IconTheme />
                </IconButton>
                <Button variant={'text'} onClick={connect} disabled={!!web3.account}>
                    {web3.account === undefined
                        ? 'connect'
                        : web3.account?.slice(0, 4).concat('****').concat(web3.account?.slice(-4))}
                </Button>
            </Toolbar>
        </AppBar>
    )
}
