Chat = {

  // the first time chat is clicked, it should find out if there are recent chats
  // and populate itself
  chats: [],
  
  wire: function() {
    $('#chatbutton').click(function(){
      $('#chatter, #talker').toggle();
      $('#talker input').val("type here to chat with others");
      if (Chat.chats.length == 0) Chat.init();
      return false;
    });
    $('#talker input').focus(function(){
      $(this).val('');
    });
    $('#talker input').keypress(function(e){
      if (e.which == 13) {
        var msg = $(this).val();
        Ajax.load('/gc/said', {msg: msg});
        $('#talker input').val('');
        return false;
      }
      return true;
    });
    
  },
  
  init: function() {
    $.each(EventDb.events, function(){ if (this.atype == 'said') Chat.chats.push(this); });
    Chat.update();
  },
  
  did_add_new_event: function(event) {
    if (event.atype == 'said') {
      Chat.chats.push(event);
      Chat.update();
    }
  },
  
  update: function() {
    var chats = Chat.chats;
    if (chats.length > 9) chats = chats.slice(chats.length - 9);
    $('#chats').html(Chat.html_for(chats));
  },
  
  html_for: function(events) {
    var html = '';
    $.each(events, function(){
      Event.improve(this);
      html += $T(Chat.chat_t, this);
    });
    return html;
  },
    
  chat_t:
    '<li title="#{when}"><a href="#" item="#{actor_tag}">#{actor_name}</a>#{what}</li>'
  
  
};
