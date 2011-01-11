Frame = {
  
  init: function() {
    $('.startupmagic').app_paint();

    var page_height = window.innerHeight || window.document.body.clientHeight;
    if (page_height < 600) $('body').addClass('shortview');

    $(document).keyup(function(e){
      if (e.keyCode == 27 || e.keyCode == e.DOM_VK_ESCAPE) {
        if (This.tool || (This.item && !This.item.startsWith('City__'))) App.closeclick();
        else if (go.value('has_selection')) go('#clear_selection');
        else App.clear_query();
        return false;
      }
    }).keypress(function(e){
      if ($(e.target).is('input,textarea')) return true;
      if (e.metaKey) return true;
      var ch = String.fromCharCode(e.which);
      if (ch == 'S') { GM.setMapTypeId(google.maps.MapTypeId.SATELLITE); return false; }
      if (ch == 'N') { GM.setMapTypeId(google.maps.MapTypeId.ROADMAP); return false; }
      if (ch == 'H') { GM.setMapTypeId(google.maps.MapTypeId.HYBRID); return false; }
      if (ch == 'T') { GM.setMapTypeId(google.maps.MapTypeId.TERRAIN); return false; }
      if (ch == '?') { go('tool=help_keyboard'); return false; }
      if (ch == 'w') { go('item='); return false; }
      if (ch == 'e') { go('tool=view_activity'); return false; }
      if (ch == 'c') { go('tool=chat'); return false; }
      if (ch == ',') { go('#collapse_leftbar'); return false; }
      if (ch == 'g') { go('#go_where'); return false; }
      if (ch == 'O') { go('#rss_overlay'); return false; }
      if (ch == '\\') { alert(This.item); return false; }

      if (ch == 'm') { go('#quick_mission_title'); return false; }
      if (ch == '!') { go('#quick_mission'); return false; }

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
