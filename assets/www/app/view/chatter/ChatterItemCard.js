
Ext.define('ItbApp.view.chatter.ChatterItemCard', {
	 extend: 'Ext.Panel',
     requires:["ItbApp.view.chatter.ChatterCommentList"],
	 xtype:'chatteritemcard',
	 initialize:function(){
		var reply_Button = Ext.create('Ext.Button', {
		    iconCls: 'reply', 
            iconMask: true, 
            ui:'plain',
            handler: function(){
            	alert('reply');            	
            }
		});
		var itblogo = Ext.create('Ext.Img',{
			src :'resource/Images/itblogo.png',
			cls : 'itb_logo'
		});
		var backToChatterListButton = Ext.create('Ext.Button', {
			    text: 'Back',
			    ui:'back',
			    handler: this.backToChatterList,
            	scope: this
			});	
		 var chatterItemToolbar={
				 xtype: "toolbar",
		         title: 'Chatter',
		         docked: "top",
		         items:[backToChatterListButton,
		            {xtype:'spacer'},
		            reply_Button
		            //logoutButton
		         ]
		 };
		 var chatterPost = Ext.create(
		 	'Ext.Panel',{
		 	tpl: '<div>Testing: {text}</div><div>data: {data}</div>',
		 	flex : 1,
		 	id :'CHATTER_POST'
		   	}
		 );
		 this.add([chatterItemToolbar,//chatterForm//, 
		           chatterPost,
		           {xtype:'commentlist', flex : 9}
		           ]);		 	 
		 } ,
	config:{
    	layout: 'vbox', 
        id:'CHATTER_ITEM_CARD'
   },
   backToChatterList:function(){
      	Ext.getCmp('CHATTER').setActiveItem(0); 
      } 
});
