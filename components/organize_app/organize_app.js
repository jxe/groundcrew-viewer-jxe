Viewer.apps.organize = {
  url_part_labels: $w('squad city item live_event'),

  marker_clicked: function(tag, state) {
    squad = state.squad || 'your_personal_squad';
    Viewer.go('/organize/'+ squad +'/:city/' + tag);
  },

  // debug
  show_live_event: function (state) {
    Viewer.render_item('assignment_editor');
  },

  show_item: function(state) {
    if (state.item.startsWith('Person'))   Viewer.render_item('organize_agent', 16);
    if (state.item.startsWith('Landmark')) Viewer.render_item('organize_landmark');
  },

  display_assignment_editor: function(state) {
    Viewer.render_item('assignment_editor');
  },

  display_build_experience: function(state) {
    Viewer.render_item('idea_catalog');
  },

  display_landmark_editor: function(state, ref_template) {
    state.ref_template = ref_template
    Viewer.render_item('landmark_editor');
  },

  build_pos_form_submitted: function(data, state) {
    Viewer.render_item('idea_catalog');
  },

  idea_catalog_form_submitted: function(data, state) {
    Viewer.render_item('assignment_editor');
  },

  send_assignment_form_submitted: function(data, state) {
    // Ajax.fetch('/gc/invite', {invitation:data}, function(ev){
    EventDb.watch[ev.landmark_tag] = ev.annc_tag;
    Viewer.render_item('live_event');
  },

  send_landmark_form_submitted: function(data, state) {
    // Ajax.fetch('/gc/edit_landmark', {lm:data}, function(ev){

    // return to referrer template
    var ref_template = 'organize_landmark';
    if (state.ref_template) { ref_template = state.ref_template; }
    Viewer.render_item('ref_template');
  },
  
  on_new_event: function(event) {
    if (!this.state.item || !event.re || !EventDb.by_tag[re]) return;

    // are we displaying it's parent right now?
    if (this.state.item == EventDb.by_tag[event.re].landmark_tag) {
      Ajax.post_process_new_events['update_current_watched_event'] = function(){ Viewer.render_item('live_event'); };
    }
  },
  
  
  item_status: function(state)     { return "This agent is available."; },
  item_believesin: function(state) { return " "; },
  item_celebrates: function(state) { return " "; },
  item_helpwith: function(state)   { return " "; },
  item_didrecent: function(state)  { return " "; },

  everyone_will: function(state) {
    return "Touch your nose/Smile mischeviously/Make hand signals/Caress yourself/Hum quietly/Look mysterious".split('/').map(function(x){
      return "<option>" + x + "</option>";
    }).join('');
  },

  sanitize_category: function (category) {
    return category.replace(' ', '_');
  },

  idea_categories: function (state) {
    var data = '';

    $keys(IdeaCatalogue).map(function (cat) {
      cat = Viewer.apps.organize.sanitize_category(cat);
      data += '<a id="idea_catalog_categories_' + cat + '" href="##set_category/' + cat + '">' + cat + '</a><br />' + "\n";
    });
    data += '<a id="idea_catalog_categories_all" href="##set_category/all" class="highlight">Show all</a>' + "\n";

    return data;
  },

  set_category: function (state, category) {
    state.category = category || 'all';

    $keys(IdeaCatalogue).map(function (cat) {
      var cat = Viewer.apps.organize.sanitize_category(cat);
      if (state.category != cat) {
        $('#idea_catalog_categories_' + cat).removeAttr('class');
      }
    });
    $('#idea_catalog_categories_all').removeAttr('class');

    $('#idea_catalog_categories_' + category).attr('class', 'highlight');
    $('#idea_catalog_ideas').app_paint();
  },

  idea_ideas: function (state) {
    var data = '';

    state.category = state.category || 'all';
    $keys(IdeaCatalogue).map(function (cat) {
      sanitized_cat = Viewer.apps.organize.sanitize_category(cat);
      if (state.category == sanitized_cat || state.category == 'all') {
        for (var i = 0; i < IdeaCatalogue[cat].length; i++) {
          var idea = IdeaCatalogue[cat][i]['name'];
          data += '<option value="' + idea + '">' + idea + "</option>";
        }
      }
    });

    return data;
  },

  live_event_info: function (state) {
    var parent_annc_tag = EventDb.watched[state.item];
    if (!parent_annc_tag) return 'No event!';

    var data = '';
    EventDb.events.map(function (ev) {
      if (ev.re == parent_annc_tag || ev.annc_tag == parent_annc_tag) {
        ev = Event.improve(ev);
        data += Templates.event.t(ev);
      }
    });
    return data;
  },

  live_event_landmark: function (state) {
    return state.item.resource().title;
  },
};

var IdeaCatalogue = { 'good deeds': [

{ 'name': 'clean up litter' },
{ 'name': 'hand out flowers to strangers' },
{ 'name': 'compliment strangers' },
{ 'name': 'guerilla gardening' }

], 'adventures': [

{ 'name': 'stealthy travel' },
{ 'name': '15 minute dreams' },
{ 'name': 'infiltrate a social scene' }

], 'art projects': [

{ 'name': 'learn a song' },
{ 'name': 'group sculpture' },
{ 'name': 'knitting circle' }

] };
