Actions = {
  
  event_t:
    '<div class="event #{color}">\
     <span class="time">#{when}</span>\
     <a href="#@#{actor_tag}">#{actor_title}</a>\
     #{what}\
     </div>',
     
   chat_t:
     '<li title="#{when}"><b>#{actor_title}</b>#{what}</li>'
  
};

go.push({
  
  recent_events: function(state) {
    $.each(Anncs.all, function(){ Event.improve(this); });
    return Actions.event_t.tt(Anncs.all.grep(function(x){ return x && x.atype != 'chat'; }).reverse());
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
