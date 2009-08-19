App.modes.coordinate = {  
  
  show_type: function() {
    Viewer.render_item(This.type);
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
