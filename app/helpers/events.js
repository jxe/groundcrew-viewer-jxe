Actions = {

  event_t:
    '<div class="event clearfix #{color}">\
     <img href="#@#{actor_tag}" class="athumb" src="#{actor_thumb_url}" title="#{actor_title}"/>\
     <div class="text">\
       <a href="#@#{actor_tag}">#{actor_title}</a>\
       #{what}\
       <span class="ts">#{when}</span>\
     </div></div>',

  chat_t:
     '<li title="#{when}"><b>#{actor_title}</b>#{what}</li>',

  event_divs: function(events) {
    var divs = [];
    var prev_time = null;
    $.each(events, function(){
      var time = Actions.relative_time(this.created_at);
      if (time != prev_time) {
        divs.push(tag('div.time.divider', time));
        prev_time = time;
      }
      divs.push(Actions.event_t.t(this));
    });
    return divs.join('');
  },

  relative_time: function(ts) {
    if      (Date.within(ts, 60 * 5))               return "Just now";
    else if (Date.within(ts, 60 * 60))              return "Last hour";
    else if ($is_today(ts))                         return "Today";
    else if ($is_yesterday(ts))                     return "Yesterday";
    else if (Date.within(ts, 60 * 60 * 24 * 7))     return "Last 7 days";
    else if (Date.within(ts, 60 * 60 * 24 * 7 * 2)) return "Last 2 weeks";
    else                                            return "2+ weeks ago";
  }
};

go('event_filter=all');

go.push({
  recent_events: function() {
    var type = This.event_filter;
    if (This.event_filter == 'all') type = null;
    else if (This.event_filter == 'msgs') type = 'pm|msg';

    return Actions.event_divs(Events.events(type));
  },
  
  latest_chats: function(state) {
    if (Chats.length > 9) Chats = Chats.slice(Chats.length - 9);
    return Actions.chat_t.tt(Chats);
  },
  
  note_form_submitted: function(data, state, form) {
    if (!data.msg || data.msg.length == 0) return "redo";
    var input = $(form).find('input');
    data.type = 'note';
    data.venture = This.item;
    data.city = This.city_id;
    Event.post(data, function(x) {
      input && input.val('');
      $(form).enable();
      $('#op_for_any_mode').app_paint();
    });
    return "redo";
  },

  chat_form_submitted: function(data, state, form) {
    if (!data.msg || data.msg.length == 0) return "redo";
    var input = $(form).find('input');
    data.type = 'chat';
    Event.post(data, function(x) {
      input && input.val('');
      input && input.blur();
      $(form).enable();
      $('#chat_palette').app_paint();      
    });
    return "redo";
  }
  
});
