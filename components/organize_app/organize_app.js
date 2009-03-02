Viewer.apps.organize = {
  url_part_labels: $w('squad city item mode'),

  marker_clicked: function(tag, state) {
    squad = state.squad || 'your_personal_squad';
    Viewer.go('/organize/'+ squad +'/:city/' + tag);
  },

  show_mode: function (state) {
    Viewer.render_item(state.mode);
  },

  show_item: function(state) {
    if (state.item.startsWith('Person'))   Viewer.render_item('organize_agent', 16);
    if (state.item.startsWith('Landmark')) Viewer.render_item('organize_landmark');
  },

  send_assignment_form_submitted: function(data, state) {
    // Ajax.fetch('/gc/invite', {invitation:data}, function(ev){
    // EventDb.watch[ev.landmark_tag] = ev.annc_tag;
  },
  
  on_new_event: function(event) {
    if (!this.state.item || !event.re || !EventDb.by_tag[re]) return;

    // are we displaying it's parent right now?
    if (this.state.item == EventDb.by_tag[event.re].landmark_tag) {
      Ajax.post_process_new_events['update_current_watched_event'] = function(){ Viewer.render_item('live_event'); };
    }
  },
  
  
  item_status: function(state)     { return "This agent is available."; },
  item_believesin: function(state) { return " "; },
  item_celebrates: function(state) { return " "; },
  item_helpwith: function(state)   { return " "; },
  item_didrecent: function(state)  { return " "; },

  everyone_will: function(state) {
    return "Touch your nose/Smile mischeviously/Make hand signals/Caress yourself/Hum quietly/Look mysterious".split('/').map(function(x){
      return "<option>" + x + "</option>";
    }).join('');
  },

  live_event_info: function (state) {
    var parent_annc_tag = EventDb.watched[state.item];
    if (!parent_annc_tag) return 'No event!';

    // TODO: this should not go thru all events.  instead, update a DB on
    // event()
    return EventDb.events.map(function (ev) {
      if (ev.re != parent_annc_tag && ev.annc_tag != parent_annc_tag) return;
      Event.improve(ev);
      return Templates.event.t(ev);
    }).compact().join('');
  }
};
