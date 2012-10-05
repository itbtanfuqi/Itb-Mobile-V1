Ext.define('ItbApp.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'mainview',
    requires: [
               'ItbApp.view.chatter.Chatter',
               'ItbApp.view.timecard.Timecard',
               //'ItbApp.view.profil.Profil'
           ],
    config: {// sometimes you must include these in config item otherwise ineffective.
    	fullscreen: true,
        tabBarPosition: 'bottom',
        items: [
            {xtype:'chatter'          	
            }, 
            {xtype:'timecard'           	
            }
            /*, 
            {xtype:'profil'           	
           }*/
        ]
   }
});