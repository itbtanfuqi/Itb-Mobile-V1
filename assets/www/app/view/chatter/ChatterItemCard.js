Ext.define('ItbApp.view.chatter.ChatterItemCard', {
	 extend: 'Ext.Panel',
     requires:['ItbApp.view.chatter.ChatterCommentList','ItbApp.store.ChatterComments'],
	 xtype:'chatteritemcard',
	 initialize:function(){
		var reply_Button = Ext.create('Ext.Button', {
		    iconCls: 'reply', 
            iconMask: true, 
            ui:'plain',
            handler: function(){
            	//Ext.getCmp('CHATTER_COMMENT_FORM').setValues({postid:ItbAppUtil.currentFeedId});   alert('11') 
            	Ext.getCmp('CHATTER').setActiveItem(3); 
            }
		});
		var itblogo = Ext.create('Ext.Img',{
			src :'resource/Images/itblogo.png',
			cls : 'itb_logo'
		});
		var backToChatterListButton = Ext.create('Ext.Button', {
			    text: 'Back',
			    ui:'back',
			    handler: this.backToChatterList,
            	scope: this
			});	
		 var chatterItemToolbar={
				 xtype: "toolbar",
		         title: 'Chatter',
		         docked: "top",
		         items:[backToChatterListButton,
		            {xtype:'spacer'},
		            reply_Button
		            //logoutButton
		         ]
		 };
		 var chatterPost = Ext.create(
		 	'Ext.Container',{
		 	tpl: '<span class="actorPhoto"><img src="{parentPhotoSmallPhotoUrl}?oauth_token={accessToken}" alt=""/></span>'		 		
                +'<div class="chatterPost"><span class="actorInfo"><tpl if="parentName != actorName"><img src="resource/Images/groups16.png" class="groupImage"/>{parentType} - </tpl>{actorName}</span><br><span class="post_body">{bodyText}'
    			+'</span><br><span class="chatterTime">{createdDate}</span><br>'
    			+'<a class="commentLink" href="#" onclick="ItbApp.likeComment(\'{id}\')">Like</a><a onclick="ItbApp.deletePost(\'{id}\')" class="commentLink">Delete</a>'                                   
                //+ '<div class="like">Likes: {likesTotal}</div>'
                + '</div>',
		 	id :'CHATTER_POST',
		 	docked: "top"
		   	}
		 );
		 var chatterArrow = Ext.create('Ext.Container',{
            html:'<div id="COMMENT_ARROW" class="commentArrowShow"><img src="resource/Images/chat_arrow.png"/><div id="showMore"><span>Show more ...</span></div></div>',
            id :'CHATTER_POST_ARROW',
		 	docked: "top"
		 });
		 var commentListStore = Ext.create('ItbApp.store.ChatterComments',{
		 	id :'CHATTER_COMMENT_STORE'
		 });
		 this.add([chatterItemToolbar,//chatterForm//, 
		           chatterPost,
		           chatterArrow,
		           {xtype:'commentlist', store:commentListStore,
		            id : 'COMMENT_LIST',
		           	pressedCls: 'white',
    				selectedCls: 'white',
    				flex:1
		           }
		           ]);		 	 
		 } ,
	config:{
    	layout: 'vbox', 
        id:'CHATTER_ITEM_CARD'
   },
   backToChatterList:function(){
      	Ext.getCmp('CHATTER').setActiveItem(0); 
      } 
});
ItbApp.likeComment = function(feedid){//alert(feedid)
		forcetkClient.ajax('/' + forcetkClient.apiVersion + '/chatter/feed-items/'+feedid+'/likes', 
		function(response){
			Ext.getCmp('CHATTER').setActiveItem(0);
			setTimeout(function(){ItbApp.store.chatterStore.load()},10);
		}, 
		ItbApp.onCommentFailed,
		'POST',
		null);
}
ItbApp.deletePost = function(feedid){
	forcetkClient.del('FeedItem', feedid, function(response){
				Ext.getCmp('CHATTER').setActiveItem(0);
				setTimeout(function(){ItbApp.store.chatterStore.load()},10);
			},  ItbApp.onChatterSendMessageFailed);
}
