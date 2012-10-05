Ext.define('ItbApp.view.profil.Profil', {
	extend: 'Ext.Panel',
	requires:['ItbApp.view.profil.ProfilDetailCard'],
    xtype:'profil',    
    config:{
    	//html:'This is pf of view',
    	iconCls:'user' ,
    	title:'Profil',
    	layout:'card',
    	items:[
    		{xtype:'profiledetailcard'}
    	]
    }
});