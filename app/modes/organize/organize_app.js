App.modes.mobilize = {
  
  render: function(changed) {
    if (changed.item) {
      if (This.item.startsWith('Person')) MapMarkers.window('organize_agent', 16);
    }
  },
  
  
  show_type: function() {
    Viewer.render_item(This.type);
  },

  show_item: function(state) {
    if (This.item.startsWith('Person'))   Viewer.render_item('organize_agent', 16);
    if (This.item.startsWith('Landmark')) Viewer.render_item('organize_landmark');
  },
  
  make_it_happen_form_submitted: function(data, state) {
    Operation.assign(This.item, data.assign, function(operation){
      go('@' + operation.id);
    });
  },
  
  
  send_assignment_form_submitted: function(data, state) {
    Operation.invite(This.item, data.title, data.assignment, function(operation){
      go('@' + operation.id);
    });
  },
  
  landmarks: function(state) {
    return Landmarks.here().as_option_list();
  },
  
  other_agents: function(state) {
    return $.grep(Agents.here(), function(x){
      return x.id != This.item && x.id != This.user.tag;
    }).as_option_list();
  },
  
  agent_assignable: function(state) {
    // return true;
    return This._item.availability_status != 'inaccessible';
  },

  agent_latched_and_assigned: function(state) {
    return This._item.availability_status == 'assigned';
  },
  
  agent_unlatched: function(state) {
    return true;
  },
  
  agent_assign_prompt: function() {
    if (This._item.availability_status == 'assigned') {
      return "Change this agent's assignment?";
    } else {
      return "What would you like this agent to do?";
    }
  },
  
  item_status: function(state)     { return "This agent is <b>"+This._item.availability_status+"</b> and <b>on your squad</b>."; },
  item_believesin: function(state) { 
    if (!This._item.believesin) return " ";
    return "believes in: <b>" + This._item.believesin.semisplit().join(', ')  + "</b>";
  },
  
  item_current_assignment: function(state) {
    if (This._item.latch.startsWith('unlatched')) return " ";
    return This._item.latch.split(' ')[2].resource().title;
  },
  
  
  item_celebrates: function(state) { return " "; },
  item_helpwith: function(state)   { return " "; },
  item_didrecent: function(state)  { return " "; },

  everyone_will: function(state) {
    return "Touch your nose/Smile mischeviously/Make hand signals/Caress yourself/Hum quietly/Look mysterious".split('/').map(function(x){
      return "<option>" + x + "</option>";
    }).join('');
  }
};
