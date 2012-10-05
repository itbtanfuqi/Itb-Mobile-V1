Ext.define('ItbApp.view.chatter.ChatterListItem', {
    extend: 'Ext.dataview.component.DataItem',
    xtype : 'chatterlistitem',
    
    requires: [
        'Ext.Img'        
    ],

    config: {        
        cls: 'chatter-list-item',
        //cls: 'x-list-item',       
        dataMap: {
            getImage: {                
                setSrc: 'image'
            },
            getListItem: {
                setHtml: 'listitem'
            }
        },
        
        image: {
        	cls: 'actorPhoto',
        	flex:1
        },
        
        listItem: {
            cls: 'x-mylist',
            flex:5
        },      
        layout: {
            type: 'hbox',
            align: 'left'
        }
    },
    updateRecord:function(newRecord){
    	
    	if (!newRecord) {
            return;
        }
        this._record = newRecord;

        var me = this, 
            dataview = me.config.dataview,
            data = dataview.prepareData(newRecord.getData(true), dataview.getStore().indexOf(newRecord), newRecord),
            items = me.getItems(),
            item = items.first(),
            dataMap = me.getDataMap(),
            componentName, component, setterMap, setterName;
       // in this case,dataview is the chatterList
       // data is just one piece of data record json.
       // dumpProps(data);
       // alert(item);
        if (!item) {
            return;
        }
        for (componentName in dataMap) { //componentName is the getter key, e.g. getMyButton
            setterMap = dataMap[componentName]; //setterMap is the getter value, e.g. { setHtml: 'name'}
            component = me[componentName](); // component is the result of this.getMyButton(),so it is the Current component you are adding
            //dumpProps(setterMap);
           // dumpProps(me[componentName]());// it is the components you want to add
            if (component) {
                for (setterName in setterMap) { 
                    if (component[setterName]) {
                        //component[setterName](data[setterMap[setterName]]);
                        //well here is just like:
                        // myButton[setText],i.e. myButton.setText(...);
                        //data[setterMap[setterName]],i.e. data['text'], so just take 'text'field of record.
                        //!! so just need to overwrite this line.
                    	if(setterMap[setterName]==='image'){// if data field is 'image'
                    		if(data['type']!== 'TrackedChange'){ 
                    			component[setterName](data['parentPhotoSmallPhotoUrl']+'?oauth_token='+ItbAppUtil.accessToken);
                    		}
                    	}else if(setterMap[setterName]==='listitem'){ //if data field name is 'name'                    		
                    		var group_type,createDate,actorName;
                    		if(data['parentType']==='CollaborationGroup'){
                    			group_type='(News)';
                    		}else{
                    			group_type='('+data['parentType']+')';
                    		}
                    		createDate=data['createdDate'];// we can format createDate here
                    		if(createDate) createDate = createDate.substring(0,16).replace('T',' ');
                    		if(data['type']!== 'TrackedChange'){
                    			actorName=data['actorName'];
                    		}else{
                    			actorName='';
                    		}
                    		//dumpProps(data);
                    		//dumpProps(data.comments.comments);
                    		var k,v,
                    		listitem_string='<div class="chatterMain"><div><span class="actorInfo">'+actorName+'</span><span class="post_body">'+data['bodyText']
                    			+'</span></div><div class="chatterTime">'+createDate+'</div>'
                    			+'<a onclick="ItbApp.showCommentPopUp(\''+data['id']+'\')" class="commentLink">Comment</a><a class="commentLink" href="#" onclick="ItbApp.likeComment(\''+data['id']+'\')">Like</a>'                                   
                                + (data['likesTotal']?'<div class="like">Likes: '+data['likesTotal']+'</div>':'') 
                                + '<div class="cmt_bar">'+ data.comments.total +' Comments now.</div></div>'  
                                
                            /*
                            if(data.comments.total == 0){
                            	listitem_string += '<div class="cmt_bar">No Comments now.</div>';
                            }else{
                            	listitem_string +='<a href="#" class="x-button cmt_bar" onclick="ItbApp.hideComment(this);return false;" style="display:none;">Hide Comments</a><a href="#" class="x-button cmt_bar" onclick="ItbApp.showComment(this);return false;">Show All '
                                + data.comments.total+' Comments</a><div style="display:none;">';
                            }
                                 //if(data.comments.comments) {alert('get commt');dumpProps(data['comments.comments']);}
                            for(k in data.comments.comments){
                            	v = data.comments.comments[k];
                            	listitem_string += '<div><span><img class="cmtPhoto" src="'+v.user.photo.smallPhotoUrl+'?oauth_token='+ItbAppUtil.accessToken
	                                +'"/></span><div class="cmtBody"><span class="actorInfo">'+v.user.name
                        			+ '</span><span class="bodyText">'+ v.body.text 
                        			+ '</span><br/><span class="chatterTime">'+v['createdDate'].substring(0,16).replace('T',' ')
                        			+ (v.clientInfo? '<br/>from '+v.clientInfo.applicationName:'')+'</span></div></div>';
                            }                                          
                            listitem_string+= '</div>';
                    		*/
                    		//component[setterName](data[setterMap[setterName]]+'<b>good...</b>');
                    		component[setterName](listitem_string);
                    	}
                    	
                    	
                    	
                    }
                }
            }
        }

        
        me.fireEvent('updatedata', me, data);

        // Bypassing setter because sometimes we pass the same object (different properties)
        item.updateData(data);
    },
    /**
     * @private
     */
    applyImage: function(config) {
        return Ext.factory(config, Ext.Img, this.getImage());
    },
    /**
     * @private
     */
    updateImage: function(newImage, oldImage) {
        if (newImage) {
            this.add(newImage);
        }

        if (oldImage) {
            this.remove(oldImage);
        }
    },
    /**
     * @private
     */
    applyListItem: function(config) {
        return Ext.factory(config, Ext.Component, this.getListItem());
    },
    /**
     * @private
     */
    updateListItem: function(newName, oldName) {
        if (newName) {
        	this.add(newName);
        }

        if (oldName) {
            this.remove(oldName);
        }
    }
}); 

