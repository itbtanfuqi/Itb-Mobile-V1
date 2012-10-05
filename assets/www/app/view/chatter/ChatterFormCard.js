Ext.define('ItbApp.view.chatter.ChatterFormCard', {
	 extend: 'Ext.Panel',
     requires:['ItbApp.view.chatter.ChatterForm'],
	 xtype:'chatterformcard',	
	 initialize:function(){	
		 var logoutButton = Ext.create('Ext.Button', {
			    text: 'Logout',
			    ui:'decline',
			    handler: ItbAppUtil.logout,
            	scope: this
			});
		var backToChatterListButton = Ext.create('Ext.Button', {
			    text: 'Back',
			    ui:'back',
			    handler: this.backToChatterList,
            	scope: this
			});			
		 var chatterFormToolbar={
				 xtype: "toolbar",
		         title: 'Share Something',
		         docked: "top",
		         items:[
		         	backToChatterListButton,
		            {xtype:'spacer'},		            
		            logoutButton
		         ]
		 };
		 var chatterFormBase={
		 	xtype:'chatterform'
		 };
		 
		
		 this.add([chatterFormToolbar,chatterFormBase]);
		 	 
		 } 
	, 
    config:{ 
    	id:'CHATTER_FORM_CARD',
    	layout: 'fit',        
    },
      backToChatterList:function(){
      	Ext.getCmp('CHATTER').setActiveItem(0); 
      } 
});