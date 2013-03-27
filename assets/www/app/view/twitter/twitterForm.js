Ext.define("ItbApp.view.twitter.twitterForm", {
    extend: "Ext.form.Panel",
    alias: "widget.twitterform",
    config: {
		layout:'vbox',
		id:'TWITTER_FORM',
		items:[			
	        {
	            xtype: 'textareafield',
	            id:'TWITTER_FORM_TEXTAREA',
	            name: 'twitterContent',
	            placeHolder: 'Compose new Tweet...',
	            flex:8,
	            cls:'twitter_textarea'
	        },
	        {
	        	xtype: 'togglefield',
	        	id:'UPDATE_CHATTER',
			    name: 'updateChatter',
			    label: 'Also chatter?',
			    labelWidth: '60%',
			    flex:1,
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
			        		Ext.getCmp('TWITTER_FORM').reset();
			        	}
			        },
			        {
			        	xtype: 'spacer',
			        	flex:1,
			        },
			        {
			        	xtype: 'button',
			        	text: 'Tweet',
			        	ui: 'action',
			        	flex:1,
			        	handler:function(){// Ext.getCmp('ID').getValue() not work!! Reason not clear.
			        		Ext.Viewport.setMasked({xtype: 'loadmask',indicator: true});
			        		var twitterFormData={
			        			status:Ext.getCmp('TWITTER_FORM_TEXTAREA').getValue()
			        		};
			        		var synChatter = Ext.getCmp('UPDATE_CHATTER').getValue(); 
			        		//dumpProps(chatterFormData)
			        		if(twitterFormData.status != ''){			        			
			        			ItbAppUtil.twitterUpdate(twitterFormData);
			        			if(synChatter == 1){
			        				var chatterFormData={
					        			Body:twitterFormData.status,
					        			ParentId: ItbAppUtil.sfdcUserId
					        		};
					        		forcetkClient.create('FeedItem', chatterFormData, function(){ItbApp.store.chatterStore.load();}, ItbApp.onChatterSendMessageFailed) ;
			        			}
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