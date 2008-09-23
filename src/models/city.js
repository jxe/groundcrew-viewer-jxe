City = {
	
	landmarks_list: function() {
    var landmarks = LandmarkDb.landmarks_by_city[Viewer.selected_city];
    if (!landmarks) return '';
    return landmarks.map(function(lm){
      return "<li><a href='#' item='"+ lm.item_tag +"'>" + lm.title + "</a></li>";
    }).join('');
	},

	landmarks_list2: function() {
    var landmarks = LandmarkDb.landmarks_by_city[Viewer.selected_city];
    if (!landmarks) return '';
    return landmarks.map(function(lm){
      return "<a href='#' item='"+ lm.item_tag +"'>" + lm.title + "</a>";
    }).join('');
	},

	landmarks_options: function() {
    var landmarks = LandmarkDb.landmarks_by_city[Viewer.selected_city];
    if (!landmarks) return '';
    return landmarks.map(function(lm){
      return "<option value='"+lm.item_tag+"'>" + lm.title + "</option>";
    }).join('');
	},
	
	atags_ripe: function() {
    var agents = City.agents_by_atag();
    var atags = $w('pchal stretchme artsuggest art scavhunts soccer basketball ultimate convo bene hoodwork')
          .sort_by(function(x){ return -(agents[x]||[]).length; });
    var html = '<option>select a type of action:</option>';
    $.each(atags, function(){
      var atag = this;
      var atag_agents;
      if (atag_agents = agents[atag]) {
        html += '<option value="' + atag + '">' + atag_desc(atag) + " &mdash; " + atag_agents.length + " agents ready</option>";
      }
    });
    return html;
	},
	
	wishes: function() {
	  var html = '';
	  var agents = ItemDb.agents_by_city[Viewer.selected_city];
    $.each(agents, function(){ 
      if (this.pgoal) html += '<a href="#" item="'+this.item_tag+'" class="mchoice">'+this.pgoal+'</a>';
    });
    return html;
	},
	
	
	agents_by_atag: function() {
    var agents = ItemDb.agents_by_city[Viewer.selected_city];
    var atags = {};
    $.each(agents, function(){
      var agent = this;
      $.each($w(agent.atags), function(){
        atags[this] = atags[this] || [];
        atags[this].push(agent);
      });
      if (agent.pgoal && agent.pgoal[0] == '#') {
        var tag = agent.pgoal.slice(1);
        atags[tag] = atags[tag] || [];
        atags[tag].push(agent);
      };
    });
    return atags;
	}
	
	
};
