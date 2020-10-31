import { createMuiTheme } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import grey from '@material-ui/core/colors/grey'

const overrides = {
    MuiCssBaseline: {
        '@global': {
            '::-webkit-scrollbar': {
                width: 8,
                height: 8,
            },
            '::-webkit-scrollbar-track': {
                backgroundColor: '#676666',
            },
            '::-webkit-scrollbar-thumb': {
                height: 40,
                backgroundColor: '#b5b5b5',
                borderRadius: 3,
            },
        },
    },
}

const themeLight = createMuiTheme({
    palette: {
        type: 'light',
        //@ts-ignore
        indicator: grey['400'],
    },
    overrides,
})

const themeDark = createMuiTheme({
    palette: {
        type: 'dark',
        //@ts-ignore
        indicator: grey['A400'],
    },
    overrides,
})


export type ThemeChoice = 'light' | 'dark'

const AppTheme: {
    [theme: string]: Theme
} = {
    light: themeLight,
    dark: themeDark,
}

export default AppTheme
