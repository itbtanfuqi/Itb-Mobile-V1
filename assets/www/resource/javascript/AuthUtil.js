var sfdcUserId;
var ItbAppUtil = {

	login: function (){
        //alert('will login');
		var oauthProperties = new OAuthProperties(remoteAccessConsumerKey, 
                                              oauthRedirectURI, 
                                              oauthScopes, 
                                              autoRefreshOnForeground);
        
		SalesforceOAuthPlugin.authenticate(ItbAppUtil.loginSuccess, ItbAppUtil.loginFailure, oauthProperties);

        document.addEventListener("ItbAppUtil.salesforceSessionRefresh",ItbAppUtil.salesforceSessionRefreshed,false);        
    },

	loginSuccess: function(oauthCredentials){
		//alert('login success');dumpProps(oauthCredentials);
        ItbAppUtil.sfdcUserId = oauthCredentials.userId;
        ItbAppUtil.accessToken = oauthCredentials.accessToken;
        //alert(ItbAppUtil.accessToken);
		ItbAppUtil.salesforceSessionRefreshed(oauthCredentials);
		/*
		var mainView = {           
        		xtype:'mainview'        		
        }; 
        Ext.Viewport.add(mainView); 
        */
       //alert(ItbAppUtil.accessToken);
        Ext.getCmp('CHATTER_LIST').setItemTpl('<tpl for="."><span class="actorPhoto"><img src="{parentPhotoSmallPhotoUrl}?oauth_token='+ItbAppUtil.accessToken+'" alt=""/></span>'
                +'<div class="chatterMain"><div><span class="actorInfo">{actorName}</span><span class="post_body">{bodyText}'
    			+'</span></div><div class="chatterTime">{createdDate}</div>'
    			+'<a onclick="ItbApp.showCommentPopUp(\'{id}\')" class="commentLink">Comment</a><a class="commentLink" href="#" onclick="ItbApp.likeComment(\'{id}\')">Like</a>'                                   
                + '<div class="like">Likes: {likesTotal}</div>'
                + '<div class="cmt_bar">{commentsTotal} Comments now.</div></div>'
                + '</tpl>');
        ItbApp.store.chatterStore.load({
              /*callback:function(records, operation, success){
              	alert('call back');
              	dumpProps(records)
              },*/
              scope: this
        });
        //forcetkClient.ajax('v23.0/chatter/feeds/news/me/feed-items',rok,rfail);
	}
	,
	salesforceSessionRefreshed: function(creds) {	
		forcetkClient = new forcetk.Client(creds.clientId, creds.loginUrl);
		forcetkClient.setSessionToken(creds.accessToken, apiVersion, creds.instanceUrl);
		forcetkClient.setRefreshToken(creds.refreshToken);
		forcetkClient.setUserAgentString(creds.userAgent);        
	},
    
    loginFailure: function(error) {
    	Ext.Msg.alert('Error','Error during login occured');        
    },
	
    logout: function(){
    	SalesforceOAuthPlugin.logout();
    	if(ItbAppUtil.sfdcUserId){ItbAppUtil.sfdcUserId=undefined;}    	
    },
    getToken : function(){
		return ItbAppUtil.accessToken;
	},
    testStore:[{
    	image:'http:\\mytest.jpg',
    	type:'TrackedChange',
    	parentType:'CollaborationGroup',
    	createdDate:'2012-04-16 11:12:52',
    	actorName:'fuqi.tan',
    	parentName:'news',
    	likesTotal:5,
    	bodyText:'bodyTest',
    	comments:{
    		comments:{
    			createdDate:'2012-03-05',
    			user:{
    				name:'testName'
    			},
    			body:{
    				text:'test text'
    			}
    		}
    	}
    },
    {
    	image:'http:\\mytestss.jpg',
    	type:'TrackedChange',
    	parentType:'CollaborationGroup',
    	createdDate:'2012-04-13 11:12:52',
    	actorName:'fuqi.tan',
    	parentName:'profil',
    	likesTotal:20,
    	bodyText:'bodyTest again',
    	comments:{
    		comments:{
    			createdDate:'2012-03-08',
    			user:{
    				name:'testName11'
    			},
    			body:{
    				text:'test text22'
    			}
    		}
    	}
    }
    ]
}
function rok(response){Ext.Msg.alert('ok','ok');
	dumpProps(response);
}
function rfail(response){Ext.Msg.alert('fail','fail');
	dumpProps(response);
}
function dumpProps(obj, parent) {
    for (var i in obj) {
        if (parent) { var msg = parent + "." + i + "\n" + obj[i]; } else { var msg = i + "\n" + obj[i]; }
        if (!confirm(msg)) { return; }
        if (typeof obj[i] == "object") { 
            if (parent) { dumpProps(obj[i], parent + "." + i); } else { dumpProps(obj[i], i); }
        }
    }
}