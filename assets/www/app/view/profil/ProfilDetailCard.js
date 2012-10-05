Ext.define('ItbApp.view.profil.ProfilDetailCard', {
	 extend: 'Ext.Panel',
     requires:['ItbApp.view.profil.ProfilDetailForm'],
	 xtype:'profiledetailcard',
	 initialize:function(){	
		 var logoutButton = Ext.create('Ext.Button', {
			    text: 'Logout',
			    ui:'decline',
			    handler: ItbAppUtil.logout
			});
		var editProfilButton = Ext.create('Ext.Button', {
			    text: 'Edit',
			    ui:'action',
			    handler: this.editProfil
			});
		 var prifilDetailCardToolbar={
				 xtype: "toolbar",
		         title: 'Profil',
		         docked: "top",
		         items:[
		            {xtype:'spacer'},
		            editProfilButton,
		            logoutButton
		         ]
		 };
		 
		 var profilDetailForm = {
				 xtype:'profildetailform'
				// html:'///'
				 };
		
		 this.add([prifilDetailCardToolbar, 
		           profilDetailForm
		           ]);
		 },
		 config:{ 
	    	layout: 'fit', // again this layout is important!!
	    },
	    editProfil:function(){
	    	ItbApp.showCommentPopUp('aa');
	    	//alert('laaa')
	    	//alert(Ext.getCmp('PROFIL_FORM').id)
	    	//alert(Ext.getCmp('PROFIL_FORM').disabled)
	    	//Ext.getCmp('PROFIL_FORM').enable();
	    }
});