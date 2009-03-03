Chat = { 
  chats: [],

  chat_t:
    '<li title="#{when}"><a href="#" item="#{actor_tag}">#{actor_title}</a>#{what}</li>',
  
};

LiveHTML.widgets.push({
  
  latest_chats: function(state) {
    if (Chat.chats.length > 9) Chat.chats = Chat.chats.slice(Chat.chats.length - 9);
    return Chat.chat_t.tt(Chat.chats);
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
