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
		listTpl = new Ext.XTemplate(
				'<tpl for=".">',
					'<span class="actorPhoto">',
						'<img src="{parentPhotoSmallPhotoUrl}?oauth_token=',
						//ItbAppUtil.accessToken,
						'{[ItbAppUtil.getToken()]}',
						'" alt=""/>',
					'</span>',
					'<div class="chatterMain">',
						'<div><span class="actorInfo">',
							'<tpl if="parentName != actorName">',
							'<img src="resource/Images/groups16.png" class="groupImage"/>',
							'{parentName} - ',
							'</tpl>',
							'{actorName}</span>    <tpl if="parentName != actorName"><br></tpl><span class="chatterTime">{[this.processTime(values.createdDate)]}</span><br>',
							'<span class="post_body">{[this.processText(values.bodyText,60,true)]}</span><br>',
							//'<span class="cmtTotal">{commentsTotal} Comment{[values.commentsTotal<2?"":"s"]}</span>',
							'<span class="like"><img src="resource/Images/like.png"/> {likesTotal}</span>',
						'</div>',
						//'<div class="cmt_bar"><br><span class="cmtTotal">{commentsTotal} Comment{[values.commentsTotal<2?"":"s"]}</span></div>',
					'</div>',
               '</tpl>',
               {	processText:function(value, len, word){
               			if (value && value.length > len) {
				            if (word) {
				                var vs = value.substr(0, len - 2),
				                index = Math.max(vs.lastIndexOf(' '), vs.lastIndexOf('.'), vs.lastIndexOf('!'), vs.lastIndexOf('?'));
				                if (index !== -1 && index >= (len - 15)) {
				                    return vs.substr(0, index) + "...";
				                }
				            }
				            return value.substr(0, len - 3) + "...";
				        }
				        return value;
              		},
					processTime:function(t,idx){
						var _t=''+t;
						var year=parseInt(_t.substring(0,4),10),
							month=parseInt(_t.substring(5,7),10),
							day=parseInt(_t.substring(8,10),10),
							hour=parseInt(_t.substring(11,13),10),
							minute=parseInt(_t.substring(14,16),10);
						//alert(t+"=="+year+':'+month+":"+day+":"+hour+":"+minute)
						var d = new Date();
						var _year=d.getFullYear(),
							_month=1+d.getMonth(),
							_day=d.getDate(),
							_hour=d.getHours(),
							_minute=d.getMinutes();
						var result;
						if(year === _year){
							if(month === _month){
								if(day === _day){
									if(hour === _hour){
										if(minute === _minute){
											result = 'just now';
										}else{
											result = (_minute - minute > 1 ?(_minute - minute)+'minutes' : '1 minute');
										}
									}else{
										result = (_hour - hour > 1 ?(_hour - hour)+'hours' : '1 hour');
									}
								}else{
									result = (_day - day > 1 ?(_day - day)+'days' : '1 day');
								}
							}else{
								result = (_month - month > 1 ?(_month - month)+'months' : '1 month');
							}
						}else{
							result = (_year - year > 1 ?(_year - year)+'years' : '1 year');
						}						
						return result;
					}
               }
		);
        Ext.getCmp('CHATTER_LIST').setItemTpl(listTpl);
        ItbApp.store.chatterStore.load({
              /*callback:function(records, operation, success){
              	alert('call back');
              	dumpProps(records)
              },*/
              scope: this
        });
        //Ext.getCmp('CHATTER_POST').setItemTpl();
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
	formatTime:function(t,idx){
						var _t=''+t;
						var year=parseInt(_t.substring(0,4),10),
							month=parseInt(_t.substring(5,7),10),
							day=parseInt(_t.substring(8,10),10),
							hour=parseInt(_t.substring(11,13),10),
							minute=parseInt(_t.substring(14,16),10);
							if(hour < 10) hour = '0'+hour;
							if(minute < 10) minute = '0'+minute;						
						var result;
						var map_month = [
							'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'
						];
						month = map_month[month-1];
						result = month + ' ' + day + ' ' + year + ' ' + hour + ':' + minute + (hour < 12 ? ' AM':' PM');
						return result;
				},
	twitterOptions: {
						consumerKey: '1YXY07G5nUV76NOTWl3Hw',
						consumerSecret: 'DVTqVCgyAOx2UuXI6OFKB9FXMRLPoRzE0g8zVgqzaQo',
						callbackUrl:"testsfdc:///itbdemo/TWITTERCALLBACK"
						//callbackUrl: oauthRedirectURI
					},
	twitterOAuth : null,
	twitterSuc : function(data){
								//alert('ok');
								//dumpProps(data);
					if(data&&data.text&&data.text.length > 0){
						var rq = data.text.split('&');
						var oauthToken = rq[0].split('='),
							oauthTokenSecret = rq[1].split('='),
							oauthCallbackConfirmed = rq[2].split('=');
						ItbApp.oauthToken = data.text;
						var url_sec = 'https://api.twitter.com/oauth/authenticate?oauth_token='+oauthToken[1];								
						//Ext.getCmp('TWITTER_CONTAINER').setHtml('<div>Click the twitter page link and grant access to this application.Then fill in the below PIN code which will be provided from the twitter grant access page.</div> <a href="'+ url_sec +'" target="_blank">Twitter Grant Access</a>');
						Ext.getCmp('TWITTER_CONTAINER').add({
							xtype:'button',
							text:'twitterLogin',
							handler:function(){ //alert('@AuthUtil 172 under construction');
								//window.twitter.startTwitterLogin(url_sec);
								//Ext.Viewport.setMasked({xtype: 'loadmask',indicator: true});
								SalesforceOAuthPlugin.twitterAuth(function(data){
										//alert('ok 175');
										ItbAppUtil.twitterLoginSuc(data);
									},
									function(err){
										alert('fail get data from call back');
										dumpProps(err);
									},
									url_sec);
							}
						});
					}else{
							alert('Response empty data,please check');
							dumpProps(data);
					}
				},
	twitterFail : function(data){
									alert("Throw rotten fruit, something failed");
									dumpProps(data);
								},
	pinProcess : function(oauth_token,oauth_verifier){
								//var pin = Ext.getCmp('PIN_CODE').getValue();
								//alert(pin);
								if(oauth_token){
									//ItbAppUtil.twitterOAuth.get('https://twitter.com/oauth/access_token?oauth_verifier='+pin+'&'+ItbApp.oauthToken,
									ItbAppUtil.twitterOAuth.get('https://twitter.com/oauth/access_token?oauth_verifier='+oauth_verifier+'&oauth_token='+oauth_token,
										function(data) {					
											var accessParams = {};
											var qvars_tmp = data.text.split('&');
											for (var i = 0; i < qvars_tmp.length; i++) {;
												var y = qvars_tmp[i].split('=');
												accessParams[y[0]] = decodeURIComponent(y[1]);
											};
											ItbAppUtil.twitterOAuth.setAccessToken([accessParams.oauth_token, accessParams.oauth_token_secret]);
											Ext.getCmp('TWITTER_LOGOUT').setHidden(false);
											Ext.getCmp('TWITTER_LOGIN').setHidden(true);
											//alert('ov')
											ItbAppUtil.twitterOn = true;
											ItbAppUtil.getHomeTimeline();	
											
										},
					
										function(data) { Ext.Viewport.setMasked(false); alert('poop'); dumpProps(data); }
									);				
								}else{
									alert('PIN can not be empty')
								}
							},
	twitterLogout : function(){
		ItbAppUtil.twitterOAuth.setAccessToken([null, null]);
		ItbAppUtil.twitterOAuth = null;
		Ext.getCmp('TWITTER_CONTAINER').setHtml('You are log out');
		Ext.getCmp('TWITTER_LOGOUT').setHidden(true);
		Ext.getCmp('TWITTER_LOGIN').setHidden(false);
		ItbAppUtil.twitterOn = false;
	},
	getHomeTimeline : function(){
		if(!ItbAppUtil.twitterOn){Ext.Msg.alert('Status','You have not logged in!');return;}
		Ext.Viewport.setMasked({xtype: 'loadmask',indicator: true});
		ItbAppUtil.twitterOAuth.get('https://api.twitter.com/1/statuses/home_timeline.json?include_entities=true',									
			function(data) {				
				var entries = JSON.parse(data.text);
				var o,
					twitterStore = Ext.getStore('TWITTER_STORE');										
				for (var i in entries) { //alert('i='+i);if(i<2)dumpProps(entries[i])
					o = Ext.create('ItbApp.model.Twitter',{
						'id':entries[i].id,
				        'created_at': entries[i].created_at,
				        'text':entries[i].text,
				        'userName':entries[i].user.name,
				        'screenName':entries[i].user.screen_name,
				        'userImageHttps':entries[i].user.profile_image_url_https,
				        'userImage':entries[i].user.profile_image_url
					});
					twitterStore.add(o);
				}
				Ext.getCmp('TWITTER').setActiveItem(1);
				Ext.Viewport.setMasked(false);
			},
			function(data) { 
				Ext.Viewport.setMasked(false);
				alert('lame'); 
				dumpProps(data); 
			}
		);			
	},
	twitterLogin:function(){
							//console.log('beging twitter login');
							var requestParams; 
        					var accessParams; 
							ItbAppUtil.twitterOAuth = OAuth(ItbAppUtil.twitterOptions);
							var url = "https://api.twitter.com/oauth/request_token";							//alert(url);
							
							var ops ={
									method:'POST',
								 	//url: 'http://www.example.com/person/edit/2',
								 	url:"https://api.twitter.com/oauth/request_token",
									success: ItbAppUtil.twitterSuc,
									failure: ItbAppUtil.twitterFail,
									Authorization: OAuth,									
									headers:{									
										oauth_nonce:new Date().getTime(), 
										oauth_callback:"http%3A%2F%2Flocalhost%2Fsign-in-with-twitter%2F",
										oauth_signature_method:"HMAC-SHA1", 
										oauth_timestamp:new Date().getTime(), 
										oauth_consumer_key: ItbAppUtil.twitterOptions.consumerKey, 
										oauth_version:"1.0"
									}
								};
								//dumpProps(ops)
							ItbAppUtil.twitterOAuth.request(ops);
						
			        		
			        	
	},
	twitterUpdate : function(statusData,type){//alert('will update');dumpProps(statusData);
		if(type){ alert('a 291')
			ItbAppUtil.twitterOAuth.post("https://api.twitter.com/1.1/statuses/update.json",statusData,function(){},function(){});
		}else{alert('b 293')
			ItbAppUtil.twitterOAuth.post("https://api.twitter.com/1.1/statuses/update.json",statusData,ItbAppUtil.twitterUpdateSuc,ItbAppUtil.twitterUpdateFail);
		}
	},
	twitterUpdateSuc : function(data){
		Ext.getCmp('TWITTER_FORM').reset();
		Ext.Viewport.setMasked(false);
		Ext.getCmp('TWITTER').setActiveItem(1); 
		ItbAppUtil.getHomeTimeline();
		//alert('update suc'),
		//dumpProps(data);
		
	},
	twitterUpdateFail : function(data){
		Ext.Viewport.setMasked(false);
		alert('update fail')
		dumpProps(data);
		Ext.getCmp('TWITTER_FORM').reset();
	},
	twitterOn : false,
	twitterLoginSuc : function(str){//alert('309'+str);
		Ext.Viewport.setMasked({xtype: 'loadmask',indicator: true});
		if(str && str.length > 0){
			var ary = str.split('?');
			if(ary.length == 2){
				ary = ary[1].split('&');
				if(ary.length == 2){
					var oauth_token = ary[0].split('='),	
						oauth_verifier = ary[1].split('=');
					ItbAppUtil.pinProcess(oauth_token[1],oauth_verifier[1]);
				}
			}
		}else{
			Ext.Viewport.setMasked(false);
		}
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