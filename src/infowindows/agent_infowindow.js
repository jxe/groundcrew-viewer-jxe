AgentIW = {

  blit_bio: function(bio) {
    var x = MapMarkers.iw_item;
    bio.fillout({
      "#agent_iw_liked"          : x.liked_list || "<li><i>loading</i></li>",
      "#agent_iw_noliked"        : x.noliked_list || "<li><i>loading</i></li>",
      "#agent_iw_upfor"          : x.upfor,
      'a.extlink //href'         : '/agent/' + x.id      
    });
    if (x.liked_list) return;
            
    Ajax.fetch('/agent/taste_json', { dude: x.item_tag }, function(obj){
      var listify = function(list) {
        if (list.length == 0) return "<li><i>none</i></li>";
        list = list.slice(0, 4);
        return list.map(function(x){ return "<li>" + x + "</li>"; }).join('');
      };

      x.liked_list = listify(obj[0]);
      x.noliked_list = listify(obj[1]);
      AgentIW.blit_bio(bio);
    });
  },

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
      
  asDOMObj: function(x) {
    var m;
    if (m = MessageIW.asDOMObj(x)) return m;

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
            
    return $.template('#agent_iw_template').showhide({
      '#agent_iw_current_stanza' : x.current_assignment,
      '#agent_iw_assign_stanza'  : assign_prompt,
      '#agent_iw_free_stanza'    : show_free,
      '#activate_stanza'         : x.status == 'off' && !Tour.current || Tour.current.mode != 'suggest'
    }).fillout({
      '#agent_iw_name'           : x.title,
      'div.report'               : x.recent_report || (x.pgoal && "<b>looking for</b>: " + x.pgoal),
      '.last_heard'              : last_heard_from,
      'img#headshot //src'          : x.thumb_url,
      '#agent_iw_assign_prompt'  : assign_prompt,
      '#agent_iw_assignment'     : x.current_assignment
    }).clicks({
      '#agent_iw_free'           : AgentIW.free_agent,
      '#agent_iw_activate'       : AgentIW.activate
    }).forms({
      "#assignment_submit_form"  : AgentIW.send_msg
    }).blit()[0];
  }

};

  // off:       '<a href="#" item="#{item_tag}" class="activate button">activate this agent</a>',
