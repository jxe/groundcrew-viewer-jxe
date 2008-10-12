function button(cls, name, attrs){
  if (!attrs) return tag('a.q.'+cls, name);
  attrs.content = name;
  return tag('a.q.'+cls, attrs);
  // return "<big>&lt;</big>" + tag('a.'+cls, name) + "<big>&gt;</big>";
}


Tour = {

  highlighted_crew: null,
  prev_highlighted_crew: null,
  current: null,
  index: 0,
  
  wire: function() {
    $(document).clicks({
      '#unhighlight'  : Tour.stop,
      "#tourbox_larr" : Tour.prev,
      "#tourbox_rarr" : Tour.next
    });
    NQueue.receivers.push(Tour);
  },
  
  stop: function(omit_redraws) {
    var old_crew = Tour.prev_highlighted_crew = Tour.highlighted_crew;
    Tour.highlighted_crew = null;
    Tour.current = null;
    Tour.index = null;
    if (!old_crew) return;
    $.each(old_crew, function(){ delete this.highlighted; Item.calculate_fields(this); });
    if (omit_redraws !== true) {
      $('body').removeClass('has_tour');
      $('#tourbox_hud').hide();
      Facebar.resort();
      MapMarkers.re_highlight();
    }
  },
  
  start: function(crew, options) {
    var what = options.topic;
    var msg = "<b>" + pluralize(crew.length, 'agent') + "</b> " + what;
    Tour.init(crew, msg, options);
  },
  
  init: function(crew, msg, options) {

    crew = crew.compact();

    if (crew.length > 1) crew = ItemDb.eliminate_self(crew);

    if (crew.length == 0) { alert('Tour.start called with zero crew!'); return; }
    if (Tour.current) Tour.stop(true); // crew.length > 1
    // if (crew.length == 1) return Viewer.open(crew[0]);
    Tour.current = options;
    Tour.highlighted_crew = crew;
    Tour.index = 0;
    // recalculate items
    $.each(crew, function(){ this.highlighted = true; Item.calculate_fields(this); });

    // adjust UI
    Facebar.resort();
    MapMarkers.re_highlight();
    Viewer.open(options.openthis || crew[0]);
    
    $('body').addClass('has_tour');
    $('#tour_msg').html(msg).blit();
    $('#tourbox_hud').show();
  },

  with_goal: function(crew, goal, openthis) {
    Tour.init(
      crew,
      tag('div.small', "RIGHT NOW, <b>"+pluralize(crew.length, 'agent')+"</b> are standing by") + 
      tag('div.b.center', 'to ' + goal) + 
      tag('div.small.center',
        button('plink', 'join them', {popper:'#lmark_popup/bc'}) + ' &nbsp; ' + 
        button('plink', 'gather them', {popper:'#lmark_popup/bc'})
      ), 
      { original_crew: crew, goal:goal, openthis:openthis }
    );
  },
  
  cur_readyto: function() {
    return (Tour.current && Tour.current.goal);
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
