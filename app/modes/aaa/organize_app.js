App.modes.coordinate = {  
  
  show_type: function() {
    Viewer.render_item(This.type);
  },

  show_item: function(state) {
    if (This.item.startsWith('Person'))   Viewer.render_item('organize_agent', 16);
    if (This.item.startsWith('Landmark')) Viewer.render_item('organize_landmark');
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
  
  everyone_will: function(state) {
    return "Touch your nose/Smile mischeviously/Make hand signals/Caress yourself/Hum quietly/Look mysterious".split('/').map(function(x){
      return "<option>" + x + "</option>";
    }).join('');
  }
};
