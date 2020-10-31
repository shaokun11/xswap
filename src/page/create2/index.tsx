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
export default function Create2(p: { value: string }) {
    const web3 = useWeb3React()
    const dispatch = useDispatch()
    const { nonce, amount, hashArr } = useSignState()

    return <div role="tabpanel"
                hidden={p.value !== 'create2'}>
        <Card>
                coming soon
        </Card>
    </div>
}
