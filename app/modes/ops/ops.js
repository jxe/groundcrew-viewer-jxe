App.modes.ops = {
  url_parts: $w('city item'),
  
  show_city: function(state) {
    Viewer.render('show_city');
  },
    
  show_item: function(state) {
    if (This.item.startsWith('Op')) Viewer.render_item('live_event');
  },

  did_add_events: function(state) {
    Viewer.render_item('live_event');
  },

  live_event_info: function (state) {
    return Actions.event_t.tt(This._item.children);
  },
  
  group_interact_form_submitted: function(data, state, form) {
    Operation.group_assign($keys(Selection.current), data.assign, function(operation){
      go('@' + operation.id);
    });
  }
  
};
