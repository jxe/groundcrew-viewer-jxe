RecentHUD = {
  
  state: 'closed',
  // types: ['assignments', 'reports', 'events'],
  // type: 'reports',
  // events: [],
  
  // filter_events: function() {
  //   if (RecentHUD.type == 'events') return RecentHUD.events = EventDb.events;
  //   var events = [];
  //   $.each(EventDb.events, function(){ if (RecentHUD.belongs(this)) events.push(this); });
  //   RecentHUD.events = events;
  // },
  // 
  // belongs: function(event) {
  //   if (RecentHUD.type == 'events') return true;
  //   switch(RecentHUD.type) {
  //     case 'assignments':
  //       return (event.atype == 'assignment' || event.atype == 'accepted');
  //     case 'reports':
  //       return (event.atype == 'report' || event.atype == 'msg' || event.atype == 'assignment' || event.atype == 'accepted');
  //   }
  //   alert("impossible to get here.");
  // },  
  
  toggle_open_closed: function() {
    if (RecentHUD.state == 'open') {
      RecentHUD.state = 'closed';
      $('#recent_content').slideUp(100);
    } else {
      RecentHUD.state = 'open';
      var html = RecentHUD.html_for(EventDb.events);
      $('#recent_content').html(html).blit().slideDown(100);
    }
  },
  
  html_for: function(events) {
    var html = '';
    $.each(events, function(){
      Event.improve(this);
      html += RecentHUD.event_t.t(this);
    });
    return html;
  },
  
  event_t:
    '<div class="event #{color}">\
     <span class="time">#{when}</span>\
     <a href="#" item="#{actor_tag}">#{actor_name}</a>\
     #{what}\
     </div>'

};
