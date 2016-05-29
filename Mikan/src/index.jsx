import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { teal500 } from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';


//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const muiTheme = getMuiTheme({
    fontFamily: "'Noto Sans', 'Noto Sans SC', 'Noto Sans JP', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    palette: {
        primary1Color: teal500,
    },
});

const Main = () => (
    <MuiThemeProvider muiTheme={muiTheme}>
        <div>
            <FlatButton label="test" />
        </div>
    </MuiThemeProvider>
);

ReactDOM.render(
    <Main />,
    document.getElementById("content")
);