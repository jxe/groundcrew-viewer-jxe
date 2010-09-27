$.extend(Agents, {
  // Returns system letters common to agent + current squad
  common_sys: function(comm) {
    var via_sys = (comm && comm.split(/ /)[3] || '');
    if (App.current_stream_systems().length > 0) {
      via_sys = via_sys.split('').intersect(App.current_stream_systems()).join('');
      if (window.demo && via_sys.length == 0) via_sys = App.current_stream_systems();
    }
    return via_sys;
  },
  // Returns true only if the agent is reachable by the current squad
  reachable_by_current_squad: function(item) {
    if (!item || item.id.resource_type() != 'Agent') return true;
    common_sys = Agents.common_sys(item.comm);
    return common_sys.length > 0;
  },
  has_question: function(item) {
    return item && ("" + item.msg + item.update).contains('?');
  },
  has_problem: function(item) {
    return item && ("" + item.update).startsWith('problem:') && item.update_ts >= item.msg_ts;
  },
  concern: function(item) {
    if (item.msg_ts >= item.update_ts  && item.msg && item.msg.contains('?')) return item.msg;
    if (item.update && item.update.contains('?')) return item.update;
    if (item.update && item.update.startsWith('problem:')) return item.update;
    return item.msg;
  }
});

Item = {

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
    }],

    ['time_avail', function(item) {
      return ['20 MIN', '1 HR', '30 MIN', '5 MIN'].choose_random();
    }],

    ['immediate', function(item) {
      if (window.demo) return true;
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
      var they_said_ts     = comm[4] || comm[1] || 0;
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
      var last_event         = item_children[item.id] && item_children[item.id].last();
      var last_answer_and_ts = $values(item.answers).sort_by(function(x){ return -x[1]; })[0];
      var most_recent_answer = last_answer_and_ts && Date.within(last_answer_and_ts[1], 24*60*60) && last_answer_and_ts[0];

      // calculate timestamps
      var they_said_ts     = Number(comm[4] || comm[1] || 0);
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
      if (comm[5] == 'recruitable') return 'recruitable';
      if (item.transients['retired']) return 'retired';
      // TODO(twit): add unreachable state based on reachable_by_current_squad?  or just
      // go back to filtering these guys out?

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
