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