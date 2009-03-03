EventsPalette = {
  
  event_t:
    '<div class="event #{color}">\
     <span class="time">#{when}</span>\
     <a href="#" item="#{actor_tag}">#{actor_title}</a>\
     #{what}\
     </div>'
  
}


LiveHTML.widgets.push({
  
  recent_events: function(state) {
    return EventsPalette.event_t.tt(EventDb.events);
  }
  
});
