App.modes.ops = {
  url_parts: $w('city item'),
  
  group_interact_form_submitted: function(data, state, form) {
    Operation.group_assign($keys(Selection.current), data.assign, function(operation){
      go('@' + operation.id);
    });
  }
  
};
