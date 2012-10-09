Ext.define("ItbApp.view.chatter.ChatterForm", {
    extend: "Ext.form.Panel",
    alias: "widget.chatterform",
    config: {
		layout:'vbox',
		id:'CHATTER_FORM',
		items:[			
	        {
	            xtype: 'textareafield',
	            id:'CHATTER_FORM_TEXTAREA',
	            name: 'chatterContent',
	            placeHolder: 'What are you working on?',
	            flex:10,
	            cls:'chatter_textarea'
	        },
	        {
	        	layout:'hbox',
	        	flex:1,
	        	items:[
	        		{
			        	xtype: 'button',
			        	text: 'Reset',
			        	flex:1,
			        	handler:function(){
			        		Ext.getCmp('CHATTER_FORM').reset();
			        	}
			        },
			        {
			        	xtype: 'spacer',
			        	flex:1,
			        },
			        {
			        	xtype: 'button',
			        	text: 'Share',
			        	ui: 'action',
			        	flex:1,
			        	handler:function(){// Ext.getCmp('ID').getValue() not work!! Reason not clear.
			        		Ext.Viewport.setMasked({xtype: 'loadmask',indicator: true});
			        		var chatterFormData={
			        			Body:Ext.getCmp('CHATTER_FORM_TEXTAREA').getValue(),
			        			ParentId: ItbAppUtil.sfdcUserId
			        		};
			        		//dumpProps(chatterFormData)
			        		if(chatterFormData.Body != ''){			        			
			        			forcetkClient.create('FeedItem', chatterFormData, ItbApp.onChatterSendMessageSuccess, ItbApp.onChatterSendMessageFailed) ;
			        		}else{
			        			Ext.Viewport.setMasked(false);
			        			return false;
			        		}
			        	}
			        }
	        	]
	        }
	        
		]
    }
});
ItbApp.onChatterSendMessageSuccess=function(result){	
	Ext.getCmp('CHATTER').setActiveItem(0);
	Ext.getCmp('CHATTER_FORM').reset();
	Ext.Viewport.setMasked(false);
	ItbApp.store.chatterStore.load();
	//$j('#CHATTER_FORM_TEXTAREA').find('textarea').val('');
	//Ext.getCmp('CHATTER_LIST').refresh();
    //Ext.getCmp('CHATTER').setActiveItem(0); 
};
ItbApp.onChatterSendMessageFailed = function (error){
	Ext.Viewport.setMasked(false);
    Ext.Msg.alert('Error','Ein Fehler ist aufgetreten! Bitte versuchen Sie es erneut');
    dumpProps(error);
    
};