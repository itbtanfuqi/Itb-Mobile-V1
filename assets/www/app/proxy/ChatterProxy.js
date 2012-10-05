Ext.define("ItbApp.proxy.ChatterProxy", {
    extend: "Ext.data.proxy.Rest",
    
    alias: "chatterproxy",
    config:{
    	noCache:true,
        limitParam:undefined,
        pageParam:false,
        appendId: false,
        headers: {'Accept':'application/json'},
        reader: {
                         type: 'json',
                         rootProperty: 'items'
                },
        listeners: {
	        exception : function(proxy, response, operation ){
	            
	        	dumpProps(response, false);
	        }
        }
    }
   /*
    config:{
	    noCache:false,
	    limitParam:undefined,
	    url: 'http://deep-journey-6874.heroku.com/chatterFeed.json',
	    appendId: false,
	    headers: {'Accept':'application/json'},
	    reader: {
	       type: 'json',
	    }
	}*/
});