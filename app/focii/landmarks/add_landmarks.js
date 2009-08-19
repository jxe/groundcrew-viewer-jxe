App.modes.mapcare = {
  
  send_landmark_form_submitted: function(data, state) {
    var x = {};
    $.extend(x, This._item, data);
    delete x.map_marker;
    $.post('/gc/edit_landmark', x, function(data){
      eval(data);
      Viewer.back();
    });
  }
    
};

