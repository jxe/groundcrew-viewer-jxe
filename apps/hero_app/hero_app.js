var atag_trans = {
  conn: 'connection',
  bene: 'kindness',
  food: 'food',
  adv: 'adventures',
  mgames: 'puzzles',
  vol: 'volunteering',
  stretchme: 'challenge',
  stealth: 'stealth',
  pchal: 'challenge',
  pgrowth: 'challenge',
  convo: 'conversation',
  beauty: 'beauty',
  raok: 'kindness'
};

function agent_wants(agent){
  var translated = agent.atags.split(' ').map(function(x){ return atag_trans[x]; }).compact();
  if (translated.length == 0) return null
  return translated.choose_random().toUpperCase();
}


var resources = [
  { what: 'Joe\'s car' },
  { what: 'library shelves' },
  { what: 'Alex\'s telephone' },
  { what: 'Kate\'s lawnmower' },
  { what: 'free furniture' }
];

var wishes = [
  { what: 'bike path renovation' },
  { what: 'groundcrew publicity' },
  { what: 'main st decorations' },
  { what: 'downtown dance party prep' }
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

]

Viewer.apps.hero = {
  url_part_labels: $w('city adventure'),
  
  adventures: function(state) {
    var projects = wishes.map(function(a){ return Viewer.apps.hero.proj_t.t(a); }).join('');
    
    return adventures.map(function(a){ return Viewer.apps.hero.adventure_t.t(a); }).join('') + projects;
  },
  
  resources: function(state) {
    return resources.map(function(a){ return Viewer.apps.hero.resource_t.t(a); }).join('');
  },

  agents_to_guide: function(state) {
    var agents = Agents.find("=city_id " + Viewer.selected_city);
      
    return agents.map(function(a){ 
      a.wants = agent_wants(a);
      a.time = ['20 MIN', '1 HR', '5 MIN'].choose_random();
      return Viewer.apps.hero.agent_t.t(a);
    }).join('');
  },
      
  agent_t: '<div onclick="Viewer.open(\'#{item_tag}\');"><img src="http://groundcrew.us#{thumb_url}"/>HAS #{time} FOR<br/><b>#{wants}</b></div>',

  adventure_t: '<div>#{where}<img src="#{thumb}"/><b>#{what}&#9660;</b></div>',

  resource_t: '<div><img src=""/><b>#{what}</b></div>',
  
  proj_t: '<div>#{what}</div>'  
    
};
