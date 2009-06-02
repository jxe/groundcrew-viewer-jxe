Actions = {
  
  event_t:
    '<div class="event #{color}">\
     <span class="time">#{when}</span>\
     <a href="#//organize/:city/#{actor_tag}">#{actor_title}</a>\
     #{what}\
     </div>',
     
   chat_t:
     '<li title="#{when}"><a href="#" item="#{actor_tag}">#{actor_title}</a>#{what}</li>'
  
};

LiveHTML.widgets.push({
  
  recent_events: function(state) {
    return Actions.event_t.tt(Annc.all);
  },
  
  latest_chats: function(state) {
    var chats = Anncs.find('=atype said');
    if (chats.length > 9) chats = chats.slice(chats.length - 9);
    return Actions.chat_t.tt(chats);
  },
  
  chat_form_submitted: function(data, state, form) {
    var input = $(form).find('input');
    $.post("/gc/said", {msg: data.msg}, function(x){ 
      input.val('');
      $(form).enable();
      eval(x);
    });
  }
  
});
