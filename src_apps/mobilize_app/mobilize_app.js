Viewer.apps.mobilize = {
  // http://groundcrew.us/viewer/#/mobilize/noho/good_deeds/Idea__12/Agent__405
  url_part_labels: $w('city category idea item'),

  set_category: function(category, state, changed) {
    if (!category) { delete state.agents; return; }
    state.agents         = City.agents_with_atag_in_city(state.city, category);
    state.category_label = Category[category]; 
  },
  
  category_index: function(state) {
    var atag_counts = City.atags_in_city(state.city).bins;
    $('.categories div').decorate_categories(atag_counts);
  },
  
  idea_index: function(state) {
    var cat_label_singular = state.category_label.toLowerCase().singularize();
    var ag_ct = pluralize(state.agents.length, 'agent');
    $('#idea_index').fillout({
      '.cat_label_singular': cat_label_singular,
      '.ag_ct': ag_ct
    }).forms({
      'form': $method(Viewer.apps.mobilize, 'new_idea')
    });
  },
  
  new_idea_submit: function(data) {
    var idea_title = data.idea_title;
    alert('received ' + idea_title);
    return;
    // generate a local, new idea
    // added it to the ideas database
    Viewer.go(idea_tag);
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

