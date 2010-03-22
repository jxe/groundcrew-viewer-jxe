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

var most_recent_item = null;
var fuzzfactor = {};

function make_fuzzfactor(){
  var xfuzz = Math.random() * 0.05 - 0.025;
  var yfuzz = Math.random() * 0.05 - 0.025;
  return [xfuzz, yfuzz];
}

// item - an item on the map
function item(city, tag, title, thumb_url, lat, lng, atags, latch, comm, req, x){
  // ignore items if this stream can't communicate with them
  var reachable_by = (comm && comm.split(/ /)[3] || '').split('');
  var via_sys = reachable_by.intersect(App.current_stream_systems()).join('');
  if (demo && via_sys.length == 0) via_sys = App.current_stream_systems();
  if (MapMarkers.type(tag) == 'agents' && via_sys.length < 1) return null;

  // country state state city zip
  if (x && (x.acc == 'zip' || x.acc == 'city') && lat && lng) {
    if (!fuzzfactor[tag]) fuzzfactor[tag] = make_fuzzfactor();
    lat = Number(lat) + fuzzfactor[tag][0];
    lng = Number(lng) + fuzzfactor[tag][1];
  }
  return most_recent_item = Resource.add_or_update(tag, {
    city_id: city,
    title: title,
    thumb_url: thumb_url,
    lat: lat,
    lng: lng,
    atags: atags,
    latch: latch,
    comm: comm,
    req: req,
    via_sys: via_sys
  }, x);
}

function off(tag){
  if (!tag) return;
  type = MapMarkers.type(tag);
  if (type == 'agents') {
    Agents.remove(tag);
    This.agents = Agents.here();
    Facebar.populate(This.agents);
  } else if (type == 'landmarks') {
    Landmarks.remove(tag);
  }
  Map.site_remove(type, tag);
}

$.extend(Resource.prototype, {
  in_city: function(city, more) {
    return this.find("=city_id " + city) || [];
  },

  here: function(n) {
    var result;
    if (This.city) {
      result = this.find("=city_id " + This.city_id) || [];
    } else {
      result = this.everything() || [];
    }
    if (This.q) {
      var query = This.q.toLowerCase();
      result = result.grep(function(x){
        var strings = (x.upfor + " " + x.has + " " + x.title).toLowerCase();
        return strings.match(query);
      });
    }
    if (n) result = result.slice(0, n);
    return result;
  },

  nearby: function(lat, lng, distance_in_meters) {
    var x = new GLatLng(lat, lng);
    return this.here().grep(function(thing){
      var y = new GLatLng(thing.lat, thing.lng);
      var distance = x.distanceFrom(y);
      return distance < distance_in_meters;
    });
  }

});

Persons = Agents = new Resource('Person', {
  enhancer: function(item) {
    item.recent_events = [];
    Item.calculate_fields(item);
  },
  changed: function(what_changed) {
    if (what_changed[This.user.vtag]) $.extend(This.user, what_changed[This.user.vtag]);
    if (App.loaded && This.agents) {
      if (Agents.something_added) {
        This.agents = Agents.here();
        if (Map.layer_visible['agents']) Map.layer_recalculate('agents');
      }
      if (Landmarks.something_added) {
        // Map.site_add('landmarks', )
      }
      Facebar.populate(This.agents);
      $.each(what_changed, function(k, v){
        if (This.item == k) {
          This._item = v;
          App.refresh_mapwindow();
        }
        if (Map.site_exists('agents', k)) {
          if (v.city_id == This.city_id) Map.site_move('agents', k, v.lat, v.lng);
          else Map.site_remove('agents', k);
        } else {
          $('#objects_nav').app_paint();
        }
      });
    }
  },
  has_question: function(item) {
    return item && ("" + item.msg + item.update).contains('?');
  },
  has_problem: function(item) {
    return item && ("" + item.update).startsWith('problem:') && item.update_ts >= item.msg_ts;
  },
  concern: function(item) {
    return item.msg ? item.msg : item.update;
  }
});


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
    $.each(Item.calculated_fields, function(){
      if (!item) return true;
      var field = this[0];
      var fn = this[1];
      item[field] = fn(item);
      return true;
    });
  },

  calculated_fields: [
    ['upfor', function(item) {
      if (!item || !item.atags) return null;
      return item.atags;
      // return item.atags.split(' ').map(function(x){ return Item.atags_to_upfors[x]; }).compact().uniq().join(' ');
    }],

    ['time_avail', function(item) {
      return ['20 MIN', '1 HR', '30 MIN', '5 MIN'].choose_random();
    }],

    ['immediate', function(item) {
      if (demo) return true;
      return item.via_sys && item.via_sys.length > 0 && item.via_sys != 'e';
    }],

    ['badges', function(item) {
      var badges = '';
      if (!item.immediate) badges += '<img src="i/icons/turtle.png" class="badge"/>';
      return badges;
    }],

    ['map_icon', function(item) {
      if (Selection.is_item_selected(item.id)) return 'sman';
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
    }],

    ['thumb_url', function(item) {
      if (item.thumb_url) return item.thumb_url.gcify_url();
      return 'i/swirl.jpg';
    }],

    ['last_ts_ago', function(item) {
      if (!item.comm) return 0;
      var comm  = item.comm.split(' ');
      var they_said_ts     = comm[1] || 0;
      var we_said_ts       = comm[2] || 0;
      return -Math.max(they_said_ts, we_said_ts);
    }],

    ['fab_state', function(item){
      // some backward compat fixes
      if (!item.transients) item.transients = {};
      if (!item.answers)    item.answers    = {};
      if (!item.latch || !item.comm)    return 'inaccessible';
      var comm  = item.comm.split(' ');
      var latch = item.latch.split(' ');
      if (comm.contains("unreachable")) return "inaccessible";
      if (latch.contains("unknown"))    return "unknown";

      // parse recent content
      var last_event         = item.recent_events && item.recent_events.last();
      var last_answer_and_ts = $values(item.answers).sort_by(function(x){ return -x[1]; })[0];
      var most_recent_answer = last_answer_and_ts && Date.within(last_answer_and_ts[1], 24*60*60) && last_answer_and_ts[0];

      // calculate timestamps
      var they_said_ts     = Number(comm[1] || 0);
      var we_said_ts       = Number(comm[2] || 0);
      var last_ts          = Math.max(they_said_ts, we_said_ts);
      var within_four_hrs  = Date.within(last_ts, 4 * 60 * 60);
      var within_three_min = Date.within(last_ts, 3 * 60);
      var latch_start = item.latch.to_mspec().start;
      var their_court = (
        (we_said_ts > they_said_ts + 2) ||
        (last_event && last_event.atype == 'accepted')
      );
      var our_court   = !(their_court);

      // bails
      if (item.transients['retired']) return 'retired';


      if (our_court) {

        if (Agents.has_question(item) || Agents.has_problem(item)) {
          if (!within_four_hrs)  return "addressable";
          if (!within_three_min) return "neglected";
          return "concerns";
        }

        if (latch.contains("unlatched")) {

          if (most_recent_answer) {
            if (most_recent_answer[0].match(/^yes/)) return "responded_yes";
            if (most_recent_answer[0].match(/^no/))  return "responded_no";
            return "responded";
          }
          return "available";

        } else {

          // if they were latched earlier, and then said something else
          if (latch_start && latch_start + 100 < they_said_ts) return "reporting";

          // else
          return "assigned";
        }

      }
      else if (their_court) {
        if (!Date.within(we_said_ts, 4 * 60 * 60))  return "available";
        if (!Date.within(last_ts, 30 * 60))         return "unresponsive";
        if (latch.contains("unlatched"))            return 'in_dialogue';
        if (item.latch.to_mspec().start && item.latch.to_mspec().start > they_said_ts) {
          return "pending";
        }

        return "assigned";
      }

      return "unknown";
    }]

  ]
};


// wants: function(item) {
//   if (!item.atags) return;
//   var readywords = item.atags.split(' ').map(function(x){ return Item.atags_to_upfors[x]; }).compact().join(' ').split(' ').uniq();
//   if (readywords.length == 0) return "???";
//   return readywords.choose_random().toUpperCase();
// },

// readywords: function(item) {
//   if (!item.atags) return;
//   return item.atags.split(' ').map(function(x){ return Item.atags_to_upfors[x]; }).compact();
// },

// locked: function(item) {
//   if (!item.latch) return false;
//   if (item.latch.split(' ').indexOf(This.user.tag) >= 0) return false;
//   return true;
// },
