Frame = {
  
  init: function() {
    $('.startupmagic').app_paint();

    $(document).keyup(function(e){
      if (e.keyCode == 27 || e.keyCode == e.DOM_VK_ESCAPE) {
        App.closeclick();
        return false;
      }
    }).keypress(function(e){
      if ($(e.target).is('input,textarea')) return true;
      if (e.metaKey) return true;
      var ch = String.fromCharCode(e.which);
      if (ch == 'S') { GM.setMapType(G_SATELLITE_MAP); return false; }
      if (ch == 'N') { GM.setMapType(G_NORMAL_MAP); return false; }
      if (ch == 'H') { GM.setMapType(G_HYBRID_MAP); return false; }
      if (ch == 'T') { GM.setMapType(G_PHYSICAL_MAP); return false; }
      if (ch == '?') { go('tool=help_keyboard'); return false; }
      if (ch == 'w') { go('item='); return false; }
      if (ch == ',') { go('#collapse_leftbar'); return false; }
      if (ch == 'g') { go('#go_where'); return false; }
      if (ch == 'O') { go('#rss_overlay'); return false; }
      if (ch == 'f') { $('#search').focus(); return false; }
      if (ch == 't') { setTimeout(function(){go('tool=tag_agents');},0); return false; }
      if (ch == '$') { test = !test; if (test) alert('test mode active'); return false; }
      if (ch == '#') { window.open(stream_url); return false; }
      if (ch == 'Q') { clearTimeout(StreamLoader.timer); return false; }
      if (demo) return Demo.qa_keypresses(ch);
      return true;
    });

    $.jGrowl.defaults.pool = 7;
  }

};
