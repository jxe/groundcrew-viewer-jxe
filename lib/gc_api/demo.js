
$.extend(String.prototype, {

  change_resource: function(changes) {
    var item = this.resource();
    $.extend(item, changes);
    Resource.add_or_update(this, item);
  }
});

Demo = {

  delay: function(delay_min, delay_rand) {
    if (delay_min == null) delay_min = 1000;
    if (delay_rand == null) delay_rand = Math.rand(2000);
    return delay_min + delay_rand;
  },

  update_comm: function(agent, i, new_val) {
    var comm_parts = agent.resource().comm.split(' ');
    comm_parts[i] = new_val;
    agent.change_resource({comm: comm_parts.join(' ')});
  },

  contact: function(person) {
    setTimeout(function(){
      // update person's comm with time we last contacted them
      Demo.update_comm(person, 2, Date.unix());
    }, Demo.delay(50, 200));
  },

  // events

  // TODO: this is currently only approriate for agent response events
  create_event: function(atype, person, op, changes, json_etc, delay_min, delay_rand) {
    setTimeout(function(){
      var evtag = "Annc__" + Ajax.uuid();
      var now = Date.unix();
      Demo.update_comm(person, 1, Date.unix());
      Frame.populate_flexbar_agents(This.agents);
      person.change_resource(changes);
      event(evtag, now, atype, person, op.id, null, op.city_id, person, json_etc);
    }, Demo.delay(delay_min, delay_rand));
  },

  // operations

  create_op: function(site, title, atype, body) {
    var optag = "Op__" + Ajax.uuid();
    var city_id = site.resource().city_id;
    op_watch = optag;
    return op(city_id, optag, title, site, This.user.tag, atype, body);
  },

  group_assign_demo: function(agents, what, callback) {
    var op = Demo.create_op(agents[0], "\""+what+"\"", 'assignment group', what);
    callback && callback(op);

    $.each(agents, function(i, agent){
      Demo.contact(agent);
      Demo.create_event('accepted', agent, op, {latch: "latched 1-10000 " + op.id + " " + This.user.tag}, 4000, 10000);
    });
  },

  assign_demo: function(agent, assignment, callback) {
    var op = Demo.create_op(agent, "\""+assignment+"\"", 'assignment individual', assignment);
    callback && callback(op);

    Demo.contact(agent);
    Demo.create_event('accepted', agent, op, {latch: "latched 1-10000 " + op.id + " " + This.user.tag}, 2000);
    Demo.create_event('completed', agent, op, {latch: "unlatched"}, 8000, 7000);
  },

  invite_demo: function(landmark, title, assignment, callback) {
    var op = Demo.create_op(landmark, "\""+title+"\"", 'assignment invite', title);
    callback && callback(op);

    $.each(Agents.in_city(op.city_id).slice(0, 10), function(i, agent){
      Demo.contact(agent);
      Demo.create_event('accepted', agent.id, op, {latch: "latched 1-10000 " + op.id + " " + This.user.tag}, 2000, 10000);
    });
  },

  question_demo: function(question, agents) {
    console.log(question + " asked of " + agents);
    var op = Demo.create_op(agents[0], "question: " + question, 'assignment question', question);

    $.each(agents, function(i, agent){
      Demo.contact(agent);
      Demo.create_event('answered', agent, op, {latch: "unlatched"}, {msg: "wow, you're a real cool cat"}, 2000, 1000);
    });
  }

};
