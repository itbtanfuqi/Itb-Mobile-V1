Ext.define("ItbApp.view.chatter.ChatterCommentForm", {
    extend: "Ext.form.Panel",
    alias: "widget.chattercommentform",
    config: {
		layout:'vbox',
		id:'CHATTER_COMMENT_FORM',
		items:[			
	        {
	            xtype: 'textareafield',
	            id:'COMMENT_FORM_TEXTAREA',
	            name: 'text',
	            placeHolder: 'Any reply?',
	            flex:10,
	            cls:'chatter_textarea'
	        },
	        {
					xtype:'hiddenfield',
					name:'postid'
			},
	        {
	        	layout:'hbox',
	        	flex:1,
	        	items:[
	        		{
			        	xtype: 'button',
			        	text: 'Reset',
			        	flex:5,
			        	handler:function(){
			        		Ext.getCmp('CHATTER_COMMENT_FORM').reset();
			        	}
			        },
			        {
			        	xtype: 'spacer',
			        	flex:5,
			        },
			        {
			        	xtype: 'button',
			        	text: 'Comment',
			        	ui: 'action',
			        	flex:6,
			        	handler:function(){// Ext.getCmp('ID').getValue() not work!! Reason not clear.
			        		Ext.Viewport.setMasked({xtype: 'loadmask',indicator: true});
			        		Ext.getCmp('CHATTER_COMMENT_FORM').setValues({postid:ItbAppUtil.currentFeedId});
			        		var commentDataset=Ext.getCmp('CHATTER_COMMENT_FORM').getValues();							
							//dumpProps(commentDataset)
							if(commentDataset.postid != ''){
								forcetkClient.addPostComment(commentDataset,ItbApp.onCommentSucess,ItbApp.onCommentFailed);			        		
			        		}else{
			        			return false;
			        		}
			        	}
			        }
	        	]
	        }
	        
		]
    }
});
