Ext.define("ItbApp.model.ChatterComments", {
    extend: "Ext.data.Model",
    config: {/*
    	fields: [
        {name: 'id', type:'string'},
        {name: 'bodyText', mapping:'body.text', type:'string'},//
        {name: 'cmtPhotoUrl', mapping:'user.photo.smallPhotoUrl', type:'string'},//
        {name: 'createdDate', type:'string'},//
        {name: 'userName', mapping:'user.name', type:'string'},//
       // {name: 'likes', type: 'auto'},///
        {name: 'appName', type: 'clientInfo.applicationName'},//     	
    ]*/
    fields: [
         'id',
        'bodyText',//
        'cmtPhotoUrl',//
        'createdDate',//
        'userName',//
       // {name: 'likes', type: 'auto'},///
       'appName',//
       'accessToken' 	
    ]
    }
});