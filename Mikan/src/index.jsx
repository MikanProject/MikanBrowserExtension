import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { teal500 } from 'material-ui/styles/colors';
import StateGroup from './StateGroup';
import InfoSnackbar from './InfoSnackbar';

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
            <StateGroup />
            <InfoSnackbar ref={(c) => window.InfoSnackbar = c} />
        </div>
    </MuiThemeProvider>
);

ReactDOM.render(
    <Main />,
    document.getElementById("content")
);

let clipboard = new Clipboard('.clipBtn');
clipboard.on('success', function (e) {
    window.InfoSnackbar.setState({
        open: true,
        message: chrome.i18n.getMessage("copySuccess"),
    });
});

clipboard.on('error', function (e) {
    window.InfoSnackbar.setState({
        open: true,
        message: chrome.i18n.getMessage("copyFailed"),
    });
});