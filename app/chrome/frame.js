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
  },
  
  // NOTE: this function doesn't use jquery cause we like our resize FAST
  resize: function() {
    var page_height = window.innerHeight || window.document.body.clientHeight;
    var junk = 125;
    junk += document.getElementById('modetray').offsetHeight;
    
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
