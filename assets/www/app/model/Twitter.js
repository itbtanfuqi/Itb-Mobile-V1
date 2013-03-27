Ext.define("ItbApp.model.Twitter", {
    extend: "Ext.data.Model",
    config: {
    	//id:'TWITTER_MODEL',
    	fields: [
        {name: 'id', type:'string'},
        {name: 'created_at', type:'string'},
        {name: 'text', type:'string'},
        {name: 'userName',  type:'string'},
        {name: 'screenName',  type:'string'},
        {name: 'userImageHttps', type:'string'},
        {name: 'userImage', type:'string'}
    ],
    }
});