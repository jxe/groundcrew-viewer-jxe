AgentIW = {

  blit_bio: function(bio) {
    var x = MapMarkers.iw_item;
    bio.fillout({
      "#agent_iw_liked"          : x.liked_list || "<li><i>loading</i></li>",
      "#agent_iw_noliked"        : x.noliked_list || "<li><i>loading</i></li>",
      'a.extlink //href'         : '/agent/' + x.id      
    });
    if (x.liked_list) return;
            
    Ajax.fetch('/agent/taste_json', { dude: x.item_tag }, function(obj){
      var listify = function(list) {
        if (list.length == 0) return "<li><i>none</i></li>";
        list = list.slice(0, 4);
        return list.map(function(x){ return "<li>" + x + "</li>"; }).join('');
      };

      x.liked_list = listify(obj[0]);
      x.noliked_list = listify(obj[1]);
      AgentIW.blit_bio(bio);
    });
  }

};
