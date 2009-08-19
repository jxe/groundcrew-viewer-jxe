//
// this is data which we don't yet have server side, but
// want to test the UI for
//

AllWishes = [
  {
    thumb_url: 'http://groundcrew.us//system/0000/0043/thomas.jpg',
    type:      'Citizen investigations',
    title:     'Document the upcoming town meeting',
    agent:     'Thomas Goorden',
    posx:      21,
    req:       20
  },
  
  {
    thumb_url: 'http://groundcrew.us//uploads/avatars/thumb_1.jpg?1227490104',
    type:      'Neighborhood improvement',
    title:     'Bike path plantings',
    agent:     '3oe',
    posx:      48,
    req:       30
  },
  
  {
    thumb_url: 'http://groundcrew.us//system/0000/0030/facebook_003.jpg',
    type:      'Brainstorm',
    title:     'Discuss improving the town water supply',
    agent:     'Molly427',
    posx:      120,
    req:       40
  },
  
  {
    thumb_url: 'http://groundcrew.us//uploads/avatars/thumb_1.jpg?1227490104',
    type:      'Adventures and games',
    title:     'Teens and elders hillside FLASHMOB',
    agent:     '3oe',
    posx:      48,
    req:       1000
  },
  
  {
    thumb_url: 'http://groundcrew.us//uploads/avatars/thumb_1.jpg?1227490104',
    type:      'Adventures and games',
    title:     'Capture the Flag at Pulaski Park',
    agent:     '3oe',
    posx:      48,
    req:       200
  }
  
];

Wishes = {
  t: '<div class="wish"><div class="thumb"><img src="#{thumb_url}" /></div>\
      <div class="info">#{type}<br/> <strong>#{title}</strong><div class="xtra_info">from agent <b>#{agent}</b> (#{posx} POSX); requires <b>#{req}</b> people.</div></div>\
      <div class="actions"> <button class="primary">Approve</button><button>Reject</button></div></div><hr class="clear spacer" />'
};

QuestionAnswers = {
  t: '<div class="wish"><div class="thumb"><img src="#{thumb_url}" /></div>\
      <div class="info"><strong><a href="#mode=Dispatch;item=#{guy}">#{answer}</a></strong><div class="xtra_info">from agent <b>#{agent}</b> at #{time}</div></div><hr class="clear spacer" />'
};


Snippets = {
  celebrate_by: [
    { id: 'bow', title:'bowing down'},
    { id: 'wave', title:'waving your hands in the air'},
    { id: 'boogie', title:'boogie'},
    { id: 'rhythm_machine', title:'make a beat together'},
    { id: 'circle_dance', title:'hold hands in a circle and dance around'}
  ],
  
  end_by: [
    { id: 'om', title:'saying a long "Om" together'},
    { id: 'yell_yeehaw', title: 'Yelling "Yeehaw!"'},
    { id: 'handshake_and_wink', title: 'giving everybody a handshake and a wink'},
    { id: 'run_screaming', title: 'running away screaming'},
    { id: 'shush', title: 'shushing everybody and slinking away'}
  ]
};

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
