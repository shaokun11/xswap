import { TextField, Theme, withStyles } from '@material-ui/core'
import React from 'react'

export const XTextNumberField = withStyles((t: Theme) => ({
    root: {
        '& .MuiInput-underline:after': {
            borderBottomColor: t.palette.text.primary,
        },
        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0,
        },
        '& input': {
            textAlign: 'center',
        },
    },
}))(TextField)
