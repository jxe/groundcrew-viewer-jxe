go.push({

  // item state:  latch status, problems, etc

  item_comm_ts: function() {
    if (!This._item.comm) return "a while ago";
    var comm_ts = This._item.comm.split(' ')[1];
    if (!comm_ts) return "just now";
    return $long_ago(comm_ts) + " ago";
  },

  is_agent: function() {
    return This.item && This.item.startsWith('p');
  },
  
  can_remove: function() {
    if (!This.item || !This.item.startsWith('p')) return false;
    if (window.stream_role != 'leader') return false;
    return true;
  },

  slow_stmt: function() {
    if (This._item.immediate) return "";
    return '<img src="i/icons/turtle.png" class="niw_slow_thumb" align="right"/>' +
      'Reachable only by email.';
  },

  location_stmt: function() {
    if (! This._item.immediate) return "";
    var loc_update = '<a class="lio agent_loc_update" href="##request_agent_update_location">Ask for updated location?</a>';
    var stale_loc = !This._item.loc_ts || !Date.within(This._item.loc_ts, 60 * 60);
    if (This._item.acc) {
      if (This._item.acc == 'zip') return "Only approximate location (zipcode). " + loc_update;
      if (This._item.acc == 'city') return "Only approximate location (city). " + loc_update;
    }
    if (stale_loc) return 'Location is stale. ' + loc_update;
    else return "Location is fresh.";
  },

  item_status: function() {
    if (!This._item.fab_state) return "Unknown";
    if (This._item.fab_state == 'assigned') return "Assigned";
    return "Available";
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

  agent_status: function() {
    return This._item.update;
  },

  agent_bio: function() {
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
      return "Send a message to this agent";
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
    var upfors = $w(This._item.upfor || '');

    return upfors.map(function(x, i){
      var id = This.item + x;
      var content = '<a href="#q='+x+'" class="tag">'+x+'</a> ' +
        '<a href="##tag_remove(\'' + This.item + '\',\'' + x +'\')" class="delete" title="Remove this tag?">x</a>';
      if (i < upfors.length-1) content += '<span class="divider">&middot;</span>';
      return tag('li', { id: id, content: content });
    }).join(' ');
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
    return strings.sort_by('.ts', { order: 'desc' }).map('.html').join('');
  },

  current_question: function() {
    return Q.current();
  },

  questions_as_lis: function() {
    var qs = Q.here();
    return qs.map(function(q){
      return "<li href='#tool=show_answers;question="+escape(q)+"'>" + q + "</li>";
    }).join('');
  },

  lm_first_tag: function() {
    return This._item.atags && This._item.atags.split(' ')[0] || 'landmark';
  },

  answers_for_question: function() {
    return QuestionAnswers.t.tt(Answers.for_q_here(Q.current()));
  },

  // masses of agents

  some_agents_elsewhere: function() {
    if (!This.city) return false;
    if (!Agents.all) return false;
    return Agents.all.length - Agents.here().length;
  },

  agents_elsewhere_count: function() {
    if (Agents.all) { return String(Agents.all.length - Agents.here().length); }
  },

  agents_count: function() {
    return Agents.all && Agents.all.length;
  }

});
