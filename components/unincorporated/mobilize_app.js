Viewer.apps.mobilize = {
  url_part_labels: $w('city category idea item'),
  
  marker_clicked: function(tag, state) {
    if (!state.category) return false;
    if (tag[0] != "L") return false;
    if (state.idea) return Viewer.go('/mobilize/:city/:category/:idea/' + tag);
    else Viewer.go('/organize/:city/' + tag);
  },
  
  ideas_form_submitted: function(data, state, form) {
    var idea_tag = data.idea;
    var idea;
    if (data.what && !$(form.what).hasClass('prompting')) {
      idea = Ideas.local({ atags: state.category, title: data.what, action: data.what });
      idea_tag = idea.item_tag;
    }
    if (!idea) idea = idea_tag.resource();
    var text = state.agents.length + " agents are standing by.  Would you like to organize them to '"+ idea.title +"'?";
    if (confirm(text)) Viewer.go(idea_tag);
  },
  
  instructions_form_submitted: function(data, state, form) {
    Ajax.fetch('/gc/idea', {atags: state.category, act: data.action, instructions: data.instr, ltypes:data.ltypes}, function(idea){
      Ideas.add_or_update(idea);
      state.selected_idea = idea.item_tag;
      // $('select[fill=idea_select]').html(self.idea_select(state));
    });
  },
  
  
  // item and idea level stuff
  
  idea_select_changed: function(new_idea, state) { },
  
  idea_edit: function(state) {
    $.facebox($.template('#edit_idea_dialog').app_paint()[0]);
  },
  
  set_idea: function(idea, state, changed) {
    state.idea_r = idea && idea.resource();
    state.idea_title = state.idea_label = idea && state.idea_r.title;
    state.idea_action = idea && state.idea_r.action;
    state.idea_instructions = idea && state.idea_r.instructions;
    state.idea_comments = '';
  },
    
  show_item: function(state) {
    if (state.item.startsWith('Landmark')) {
      return MapMarkers.open(state.item, $.template('#invite_iw').app_paint()[0], 17);
    }
  },
  
  trash_idea: function(state) {
    alert('This needs to be implemented!');
  },
  
  
  // category level stuff
  
  set_category: function(category, state, changed) {
    if (!category) { delete state.agents; return; }
    var ideas = Ideas.find('::words ' + category);
    if (ideas[0].atags) {
      var atag = ideas[0].atags.split(' ')[0];
      state.agents = Agents.find("=city_id " + state.city.resource_id() + " :atags " + atag);
      state.category_label = (Category[category] || category).toLowerCase(); 
      if (Category[category]) state.cat_label_singular = state.category_label.singularize().indef_article();
      else                    state.cat_label_singular = (state.category + " idea").indef_article();
    }
  },
  
  
  // alt renderings
  
  show_category: function(state) {
    if (state.category == 'celebrations') Viewer.render('show_celebrations');
  },
  
  celebrate_form_submitted: function(data, state, form) {
    var clean = data.celebration.replace(/[^a-zA-Z0-9-_ ]/, '_');
    var title = "celebrate " + clean;
    var idea = Ideas.local({ atags: 'parties', title: title, action: title });
    Viewer.go(idea.item_tag);
  },
      
  recent_celebrations: function(state) {
    return 'various things';
  },
  
  
  // dyn fills
  
  idea_select: function(state) { 
    // return Ideas.find("::words " + state.category).as_option_list(state.selected_idea); 
    var selected = state.selected_idea;
    return Ideas.find("::words")[state.category].map(function(x){ 
      // var title = x.title + "&nbsp; <i>test of snippet</i>";
      return "<option "+ (selected == x.item_tag ? " selected " : "") +"value='"+x.item_tag+"'>" + x.title + "</option>"; 
    }).join();
  },
  
  idea_tag_cloud: function(state) {
    var tags = Ideas.find('::words');
    tags.celebrations = '#/mobilize/:city/celebrations';
    tags.allies = '#/stand/:city';
    tags.helpers = '#/allies/:city';
    
    var atag_counts = Agents.find('=city_id ' + state.city.resource_id() + " :atags");
    var mine = CurrentUser.atags.split(' ');

    return $keys(tags).sort().map(function(x){
      var ideas = tags[x];
      if (ideas[0] == '#') {
        return tag('a.mine.s4', {content: x, href:ideas});
      } else {
        var agents_count = atag_counts[ideas[0].atags.split(' ')[0]].length;
        var clss = (agents_count < 14 ? 's1' : agents_count < 16 ? 's2' : 's3');
        if (mine.contains(x)) clss += ".mine";
        var label = Category[x] ? Category[x].toLowerCase() : x;
        return tag('a.' + clss, {content: label, href:"#"+x});
      }
    }).join(' ');
  }
  
};
