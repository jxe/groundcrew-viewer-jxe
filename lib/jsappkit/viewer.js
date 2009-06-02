var components = [];

////
// This is the "Application" controller and selection model
//
Viewer = App = new JSApp({
  app_url_prefixes: ['squad', 'mode_name'],
  base_url_prefix: "/:squad/",
  modes: {},
  
  init: function() {
    this.update('squad', 'demo');
    this.set_city(null);
    // this.update('city', null);
  },
  
  marker_clicked: function(tag) {
    if (tag.startsWith('Op__')) return Viewer.go('//ops/:city/' + tag);
    else return Viewer.go('//organize/:city/' + tag);
  },

  set_city: function(city) {
    This.city_id = city && city.resource_id();
    this.update('agents', Agents.here());
  },

  set_item: function(item) {
    This._item = item && item.resource();
  },

  set_squad: function(squad) {
    if (squad == 'demo') {
      $.ajaxSetup({async: false});
      $.getScript('/data/demo.js');
      $.ajaxSetup({async: true});
    }
  },

  open: function(tag) {
    $.unreveal();
    if (LiveHTML.shiftOn) return Selection.toggle(tag);
    if (!This.city) {
      var city_id = tag.resource().city_id;
      return Viewer.go('//organize/City__' + city_id + '/' + tag);
    }
    LiveHTML.dispatch('marker_clicked', tag, This);
  },
      
  set_agents: function(agents) {
    MapMarkers.display(This.city, This.agents);
    Frame.populate_flexbar_agents(This.agents);
    components.trigger('city_changed', This.city);
  },
  
  
  
  
  render_item: function(template_name, min_zoom) {
    if (This.renderer) $('body').removeClass(This.renderer);
    if (This.painted_elements) This.painted_elements.offscreen();
    This.renderer = null;
    This.painted_elements = null;    
    MapMarkers.open(This.item, $.template('#' + template_name + '_iw').app_paint()[0], min_zoom);
    This.rendered = true;
  },
  
  render: function(renderer) {
    var mode_name = This.mode_name;
    var app = This.mode;

    $.unreveal();
    if (This.renderer) $('body').removeClass(This.renderer);
    if (This.painted_elements) This.painted_elements.offscreen();
    
    This.renderer = renderer;
    This.painted_elements = $("." + mode_name + "." + This.renderer);
    
    This.painted_elements.onscreen().app_paint();
    $('body').addClass(renderer);

    This.rendered = true;
  }
  
});
