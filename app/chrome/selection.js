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
  
  update_all: function() {
    $.each($keys(Selection.current), function(){ Selection.update(this); });
  },
  
  update: function(tag) {
    if (Selection.current[tag]) $('.athumb.' + tag).addClass('selected');
    else $('.athumb.' + tag).removeClass('selected');
    var guy = tag.resource();
    if (!guy) return;
    Item.calculate_fields(guy);
    Map.site_set_image('agents', tag, MapIcons.for_type(guy.map_icon).image);
    Selection.hide_or_show_options();
  },
  
  hide_or_show_options: function() {
    if (isEmpty(Selection.current)){
      $('#group_actions').hide();
      $('.require_selection').show();
    } else {
      $('#group_actions').show().center();
      $('.require_selection').hide();
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
  },

  require_selection: function() {
    return "Please select (option- or command-click) some agents";
  }

});
