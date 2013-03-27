Ext.define("ItbApp.view.twitter.twitterCard", {
    extend: "Ext.Panel",
    alias: "widget.twittercard",
    requires: [
               'ItbApp.view.twitter.twitterList','ItbApp.store.Twitter'
           ],
    initialize:function(){	
		 var refreshBtn = Ext.create('Ext.Button', {
			    iconCls: 'refresh', 
                iconMask: true, 
                ui:'plain',
                handler: function(){
                	ItbAppUtil.getHomeTimeline();              	
                }
			});
		var tweet_Button = Ext.create('Ext.Button', {
		    iconCls: 'compose', 
            iconMask: true, 
            ui:'plain',
            handler: function(){
            	Ext.getCmp('TWITTER').setActiveItem(2);            	
            }
		});	
		 var twitterFormToolbar={
				 xtype: "toolbar",
		         title: 'Twitter',
		         docked: "top",
		         items:[
		         	{
		         		text: 'Back',
					    ui:'back',
					    handler: function(){
					    	Ext.getCmp('TWITTER').setActiveItem(0);
					    },
		            	scope: this
		         	},
		            {xtype:'spacer'},
		            tweet_Button,	            
		            refreshBtn		            
		         ]
		 };	 		 
		 this.add([
		 	twitterFormToolbar,
		     {
            	xtype:'twitterlist',
            	store: Ext.create("ItbApp.store.Twitter",{            		    
    				id:'TWITTER_STORE'
            	})
             }
		 ]);
		 },
    	config: {
			layout:'fit'		
		}
});