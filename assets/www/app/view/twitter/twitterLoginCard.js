Ext.define('ItbApp.view.twitter.twitterLoginCard', {
	 extend: 'Ext.Panel',
     requires:['ItbApp.view.twitter.twitterCard'],
	 xtype:'twitterlogincard',	
	 initialize:function(){	
		 var logoutButton = Ext.create('Ext.Button', {
			    text: 'Logout',
			    ui:'decline',
			    hidden:true,
			    id:'TWITTER_LOGOUT',
			    handler: ItbAppUtil.twitterLogout,
            	scope: this
			});
		var loginButton = Ext.create('Ext.Button', {
			    text: 'Login',
			    ui:'confirm',
			    id:'TWITTER_LOGIN',
			    hidden:false,
			    handler: ItbAppUtil.twitterLogin,
            	scope: this
			});	
		 var twitterFormToolbar={
				 xtype: "toolbar",
		         title: 'Twitter Login',
		         docked: "top",
		         items:[
		         	
		            {xtype:'spacer'},		            
		            logoutButton,
		            loginButton		            
		         ]
		 };
		 this.add([
		 	twitterFormToolbar,		
				 	{
				 		xtype:'container',
				 		flex:1
				 	},
			        {
			        	xtype:'container',
			        	id:'TWITTER_CONTAINER',
			        	html:'Plese log in!',
			            flex:2
			        }
			        /*
			        ,
			        {
		            	xtype:'fieldset',
		            	items:[
		            		{
			                    xtype: 'textfield',
			                    name : 'firstName',
			                    placeHolder : 'Twitter PIN code',
			                    label: 'PIN Code',
			                    id:'PIN_CODE'
			                },
			                {
			                	xtype:'button',
			                	id:'PIN_BTN',
			                	text:'OK',
			                	margin: '10 0 0 0'
			                },
			                {
			                	xtype:'button',
			                	id:'Next',
			                	text:'Skip',
			                	margin: '10 0 0 0',
			                	handler:function(){
			                		Ext.getCmp('TWITTER').setActiveItem(1);
			                	}
			                }
		            	],
		            	flex:3
		            }
		            */
		 	]);
		 	 //Ext.getCmp('PIN_BTN').setHandler(ItbAppUtil.pinProcess);
		 } 
	, 
    config:{ 
    	id:'TWITTER_LOGIN_CARD',
    	layout:'vbox'  
    }
});

