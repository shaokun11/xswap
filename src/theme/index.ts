import { createMuiTheme } from "@material-ui/core/styles";
import {Theme} from '@material-ui/core/styles/createMuiTheme'
import grey from '@material-ui/core/colors/grey';

const themeLight = createMuiTheme({
  palette: {
    type: "light",
    //@ts-ignore
    indicator:grey['300']
  },

});

const themeDark = createMuiTheme({
  palette: {
    type: "dark",
    //@ts-ignore
    indicator:grey['100']
  }
});

export type ThemeChoice = "light" | "dark"

const AppTheme :{
  [theme:string]:Theme
}= {
  light: themeLight,
  dark: themeDark
}

export default AppTheme;
