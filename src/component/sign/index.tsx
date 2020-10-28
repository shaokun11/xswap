import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Button, List, ListItemText, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { createStyles } from '@material-ui/core/styles'
import { signActions, useSignState } from '../../state/sign'
import { useDispatch } from 'react-redux'

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
            '& > div': {
                margin: '10px 20px',
                wordWrap: 'break-word',
            },
        },
    }),
)

export default function EIP712(p: { value: string }) {
    const web3 = useWeb3React()
    const classes = useStyles()
    const dispatch = useDispatch()
    const { nonce, amount } = useSignState()
    const [signatureObj, setSignature] = useState({
        r: '0x',
        s: '0x',
        v: 27,
        signature: '0x',
    })
    const btnClickSign = () => {
        const data = JSON.stringify({
            types: eip712Obj.types,
            domain: eip712Obj.domain(web3.chainId!!),
            primaryType: 'Test',
            message: {
                owner: web3.account,
                amount: 10,
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
                    amount: 10,
                    v,
                    r,
                    s,
                },
            ))
        })
    }
    return <div role="tabpanel"
                hidden={p.value !== 'eip712'}>
        <List className={classes.root}>
            <ListItemText
                aria-multiline={'true'}
                primary={'signature:' + signatureObj.signature} />
            <ListItemText primary={'r :' + signatureObj.r} />
            <ListItemText primary={'s :' + signatureObj.s} />
            <ListItemText primary={'v :' + signatureObj.v} />
            <ListItemText primary={'nonce :' + nonce} />
            <ListItemText primary={'amount :' + amount} />
        </List>
        <Button onClick={btnClickSign}>
            sign
        </Button>
    </div>
}
