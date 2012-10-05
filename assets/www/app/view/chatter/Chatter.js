Ext.define('ItbApp.view.chatter.Chatter', {
	 extend: 'Ext.Panel',
     requires:["ItbApp.view.chatter.ChatterListCard",
     	"ItbApp.view.chatter.ChatterFormCard",
     	"ItbApp.view.chatter.ChatterItemCard"
     	],
	 xtype:'chatter',	 
     config:{    	
    	iconCls:'info',
    	title:'Chatter',
    	layout:{type:'card',animation:{type:'slide'}},
    	id:'CHATTER',
    	items:[
    		{xtype:'chatterlistcard'},
    		{xtype:'chatterformcard'},
    		{xtype:'chatteritemcard'}
    	]              
    }
    
});
