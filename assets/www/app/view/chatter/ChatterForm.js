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
	        	xtype: 'togglefield',
	        	id:'UPDATE_TWITTER',
			    name: 'updateTwitter',
			    label: 'Also twitter?',
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
			        		var synTwitter = Ext.getCmp('UPDATE_TWITTER').getValue(); alert(synTwitter);
			        		//dumpProps(chatterFormData)
			        		if(chatterFormData.Body != ''){			        			
			        			forcetkClient.create('FeedItem', chatterFormData, ItbApp.onChatterSendMessageSuccess, ItbApp.onChatterSendMessageFailed) ;
			        			if(synTwitter == 1){ // update twitter at the same time
			        				if(ItbAppUtil.twitterOn){		
				        				var twitterFormData={
						        			//status:Ext.getCmp('TWITTER_FORM_TEXTAREA').getValue()
						        			status:chatterFormData.Body
						        		};alert('58@chatterform');
						        		//dumpProps(chatterFormData)
						        		ItbAppUtil.twitterUpdate(twitterFormData);
					        		}else{
					        			alert('twitter not log in')
					        		}
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