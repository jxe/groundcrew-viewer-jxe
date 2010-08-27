LiveHTML.widgets.push({

  // item state:  latch status, problems, etc

  item_comm_ts: function() {
    if (!This._item.comm) return "a while ago";
    var comm_ts = This._item.comm.split(' ')[1];
    if (!comm_ts) return "just now";
    return $long_ago(comm_ts) + " ago";
  },

  slow_stmt: function() {
    if (This._item.immediate) return "";
    return '<img src="i/icons/turtle.png" class="niw_slow_thumb" align="right"/>' +
      'Reachable only by email.';
  },

  location_stmt: function() {
    if (! This._item.immediate) return "";
    var loc_update = '<a class="lio" href="##request_agent_update_location">ask for updated location</a>';
    var stale_loc = !This._item.loc_ts || !Date.within(This._item.loc_ts, 60 * 60);
    if (This._item.acc) {
      if (This._item.acc == 'zip') return "Approximate location: by zipcode. " + loc_update;
      if (This._item.acc == 'city') return "Approximate location: by city. " + loc_update;
    }
    if (stale_loc) return 'Location is stale. ' + loc_update;
    else return "Location is fresh.";
  },

  item_status: function() {
    if (!This._item.fab_state) return "unknown";
    if (This._item.fab_state == 'assigned') return "assigned";
    return "available";
  },

  is_latched: function() {
    return This._item.latch.contains(' v');
  },

  has_concern: function() {
    return ['neglected', 'concerns', 'addressable'].contains(This._item.fab_state) &&
      (Agents.has_question(This._item) || Agents.has_problem(This._item));
  },

  concern: function() {
    return Agents.concern(This._item);
  },

  agent_assignable: function() {
    // return true;
    return This._item.fab_state != 'inaccessible';
  },

  agent_latched_and_assigned: function() {
    return This._item.fab_state == 'assigned';
  },

  agent_unlatched: function() {
    return true;
  },

  twitter_status: function() {
    return This._item.update;
  },

  twitter_bio: function() {
    return This._item.bio;
  },

  immediate: function() {
    return This._item.immediate;
  },



  // operational involvements

  item_current_operation_title: function() {
    if (This._item.fab_state != 'assigned') return " ";
    return This._item.latch.split(' ')[2].resource().title;
  },

  jump_to_op: function() {
    var op = This._item.latch.split(' ')[2];
    if (op) go('@' + op);
  },

  item_current_assignment: function() {
    var latch2 = This._item.latch && This._item.latch.split(' ')[2];
    var latch_op = latch2 && latch2.resource();
    if (!latch_op) return "";
    if (latch_op.atype.contains('question')) {
      // TODO: questions should link to the show_answers display, as well as the live feed
      return "Question: " + latch_op.body;
    } else {
      return latch_op && latch_op.body;
    }
  },

  agent_assign_prompt: function() {
    if (This._item.fab_state == 'assigned') {
      return "Change this agent's assignment?";
    } else {
      return "What would you like this agent to do?";
    }
  },



  // other data

  agent_skills_as_lis: function() {
    if (!This._item.has) return null;
    var skills = This._item.has || ' ';
    return "<li>" + $w(skills).map(function(x){
      return "<a href='#q="+x+"'>"+x+"</a>";
    }).join(',</li> <li>') + "</li>";
  },

  upfors_as_lis: function() {
    var upfor = This._item.upfor || '';
    return "<li>" + $w(upfor).map(function(x){
      return "<a href='#q="+x+"'>"+x+"</a>";
    }).join(',</li> <li>') + "</li>";
  },

  upfors_as_lis_and_agent_assignable: function(){
    return This._item.upfor && This._item.fab_state != 'inaccessible';
  },

  // answers: function() {
  //   if (!This._item.answers) return '';
  //   var answers = This._item.answers.split(/;; ?/);
  //   return answers.map(function(x){
  //     var parts = x.split(' ');
  //     if (!parts[1]) return '';
  //     var data = parts.shift().split('-');
  //     var q = Questions[data[0]];
  //     var answer = parts.join(' ');
  //     var tstamp = $time(data[1]);
  //     return '<h6 class="question">Q. '+q+'</h6><div class="answer">A. &ldquo;'+answer+'&rdquo;<span class="timestamp">'+tstamp+'</span></div>';
  //   }).join('');
  // },

  answers: function() {
    var strings = [];
    if (!This._item.answers) return '';
    $.each(This._item.answers, function(k, v){
      var q = k;
      var answer = v[0];
      var tstamp = $time_and_or_date(v[1]);
      var o = {ts: v[1], html: '<h6 class="question">Q. '+q+'</h6><div class="answer">A. &ldquo;'+answer+'&rdquo;<span class="timestamp">'+tstamp+'</span></div>'};
      strings.push(o);
    });
    return strings.sort_by('.ts', -1).map('.html').join('');
  },

  current_question: function() {
    return Q.current();
  },

  questions_as_lis: function() {
    var qs = $keys(Answers.here());
    return qs.map(function(x){
      var q = x;
      return "<li href='#tool=show_answers;question="+escape(x)+"'>" + q + "</li>";
    }).join('');
  },

  lm_first_tag: function() {
    return This._item.atags && This._item.atags.split(' ')[0];
  },

  answers_for_question: function() {
    return QuestionAnswers.t.tt(Answers.for_q_here(Q.current()));
  },

  // masses of agents

  agents_count: function() {
    return Agents.all && Agents.all.length;
  }

});
