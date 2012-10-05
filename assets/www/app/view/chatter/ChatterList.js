Ext.define("ItbApp.view.chatter.ChatterList", {
    //extend: "Ext.DataView",
    extend: "Ext.List",
    alias: "widget.chatterlist",
    requires: ["ItbApp.store.Chatter"
               //"ItbApp.view.chatter.ChatterListItem","ItbApp.view.chatter.ChatterCommentList"
           ],
    config: {  
    	id:'CHATTER_LIST',
    	//useComponents: true,
        //defaultType: 'chatterlistitem',
        scrollable: 'vertical',
        //padding:'5 10 10 10',
        listeners:{
        	itemtap:function(list, index, item, record){
        		//alert('item tap')
        		//dumpProps(record);
        		Ext.getCmp('CHATTER_POST').getTpl().overwrite(Ext.getDom('CHATTER_POST'),record.raw.body);
        		Ext.getCmp('COMMENT_LIST').setData([{text:'aaa'},{text:'aaab'},{text:'aaac'}]);
        		//dumpProps(record.raw.comments.comments);
        		//Ext.getCmp('COMMENT_LIST').refresh();
        		Ext.getCmp('CHATTER').setActiveItem(2);
        	}
        },
        //store: ItbApp.store.chatterStore,
        /* if defined here, ItbAppUtil.getToken() will return undefined , so we should use setItemTpl to get the value
        itemTpl:'<tpl for="."><div class="actorPhoto"><img src="{parentPhotoSmallPhotoUrl}?oauth_token='+ItbAppUtil.getToken()+'" alt=""/>{parentPhotoSmallPhotoUrl}?oauth_token='+ItbAppUtil.getToken()+'</div>'
                +'<div class="chatterMain"><div><span class="actorInfo">{actorName}</span><span class="post_body">{bodyText}'
    			+'</span></div><div class="chatterTime">{createdDate}</div>'
    			+'<a onclick="ItbApp.showCommentPopUp(\'{id}\')" class="commentLink">Comment</a><a class="commentLink" href="#" onclick="ItbApp.likeComment(\'{id}\')">Like</a>'                                   
                + '<div class="like">Likes: {likesTotal}</div>'
                + '<div class="cmt_bar">{commentsTotal} Comments now.</div></div>'
                + '</tpl>'
                */
    }
});
ItbApp.showCommentPopUp=function(feedid){//alert('showCmt'+feedid);
	if(!ItbApp.CommentPopUp){//alert('showCmt if');
	ItbApp.CommentPopUp=Ext.create('Ext.form.Panel',{
			xtype:'formpanel',
			width:300,
			height:270,
			centered: true,
			modal:true,
			border:1,
			cls:'comment_pop',
			items:[
				{
				 xtype: "toolbar",
		         title: 'Comment',
		         docked: "top"
		        },
				{
					xtype:'textareafield',
					name:'text',
					placeHolder:'write a comment...',
					height:'100px'
				},
				{
					xtype:'hiddenfield',
					name:'postid'
				},
				{
					width:'100%',
					height: '15px'
				},{
					xtype:'button',
					text:'Cancel',
					handler:function(){
						ItbApp.CommentPopUp.setValues({postid:''});
						ItbApp.CommentPopUp.hide();
					}
				},
				{
					xtype:'button',
					text:'Share',
					ui:'action',
					handler:function(){						
						ItbApp.CommentPopUp.setValues({postid:feedid});
						var commentDataset=ItbApp.CommentPopUp.getValues();
						ItbApp.CommentPopUp.hide();
						//dumpProps(commentDataset)
						if(commentDataset.postid != '')
						forcetkClient.addPostComment(commentDataset,ItbApp.onCommentSucess,ItbApp.onCommentFailed);
					}
				}]				
   		});
   		//Ext.getCmp('CHATTER_LIST_CARD').add(ItbApp.CommentPopUp);
   		Ext.Viewport.add(ItbApp.CommentPopUp);
   	}else{//alert('showCmt else');
   		ItbApp.CommentPopUp.show();
   	}
};
ItbApp.shareComment=function(el,feedid){	
	var commentValue=el.previousSibling.previousSibling.previousSibling.value;
	var commentDataset={
			postid:feedid,
			text:commentValue
		};
	forcetkClient.addPostComment(commentDataset,ItbApp.onCommentSucess,ItbApp.onCommentFailed);
	
};
ItbApp.onCommentSucess=function(){	
	Ext.Msg.alert('Success','comment success...');
	setTimeout(function(){ItbApp.store.chatterStore.load()},10);
	//without such setTimeout delay, the load result will not be most updated

};
ItbApp.onCommentFailed=function(error){
	Ext.Msg.alert('Error','comment error...')
	dumpProps(error);// the error status show 0, not sure how to solve.
};
ItbApp.likeComment = function(feedid){
	forcetkClient.ajax('/' + forcetkClient.apiVersion + '/chatter/feed-items/'+feedid+'/likes', 
		function(response){
			setTimeout(function(){ItbApp.store.chatterStore.load()},10);
		}, 
		ItbApp.onCommentFailed,
		'POST',
		null);
}
ItbApp.hideComment = function (elem){//alert('hide comt ')
	$j(elem).hide().next().show().next().hide();		
}
ItbApp.showComment = function (elem){//alert('show ')
	$j(elem).prev().show().next().hide().next().show();	
	//$j('.chatter-list-item').each(function(){
	//	alert($j(this).html());
	//});
}

