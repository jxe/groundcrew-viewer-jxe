EventDb = {
  
  events: [],

  add_all: function(new_events) {
    Ajax.since = new_events[new_events.length - 1].created_at;
    $.each(new_events, function(){ EventDb.add(this); });
  },
  
  add: function(e) {
    e.item = e.item_doc && eval("x = " + e.item_doc);
    EventDb.new_event(e);
    if (          e.atype == 'off')  Agents.remove(e.item_tag);
    if (e.item && e.atype != 'off')  Resource.add_or_update(e.item);
  },
  
  install: function(events) {
    EventDb.events = events;
    $.each(events, function(){ Gatherings.did_add_new_event(this); });
    Ajax.since = events[events.length - 1].created_at;
  },

  new_event: function(event) {
    EventDb.events.push(event);
    EventDb.annc(event);
  },
  
  //
  // private
  //
  
  annc: function(event) {
    Gatherings.did_add_new_event(event);
    Notifier.did_add_new_event(event);
    Chat.did_add_new_event(event);
  }
  
};
