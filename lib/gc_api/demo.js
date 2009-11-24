
$.extend(String.prototype, {

  change_resource: function(changes) {
    var item = this.resource();
    $.extend(item, changes);
    Resource.add_or_update(this, item);
  }
});

Demo = {
  interval: 15 * 1000,

  init_manual: function() {
    if (!window.demo_random_reports) {
      window.demo_random_reports = ["I'm reporting in", "it's snowing!"];
    }
    if (!window.demo_replies) {
      window.demo_replies = ["I don't understand. What?", "I'm replying", "okay"];
    }

    window.demo_random_reports.sort(Math.randSort);
    window.demo_replies.sort(Math.randSort);

    setTimeout(function(){Demo.random_events();}, Demo.delay(Demo.interval));
  },

  random_events: function() {
    switch(Math.rand(2))
    {
      case 0:
        Demo.random_move();
        break;
      case 1:
        Demo.random_report();
        break;
    }
    setTimeout(function(){Demo.random_events();}, Demo.delay(Demo.interval));
  },

  // qa

  qa_keypresses: function(ch) {
    if (ch == 'M') {
      Demo.random_move();
      return false;
    };
    if (ch == 'R') {
      Demo.random_report();
      return false;
    }
    if (ch == 'X') {
      var lat = 42.2481415 - Math.rand(100)/1000;
      var lng = -72.5796331 - Math.rand(100)/1000;
      item(220,"Person__pmcdcf3421a1c","Elizabeth","/images/02/10/02107108bba957823b328a90f9d5c8df_thumb.jpg",lat,lng,"adv health.healing adv.water_fight community.beertalk adv.stealth service.random_kindness health.game health.game.basketball adv.game community.party service.volunteer community service.cleanup art health.art adv.challenge health.food health.game.frisbee community.reporting service.neighbor art.perform service adv.beauty art.stunt health.walk health.yoga art.music health art.writing","unlatched","reachable 1253543018 1254583581",null,{"image_url":"/images/02/10/02107108bba957823b328a90f9d5c8df_medium.jpg"});
      return false;
    };
    if (ch == 'Y') {
      // she moves to australia
      item(13,"Person__pmcdcf3421a1c","Elizabeth","/images/02/10/02107108bba957823b328a90f9d5c8df_thumb.jpg",-33.881168,151.192959,"adv health.healing adv.water_fight community.beertalk adv.stealth service.random_kindness health.game health.game.basketball adv.game community.party service.volunteer community service.cleanup art health.art adv.challenge health.food health.game.frisbee community.reporting service.neighbor art.perform service adv.beauty art.stunt health.walk health.yoga art.music health art.writing","unlatched","reachable 1253543018 1254583581",null,{"image_url":"/images/02/10/02107108bba957823b328a90f9d5c8df_medium.jpg"});
      return false;
    };
    if (ch == 'Z') {
      // someone new comes to town
      var lat = 42.2481415 - Math.rand(100)/1000;
      var lng = -72.5796331 - Math.rand(100)/1000;
      item(220,"Person__pmcdcf21a1c","Elizabeth2","/images/02/10/02107108bba957823b328a90f9d5c8df_thumb.jpg",lat,lng,"adv health.healing adv.water_fight community.beertalk adv.stealth service.random_kindness health.game health.game.basketball adv.game community.party service.volunteer community service.cleanup art health.art adv.challenge health.food health.game.frisbee community.reporting service.neighbor art.perform service adv.beauty art.stunt health.walk health.yoga art.music health art.writing","unlatched","reachable 1253543018 1254583581",null,{"image_url":"/images/02/10/02107108bba957823b328a90f9d5c8df_medium.jpg"});
      return false;
    };
    return true;
  },


  delay: function(delay_min, delay_max) {
    if (delay_min == null) delay_min = 1000;
    if (delay_max == null) delay_max = delay_min * 2;
    return delay_min + Math.rand(delay_max - delay_min);
  },

  update_comm: function(person, i, new_val) {
    var comm_parts = person.resource().comm.split(' ');
    comm_parts[i] = new_val;
    return comm_parts.join(' ');
  },

  offer: function(person, op) {
    setTimeout(function(){

      latch_parts = ["latched", Date.unix() + "-" + (Date.unix() + 60*60), op.id, This.user.tag];
      person.change_resource({
        latch: latch_parts.join(' '),
        sent: op.title,
        comm: Demo.update_comm(person, 2, Date.unix())});
    }, Demo.delay(50, 250));
  },

  random_agent: function() {
    agents = Agents.here(200);
    if (!agents || agents.length == 0) return null;
    return agents[Math.rand(agents.length)];
  },

  get_random_report: function() {
    report = demo_random_reports.shift();
    demo_random_reports.push(report);
    return report;
  },

  get_reply: function() {
    reply = demo_replies.shift();
    demo_replies.push(reply);
    return reply;
  },

  get_answer: function() {
    return "I'm answering your question";
  },

  random_report: function(agent) {
    if (!agent) agent = Demo.random_agent();
    Demo.report(agent.id, Demo.get_random_report(), null, 0);
    return true;
  },

  random_move: function(agent) {
    if (!agent) agent = Demo.random_agent();
    fuzz = make_fuzzfactor();
    changes = {
      lat: agent.lat + fuzz[0],
      lng: agent.lng + fuzz[1],
      loc_ts: Date.unix(),
      comm: Demo.update_comm(agent.id, 1, Date.unix())
    };
    return agent.id.change_resource(changes);
  },

  // events

  create_rcv_event: function(atype, person, op, changes, json_etc, delay_min, delay_max) {
    var delay = Demo.delay(delay_min, delay_max);
    setTimeout(function(){
      if (!changes) changes = {};
      if (!json_etc) json_etc = {};
      var evtag = "Annc__" + Ajax.uuid();
      var now = Date.unix();
      var city_id = op ? op.city_id : This.city_id;
      var op_id = op ? op.id : null;
      changes["comm"] = Demo.update_comm(person, 1, Date.unix());
      if (changes["msg"] == null) changes["msg"] = json_etc["msg"] ? json_etc["msg"] : "yup";
      changes["msg_ts"] = Date.unix();
      person.change_resource(changes);
      event(evtag, now, atype, person, op_id, null, city_id, person, json_etc);
    }, delay);
    return delay;
  },

  report: function(agent, msg, op, delay_min, delay_max) {
    return Demo.create_rcv_event('reported', agent, op, {msg: msg}, {msg: msg}, delay_min, delay_max);
  },

  // operations

  create_op: function(site, title, atype, body) {
    var optag = "Op__" + Ajax.uuid();
    var city_id = site.resource().city_id;
    return op(city_id, optag, title, site, This.user.vtag, atype, body);
  },

  assign: function(agents, assignment, callback) {
    var op = Demo.create_op(agents[0], "\""+assignment+"\"", 'assignment', assignment);
    go('@' + most_recent_op.id);
    callback && callback(op);

    $.each(agents, function(i, agent){
      Demo.offer(agent, op);
      if (Math.random() < 0.20)
      {
        Demo.create_rcv_event('declined', agent, op, {msg: "no thanks"}, {}, 13*1000);
        return;
      }
      var delay = Demo.create_rcv_event('accepted', agent, op,
        {latch: "latched 1-10000 " + op.id + " " + This.user.tag, msg: "ok"}, null, 10*1000);
      if (Math.random() < 0.33) delay = Demo.report(agent, Demo.get_random_report(), op, delay + 5*1000);
      Demo.create_rcv_event('completed', agent, op, {latch: "unlatched", msg: "done"}, null, delay + 15*1000);
    });
  },

  message: function(agents, msg, callback)
  {
    callback && callback(op);
    $.each(agents, function(i, agent){
      if (Math.random() < 0.33) Demo.report(agent, Demo.get_reply(), op, 5*1000);
    });
  },

  invite: function(agents, landmark, title, assignment, callback) {
    var op = Demo.create_op(landmark, "\""+title+"\"", 'assignment invite', title);
    go('@' + most_recent_op.id);
    callback && callback(op);

    $.each(agents, function(i, agent){
      Demo.offer(agent, op);
      var delay = Demo.create_rcv_event('accepted', agent, op,
        {latch: "latched 1-10000 " + op.id + " " + This.user.tag, msg: "ok"}, null, 10*1000);
      Demo.create_rcv_event('completed', agent, op, {latch: "unlatched", msg: "done"}, null, delay + 15*1000);
    });
  },

  question: function(question, agents) {
    console.log(question + " asked of " + agents);
    var op = Demo.create_op(agents[0], "question: " + question, 'assignment question', question);
    go('@' + most_recent_op.id);

    $.each(agents, function(i, agent){
      Demo.offer(agent, op);
      answer = Demo.get_answer();
      // TODO: clone answers -- this will update the agent's answer dict immediately
      answers = agent.resource().answers;
      answers[question] = [answer, Date.unix() + 30];
      Demo.create_rcv_event('answered', agent, op,
        {latch: "unlatched", msg: answer, answers: answers}, {msg: answer},
        null, 30*1000);
    });
  },

  // actions
  
  update_loc: function(agent_id) {
    $('#make_it_happen_form').html('Message sent!');
    setTimeout(function(){ Demo.random_move(agent_id.resource()); }, Demo.delay(3*1000));
  },

  tag: function(agent_ids, tags, callback) {
    callback && callback(op);
    $.each(agent_ids, function(i, agent_id){
      agent = agent_id.resource();
      changes = {atags: tags + (agent.atags ? (" " + agent.atags) : "")};
      return agent_id.change_resource(changes);
    });
  }

};
