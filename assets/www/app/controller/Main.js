Ext.define("ItbApp.controller.Main", {

    extend: "Ext.app.Controller",
    config: {
        refs: {
            // We're going to lookup our views by xtype.
            chatterView: "chatterlistcard"
        },
        control: {
            chatterView: {
                // The commands fired by the events defined in the view.
                postButtonTap: "onPostButton"
            }
        }
    },

    // Commands.
    
    onPostButton: function (list, record) {
		Ext.getCmp('CHATTER').setActiveItem(1);        
    },
    // Base Class functions.
    launch: function () {
        this.callParent(arguments); 
        console.log("launch");
    },
    init: function () {
        this.callParent(arguments);
        console.log("init");
    }
});