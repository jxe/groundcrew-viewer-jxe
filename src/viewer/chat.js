Chat = {

  // the first time chat is clicked, it should find out if there are recent chats
  // and populate itself
  chats: [],
  
  wire: function() {
    $('#eventsbutton').click(function(){ RecentHUD.toggle_open_closed(); return false; });
    $('#chatbutton').click(function(){
      $('#chatter, #talker').toggle();
      $('#talker input').val("type here to chat with others");
      Chat.update();
      return false;
    });
    $('#talker input').focus(function(){
      $(this).val('');
    });
    $('#talker input').keypress(function(e){
      if (e.which == 13) {
        var msg = $(this).val();
        $.post("/gc/said", {msg:msg}, function(x){ 
          $('#talker input').val('');
          eval(x); 
        });
        return false;
      }
      return true;
    });
    
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
      html += Chat.chat_t.t(this);
    });
    return html;
  },
    
  chat_t:
    '<li title="#{when}"><a href="#" item="#{actor_tag}">#{actor_name}</a>#{what}</li>'
  
  
};
