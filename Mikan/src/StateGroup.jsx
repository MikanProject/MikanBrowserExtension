import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import UpdateCardList from './UpdateCardList';
import ErrorCardList from './ErrorCardList';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import RefreshIndicator from 'material-ui/RefreshIndicator';

class StateGroup extends Component {
    constructor(props) {
        super(props);
        let mentionDatas = [];
        let dataValid = false;
        try {
            mentionDatas = JSON.parse(localStorage.getItem("mentionDatas"));
            if (localStorage.getItem("loginStatus") === "login" && mentionDatas.length > 0) dataValid = true;
        } catch (err) {
            localStorage.setItem("mentionDatas", "[]");
        }
        this.state = {
            showRefreshIndicator: false,
            mentionDatas: mentionDatas,
            dataValid: dataValid,
        }
    }

    getIndicatorStyle() {
        if (this.state.showRefreshIndicator) {
            return "loading";
        } else {
            return "hide";
        }
    }

    render() {
        let cards;
        if (this.state.dataValid) {
            cards =
                <UpdateCardList mentionDatas={ this.state.mentionDatas } />
        } else {
            cards =
                <ErrorCardList />
        }
        return (
            <div>
                <AppBar
                    title={chrome.i18n.getMessage("recentUpdate")}
                    showMenuIconButton={false}
                    style={{ position: "fixed", top: 0 }}
                    iconElementRight={<IconButton onTouchTap={() => {
                        this.setState({ showRefreshIndicator: true })
                        chrome.runtime.sendMessage({ type: "refresh" },
                            (response) => {
                                let dataValid = false;
                                if (response.status === "success") {
                                    window.InfoSnackbar.setState({
                                        open: true,
                                        message: chrome.i18n.getMessage("refreshSuccess"),
                                    });
                                    dataValid = true;
                                } else {
                                    window.InfoSnackbar.setState({
                                        open: true,
                                        message: chrome.i18n.getMessage("refreshFailed") + ", " + response.errorThrown,
                                    });
                                }
                                this.setState({
                                    showRefreshIndicator: false,
                                    mentionDatas: JSON.parse(localStorage.getItem("mentionDatas")),
                                    dataValid: dataValid,
                                });
                            }
                        );
                    } }><Refresh /></IconButton>}
                    />
                <RefreshIndicator size={36} left={163} top={100} status={ this.getIndicatorStyle() } />
                <div className="content">
                    {cards}
                </div>
            </div>
        );
    }
}

export default StateGroup;