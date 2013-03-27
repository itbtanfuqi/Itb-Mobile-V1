Ext.define('ItbApp.view.twitter.twitterFormCard', {
	 extend: 'Ext.Panel',
     requires:['ItbApp.view.twitter.twitterForm'],
	 xtype:'twitterformcard',	
	 initialize:function(){	
		 var logoutButton = Ext.create('Ext.Button', {
			    text: 'Logout',
			    ui:'decline',
			    handler: ItbAppUtil.logout,
            	scope: this
			});
		var backToTwitterListButton = Ext.create('Ext.Button', {
			    text: 'Back',
			    ui:'back',
			    handler: function(){
			      	Ext.getCmp('TWITTER').setActiveItem(1); 
			      } ,
            	scope: this
			});			
		 var twitterFormToolbar={
				 xtype: "toolbar",
		         title: 'New Tweet',
		         docked: "top",
		         items:[
		         	backToTwitterListButton,
		            {xtype:'spacer'},		            
		            logoutButton
		         ]
		 };
		 var twitterFormBase={
		 	xtype:'twitterform'
		 };		 
		
		 this.add([twitterFormToolbar,twitterFormBase]);
		 	 
		 } 
	, 
    config:{ 
    	id:'TWITTER_FORM_CARD',
    	layout: 'fit',        
    } 
});