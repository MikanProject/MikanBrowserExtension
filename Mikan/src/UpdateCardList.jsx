import React, {PropTypes} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
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
                        primaryText={chrome.i18n.getMessage("updateNotificationButtonDownload") }
                        leftIcon={<FileDownload style={{ marginTop: "8px", marginBottom: "8px" }} />}
                        onTouchTap={(event) => chrome.runtime.sendMessage(
                            {
                                type: "openWindow",
                                targetUrl: "magnet:?xt=urn:btih:" + mentionData.MagnetLink,
                            }
                        ) } />
                    <ListItem
                        innerDivStyle={{ paddingTop: "12px", paddingBottom: "12px" }}
                        primaryText={chrome.i18n.getMessage("updateNotificationButtonCopy") }
                        leftIcon={<ContentCopy style={{ marginTop: "8px", marginBottom: "8px" }} />}
                        data-clipboard-text={"magnet:?xt=urn:btih:" + mentionData.MagnetLink}
                        className="clipBtn" />
                    <ListItem
                        innerDivStyle={{ paddingTop: "12px", paddingBottom: "12px" }}
                        primaryText={chrome.i18n.getMessage("updateNotificationButtonOpen") }
                        leftIcon={<OpenInNew style={{ marginTop: "8px", marginBottom: "8px" }} />}
                        onTouchTap={(event) => chrome.runtime.sendMessage(
                            {
                                type: "openWindow",
                                targetUrl: "http://mikanani.me/Home/Bangumi/" + mentionData.BangumiId + "#" + mentionData.SubtitleGroupId,
                            }
                        ) } />
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