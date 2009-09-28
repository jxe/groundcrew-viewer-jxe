Selection = {
  current: {},
  groups: {},
  
  clear: function() {
    $.each($keys(Selection.current), function(){ Selection.deselect(this); });
  },
  
  select: function(tag) {
    Selection.current[tag] = true;
    Selection.update(tag);
  },
  
  deselect: function(tag) {
    delete Selection.current[tag];
    Selection.update(tag);
  },
  
  toggle: function(tag) {
    if (Selection.current[tag]) Selection.deselect(tag);
    else Selection.select(tag);
  },
  
  update: function(tag) {
    if (Selection.current[tag]) $('.athumb.' + tag).addClass('selected');
    else $('.athumb.' + tag).removeClass('selected');
    Item.calculate_fields(tag.resource());
    MapMarkers.update_marker(tag);
    Selection.hide_or_show_options();
  },
  
  hide_or_show_options: function() {
    if (isEmpty(Selection.current)){
      $('#group_actions').hide();
    } else {
      $('#group_actions').show().center();
    }
  }
  
};


LiveHTML.widgets.push({
  
  select_group: function(foo) {
    var method = Selection.groups[foo] ? 'deselect' : 'select';
    Selection.groups[foo] = !Selection.groups[foo];
    $.each(This.agents, function(){
      if (this.fab_state == foo) Selection[method](this.id);
    });
  },
  
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
