LiveHTML.widgets.push({
  
  current_stream_name: function() {
    return window.current_stream_name || 'Demo Squad';
  },
  
  current_stream_desc: function() {
    return window.current_stream_desc || '';
  },
  
  squads_dropdown: function() {
    if (!window.stream_names) window.stream_names = {};
    stream_names['demo'] = 'Demo Squad';
    var streams = $keys(window.stream_names);
    // if (streams.length == 0) return "<li>You have no other squads available.</li>";
    
    return streams.map(function(stream){
      if (stream == current_stream) return '';
      var name = stream_names[stream];
      var switch_url = "http://groundcrew.us/" + stream + "/live/";
      return '<li href="'+switch_url+'">' + name + '</li>';
    }).join('');
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
