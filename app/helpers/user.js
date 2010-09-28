go.push({
  
  current_stream_name: function() {
    return window.current_stream_name || 'Demo Squad';
  },
  
  current_stream_desc: function() {
    if (demo) return "This is the groundcrew demo squad.  These are not real people, so you can send them whatever messages you like.";
    return window.current_stream_desc || '';
  },
  
  youbox: function() {
    if (typeof window.sms_remaining == "number") return "<b>"+window.sms_remaining+"</b> text messages remaining";
    else if (window.posx) return "You've organized <b>48</b> positive experiences.";
    else return ""; //"Join squads to mobilize positive action.";
  },
    
  sidebar_content: function() {
    if (SidebarTags[current_stream]) return Subsquads.sidebar_content();
  },

  self_name: function() {
    return This.user.title;
  },
  
  self_posx_pts: function() {
    return This.user.posx_pts;
  },

  self_posx: function() {
    return This.user.posx;
  },

  self_squadm: function() {
    return This.user.squadm;
  }

});
