Ext.define("ItbApp.model.Chatter", {
    extend: "Ext.data.Model",
    config: {
    	fields: [
        {name: 'id', type:'string'},
        {name: 'bodyText', mapping:'body.text', type:'string'},
        {name: 'type', mapping:'type', type:'string'},
        {name: 'parentPhotoSmallPhotoUrl', mapping:'parent.photo.smallPhotoUrl', type:'string'},
        {name: 'createdDate', type:'string'},
        {name: 'actorName', mapping:'actor.name', type:'string'},
        {name: 'comments', type: 'auto'},
        {name: 'commentsTotal', mapping: 'comments.total', type: 'int'},
        {name: 'likes', type: 'auto'},///
        {name: 'likesTotal', mapping: 'likes.total', type: 'int'},
        {name: 'actor', type: 'auto'},
        {name: 'body', type: 'auto'},
        {name: 'parent', type: 'auto'},
        {name: 'parentName', mapping: 'parent.name'},
        {name: 'parentType', mapping: 'parent.type'},
     	{name: 'attachment', mapping: 'attachment'},
     	{name: 'accessToken',type: 'auto'}
    ],
    }
});