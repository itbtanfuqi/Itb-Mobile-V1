Ext.define('ItbApp.view.twitter.Twitter', {
	 extend: 'Ext.Panel',
     requires:[
     		'ItbApp.view.twitter.twitterLoginCard',
     		'ItbApp.view.twitter.twitterCard',
     		'ItbApp.view.twitter.twitterFormCard'
     	],
	 xtype:'twitter',	 
     config:{    	
    	iconCls:'info',
    	title:'Twitter',
    	layout:{type:'card',animation:{type:'slide'}},
    	id:'TWITTER',
    	items:[
    		{xtype:'twitterlogincard'},
    		{
    			xtype:'twittercard',
    			config:{
    				id:'TWITTER_CARD'
    			}
    		},
    		{ xtype:'twitterformcard'}
    	]              
    }
    
});