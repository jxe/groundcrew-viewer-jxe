Frame = {
  agent_thumb: '<div class="athumb agent_photo #{id}"><img class="th" src="http://groundcrew.us/#{thumb_url}" title="#{title}" href="#@#{id}"/><img src="i/timebadges/5m.png" class="badge"/></div>',
  
  init: function() {
    Frame.resize();
    // setInterval(function(){ $('.from_now').update_times(); }, 20000);
    $(window).resize(function(){
      Frame.resize();
      $('.divcenter').center();
    });
    $('.magic').app_paint();

    $(document).keypress(function(e){
      if ($(e.target).is('input,textarea')) return;
      if (e.which == 27) Map.Gmap.closeInfoWindow();
      var char = String.fromCharCode(e.which);
      if (char == 'p') return Map.Gmap.setMapType(G_SATELLITE_MAP);
      if (char == 'm') return Map.Gmap.setMapType(G_NORMAL_MAP);
      if (char == 'h') return Map.Gmap.setMapType(G_HYBRID_MAP);
      if (char == 's') return go('mode=sketch');
      if (char == 'c') return go('mode=connect');
      if (char == 'd') return go('mode=dispatch');
      if (char == 'w') return go('city=');
    });

  },
  
  // NOTE: this function doesn't use jquery cause we like our resize FAST
  resize: function() {
    var page_height = window.innerHeight || window.document.body.clientHeight;
    var junk = 51;
    junk += document.getElementById('modetray').offsetHeight;
    junk += document.getElementById('flexbar_banner').offsetHeight;
    
    // make the adjustment
    $('#map_div').height(page_height - junk);
    Map.Gmap && Map.Gmap.checkResize();
  },
    
  populate_flexbar_agents: function(agents) {
    if (!agents) return;
    var groups = agents.group_by('availability_status');
    $('#agents > div').hide();
    $.each($keys(groups), function(){
      if (this == null || this == "null") return;
      $('#' + this + '_agents').show();
      $('#' + this + '_agent_thumbs').html(Frame.agent_thumb.tt(groups[this]));
    });
    $('#flexbar').scrollLeft(0).app_paint();
  }
  
};
