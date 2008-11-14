// mobilize gcv app
// urls look like: 
//   http://groundcrew.us/viewer/#/mobilize/noho/good_deeds/Idea__12/Agent__405


Viewer.apps.mobilize = {
  url_part_labels: $w('city category item idea'),
  
  marker_clicked: function(tag, state) {
    if (!state.category) return alert('please select a category first.');
    if (state.idea) return Viewer.go('/mobilize/:city/:category/' + tag + '/:idea');
    else Viewer.go('/mobilize/:city/:category/' + tag);
  },

  form_submit: function(data, state, form) {
    var self = this;
    if (data.idea && (data.lm || state.item && state.item.startsWith('Landmark'))) {
      return Viewer.go('/mobilize/:city/:category/' + (data.lm || state.item) + '/' + data.idea);
    } 
    if (data.action && data.instr) {
      // var idea = Ideas.local({ title: data.action, action: data.action, atags: state.category,  });
      Ajax.fetch('/gc/idea', {atags: state.category, act: data.action, instructions: data.instr}, function(idea){
        Ideas.add_or_update(idea);
        state.selected_idea = idea.item_tag;
        $.facebox.close();
        $('select[fill=idea_select]').html(self.idea_select(state));
      });
      form.find('input[type=submit]').val('loading').attr('disabled', true);
      return;
    }
    alert('unusual form submit.');
  },
  
  add_idea_button: function(state) {
    $.facebox($.template('#new_idea_dialog').app_paint()[0]);
  },
  
  // item and idea level stuff
    
  set_idea: function(idea, state, changed) {
    state.idea_r = idea && idea.resource();
    state.idea_label = idea && state.idea_r.title;
  },
  
  set_item: function(item, state, changed) {
    state.item_r = item && item.resource();
    state.item_label = item && state.item_r.title;
  },
  
  idea_index: function(state) {
    if (state.item.startsWith('Landmark')) {
      return MapMarkers.open(state.item, $.template('#choose_idea_iw').app_paint()[0], 17);
    } else {
      // it's an agent!
      
    }
  },
  
  show_idea: function(state) {
    if (state.item.startsWith('Landmark')) {
      return MapMarkers.open(state.item, $.template('#invite_iw').app_paint()[0], 17);
    }
  },
  
  new_landmark: function(state) {
    if (!logged_in) return Viewer.join_please();
    $.template('#new_landmark_dialog').show_dialog(function(form){
      Ajax.fetch('/gc/create_landmark', form, function(ev){
        EventDb.add(ev);
        Viewer.open(ev.landmark_tag || ev.item_tag);
      });
    });
  },
  
  // category level stuff
  
  category_index: function(state) {
    var atag_counts = Agents.find('=city_id ' + state.city.resource_id() + " :atags");
    $('.categories div').decorate_categories(atag_counts);
    $('#category_index').center();
  },

  set_category: function(category, state, changed) {
    if (!category) { delete state.agents; return; }
    state.agents = Agents.find("=city_id " + state.city.resource_id() + " :atags " + category);
    state.category_label = Category[category]; 
  },
  
  item_index: function(state) {
    $('#item_index').app_paint().center();
  },
  

  
  // dyn fills
  
  idea_select: function(state) { return Ideas.with_atag(state.category).as_option_list(state.selected_idea); },
  lm_select:   function(state) { return Landmarks.in_city(state.city).as_option_list(); },
  cat_label_singular: function(state) { return state.category_label.toLowerCase().singularize(); },
  ag_ct:       function(state) { return pluralize(state.agents.length, 'agent'); },
  idea_title:  function(state) { return state.idea_r.title; },
  idea_action: function(state) { return state.idea_r.action; },
  idea_instructions: function(state) { return state.idea_r.instructions; },
  item_thumb_url: function(state) { return state.item_r.thumb_url; },
  item_title:  function(state) { return state.item_r.title; },
  blank:       function(){ return ''; }
    
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

