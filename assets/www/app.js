Ext.application({
    name: "ItbApp",

    models: ["Chatter"],
    stores: ["Chatter"],
    controllers: ["Main"],
   
    views: [//"NotesList","ChatterList",//"ChatterListCard","ChatterFormCard",
            "Main" ,
         //   "Chatter"
            ],
	
    launch: function () {
    	
    	var mainView = {           
        		xtype:'mainview'        		
        };       
		
        Ext.Viewport.add(mainView); //alert('19 before store load');
        //ItbApp.store.chatterStore.load({
        	
       // });
       //alert('23 before login');
       ItbAppUtil.login();
       /*
       ItbApp.store.chatterStore.setData([
       	{"parent":{"name":"News Digital","description":"T-Online news","visibility":"PublicAccess","memberCount":5,"canHaveChatterGuests":false,"mySubscription":{"id":"0FBD00000000laUOAQ","url":"/services/data/v23.0/chatter/group-memberships/0FBD00000000laUOAQ"},
       	"myRole":"StandardMember","photo":{"largePhotoUrl":"https://c.eu1.content.force.com/profilephoto/0F9/F","smallPhotoUrl":"https://c.eu1.content.force.com/profilephoto/0F9/T"},
       	"id":"0F9D000000008daKAA","url":"/services/data/v23.0/chatter/groups/0F9D000000008daKAA","type":"CollaborationGroup"},
       	"id":"0D5D000000PlzQbKAJ","type":"LinkPost","clientInfo":null,"url":"/services/data/v23.0/chatter/feed-items/0D5D000000PlzQbKAJ","body":{"text":"Aldi verkauft g\u00fcnstiges 17-Zoll-Notebook \n  Das taugt der neue Discounter-PC.",
       	"messageSegments":[{"type":"Text","text":"Aldi verkauft g\u00fcnstiges 17-Zoll-Notebook \n  Das taugt der neue Discounter-PC."}]},
       	"createdDate":"2012-01-18T15:21:01.000Z","modifiedDate":"2012-01-18T15:21:01.000Z","photoUrl":"https://c.eu1.content.force.com/profilephoto/005/T",
       	"comments":{"total":2,"comments":[{id:'aa',user:{name:'zhangsan',companyName:'itb',photo:{smallPhotoUrl:'abc.com'}},clientInfo:{applicationName:'itbDemo'},body:{text:'aaa'}},{
       		id:'bb',user:{name:'lisi',companyName:'itb',photo:{smallPhotoUrl:'abc.com'}},clientInfo:{applicationName:'itbDemo'},body:{text:'bbb'}
       	}],"nextPageUrl":null,"currentPageUrl":"/services/data/v23.0/chatter/feed-items/0D5D000000PlzQbKAJ/comments"},
       	"likes":{"total":0,"likes":[],"myLike":null,"nextPageUrl":null,"currentPageUrl":"/services/data/v23.0/chatter/feed-items/0D5D000000PlzQbKAJ/likes","previousPageUrl":null},
       	"isLikedByCurrentUser":false,"currentUserLike":null,"actor":{"name":"Maic Stohr","title":null,"firstName":"Maic","lastName":"Stohr","companyName":"ITBconsult","mySubscription":null,
       	"photo":{"largePhotoUrl":"https://c.eu1.content.force.com/profilephoto/005/F","smallPhotoUrl":"https://c.eu1.content.force.com/profilephoto/005/T"},"isChatterGuest":false,
       	"id":"005D0000001WhpaIAC","url":"/services/data/v23.0/chatter/users/005D0000001WhpaIAC","type":"User"},"event":false,"attachment":{"title":"Aldi: 17-Zoll-Notebook f\u00fcr 549 Euro","url":"http://computer.t-online.de/aldi-notebook-medion-akoya-p7624-ab-19-januar-fuer-549-euro/id_53278220"}},
       	{"parent":{"name":"News Digital","description":"T-Online news","visibility":"PublicAccess","memberCount":5,"canHaveChatterGuests":false,"mySubscription":{"id":"0FBD00000000laUOAQ",
       	"url":"/services/data/v23.0/chatter/group-memberships/0FBD00000000laUOAQ"},"myRole":"StandardMember","photo":{"largePhotoUrl":"https://c.eu1.content.force.com/profilephoto/0F9/F",
       	"smallPhotoUrl":"https://c.eu1.content.force.com/profilephoto/0F9/T"},"id":"0F9D000000008daKAA","url":"/services/data/v23.0/chatter/groups/0F9D000000008daKAA","type":"CollaborationGroup"},
       	"id":"0D5D000000PlzQaKAJ","type":"LinkPost","clientInfo":null,"url":"/services/data/v23.0/chatter/feed-items/0D5D000000PlzQaKAJ",
       	"body":{"text":"Word-Seitenformate kombinieren\n  Eine Seite hochkant, die n\u00e4chste quer.","messageSegments":[{"type":"Text","text":"Word-Seitenformate kombinieren\n  Eine Seite hochkant, die n\u00e4chste quer."}]},
       	"createdDate":"2012-01-18T15:21:01.000Z","modifiedDate":"2012-01-18T15:21:01.000Z","photoUrl":"https://c.eu1.content.force.com/profilephoto/005/T",
       	"comments":{"total":2,"comments":[{id:'cc',user:{name:'wangwu',companyName:'itb',photo:{smallPhotoUrl:'abc.com'}},clientInfo:{applicationName:'itbDemo'},body:{text:'ccc'}},
       	{id:'dd',user:{name:'zhaoliu',companyName:'itb',photo:{smallPhotoUrl:'abc.com'}},clientInfo:{applicationName:'itbDemo'},body:{text:'ddd'}}       	
       	],"nextPageUrl":null,"currentPageUrl":"/services/data/v23.0/chatter/feed-items/0D5D000000PlzQaKAJ/comments"},
       	"likes":{"total":0,"likes":[],"myLike":null,"nextPageUrl":null,"currentPageUrl":"/services/data/v23.0/chatter/feed-items/0D5D000000PlzQaKAJ/likes",
       	"previousPageUrl":null},"isLikedByCurrentUser":false,"currentUserLike":null,"actor":{"name":"Maic Stohr","title":null,"firstName":"Maic",
       	"lastName":"Stohr","companyName":"ITBconsult","mySubscription":null,"photo":{"largePhotoUrl":"https://c.eu1.content.force.com/profilephoto/005/F",
       	"smallPhotoUrl":"https://c.eu1.content.force.com/profilephoto/005/T"},"isChatterGuest":false,"id":"005D0000001WhpaIAC","url":"/services/data/v23.0/chatter/users/005D0000001WhpaIAC","type":"User"},
       	"event":false,"attachment":{"title":"Word: Seitenformate hoch und quer mischen","url":"http://computer.t-online.de/word-seitenformate-hoch-und-quer-mischen-office-tipp/id_53014144"}}
       ]);
       */
       //alert( ItbApp.store.chatterStore.getCount())
      // Ext.getCmp('CHATTER_LIST').refresh();
       //dumpProps( ItbApp.store.chatterStore);
    },
    
   onLogoutButtonTap:function(){
   		Ext.Msg.alert('will log out');
   }
});