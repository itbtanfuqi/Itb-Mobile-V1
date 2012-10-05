Ext.define("ItbApp.view.profil.ProfilDetailForm", {
    extend: "Ext.form.Panel",
    xtype: "profildetailform",
    config: {
		layout:'vbox',
		id:'PROFIL_FORM',
		scrollable: {
		    direction: 'vertical',
		    directionLock: true
		},
		disabled:true,
		defaults: {
                        required: false,
                        labelAlign: 'left',
                        labelWidth: '30%',
                        style:{
                        	 'font-size': '0.7em',
                        }
                   },
            items: [
                    {
                        xtype: 'textfield',
                        name : 'CompanyName',
                        label: 'Company'
                    },{
                        xtype: 'textfield',
                        name : 'Division',
                        label: 'Division'
                    },{
                        xtype: 'textfield',
                        name : 'Department',
                        label: 'Dept.'
                    },{
                        xtype: 'textfield',
                        name : 'Title',
                        label: 'Title'
                    },{
                    xtype: 'textareafield',
                    name : 'Street',
                    label: 'Street'
                	},{
                    xtype: 'textfield',
                    name : 'City',
                    label: 'City'
                	},{
                    xtype: 'textfield',
                    name : 'State',
                    label: 'State'
                	},{
                    xtype: 'textfield',
                    name : 'PostalCode',
                    label: 'Postal Code'
                	},{
                    xtype: 'textfield',
                    name : 'Country',
                    label: 'Country'
                   },
                   {
                    xtype: 'emailfield',
                    name : 'Email',
                    label: 'Email'
                },{
                    xtype: 'textfield',
                    name : 'Phone',
                    label: 'Phone'
                },{
                    xtype: 'textfield',
                    name : 'Fax',
                    label: 'Fax'
                },{
                    xtype: 'textfield',
                    name : 'MobilePhone',
                    label: 'Mobile'
                },{
                    xtype: 'textfield',
                    name : 'Alias',
                    label: 'Alias'
                }
            ]
    }
});