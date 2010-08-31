go.push({
  
  all_ideas: function(state) {
    return Ideas.all.map(function(idea){
      var category = idea.provides.split(' ')[0];
      return tag('div.agent_idea', HTML.dog(category) + link(idea.title, "#//ideas/:city/" + idea.id));
    }).join('');
  },
  
  ops_are_live: function(state) {
    var ops = Ops.here();
    return ops.length != 0;
  },
    
  rssfeed: function(state) {
    alert('Contact us to activate RSS feeds for your account.');
  },
  
  adventures: function(state) {
    return Tiles.adventure_tile.tt(adventures) + Tiles.proj_tile.tt(wishes);
  },

  adventures6: function(state) {
    return Tiles.adventure_tile.tt(adventures.slice(0,3)) + Tiles.proj_tile.tt(wishes.slice(0,3));
  },
    
  my_wishes: function(state) {
    if (!This.user.wishes || This.user.wishes == '') 
      return "<div class='redbox'>You don't have any action ideas yet!</div>";
    return This.user.wishes.split('; ').map(function(x){
      if (x == '') return;
      var wishwords = x.split(' ');
      var time = wishwords.shift();
      var where = wishwords.shift();
      var text = wishwords.join(' ');
      if (where == 'agent') return Tiles.proj_tile.t({what:text, who:This.user.title});
      else {
        var place = where.resource();
        var thumb = place && place.thumb_url;
        var place_title = place && place.title;
        return Tiles.adventure_tile.t({id:where, thumb:thumb, what:text, where:place_title});
      }
    }).compact().join('');
  }
  
});
