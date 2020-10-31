import { Radio, RadioProps, TextField, Theme, withStyles } from '@material-ui/core'
import React, { useMemo } from 'react'
import Select from '@material-ui/core/Select'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { blue, green, red, yellow, grey } from '@material-ui/core/colors'

export const XTextField = withStyles((t: Theme) => ({
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


export const XRadio = withStyles(({
    root: {
        color: (props: any) => {
            return props.cc[400]
        },
        '&$checked': {
            color: (props: any) => props.cc[600],
        },
        checked: {},
    },
    //@ts-ignore
}))((props: RadioProps) => <Radio color={'default'} {...props} />)

export const XSelect = withStyles((theme:Theme)=>({
    select: {
        minWidth: 200,
        background: theme.palette.background.paper,
        fontWeight: 200,
        borderStyle: 'none',
        borderWidth: 2,
        borderRadius: 12,
        paddingLeft: 24,
        color:theme.palette.text.primary,
        paddingTop: 10,
        paddingBottom: 10,
        boxShadow: '0px 5px 8px -3px rgba(0,0,0,0.14)',
        '&:focus': {
            borderRadius: 12,
            background: theme.palette.background.paper,
            borderColor: grey[100],
        },
    },
    icon: {
        color: grey[300],
        right: 12,
        position: 'absolute',
        userSelect: 'none',
        pointerEvents: 'none',
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#837979',
        },
    },
    paper: {
        borderRadius: 12,
        marginTop: 2,
    },
    list: {
        background: theme.palette.background.paper,
        paddingTop: 0,
        paddingBottom: 0,
        maxHeight:120,

        '& li': {
            fontWeight: 200,
            paddingTop: 2,
            paddingBottom: 8,
        },
        '& li:hover': {
            background: theme.palette.background.default,
        },
        '& li.Mui-selected': {
            background: theme.palette.background.default,
        },
        '& li.Mui-selected:hover': {
            background:theme.palette.background.default,
        },
    },

}))(({ classes, ...other }: any) => {
    return <Select
        value={1}
        disableUnderline
        classes={{
            root: classes.select,
        }}
        IconComponent={() => <ExpandMoreIcon className={classes.icon} />}
        MenuProps={{
            classes: {
                paper: classes.paper,
                list: classes.list,
            },
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
            },
            transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
            },
            getContentAnchorEl: null,
        }}
        {...other} />
})
