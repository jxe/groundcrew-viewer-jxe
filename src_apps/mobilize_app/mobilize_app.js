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
      Ajax.fetch('/gc/idea', {atags: state.category, act: data.action, instructions: data.instr, ltypes:data.ltypes}, function(idea){
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
  
  idea_select_changed: function(new_idea, state) {
    if (!new_idea) return;
    var idea = new_idea.resource();
    state.idea_r = idea;
    var html = idea.title + ' by ' + idea.author_tag + '  <a href="##idea_edit" class="abs_right gay_button">?</a>';
    $('#idea_current_text').html(html).app_paint();
    if (!idea.ltypes) idea.ltypes = null;
    if (state.ltype != idea.ltypes)
      Viewer.apps.mobilize.limit_ltype(state.ltype);
  },
  
  idea_edit: function(state) {
    $.facebox($.template('#edit_idea_dialog').app_paint()[0]);
  },
  
  set_idea: function(idea, state, changed) {
    state.idea_r = idea && idea.resource();
    state.idea_label = idea && state.idea_r.title;
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
  
  trash_idea: function(state) {
    alert('This needs to be implemented!');
  },
  
  
  // category level stuff
  
  category_index: function(state) {
    var atag_counts = Agents.find('=city_id ' + state.city.resource_id() + " :atags");
    $('.categories div').decorate_categories(atag_counts);
  },

  set_category: function(category, state, changed) {
    if (!category) { delete state.agents; return; }
    state.agents = Agents.find("=city_id " + state.city.resource_id() + " :atags " + category);
    state.category_label = Category[category]; 
  },
    

  
  // dyn fills
  
  idea_select: function(state) { 
    return Ideas.with_atag(state.category).as_option_list(state.selected_idea); 
  },
  
  idea_tag_cloud: function(state) {
    var tags = {};
    
    $.each(Ideas.all, function(){
      var idea = this;
      var idea_tags = this.atags.split(' ').concat(this.action.split(' '));
      $.each(idea_tags, function(){
        if (!tags[this]) tags[this] = [ idea ];
        else tags[this].push(idea);
      });
    });
    
    return $keys(tags).sort().join(', ');
  },
  
  
  cat_label_singular: function(state) { return state.category_label.toLowerCase().singularize(); },
  idea_title:  function(state) { return state.idea_r.title; },
  idea_action: function(state) { return state.idea_r.action; },
  idea_instructions: function(state) { return state.idea_r.instructions; },
  idea_comments: function(state) { return ''; }
  
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

