import React, { PropTypes } from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import FileDownload from 'material-ui/svg-icons/file/file-download';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import OpenInNew from 'material-ui/svg-icons/action/open-in-new';

const UpdateCardList = props => {
    let dataNodes = props.mentionDatas.map(mentionData => (
        <Card key={mentionData.EpisodeId} style={{ margin: "10px" }}>
            <CardMedia
                overlay={<CardTitle title={mentionData.BangumiName} subtitle={mentionData.Name} />}
                >
                <img src={"http://mikanani.me" + mentionData.Cover} />
            </CardMedia>
            <CardActions style={{ margin: 0, padding: 0 }}>
                <List style={{ margin: 0, padding: 0 }}>
                    <ListItem
                        innerDivStyle={{ paddingTop: "12px", paddingBottom: "12px" }}
                        primaryText={chrome.i18n.getMessage("updateNotificationButtonDownload")}
                        leftIcon={<FileDownload style={{ marginTop: "8px", marginBottom: "8px" }} />}
                        onTouchTap={(event) => chrome.runtime.sendMessage(
                            {
                                type: "openWindow",
                                targetUrl: mentionData.FullMagnetLink,
                            }
                        )} />
                    <ListItem
                        innerDivStyle={{ paddingTop: "12px", paddingBottom: "12px" }}
                        primaryText={chrome.i18n.getMessage("updateNotificationButtonDownloadTorrent")}
                        leftIcon={<FileDownload style={{ marginTop: "8px", marginBottom: "8px" }} />}
                        onTouchTap={(event) => {
                            let publishDate = moment(mentionData.PublishDate);
                            publishDate = publishDate.add(8, "hours").toDate();
                            chrome.runtime.sendMessage(
                                {
                                    type: "openWindow",
                                    targetUrl: "http://mikanani.me/Download/" + publishDate.getFullYear().toString() + ("0" + (publishDate.getMonth() + 1)).slice(-2) + ("0" + publishDate.getDate()).slice(-2) + "/" + mentionData.MagnetLink + ".torrent",
                                }
                            );
                        } } />
                    <ListItem
                        innerDivStyle={{ paddingTop: "12px", paddingBottom: "12px" }}
                        primaryText={chrome.i18n.getMessage("xunlei")}
                        leftIcon={<FileDownload style={{ marginTop: "8px", marginBottom: "8px" }} />}
                        onTouchTap={(event) => chrome.runtime.sendMessage(
                            {
                                type: "xunlei",
                                targetUrl: "magnet:?xt=urn:btih:" + mentionData.MagnetLink,
                            }, (response) => {
                                //https://bugzilla.mozilla.org/show_bug.cgi?id=1228044
                                if (response == null) {
                                    window.InfoSnackbar.setState({
                                        open: true,
                                        message: chrome.i18n.getMessage("xunleiFirefoxUnknown"),
                                    });
                                }
                                let message;
                                if (response.status) {
                                    message = chrome.i18n.getMessage("xunleiSuccess");
                                } else {
                                    switch (response.message) {
                                        case "notLogin":
                                            message = chrome.i18n.getMessage("xunleiNotLogin");
                                            break;
                                        case "noMagnet":
                                            message = chrome.i18n.getMessage("xunleiNoMagnet");
                                            break;
                                        default:
                                            message = chrome.i18n.getMessage("xunleiUnknownError");
                                            break;
                                    }
                                }
                                window.InfoSnackbar.setState({
                                    open: true,
                                    message: message,
                                });
                            }
                        )} />
                    <ListItem
                        innerDivStyle={{ paddingTop: "12px", paddingBottom: "12px" }}
                        primaryText={chrome.i18n.getMessage("updateNotificationButtonCopy")}
                        leftIcon={<ContentCopy style={{ marginTop: "8px", marginBottom: "8px" }} />}
                        data-clipboard-text={mentionData.FullMagnetLink}
                        className="clipBtn" />
                    <ListItem
                        innerDivStyle={{ paddingTop: "12px", paddingBottom: "12px" }}
                        primaryText={chrome.i18n.getMessage("updateNotificationButtonOpen")}
                        leftIcon={<OpenInNew style={{ marginTop: "8px", marginBottom: "8px" }} />}
                        onTouchTap={(event) => chrome.runtime.sendMessage(
                            {
                                type: "openWindow",
                                targetUrl: "http://mikanani.me/Home/Episode/" + mentionData.MagnetLink,
                            }
                        )} />
                </List>
            </CardActions>
        </Card>
    ));
    return (
        <div>
            {dataNodes}
        </div>
    );
};

export default UpdateCardList;