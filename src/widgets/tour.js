Tour = {

  highlighted_crew: null,
  prev_highlighted_crew: null,
  current: null,
  index: 0,
  
  wire: function() {
    $(document).clicks({
      '#zoom_out'     : Viewer.zoom_out,
      '#unhighlight'  : Tour.stop,
      "#tourbox_larr" : Tour.prev,
      "#tourbox_rarr" : Tour.next
    });
    NQueue.receivers.push(Tour);
  },

  topic: function() {
    if (Tour.current.topic) return Tour.current.topic;
    if (Tour.current.atag) return "for <b>" + atag_desc(Tour.current.atag).toLowerCase() + "</b>";
    return "for that";
  },
  
  stop: function(omit_redraws) {
    $.popups2.close();
    var old_crew = Tour.prev_highlighted_crew = Tour.highlighted_crew;
    Tour.highlighted_crew = null;
    Tour.current = null;
    Tour.index = null;
    if (!old_crew) return;
    $.each(old_crew, function(){ delete this.highlighted; Item.calculate_fields(this); });
    if (omit_redraws !== true) {
      $('#tourbox_hud').hide();
      Facebar.resort();
      MapMarkers.re_highlight();
    }
  },
  
  start: function(crew, options) {
    crew = crew.compact();
    if (crew.length == 0) { alert('Tour.start called with zero crew!'); return; }
    if (crew.length == 1) return Viewer.open(crew[0]);
    if (Tour.current) Tour.stop(true);
    $.popups2.close();
    Tour.highlighted_crew = crew;
    Tour.current = options;
    Tour.index = 0;
    // recalculate items
    $.each(crew, function(){ this.highlighted = true; Item.calculate_fields(this); });

    // adjust UI
    Facebar.resort();
    MapMarkers.re_highlight();
    Viewer.open(crew[0]);
    
    $('#tourbox_hud').fillout({
      '#tourbox_count': number_plural(Tour.highlighted_crew.length, 'agent', 'agents'),
      '#tourbox_what' : Tour.topic(),
      '#tourbox_where': cities[Viewer.selected_city]
    }).show();    
  },
  
  // unfortunately, the javascript modulus operator is fucked up, so we don't use it
  next: function(step) {
    if (step != -1) step = 1;
    Tour.index += step;
    if (Tour.index == Tour.highlighted_crew.length) Tour.index = 0;
    if (Tour.index == -1) Tour.index = Tour.highlighted_crew.length - 1;
    Viewer.open(Tour.highlighted_crew[Tour.index]);
  },

  prev: function() { Tour.next(-1); },
    
  local: function() {
    var agents = ItemDb.agents_by_city[Viewer.selected_city];
    Tour.start(agents, {topic: "are available"});
  }

};
