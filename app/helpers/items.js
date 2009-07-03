LiveHTML.widgets.push({

  // item state:  latch status, problems, etc
  
  item_status: function() {
    return This._item.availability_status;
  },
  
  is_latched: function() {
    return !This._item.latch.startsWith('unlatched');
  },
  
  has_problem: function() {
    return This._item.availability_status == 'problem';
  },
  
  problem: function() {
    return "i can't feel my feet!";
  },
  
  agent_assignable: function() {
    // return true;
    return This._item.availability_status != 'inaccessible';
  },

  agent_latched_and_assigned: function() {
    return This._item.availability_status == 'assigned';
  },
  
  agent_unlatched: function() {
    return true;
  },
  
  
  
  // operational involvements

  item_current_operation_title: function() {
    if (This._item.latch.startsWith('unlatched')) return " ";
    return This._item.latch.split(' ')[2].resource().title;
  },
  
  item_current_assignment: function() {
    if (This._item.latch.startsWith('unlatched')) return " ";
    return This._item.latch.split(' ')[2].resource().body;
  },
  
  agent_assign_prompt: function() {
    if (This._item.availability_status == 'assigned') {
      return "Change this agent's assignment?";
    } else {
      return "What would you like this agent to do?";
    }
  },
  
  
  
  // other data

  agent_skills_as_lis: function() {
    var skills = This._item.has || ' ';
    return "<li>" + $w(skills).join(',</li> <li>') + "</li>";
  },
  
  upfors_as_lis: function() {
    var upfor = This._item.upfor || ' ';
    return "<li>" + $w(upfor).join(',</li> <li>') + "</li>";
  },
  
  answers: function() {
    if (!This._item.answers) return '';
    var answers = This._item.answers.split(/;; ?/);
    return answers.map(function(x){
      var parts = x.split(' ');
      if (!parts[1]) return '';
      var data = parts.shift().split('-');
      var q = Questions[data[0]];
      var answer = parts.join(' ');
      var tstamp = $time(data[1]);
      return '<h6 class="question">Q. '+q+'</h6><div class="answer">A. &ldquo;'+answer+'&rdquo;<span class="timestamp">'+tstamp+'</span></div>';
    }).join('');
  },
  
  
  
  
  // masses of agents
  
  agents_count: function() {
    return Agents.all.length;
  }
  
  
  // agents_to_guide6: function() {
  //   return Tiles.agent_tile.tt(This.agents.slice(0,6));
  // },
  // 
  // agents_to_guide_all: function() {
  //   return Tiles.agent_tile.tt(This.agents.slice(0, 6*7));
  // },
  
  // TODO: make dynamic
  // item_squad: function() {
  //   return "Demo Squad";
  // },
  
});
