Frame = {
  agent_thumb: '<div href="#@#{id}" class="athumb agent_photo #{id}"><img class="th" src="#{thumb_url}" title="#{title}"/><b>#{title}</b></div>',
  
  init: function() {
    Frame.resize();
    // setInterval(function(){ $('.from_now').update_times(); }, 20000);
    $(window).resize(function(){
      Frame.resize();
      $('.divcenter').center();
    });
    $('.startupmagic').app_paint();

    $(document).keyup(function(e){
      if ($(e.target).is('input,textarea')) return;
      if (e.metaKey) return;
      if (e.keyCode == 27 || e.keyCode == e.DOM_VK_ESCAPE) {
        go('@' + This.city);
        return false;
      }
      var ch = String.fromCharCode(e.which);
      if (ch == 'p') return Map.Gmap.setMapType(G_SATELLITE_MAP);
      if (ch == 'm') return Map.Gmap.setMapType(G_NORMAL_MAP);
      if (ch == 'h') return Map.Gmap.setMapType(G_HYBRID_MAP);
      if (ch == 't') return Map.Gmap.setMapType(G_PHYSICAL_MAP);
      // if (ch == 's') return go('mode=sketch');
      // if (ch == 'c') return go('mode=connect');
      // if (ch == 'd') return go('mode=dispatch');
      if (ch == 'w') return go('item=');
      if (ch == 'g') return go('#go_where');
      if (ch == 'f') return $('#search').focus() && false;
      if (ch == 'y') return $('#floaty').toggleClass('appeared');
      if (ch == 'T') { test = !test; if (test) alert('test mode active'); }
    });

  },
  
  // NOTE: this function doesn't use jquery cause we like our resize FAST
  resize: function() {
    var page_height = window.innerHeight || window.document.body.clientHeight;
    var junk = 59;
    junk += document.getElementById('modetray').offsetHeight;
    junk += document.getElementById('flexbar_banner').offsetHeight;
    
    // make the adjustment
    $('#map_div').height(page_height - junk);
    Map.Gmap && Map.Gmap.checkResize();
  },
    
  populate_flexbar_agents: function(agents) {
    if (!agents) return;
    var groups = agents.sort_by('.last_ts_ago').group_by('fab_state');
    $('#agents > div').hide();
    $.each($keys(groups), function(){
      if (this == null || this == "null") return;
      $('#' + this + '_agents').show();
      $('#' + this + '_agent_thumbs').html(Frame.agent_thumb.tt(groups[this]));
    });
    $('#flexbar').app_paint();
    Selection.update_all();
  }
  
};
