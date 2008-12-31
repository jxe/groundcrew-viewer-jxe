var agents = [
{
  name: 'Joe',
  time: '20 MIN',
  wants: 'ADVENTURE',
  gifts: 'running, climbing, gourmet food, puzzles'
},
{
  name: 'Sally',
  time: '1 HR',
  wants: 'PEACEFUL MOMENTS',
  gifts: 'knitting, hostage negotiation'
}]

var adventures = [
{
  where: 'Pulaski Park',
  what: 'Good Deeds',
  when: '10 minutes'
},
{
  where: 'Haymarket Cafe',
  what: 'Briefcase Exchanges',
  when: '15 minutes'
},
{
  where: 'Smith Athletic Fields',
  what: 'Wargames',
  when: '25 minutes'
}

]

Viewer.apps.hero = {
  url_part_labels: $w('city adventure'),
  
  adventures: function(state) {
    return adventures.map(function(a){ return Viewer.apps.hero.adventure_t.t(a); }).join('');
  },
  
  resources: function(state) {
    return "cars, filing cabinets, public phones, furniture, lawnmowers, people";
  },

  projects: function(state) {
    return "bike path renovation, groundcrew publicity, main st decorations, downtown dance party prep";
  },
  
  agents_to_guide: function(state) {
    return agents.map(function(a){ return Viewer.apps.hero.agent_t.t(a); }).join('');
  },
  
  adventure_t: '<div class="adventure"><img src="i/idea.png"/><div class="title"><b>#{where}</b>. &nbsp; #{what}?</div>\
    Could start in <u>#{when}</u>.</div>',
    
  agent_t: '<div class="aagent"><b>Agent #{name}</b><span>HAS #{time} FOR #{wants}</span><br>\
    <i>LIKES</i> #{gifts}</div>'
    
};
