Viewer.apps.ideas = {
  url_part_labels: $w('city item'),

  show_item: function(state) {
    Viewer.render_item('idea_catalog');
  },

  idea_category_changed: function(new_category, state) {
    state.category = new_category;
    $('select[fill=idea_ideas]').html(Viewer.apps.ideas.idea_ideas(state));
  },
  
  idea_categories: function (state) {
    return $keys(IdeaCatalogue).as_option_list(state.category, '-', '-');
  },

  idea_ideas: function (state) {
    return IdeaCatalogue[state.category || 'all'].as_option_list(null, 'name', 'name');
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

IdeaCatalogue['all'] = $values(IdeaCatalogue).flatten();
