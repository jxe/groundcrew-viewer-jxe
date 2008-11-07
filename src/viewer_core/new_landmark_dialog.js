NewLandmarkDialog = {  

  show: function(i) {
    if (!logged_in) return Viewer.join_please();
    $.template('#new_landmark_dialog').show_dialog(function(form){
      Ajax.fetch('/gc/create_landmark', form, function(ev){
        EventDb.add(ev);
        Viewer.open(ev.landmark_tag || ev.item_tag);
      });
    });
  }
  
};


Wishlets = {by_city: {}};
