Ext.define("ItbApp.store.ChatterComments", {
    extend: "Ext.data.Store",
    requires:["ItbApp.model.ChatterComments"],
    config: {    	
    	model: "ItbApp.model.ChatterComments", 
        autoLoad: false,
        sorters: [{ property: 'createdDate', direction: 'DESC'}],
    }
});