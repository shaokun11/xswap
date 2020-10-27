import React, { Suspense } from 'react'
import { CssBaseline } from '@material-ui/core'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import Main from './page/main'
import NotFound from './page/error'
import { ThemeProvider } from '@material-ui/styles'
import AppTheme from './theme'
import { useApp } from './state/app'

function App() {
    const {theme}  = useApp()
    return (
        <ThemeProvider theme={{ ...AppTheme[theme] }}>
            <CssBaseline />
            <Suspense fallback="loading">
                <Router>
                    <Switch>
                        <Route exact path="/" component={Main} />
                        <Route path="/" />
                    </Switch>
                </Router>
            </Suspense>
        </ThemeProvider>
    )
}

export default App
