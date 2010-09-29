Actions = {

  event_t:
    '<div class="event clearfix #{color}">\
     <img href="#@#{actor_tag}" class="athumb" src="#{actor_thumb_url}" title="#{actor_title}"/>\
     <div class="text">\
       <a href="#@#{actor_tag}" class="actor">#{actor_title}</a>\
       #{what}\
       <span class="ts">#{when}</span>\
     </div></div>',

  op_t:
    '<div class="event clearfix">\
     <img class="athumb" src="#{thumb_url}"/>\
     <div class="text">\
       #{what}\
       <span class="ts">#{when}</span>\
     </div></div>',

  chat_t:
     '<li title="#{when}"><b>#{actor_title}</b>#{what}</li>',

  activity_divs: function(activity) {
    var divs = [];
    var prev_time = null;
    $.each(activity, function(){
      var time = Actions.relative_time(this.created_ts);
      if (time != prev_time) {
        divs.push(tag('div.time.divider', time));
        prev_time = time;
      }
      var template = this.id.resource_type() == 'Op' ? Actions.op_t : Actions.event_t;
      divs.push(template.t(this));
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

go.push({
  recent_activity: function() {
    var activity;
    if (!This.activity_filter || This.activity_filter == 'all') {
      activity = Anncs.everything().concat(Ops.everything());
    }
    else if (This.activity_filter == 'op') {
      activity = Ops.everything();
    }
    else if (This.activity_filter == 'msgs') {
      activity = Anncs.find('=atype pm|msg');
    }
    else {
      activity = Anncs.find('=atype ' + This.activity_filter);
    }
    activity = activity.sort_by('.created_ts', { order: 'desc' });
    if (activity.length > 500) activity = activity.slice(0, 500);
    $.each(activity, function(){ (this.id.resource_type() == 'Op' ? Operation : Event).improve(this); });

    return Actions.activity_divs(activity);
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
