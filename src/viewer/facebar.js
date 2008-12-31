Facebar = {
  
  contents: [],
  prev_selected_agent: null,
      
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
    
  populate: function(agents) {
    this.contents = agents;
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
      html += Facebar.agent_thumb_t.t(this);
    });
    $('#agents').html(html).blit();
    ViewerUI.adjust_frame();
  }
    
};
