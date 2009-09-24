Selection = {
  current: {},
  
  clear: function() {
    $.each($keys(Selection.current), function(){
      Selection.toggle(this);
    });
  },
  
  
  toggle: function(tag) {
    $('.athumb.' + tag).toggleClass('selected');
    if (Selection.current[tag]) delete Selection.current[tag];
    else Selection.current[tag] = true;
    // MapMarkers.cache[tag].setImage('i/map/wman.png');
    // MapMarkers.cache[tag].setImage('i/map/sman.png');
    Item.calculate_fields(tag.resource());
    MapMarkers.update_marker(tag);
    
    if (isEmpty(Selection.current)){
      $('#group_actions').hide();
    } else {
      $('#group_actions').show().center();
    }
  }
  
};


LiveHTML.widgets.push({
  
  clear_selection: function(state) {
    Selection.clear();
  },
  
  no_selection: function(state) {
    return isEmpty(Selection.current);
  },

  has_selection: function(state) {
    return !isEmpty(Selection.current);
  },
  
  selected_agent_tiles: function(state) {
    var agents = $keys(Selection.current).map(function(x){
      return x.resource();
    });
    return Tiles.agent_tile.tt(agents);
  }

});
