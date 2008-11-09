Viewer.apps.mobilize = {
  // http://groundcrew.us/viewer/#/mobilize/noho/good_deeds/Idea__12/Agent__405
  url_part_labels: $w('city category idea item'),

  set_category: function(category, state, changed) {
    if (!category) { delete state.agents; return; }
    state.agents         = Agents.find("=city_id " + state.city.resource_id() + " :atags " + category);
    state.category_label = Category[category]; 
  },
  
  category_index: function(state) {
    var atag_counts = Agents.find('=city_id ' + state.city.resource_id() + " :atags");
    $('.categories div').decorate_categories(atag_counts);
  },
  
  idea_index: function(state) {
    var cat_label_singular = state.category_label.toLowerCase().singularize();
    var ag_ct = pluralize(state.agents.length, 'agent');
    $('#idea_index').fillout({
      '.cat_label_singular': cat_label_singular,
      '.ag_ct': ag_ct,
      '.idea_select': Ideas.with_atag(state.category)
          .map(function(x){ return "<option value='"+x.item_tag+"'>" + x.title + "</option>"; }).join(),
      '.lm_select': Landmarks.in_city(state.city)
          .map(function(x){ return "<option value='"+x.item_tag+"'>" + x.title + "</option>"; }).join()
    }).clicks({
      '.add_idea': function(){
        var title = prompt("What do you want to gather people to do?");
        if (!title) return;
        var idea = Ideas.local({ title: title, atags: state.category });
        console.log(idea);
        $('#idea_index .idea_select').html(
          Ideas.with_atag(state.category)
            .map(function(x){ return "<option value='"+x.item_tag+"'>" + x.title + "</option>"; }).join()
        );
      }
    }).forms({ 'form': function(data){ Viewer.go(data.idea + "/" + data.lm); } });
  },
  
  show_item: function(state) {
    if (state.item.startsWith('Landmark')) {
      MapMarkers.open(state.item, 'why hello there!');
    }
  },
  
  set_idea: function(idea, state) {
    if (!idea) return;
    idea = idea.resource();
    state.idea_label = idea.title;
    var cat_label_singular = state.category_label.toLowerCase().singularize();
    var ag_ct = pluralize(state.agents.length, 'agent');
    $('#invite_dialog').fillout({
      '.cat_label_singular': cat_label_singular,
      '.ag_ct': ag_ct,
      '.idea_title': idea.title,
      'input[name=action] //value': idea.title
    });
  },
  
  
  agent_infowindow: function(agent) {
    return "wahooty!";
  }  
};




$.fn.decorate_categories = function(counts){
  return this.each(function(){
    var div = $(this);
    var href = div.find('a.cat').attr('href');
    if (!href) return;
    var count = counts[href.slice(1)].length;
    var text = pluralize(count, 'agent') + " available";
    if (href) div.find('span').html(text);
  });
};

