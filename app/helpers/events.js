// placeholder
Chats = [];
var last_msg = null;
var last_when = null;
function rem(who, when, what, oids, msg, title){
  if (last_msg == msg && last_when == when) return;
  last_msg = msg;
  last_when = when;
  
  if (who) who = who.replace(/^/, 'Person__');
  title = title || (who && who.resource() && who.resource().title) || 'Unknown Organizer';
  if (what == "chat") Chats.push({ actor_title: title, actor_tag: who, what: msg, when: when });
};

Actions = {
  
  event_t:
    '<div class="event #{color}">\
     <span class="time">#{when}</span>\
     <a href="#@#{actor_tag}">#{actor_title}</a>\
     #{what}\
     </div>',
     
   chat_t:
     '<li title="#{when}"><b>#{actor_title}</b>: #{what}</li>'
  
};

LiveHTML.widgets.push({
  
  recent_events: function(state) {
    $.each(Anncs.all, function(){ Event.improve(this); });
    return Actions.event_t.tt(Anncs.all.slice(0).reverse());
  },
  
  latest_chats: function(state) {
    if (Chats.length > 9) Chats = Chats.slice(Chats.length - 9);
    return Actions.chat_t.tt(Chats);
  },
  
  chat_form_submitted: function(data, state, form) {
    var input = $(form).find('input');
    $.post("/api/remark", {kind: 'chat', msg: data.msg}, function(x){ 
      input.val('');
      $(form).enable();
      eval(x);
      $('#chat_palette').app_paint();
    });
    return "redo";
  }
  
});
