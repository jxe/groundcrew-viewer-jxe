var atag_trans = {
  conn: 'connection',
  bene: 'kindness',
  food: 'food',
  adv: 'adventures',
  mgames: 'puzzles',
  vol: 'volunteering',
  stretchme: 'challenge',
  stealth: 'stealth',
  pchal: 'challenge',
  pgrowth: 'challenge',
  convo: 'conversation',
  beauty: 'beauty',
  raok: 'kindness'
};

function agent_wants(agent){
  var translated = agent.atags.split(' ').map(function(x){ return atag_trans[x]; }).compact();
  if (translated.length == 0) return null
  return translated.choose_random().toUpperCase();
}


Palettes = {}
Palettes.recent_content = function(thing){
  var events = EventDb.events;
  var html;
  if (events) {
    html = '';
    $.each(events, function(){
      Event.improve(this);
      html += Templates.event.t(this);
    });
  } else {
    html = "nothing yet.";
  }
  thing.html(html).scrollDown();
}

Palettes.chat_palette = function(thing){
  var $input = $('#chat_palette input');
  $input.val("type here to chat with others").focus(function(){
    $(this).val('');
  }).keypress(function(e){
    if (e.which == 13) {
      var msg = $(this).val();
      $.post("/gc/said", {msg:msg}, function(x){ 
        $input.val('');
        eval(x);
      });
      return false;
    }
    return true;
  });
  
  Chat.update();
}

Chat = {

  chats: [],

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
    '<li title="#{when}"><a href="#" item="#{actor_tag}">#{actor_title}</a>#{what}</li>'
  
}

