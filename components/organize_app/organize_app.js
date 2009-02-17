Viewer.apps.organize = {
  url_part_labels: $w('squad city item'),

  marker_clicked: function(tag, state) {
    squad = state.squad || 'your_personal_squad';
    Viewer.go('/organize/'+ squad +'/:city/' + tag);
  },

  show_item: function(state) {
    if (state.item.startsWith('Person'))
      MapMarkers.open(state.item, $.template('#organize_agent_iw').app_paint()[0], 16);
    if (state.item.startsWith('Landmark'))
      MapMarkers.open(state.item, $.template('#organize_landmark_iw').app_paint()[0], 16);
  },
  
  display_assignment_editor: function(state) {
    return MapMarkers.open(state.item, $.template('#assignment_editor').app_paint()[0], 16);
  },
  
  build_pos_form_submitted: function(data, state) {
    return MapMarkers.open(state.item, $.template('#idea_catalogue_iw').app_paint()[0], 16);
  },

  idea_catalogue_form_submitted: function(data, state) {
    return MapMarkers.open(state.item, $.template('#assignment_editor').app_paint()[0], 16);
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
  

  build_experience: function (state) {
    MapMarkers.open(state.item, $.template('#idea_catalogue_iw').app_paint()[0]);
  },

  sanitize_category: function (category) {
    return category.replace(' ', '_');
  },

  idea_categories: function (state) {
    var data = '';

    $keys(IdeaCatalogue).map(function (cat) {
      cat = Viewer.apps.organize.sanitize_category(cat);
      data += '<a id="idea_catalogue_categories_' + cat + '" href="##set_category/' + cat + '">' + cat + '</a><br />' + "\n";
    });
    data += '<a id="idea_catalogue_categories_all" href="##set_category/all" class="highlight">Show all</a>' + "\n";

    return data;
  },

  set_category: function (state, category) {
    state.category = category || 'all';

    $keys(IdeaCatalogue).map(function (cat) {
      var cat = Viewer.apps.organize.sanitize_category(cat);
      if (state.category != cat) {
        $('#idea_catalogue_categories_' + cat).removeAttr('class');
      }
    });
    $('#idea_catalogue_categories_all').removeAttr('class');

    $('#idea_catalogue_categories_' + category).attr('class', 'highlight');
    $('#idea_catalogue_ideas').app_paint();
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
  }
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
