// mobilize gcv app
// urls look like: 
//   http://groundcrew.us/viewer/#/mobilize/noho/good_deeds/Idea__12/Agent__405


Viewer.apps.mobilize = {
  url_part_labels: $w('city category idea item'),


  // url hooks

  set_category: function(category, state, changed) {
    if (!category) { delete state.agents; return; }
    state.agents = Agents.find("=city_id " + state.city.resource_id() + " :atags " + category);
    state.category_label = Category[category]; 
  },
  
  set_idea: function(idea, state, changed) {
    state.idea_r = idea && idea.resource();
    state.idea_label = idea && state.idea_r.title;
  },
  
  set_item: function(item, state, changed) {
    state.item_r = item && item.resource();
    state.item_label = item && state.item_r.title;
  },
  
  
  // url actions
  
  category_index: function(state) {
    var atag_counts = Agents.find('=city_id ' + state.city.resource_id() + " :atags");
    $('.categories div').decorate_categories(atag_counts);
    $('#category_index').center();
  },
  
  idea_index: function(state) {
    $('#idea_index').app_paint().center();
  },
  
  show_item: function(state) {
    if (state.item.startsWith('Landmark')) {
      return MapMarkers.open(state.item, $.template('#invite_iw').app_paint()[0]);
    }
  },
  
  
  // dyn fills
  cat_label_singular: function(state) {
    return state.category_label.toLowerCase().singularize();
  },
  
  ag_ct: function(state) {
    return pluralize(state.agents.length, 'agent');
  },
  
  idea_select: function(state) {
    return Ideas.with_atag(state.category).as_option_list(state.selected_idea);
  },
  
  lm_select: function(state) {
    return Landmarks.in_city(state.city).as_option_list();
  },
  
  idea_title: function(state) {
    return state.idea_r.title;
  },
  
  idea_action: function(state) {
    return state.idea_r.action;
  },
  
  item_title: function(state) {
    return state.item_r.title;
  },
  
  
  
  // extra interfaces
  
  agent_infowindow: function(agent) {
    return "wahooty!";
  },
  
  
  // link/form actions
  
  add_idea_button: function(state) {
    var title = prompt("What do you want to gather people to do?");
    if (!title) return;
    var idea = Ideas.local({ title: title, action: title, atags: state.category });
    state.selected_idea = idea.item_tag;
    $('#idea_index').app_paint();
  },
  
  form_submit: function(data, state) {
    if (data.idea && data.lm) Viewer.go(data.idea + "/" + data.lm);
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

