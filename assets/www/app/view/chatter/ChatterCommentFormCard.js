Ext.define('ItbApp.view.chatter.ChatterCommentFormCard', {
	 extend: 'Ext.Panel',
     requires:['ItbApp.view.chatter.ChatterCommentForm'],
	 xtype:'chattercommentformcard',	
	 initialize:function(){	
		 var logoutButton = Ext.create('Ext.Button', {
			    text: 'Logout',
			    ui:'decline',
			    handler: ItbAppUtil.logout,
            	scope: this
			});
		var backToChatterItemButton = Ext.create('Ext.Button', {
			    text: 'Back',
			    ui:'back',
			    handler: this.backToChatterItem,
            	scope: this
			});			
		 var chatterFormToolbar={
				 xtype: "toolbar",
		         title: 'Reply to ',
		         docked: "top",
		         items:[
		         	backToChatterItemButton,
		            {xtype:'spacer'},		            
		            logoutButton
		         ]
		 };
		 var chatterCommentFormBase={
		 	xtype:'chattercommentform'
		 };
		 
		
		 this.add([chatterFormToolbar,chatterCommentFormBase]);
		 	 
		 } 
	, 
    config:{ 
    	id:'COMMENT_FORM_CARD',
    	layout: 'fit',        
    },
      backToChatterItem:function(){
      	Ext.getCmp('CHATTER').setActiveItem(2); 
      } 
});