Ext.define('ItbApp.view.timecard.Timecard', {
	 extend: 'Ext.Panel',
    xtype:'timecard',
    initialize:function(){
    	var logoutButton = Ext.create('Ext.Button', {
			    text: 'Logout',
			    ui:'decline',
			    handler: ItbAppUtil.logout,
            	scope: this
			});
		var itblogo = Ext.create('Ext.Img',{
			src :'resource/Images/itblogo.png',
			cls : 'itb_logo'
		});
    	 var tcToolbar={
				 xtype: "toolbar",
		         title: 'Time Card',
		         docked: "top",
		         items:[
		         	itblogo,
		            {xtype:'spacer'},
		            //postButton,
		            logoutButton
		         ]
		 };
		 this.add([tcToolbar]);
    },
    config:{
    	id:'TIME_CARD',
    	html:'This is tc of view',
    	layout:'fit',
    	iconCls:'time' ,
    	title:'Timecard'
    }
});