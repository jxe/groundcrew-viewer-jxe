Facebar = {
  
  contents: [],
  prev_selected_agent: null,
  
  wire: function() {
    NQueue.receivers.push(Facebar);
  },
    
  did_change_selected_city     : function() { this.regen();  },
  
  did_change_item: function(agent, how) {
    if (Viewer.selected_city && Viewer.selected_city != agent.city_id) return;
    if (how == 'added' || how == 'removed') this.regen();
    else                                    this.redraw();
  },
  
  selected_agent: function(agent) {
    var old_agent = Facebar.prev_selected_agent;
    if (old_agent) $("#agents .agent[item=" + this.old_agent + "]").css('background', null);
    if (agent) $("#agents .agent[item=" + this.agent + "]").css('background', '#0000ff');
    Facebar.prev_selected_agent = agent;
  },
    
  //
  // private
  //
    
   agent_thumb_t:
     '<a item="#{item_tag}" class="agent #{status} #{color}" href="#">\
        <img class="thumb" src="#{thumb_url}" title="#{title}"/>\
        #{byline3}\
      </a>',
  
  regen: function() {
    var city = Viewer.selected_city;
    this.contents = city ? ItemDb.agents_by_city[city] : ItemDb.all_items();
    this.resort();
  },
  
  resort: function() {
    this.contents = this.contents.sort_by(function(x){
      if (x.highlighted) return 0;
      if (x.pgoal && x.status == 'available') return 1;
      if (x.status == 'available') return 2;
      if (x.pgoal) return 3;
      else return 10;
    });
    this.redraw();
  },
  
  redraw: function() {
    var html = '';
    $.each(Facebar.contents, function(){
      html += $T(Facebar.agent_thumb_t, this);
    });
    $('#agents').html(html).viewer_links();
    ViewerUI.adjust_frame();
  }
    
};
