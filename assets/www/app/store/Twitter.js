Ext.define("ItbApp.store.Twitter", {
    extend: "Ext.data.Store",
    requires:["ItbApp.model.Twitter"],
    config: {	
    	model: 'ItbApp.model.Twitter', 
        autoLoad: false,
        sorters: [{ property: 'created_at', direction: 'DESC'}],
        listeners:{
        	beforeload:function(store,operation){ 
        		alert('before')
        	},
        	load:function(store, records, successful){
        		alert('after')
        	}
        }
    }
});