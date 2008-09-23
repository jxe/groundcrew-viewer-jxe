Msgbar = {

  wire: function() {
    $('#msgbar_dreams').click(Dreambox.toggle_dreambox);
    $('#dream_ct').html($values(Initiatives.all).length);
    NQueue.receivers.push(Msgbar);
  },
  
  // RecentHUD.filter_events();
  
  did_change_viewer_state: function() {
    if (!Viewer.selected_city || Tour.highlighted_crew) $('#nearagents').hide();
    else $('#nearagents').show();
  },
  
  did_change_selected_city: function() {
    var agents = ItemDb.agents_by_city[Viewer.selected_city];
    if (agents) $('#agent_ct').html(agents.length);
    if (!Viewer.selected_city || Viewer.selected_city == 'nothing') {
      $('#msgbar').hide();
    } else {
      $('#msgbar').show();
      Msgbar.update_agent_wish_popper();
    }
  },
  
  click: function(a) {
    var atag = a.attr('atag');
    var mode = a.attr('mode');
    var item = a.attr('item');
    if (item) {
      Viewer.open(item);
    } else {
      var atags = City.agents_by_atag();
      var crew = ItemDb.eliminate_self(atags[atag]);
      Tour.start(crew, {atag: atag, mode:mode});
    }
  },
  
  update_agent_wish_popper: function() {
    var agents = ItemDb.agents_by_city[Viewer.selected_city];
    var atags = City.agents_by_atag();
    var basic_atags = $w('pchal stretchme artsuggest art scavhunts soccer basketball ultimate convo bene hoodwork');
    var wishers_pgoal = [];
    var wishers_atags = [];
    var atags_done = {};
    $.each(agents, function(){ 
      if (!this.pgoal) return;
      if (this.pgoal[0] == '#') wishers_atags.push(this.pgoal.slice(1));
      else                      wishers_pgoal.push(this);
    });
    
    var html = "<p>here's what they're wishing for:</p>";

    $.each(wishers_pgoal, function(){
      html += '<a href="#" item="'+this.item_tag+'">'+this.pgoal+'</a>';
    });

    $.each(wishers_atags, function(){
      var atag = this;
      var agents = atags[this];
      atags_done[this] = true;
      html += "<a href='#' mode='suggest' atag='"+atag+"'>" + atag_desc(atag);
      if (agents.length > 1) html += " (x "+agents.length+")";
      html += "</a>";
    });

    html += "<p>and here's what they're up for:</p>";

    $.each(basic_atags, function(){
      var atag = this;
      if (atags_done[this]) return;
      var agents = atags[this];
      if (!agents || agents.length == 0) return;
      atags_done[this] = true;
      html += "<a href='#' mode='suggest' atag='"+atag+"'>" + atag_desc(atag);
      if (agents.length > 1) html += " (x "+agents.length+")";
      html += "</a>";
    });
    
    $('#nearagents_popper').find('.insert_content_here').html(html);
  }
  
};