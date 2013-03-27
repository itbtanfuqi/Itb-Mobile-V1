Ext.define("ItbApp.view.twitter.twitterList", {
    extend: "Ext.List",
    alias: "widget.twitterlist",
    config: {  
    	id:'TWITTER_LIST',
        scrollable: 'vertical',
        pressedCls: 'white',
        selectedCls: 'white',        
        itemTpl: new Ext.XTemplate(
        	'<div class="t_content"><div class="t_stream-item-header"><div class="time">',
        		'<span class="timestamp">{[this.timeStamp(values.created_at)]}</span></div>',
        		'<a><img class="userImage" src="{userImageHttps}"/><strong class="fullName">{userName}</strong><span class="screenName"> @{screenName}</span></a></div>',
        		'<p class="tweet_text">{text}</p>',
        		'<div class="t_item_footer"><a class="t_detail"></a><ul class="t_action"><li class="t_reply"></li></ul></div>',
        	'</div>',
        	{
        		timeStamp : function(s){
        			//return 'aa'+s;
								var d = Date.parse(s),
									c = new Date(),
									b = c-d;
								b = Math.round(b/1000);//alert(b)
								if(b<60){
									return b +'s';
								}else if(b<3600){// less than 1 hour
									return Math.round(b/60) +'m';
								}else if(b<86400){// less than 24 hour
									return Math.round(b/3600) +'h';
								}else if(b<31536000){// less than 365 day
									return Math.round(b/86400) +'d';
								}else{// large than 1 year
									var y = Math.floor(b/31536000);
									b = Math .round((b%31536000)/3600) ;
									return y+'y'+ b+'d';
								}
							}
        	}
        )
    }
});