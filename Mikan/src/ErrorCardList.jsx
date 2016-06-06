import React from 'react';
import {Card, CardTitle, CardText, CardActions} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const ErrorCardList = () => {
    let message;
    let cardActions;
    if (localStorage.getItem("loginStatus") === "login") message = chrome.i18n.getMessage("errorNoData");
    else {
        message = chrome.i18n.getMessage("errorNotLogin");
        cardActions =
            <CardActions>
                <FlatButton
                    primary={true}
                    label={ chrome.i18n.getMessage("errorNotLoginButtonLogin") }
                    onTouchTap={() => chrome.runtime.sendMessage({ type: "openWindow", targetUrl: "http://mikanani.me/Account/Login" }) }
                    />
            </CardActions>
    }
    return (
        <Card key={0} style={{ margin: "10px" }}>
            <CardTitle
                title={ chrome.i18n.getMessage("error") }
                />
            <CardText>
                {message}
            </CardText>
            {cardActions}
        </Card>
    );
};

export default ErrorCardList;