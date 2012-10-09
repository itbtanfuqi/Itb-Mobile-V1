
Ext.define("ItbApp.view.chatter.ChatterCommentList", {
    extend: "Ext.List",
    alias: "widget.commentlist",
    config:{
    //itemTpl: '<tpl for=".">aaaa{bodyText}</tpl>',
    itemTpl:'<tpl for=".">'
                    + '<div><span class="cmtPhoto"><img src="{cmtPhotoUrl}?oauth_token={accessToken}" alt=""/></span>'                      
                        +'<div class="cmtBody"><span class="actorInfo">{userName}'
            			+ '</span><span class="bodyText">{bodyText}'
            			+ '</span><br/><span class="chatterTime">{createdDate}'
            			+ '\n from {appName}</span></div>'
                    + '</div>'
            + '</tpl>'
    }
});
