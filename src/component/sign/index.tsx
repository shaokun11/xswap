import React, { useEffect, useRef, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useSnackbar } from 'notistack'
import {
    Button,
    Card,
    CircularProgress, Container,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
    Theme,
    withStyles,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { createStyles } from '@material-ui/core/styles'
import { checkTxResult, signActions, useSignState } from '../../state/sign'
import { useDispatch } from 'react-redux'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import DoneIcon from '@material-ui/icons/Done'
import CloseIcon from '@material-ui/icons/Close'
import { green, grey, red } from '@material-ui/core/colors'

const eip712Obj = {
    types: {
        EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
        ],
        Test: [
            { name: 'owner', type: 'address' },
            { name: 'amount', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
        ],
    }
    , domain: (chainId: number) => ({
        name: 'shaokun',
        version: '1',
        chainId: chainId,
        verifyingContract: '0x9F8C390b7048395d4DeBc7636031aD992115C303',
    }),
}
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            height: '80%',
        },
        panel: {
            height: 'calc(100% - 48px)',
        },
        child: {
            overflowY: 'auto',
            flexGrow: 2,
            height: '100%',
            '&::-webkit-scrollbar': {
                width: '0.4em',
            },
            '&::-webkit-scrollbar-track': {
                boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#837979',
            },
        },
        childDisplay: {
            flexGrow: 1,
            display: 'flex',
            height: '100%',
            flexDirection: 'column',
            '& > div': {
                height: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            },
        },
        btn: {
            display: 'flex',
            height: '20%',
            alignItems: 'center',
            margin: '0 20px',
            justifyContent: 'space-around',
        },
        input: {
            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                '-webkit-appearance': 'none',
                margin: 0,
            },
        },
    }),
)

const XTextField = withStyles((t: Theme) => (
    {
        root: {
            '& .MuiInput-underline:after': {
                borderBottomColor: t.palette.text.primary,
            },
        },
    }
))(TextField)

const useStyles2 = makeStyles({
    root: {
        minWidth: 0,
    },
})
export default function EIP712(p: { value: string }) {
    const web3 = useWeb3React()
    const classes = useStyles()
    const classes2 = useStyles2()
    const dispatch = useDispatch()
    const { nonce, amount, hashArr } = useSignState()
    const [inputV, setInputV] = useState(10)
    const [sendBtnIsEnable, setSendBtnIsEnable] = useState(false)
    const [signatureObj, setSignature] = useState({
        r: '0x',
        s: '0x',
        v: 27,
        signature: '0x',
    })
    useEffect(() => {
        setSendBtnIsEnable(!hashArr.every(item => item.txResult > 0))
    }, [hashArr])

    useEffect(() => {
        web3.account && hashArr.filter(item => item.txResult === 0)
                               .forEach(item => checkTxResult(item.hash, dispatch, web3.account!!))
    }, [web3.account])
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputV(parseInt(event.target.value))
    }

    const { enqueueSnackbar } = useSnackbar()
    const onCopy = () => {
        enqueueSnackbar('copy success', {
            anchorOrigin:{
                vertical: 'bottom',
                horizontal: 'right',
            },
            //variant: 'info',
        })
    }
    const btnClickSign = () => {
        const data = JSON.stringify({
            types: eip712Obj.types,
            domain: eip712Obj.domain(web3.chainId!!),
            primaryType: 'Test',
            message: {
                owner: web3.account,
                amount: inputV,
                nonce,
            },
        })
        web3.library.provider.request(
            {
                method: 'eth_signTypedData_v4',
                params: [web3.account, data],
            }).then((result: string) => {
            const signature = result.substring(2)
            const r = '0x' + signature.substring(0, 64)
            const s = '0x' + signature.substring(64, 128)
            const v = parseInt(signature.substring(128, 130), 16)
            setSignature({ r, s, v, signature })
            dispatch(signActions.updateAmount(
                {
                    player: web3.account!!,
                    amount: inputV,
                    v,
                    r,
                    s,
                },
            ))
        })
    }

    return <div role="tabpanel"
                className={classes.panel}
                hidden={p.value !== 'eip712'}>
        <Card className={classes.root}>
            <Card className={classes.childDisplay}>
                <Card>
                    amount :{amount}
                </Card>
                <Card>
                    nonce :{nonce}
                </Card>
            </Card>
            <List className={classes.child}>
                {web3.account && hashArr.filter(item => item.from === web3.account)
                                        .map((item, i) => {
                                            return <ListItem key={i}>
                                                {item.txResult === 0 ?
                                                    <CircularProgress size={20} style={{ color: grey['300'] }} />
                                                    : item.txResult === 1 ? <ListItemIcon className={classes2.root}>
                                                        <DoneIcon style={{ color: green['300'] }} />
                                                    </ListItemIcon> : <ListItemIcon className={classes2.root}>
                                                        <CloseIcon style={{ color: red['300'] }} />
                                                    </ListItemIcon>}
                                                <ListItemText style={{ textAlign: 'center' }}>
                                                    {item.hash.slice(0, 16) + '******' + item.hash.slice(-16)}
                                                </ListItemText>
                                                <CopyToClipboard
                                                    onCopy={onCopy}
                                                    text={item.hash}>
                                                    <IconButton
                                                        className={classes2.root}>
                                                        <FileCopyIcon />
                                                    </IconButton>
                                                </CopyToClipboard>

                                            </ListItem>
                                        })}

            </List>
        </Card>
        <div className={classes.btn}>
            <XTextField
                defaultValue={10}
                onChange={handleChange}
                className={classes.input}
                type="number" />
            <Button
                disabled={sendBtnIsEnable}
                onClick={btnClickSign}>
                approve add amount
            </Button>
        </div>
    </div>
}
