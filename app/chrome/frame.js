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
      if (e.keyCode == 27 || e.keyCode == e.DOM_VK_ESCAPE) {
        go('@' + This.city);
        return false;
      }
    }).keypress(function(e){
      if ($(e.target).is('input,textarea')) return;
      if (e.metaKey) return;
      var ch = String.fromCharCode(e.which);
      if (ch == 'S') return GM.setMapType(G_SATELLITE_MAP);
      if (ch == 'N') return GM.setMapType(G_NORMAL_MAP);
      if (ch == 'H') return GM.setMapType(G_HYBRID_MAP);
      if (ch == 'T') return GM.setMapType(G_PHYSICAL_MAP);
      if (ch == 'c') return go('mode=');
      if (ch == 'a') return go('mode=assess');
      if (ch == 'm') return go('mode=manage');
      if (ch == 'w') return go('item=') && false;
      if (ch == 'g') return go('#go_where') && false;
      if (ch == 'f') return $('#search').focus() && false;
      if (ch == 't') return(setTimeout(function(){go('tool=tag_group');},0) && false);
      if (ch == '$') { test = !test; if (test) alert('test mode active'); };
      if (ch == '#') { window.open('/api/stream.js?stream=' + current_stream); return false; };
      if (demo) Demo.qa_keypresses(ch);
    });

    $.jGrowl.defaults.pool = 7;

  },

  // NOTE: this function doesn't use jquery cause we like our resize FAST
  resize: function() {
    var page_height = window.innerHeight || window.document.body.clientHeight;
    var junk = 59;
    junk += document.getElementById('modetray').offsetHeight;
    junk += document.getElementById('flexbar_banner').offsetHeight;

    // make the adjustment
    $('#map_div').height(page_height - junk);
    GM && GM.checkResize();
  },

  populate_flexbar_agents: function(agents) {
    if (!agents) return;
    if (agents.length == 0) {
      $('#flexbar').addClass('empty');
    } else {
      $('#flexbar').removeClass('empty');
    }
    agents = agents.sort_by('.last_ts_ago');
    if (agents.length > 3000) agents = agents.slice(0, 3000);
    var groups = agents.group_by('fab_state');
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
