function op(city, tag, title, focii, architect, atype, body, x){
  return Resource.add_or_update(tag, {
    city_id: city,
    title: title,
    focii: focii,
    architect: architect,
    atype: atype,
    body: body,
  }, x);
}


Ops = new Resource('Op', {
  enhancer: function(x){ 
    x.children = []; 
    x.site = x.focii && x.focii.split(' ')[0];
    x.thumb_url = x.site && x.site.resource().thumb_url;
  }
});

Operation = {
  
  create: function(site, title, atype, body) {
    var optag = "Op__" + Ajax.uuid();
    var city_id = site.resource().city_id;
    return op(city_id, optag, title, site, This.user.tag, atype, body);
  },
  
  group_assign: function(agents, what, callback) {
    console.log(agents);
    var op = Operation.create(agents[0], "\""+what+"\"", 'assignment group', what);
    callback(op);

    $.each(agents, function(i, agent){
      var delay = 4000 + Math.rand(10000);
      setTimeout(function(){
        Event.create('accepted', agent, op, {latch: "latched 1-10000 " + op.id + " " + This.user.tag});
      }, delay);
    });
  },
  
  assign: function(person, assignment, callback) {
    var op = Operation.create(person, "\""+assignment+"\"", 'assignment individual', assignment);
    callback(op);
    
    setTimeout(function(){
      Event.create('accepted', person, op, {latch: "latched 1-10000 " + op.id + " " + This.user.tag});
    }, 3000);

    setTimeout(function(){
      Event.create('completed', person, op, {latch: "unlatched"});
    }, 15000);

  },

  invite: function(landmark, title, assignment, callback) {
    var op = Operation.create(landmark, "\""+title+"\"");
    callback(op);
    
    $.each(Agents.in_city(op.city_id).slice(0, 10), function(i, agent){
      var delay = 2000 + Math.rand(10000);
      setTimeout(function(){
        Event.create('accepted', agent.id, op, {latch: "latched 1-10000 " + op.id + " " + This.user.tag});
      }, delay);
    });
  }
  
};
