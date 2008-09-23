String.prototype.singularize = function(){
  return this.replace(/s$/, '');
};

String.prototype.indef_article = function(){
  var vowels = 'aeiouAEIOU';
  var first_letter = this[0];
  if (vowels.indexOf(first_letter) >= 0) {
    return "an " + this;
  } else {
    return "a " + this;
  }
};


AgentIW = {

  contact: function(options) {
    // should grey out infowindow
    options.item = MapMarkers.iw_item.item_tag;
    if (Tour.current && Tour.current.atag) options.topic = Tour.current.atag;
    Ajax.fetch('/agent/contact', options, EventDb.add);
  },
  
  free_agent: function() {
    AgentIW.contact({ new_state: 'free' });
  },
  
  activate: function() {
    if (!logged_in) return Viewer.join_please();
    AgentIW.contact({ new_state: 'requested' });
  },
  
  send_msg: function(form) {
    if (!logged_in) return Viewer.join_please();
    AgentIW.contact({
      new_state: 'assigned',
      msg: $(form).find(':text').val()     
    });
  },
  
  render_liked: function(list) {
    if (list.length == 0) return "<li><i>none</i></li>";
    list = list.slice(0, 4);
    return list.map(function(x){ return "<li>" + x + "</li>"; }).join('');
  },
  
  likes_and_dislikes: {},
  
  start_background_fetch: function(domObj) {
    var dude = MapMarkers.iw_item.item_tag;
    var cached = AgentIW.likes_and_dislikes[dude];
    if (cached) {
      domObj.fillout({
        "#agent_iw_liked"          : AgentIW.render_liked(cached[0]),
        "#agent_iw_noliked"        : AgentIW.render_liked(cached[1])
      });
    } else {
      Ajax.fetch('/agent/taste_json', { dude: dude }, function(obj){
        AgentIW.likes_and_dislikes[dude] = obj;
        domObj.fillout({
          "#agent_iw_liked"          : AgentIW.render_liked(obj[0]),
          "#agent_iw_noliked"        : AgentIW.render_liked(obj[1])
        });
      });
    }    
  },
    
  asDOMObj: function(x) {
    var m = MessageIW.asDOMObj(x);
    if (m) return m;

    Item.calculate_fields(x);
    var assign_prompt = null;
    var show_free = false;
    if (x.status == 'available') {
      assign_prompt = "WHAT WOULD YOU LIKE THIS AGENT TO DO?";
    } else if (x.status == 'off' && x.highlighted && Tour.current && Tour.current.atag) {
      assign_prompt = "DO YOU HAVE <b>" + atag_desc(Tour.current.atag).singularize().indef_article().toUpperCase() + "</b> FOR THIS AGENT?";
    } else if (x.status == 'busy' && !x.locked) {
      assign_prompt = "SEND AN ADDITIONAL MESSAGE";
      show_free = true;
    }
    
    var last_heard_from = null;
    if (x.last_heard_from_at) {
      last_heard_from = "last active "+ $long_ago(x.last_heard_from_at) + " ago";
    }
    
    var landmarks = LandmarkDb.landmarks_by_city[Viewer.selected_city];
    landmarks = landmarks && landmarks.length > 0 && landmarks.length;
    
    domObj = $.template('#agent_iw_template').fillout({
      "#agent_iw_liked"          : "<li><i>loading</i></li>",
      "#agent_iw_noliked"        : "<li><i>loading</i></li>"
    });

    AgentIW.start_background_fetch(domObj);
        
    return domObj.showhide({
      '#agent_iw_current_stanza' : x.current_assignment,
      '#agent_iw_assign_stanza'  : assign_prompt,
      '#agent_iw_free_stanza'    : show_free,
      '#activate_stanza'         : x.status == 'off' && !Tour.current || Tour.current.mode != 'suggest',
      '#agent_iw_nearby'         : ItemDb.agents_by_city[Viewer.selected_city].length > 1,
      '#lmark_nearby'           : landmarks
    }).fillout({
      'a.extlink //href'         : '/agent/' + x.id,
      '#agent_iw_name'           : x.title,
      'div.report'               : x.recent_report || (x.pgoal && "<b>looking for</b>: " + x.pgoal),
      '#lmark_nearby_count'     : landmarks,
      '.last_heard'              : last_heard_from,
      'img#headshot //src'          : x.thumb_url,
      '#agent_iw_assign_prompt'  : assign_prompt,
      '#agent_iw_assignment'     : x.current_assignment,
      "#agent_iw_upfor"          : x.upfor,
      "#agent_iw_nearby_count"   : (ItemDb.agents_by_city[Viewer.selected_city].length - 1),
      '#lmark_choices' : City.landmarks_list()
    }).clicks({
      "#agent_iw_nearby"         : Tour.local,
      '#agent_iw_free'           : AgentIW.free_agent,
      '#agent_iw_activate'       : AgentIW.activate,
      '#what_like' : function(){
        $('#agtitle').click();
        return false;
      }
    }).forms({
      "#assignment_submit_form"  : AgentIW.send_msg
    }).viewer_links().popups()[0];
  }

};

  // off:       '<a href="#" item="#{item_tag}" class="activate button">activate this agent</a>',
