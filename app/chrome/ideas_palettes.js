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


LiveHTML.widgets.push({
  
  adventures: function(state) {
    return Tiles.adventure_tile.tt(adventures) + Tiles.proj_tile.tt(wishes);
  },

  adventures6: function(state) {
    return Tiles.adventure_tile.tt(adventures.slice(0,3)) + Tiles.proj_tile.tt(wishes.slice(0,3));
  },
  
  my_wishes: function(state) {
    if (!CurrentUser.wishes || CurrentUser.wishes == '') 
      return "<div class='redbox'>You don't have any action ideas yet!</div>";
    return CurrentUser.wishes.split('; ').map(function(x){
      if (x == '') return;
      var wishwords = x.split(' ');
      var time = wishwords.shift();
      var where = wishwords.shift();
      var text = wishwords.join(' ');
      if (where == 'agent') return Tiles.proj_tile.t({what:text, who:CurrentUser.title});
      else {
        var place = where.resource();
        var thumb = place && place.thumb_url;
        var place_title = place && place.title;
        return Tiles.adventure_tile.t({item_tag:where, thumb:thumb, what:text, where:place_title});
      }
    }).compact().join('');
  }
  
});
