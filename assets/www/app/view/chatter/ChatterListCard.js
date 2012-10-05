Ext.define('ItbApp.view.chatter.ChatterListCard', {
	 extend: 'Ext.Panel',
     requires:["ItbApp.proxy.ChatterProxy","ItbApp.view.chatter.ChatterList","ItbApp.store.Chatter"],
	 xtype:'chatterlistcard',
	 initialize:function(){	
		 var logoutButton = Ext.create('Ext.Button', {
			    text: 'Logout',
			    ui:'decline',
			    handler: ItbAppUtil.logout,
            	scope: this
			});
		ItbApp.store.chatterStore=Ext.getStore("Chatter");
		var refresh_Button = Ext.create('Ext.Button', {
			    iconCls: 'refresh', 
                iconMask: true, 
                ui:'plain',
                handler: function(){
                	ItbApp.store.chatterStore.load();               	
                }
			});
		var chat_Button = Ext.create('Ext.Button', {
		    iconCls: 'compose', 
            iconMask: true, 
            ui:'plain',
            handler: function(){
            	Ext.getCmp('CHATTER').setActiveItem(1);            	
            }
		});
		var itblogo = Ext.create('Ext.Img',{
			src :'resource/Images/itblogo.png',
			cls : 'itb_logo'
		});
		 var chatterListToolbar={
				 xtype: "toolbar",
		         title: 'Chatter',
		         docked: "top",
		         items:[
		         	itblogo,
		            {xtype:'spacer'},
		            chat_Button,
		            refresh_Button//,
		            //logoutButton
		         ]
		 };
		 	 
		// ItbApp.proxy.chatterProxy=Ext.create('ItbApp.proxy.ChatterProxy');
		// ItbApp.store.chatterStore.setProxy(ItbApp.proxy.chatterProxy);
		/*
		 var chatterForm = {
			xtype:'chatterform',
			flex:61
		};
		
		var refreshBtn = Ext.create('Ext.Button', {
			    text: 'Refresh',
			    ui:'normal',
			    flex:1,
			    margin:'0 10 2 10',
			    cls:'refresh_Btn',
			    handler: function(){
			    	if(ItbAppUtil.sfdcUserId)
			    		ItbApp.store.chatterStore.load();
			    	else{
			    		ItbAppUtil.logout();
			    	}
			    }
			});
			*/
		var chatterList = {
				 xtype:'chatterlist',
				 store: ItbApp.store.chatterStore
		        };
		
		 this.add([chatterListToolbar,//chatterForm//, 
		           chatterList
		           ]);
		 	 
		 } 
	,
    config:{
    	layout: { //!!important, if layout not like this, list won't show
            type: 'fit'
      },
      id:'CHATTER_LIST_CARD'
      //html:'<a class="x-button cmt_bar"><span class="x-button-label">test</span></a>'
      //html:'<a class="cmt_bar">test</a>'
    }
    /*,    
    onPostButtonTap:function(){
    	this.fireEvent("postButtonTap", this);
    }
    */
});
