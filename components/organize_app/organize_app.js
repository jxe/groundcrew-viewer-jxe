Viewer.apps.organize = {
  url_part_labels: $w('squad city item live_event'),

  marker_clicked: function(tag, state) {
    squad = state.squad || 'your_personal_squad';
    Viewer.go('/organize/'+ squad +'/:city/' + tag);
  },

  // debug
  show_live_event: function (state) {
    $('#welcome').remove();
    MapMarkers.open(state.item, $.template('#assignment_editor_iw').app_paint()[0], 16);
  },

  show_item: function(state) {
    if (state.item.startsWith('Person'))
      MapMarkers.open(state.item, $.template('#organize_agent_iw').app_paint()[0], 16);
    if (state.item.startsWith('Landmark'))
      MapMarkers.open(state.item, $.template('#organize_landmark_iw').app_paint()[0], 16);
  },

  display_assignment_editor: function(state) {
    return MapMarkers.open(state.item, $.template('#assignment_editor_iw').app_paint()[0], 16);
  },

  display_build_experience: function(state) {
    return MapMarkers.open(state.item, $.template('#idea_catalog_iw').app_paint()[0], 16);
  },

  display_landmark_editor: function(state, ref_template) {
    state.ref_template = ref_template
    return MapMarkers.open(state.item, $.template('#landmark_editor_iw').app_paint()[0], 16);
  },

  build_pos_form_submitted: function(data, state) {
    return MapMarkers.open(state.item, $.template('#idea_catalog_iw').app_paint()[0], 16);
  },

  idea_catalog_form_submitted: function(data, state) {
    return MapMarkers.open(state.item, $.template('#assignment_editor_iw').app_paint()[0], 16);
  },

  send_assignment_form_submitted: function(data, state) {
    // debug
  /*
    ev = event("Annc__2400",1234657235,"invite","Person__51315",null,null,null,null,null,{"landmark_tag":state.item, "reach": 23, 'msg':'random stuffz'});
    EventDb.watched[ev.landmark_tag] = ev.annc_tag;

    return MapMarkers.open(state.item, $.template('#live_event_iw').app_paint()[0], 16);
  */

    Ajax.fetch('/gc/invite', {invitation:data}, function(ev){
      EventDb.watch[ev.landmark_tag] = ev.annc_tag;
      return MapMarkers.open(
        state.item, $.template('#live_event_iw').app_paint()[0], 16);
    });
  },

  send_landmark_form_submitted: function(data, state) {
    // do server stuff

    // return to referrer template
    var ref_template = 'organize_landmark_iw';
    if (state.ref_template) {
      ref_template = state.ref_template;
    }
    return MapMarkers.open(
      state.item, $.template('#' + ref_template).app_paint()[0], 16);
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
