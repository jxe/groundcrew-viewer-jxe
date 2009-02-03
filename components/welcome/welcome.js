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

Viewer.apps.hero = {
  url_part_labels: $w('city adventure'),
  
  resources: function(state) {
    return resources.map(function(a){ return Viewer.apps.hero.resource_t.t(a); }).join('');
  }
  
};
