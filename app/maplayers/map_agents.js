// return a mapping from sites => markers
Map.layer_calculators['agents'] = function(){
  var mapping = {};
  $.each(This.agents, function(){
    var id = this.id;
    var icon = MapIcons.for_type(this.map_icon);
    var marker = new GMarker( new GLatLng(this.lat, this.lng), { 'title': this.title, 'icon': icon } );
    
    GEvent.addListener( marker, "click", function() { go('@' + id); });
    GEvent.addListener( marker, "dblclick", function() {
      GM.setCenter( marker.getPoint(), 15 ); 
    });
    mapping[this.id] = marker;
  });
  return mapping;
};
