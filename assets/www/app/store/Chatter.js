Ext.define("ItbApp.store.Chatter", {
    extend: "Ext.data.Store",
    requires:["ItbApp.model.Chatter","ItbApp.proxy.ChatterProxy"],
    chatterGroupId:'me',
    config: {
    	model: "ItbApp.model.Chatter", 
    	//proxy: (new ItbApp.proxy.ChatterProxy()),
        autoLoad: false,
        sorters: [{ property: 'dateCreated', direction: 'DESC'}],
		listeners: {
				beforeload:function(store,operation){ alert('begin load')
					if(!store.getProxy().config.extraParams||!store.getProxy().config.extraParams.userId)
						store.setProxy(new ItbApp.proxy.ChatterProxy());
					
						if (forcetkClient.proxyUrl !== null) {
                            store.getProxy().getHeaders()['SalesforceProxy-Endpoint'] = ''; // TODO SET URL
                        }
                        store.getProxy().getHeaders()[forcetkClient.authzHeader] = "OAuth " + forcetkClient.sessionId;
                        store.getProxy().getHeaders()['X-User-Agent'] = 'salesforce-toolkit-rest-javascript/' + forcetkClient.apiVersion;
                        if (forcetkClient.userAgentString !== null) {
                            store.getProxy().getHeaders()['User-Agent'] = forcetkClient.userAgentString;
                        }                        
                        store.getProxy().setExtraParam('userId', ItbAppUtil.sfdcUserId);                      
                        store.getProxy().setUrl(forcetkClient.instanceUrl + '/services/data/v23.0/chatter/feeds/news/me/feed-items');
                        //alert('dump proxy');
                        //dumpProps(store.getProxy());
                        //store.getProxy().setUrl(forcetkClient.instanceUrl + '/services/data' + '/' + forcetkClient.apiVersion + '/chatter/feeds/groups/' + 'me' + '/feed-items');
                     },
                     metachange:function( store, data, eOpts ){
                     	dumpProps(data);
                     },
					load:function(store, records, successful){
						//Ext.getCmp('CHATTER_LIST').refresh();
						alert('store count:'+store.getCount());
						//dumpProps(records);
					}
				} 
    }
});