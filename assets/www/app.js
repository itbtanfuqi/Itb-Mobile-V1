Ext.application({
    name: "ItbApp",

    models: ["Chatter"],
    stores: ["Chatter"],
    controllers: ["Main"],
   
    views: [//"NotesList","ChatterList",//"ChatterListCard","ChatterFormCard",
            "Main" ,
         //   "Chatter"
            ],
	
    launch: function () {
    	
    	var mainView = {           
        		xtype:'mainview'        		
        };       
		
        Ext.Viewport.add(mainView); //alert('19 before store load');
        //ItbApp.store.chatterStore.load({
        	
       // });
       //alert('23 before login');
       ItbAppUtil.login();
    },
    
   onLogoutButtonTap:function(){
   		Ext.Msg.alert('will log out');
   }
});