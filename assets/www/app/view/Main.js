Ext.define('ItbApp.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'mainview',
    requires: [
               'ItbApp.view.chatter.Chatter',
               'ItbApp.view.timecard.Timecard',
               //'ItbApp.view.profil.Profil'
               'ItbApp.view.twitter.Twitter'
           ],
    config: {// sometimes you must include these in config item otherwise ineffective.
    	fullscreen: true,
        tabBarPosition: 'bottom',
        items: [
            {xtype:'chatter'          	
            }, 
            {xtype:'timecard'           	
           	},
            /*, 
            {xtype:'profil'           	
           }*/
          	{xtype:'twitter' }
        ], 
	    listeners:{
	   		activeitemchange:function(panel, value, oldValue, eOpts){
	   			//dumpProps(value)
	   			if('TWITTER_LOGIN_CARD' == value.items.keys[0]){//alert('a')
	   				if(ItbAppUtil.twitterOn){//alert('b')
	   					Ext.getCmp('TWITTER').setActiveItem(1);
	   				}else{//alert('c')	   					
	   					Ext.getCmp('TWITTER').setActiveItem(0);
	   					ItbAppUtil.twitterLogin();
	   				}	
	   				
	   				/*
	   				entries = a.text;
					var o,							
						twitterStore = Ext.getStore('TWITTER_STORE');										
					for (var i in entries) {
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
					};
					Ext.getCmp('TWITTER').setActiveItem(1);   
					*/				
	   			}
	   		}
	   } 
   },
   
});