// adventure
// art
// beauty
// celebrating
// challenge
// connection
// crafting
// creation
// debate
// discussion
// fun
// investigating
// kindness??
// knitting
// learning
// meeting
// music
// nature
// peace
// performance
// rendezvous
// restoration
// stealth
// teamwork
// visions
// volunteering


// item - an item on the map
function item(city, tag, title, thumb_url, lat, lng, atags, latch, comm, req, x){
  return Resource.add_or_update(tag, {
    city_id: city,
    title: title,
    thumb_url: thumb_url,
    lat: lat,
    lng: lng,
    atags: atags,
    latch: latch,
    comm: comm,
    req: req
  }, x);
}


$.extend(Resource.prototype, {
  in_city: function(city, more) {
    return this.find("=city_id " + city) || [];
  },
  
  here: function(n) {
    var result;
    if (This.city) {
      if (This.q) result = this.find("=city_id " + This.city_id + " :has " + This.q) || [];
      else result = this.find("=city_id " + This.city_id) || [];
    } else {
      if (This.q) result = this.find(":has " + This.q) || [];
      else {
        Agents.find('=city_id');
        result = this.all || [];
      }
    }
    if (n) result = result.slice(0, n);
    return result;
  }
});

Persons = Agents = new Resource('Person', {
  enhancer: function(item) { Item.calculate_fields(item); },
  changed: function(what_changed) { 
    if (what_changed[This.user.tag]) $.extend(This.user, what_changed[This.user.tag]);
    $.each(what_changed, function(k, v){ MapMarkers.update_marker(k); });
    if (This.agents) Frame.populate_flexbar_agents(This.agents);
  }
});

Landmarks = new Resource('Landmark');


Item = {

  atags_to_upfors: {
    conn: 'connection',
    // bene: 'kindness',
    // food: 'food',
    art: 'art',
    adv: 'adventure',
    // mgames: 'puzzles',
    vol: 'volunteering',
    stretchme: 'challenge',
    stealth: 'stealth',
    pchal: 'challenge',
    pgrowth: 'challenge',
    convo: 'discussion debate',
    beauty: 'nature quiet',
    // raok: 'kindness',
    cornerfun: 'strangeness'
  },
  
  calculate_fields: function(item) {
    for (var i in Item.calculated_fields)
      item[i] = Item.calculated_fields[i](item);
  },
  
  calculated_fields: {
    
    upfor: function(item) {
      if (!item.atags) return;
      return item.atags.split(' ').map(function(x){ return Item.atags_to_upfors[x]; }).compact().uniq().join(' ');
    },
    
    wants: function(item) {
      if (!item.atags) return;
      var readywords = item.atags.split(' ').map(function(x){ return Item.atags_to_upfors[x]; }).compact().join(' ').split(' ').uniq();
      if (readywords.length == 0) return "???";
      return readywords.choose_random().toUpperCase();
    },
    
    time_avail: function(item) {
      return ['20 MIN', '1 HR', '30 MIN', '5 MIN'].choose_random();
    },
    
    readywords: function(item) {
      if (!item.atags) return;
      return item.atags.split(' ').map(function(x){ return Item.atags_to_upfors[x]; }).compact();
    },
            
    locked: function(item) {
      if (!item.latch) return false;
      if (item.latch.split(' ').indexOf(This.user.tag) >= 0) return false;
      return true;
    },
    
    map_icon: function(item) {
      if (Selection.current[item.id]) return 'sman';
      if (!item.latch || !item.comm) return 'brownman';
      var comm = item.comm.split(' ');
      var latch = item.latch.split(' ');
      if (latch.contains("latched")) {
        if (latch.contains(This.user.tag)) return 'brownman';
        else return 'grayman';
      }
      if (comm.contains('engaged')) {
        var current_time = Date.unix();
        var comm_time = Number(comm.pop());
        if (current_time - comm_time < 30 * 60) return "greenman";
        else return "wman";
      }
      if (comm.contains("green")) return "greenman";
      if (item.pgoal) return 'rgman';
      else return "wman";
    },

    thumb_url: function(item) {
      if (item.thumb_url) return item.thumb_url;
      return 'i/agent-smith.jpg';
    },
    
    availability_status: function(item){
      if (!item.latch || !item.comm) return 'inaccessible';
      var comm = item.comm.split(' ');
      var latch = item.latch.split(' ');
      if (!latch.contains("unlatched")) return "assigned";
      if (comm.contains("engaged")) {
        var current_time = Date.unix();
        var comm_time = Number(comm.pop());
        if (current_time - comm_time < 30 * 60) return "ready";
        else return "available";
      }
      if (comm.contains("green")) return "ready";
      if (comm.contains("unreachable")) return "inaccessible";
      return "available";
    }
    
  }
  
};
