//
// Reactor - process server events
// 
//   the server sends us json objects of the form:
//   
//     [  my_current_score, onmap_items, recent_events, new_events ]
//   
//   for the first fetch, there are no new_events, just recent_events
//   for all subsequent fetches, there are no onmap_items or recent_events
//   just new_events.  (some of which may contain changes/additions to 
//   onmap_items.)  GOT IT?
//

Reactor = {

  handle_json_obj: function(obj) {
    
    // handle scores
    var scores = obj[0];
    $('#cheer_ct').html("" + scores[3]);
    $('#team_ct').html("" + scores[1]);
    
    // handle map items
    var items = obj[1];
    if (items.length > 0) 
      ItemDb.add_all(items);
    
    // handle backstory events
    var backstory_events = obj[2];
    if (backstory_events.length > 0) {
      EventDb.install(backstory_events);
      Ajax.since = backstory_events[backstory_events.length - 1].created_at;
    }

    // handle new events
    var new_events = obj[3];
    if (new_events.length > 0)
      EventDb.add_all(new_events);
  }
    
};

// this is the new notification mechanism.
NQueue = {
 
  //RecentHUD, 
  notifications: [
    'did_change_initiatives',
    'did_change_selected_city',
    'did_change_viewer_state'
  ],
  receivers: [],
  needed: false,
  
  fire: function(type) {
    if (!NQueue.needed) {
      NQueue.needed = {};
      setTimeout(NQueue.run, 0);
    }
    NQueue.needed[type] = true;
  },
  
  run: function() {
    if (!NQueue.needed) return;
    var needed = NQueue.needed;
    NQueue.needed = false;
    $.each(NQueue.notifications, function(){
      if (needed[this]) NQueue.receivers.each_call(this);
    });
  }
  
};
