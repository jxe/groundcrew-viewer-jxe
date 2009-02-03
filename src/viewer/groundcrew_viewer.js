var wishes = [
  { what: 'bike path renovation', who: 'JimBob' },
  { what: 'groundcrew publicity', who: '3oe' },
  { what: 'main st decorations', who: 'Alex' },
  { what: 'downtown dance party prep', who: 'Marianne' }
];

var adventures = [
{
  where: 'Student Center',
  thumb: 'http://mw2.google.com/mw-panoramio/photos/square/6411087.jpg',
  what: 'GOOD DEEDS',
  when: '10 minutes'
},
{
  where: 'Waterfall',
  thumb: 'http://mw2.google.com/mw-panoramio/photos/square/5460471.jpg',
  what: 'RENDEZVOUS',
  when: '15 minutes'
},
{
  where: 'Athletic Fields',
  thumb: 'http://farm3.static.flickr.com/2369/1706799173_cc121546e1_s.jpg',
  what: 'WARGAMES',
  when: '25 minutes'
}

];



$.extend(Viewer, {

  adventures: function(state) {
    var projects = wishes.map(function(a){ return Templates.proj_tile.t(a); }).join('');
    return adventures.map(function(a){ return Templates.adventure_tile.t(a); }).join('') + projects;
  },

  adventures6: function(state) {
    var projects = wishes.map(function(a){ return Templates.proj_tile.t(a); }).slice(0, 3).join('');
    return adventures.map(function(a){ return Templates.adventure_tile.t(a); }).slice(0, 3).join('') + projects;
  },

  agents_to_guide: function(state) {
    var agents = Agents.find("=city_id " + Viewer.selected_city);
    return agents.map(function(a){ 
      a.wants = agent_wants(a);
      a.time = ['20 MIN', '1 HR', '5 MIN'].choose_random();
      return Templates.agent_tile.t(a);
    });
  },

  agents_to_guide6: function(state) {
    return Viewer.agents_to_guide(state).slice(0,6).join('');
  },  

  agents_to_guide_all: function(state) {
    return Viewer.agents_to_guide(state).join('');
  },
  
  limit_ltype: function(state, how) {
    if (state.ltype == how) how = null;
    state.ltype = how;
    $('#lm_limits').attr('limit', how || 'all');
    $('select[fill=lm_select]').html(Viewer.lm_select(state));
  },
  
  lm_select: function(state) { 
    if (!state.ltype) return Landmarks.in_city(state.city).as_option_list();
    return Landmarks.in_city(state.city, ":ltypes " + state.ltype).as_option_list();
  },
  
  limit_park: function(state)   { Viewer.limit_ltype(state, 'park'); },
  limit_cafe: function(state)   { Viewer.limit_ltype(state, 'cafe'); },
  limit_street: function(state) { Viewer.limit_ltype(state, 'street'); },
  limit_room: function(state)   { Viewer.limit_ltype(state, 'room'); },

  new_landmark: function(state) {
    if (!logged_in) return Viewer.join_please();
    $.template('#new_landmark_dialog').show_dialog(function(form){
      Ajax.fetch('/gc/create_landmark', form, function(ev){
        EventDb.add(ev);
        Viewer.go('');
      });
    });
  },

  join_please: function() {
    $.facebox($('#join_fbox').html());
  },
  
  
  ag_ct:          function(state) { return pluralize(state.agents.length, 'agent'); },
  item_thumb_url: function(state) { if (state.item_r) return state.item_r.thumb_url; },
  item_title:     function(state) { return state.item_r.title; }

});
