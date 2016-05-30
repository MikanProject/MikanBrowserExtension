import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import UpdateCardList from './UpdateCardList';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import RefreshIndicator from 'material-ui/RefreshIndicator';

class StateGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showRefreshIndicator: false,
            mentionDatas: JSON.parse(localStorage.getItem("mentionDatas")),
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
        return (
            <div>
                <AppBar
                    title="最近更新"
                    showMenuIconButton={false}
                    style={{ position: "fixed", top: 0 }}
                    iconElementRight={<IconButton onTouchTap={() => {
                        this.setState({ showRefreshIndicator: true })
                        chrome.runtime.sendMessage({ type: "refresh" },
                            (response) => {
                                if (response.status === "success") {
                                    window.InfoSnackbar.setState({
                                        open: true,
                                        message: chrome.i18n.getMessage("refreshSuccess"),
                                    })
                                } else {
                                    window.InfoSnackbar.setState({
                                        open: true,
                                        message: chrome.i18n.getMessage("refreshFailed") + ", " + response.errorThrown,
                                    })
                                }
                                this.setState({
                                    showRefreshIndicator: false,
                                    mentionDatas: JSON.parse(localStorage.getItem("mentionDatas")),
                                });
                            }
                        );
                    } }><Refresh /></IconButton>}
                    />
                <RefreshIndicator size={36} left={163} top={100} status={this.getIndicatorStyle() } />
                <div className="content">
                    <UpdateCardList mentionDatas={this.state.mentionDatas } />
                </div>
            </div>
        );
    }
}

export default StateGroup;