IconFactory = {
  
  for_landmark: function(lm) {
    return $.extend(new GIcon(), {
      image: lm.map_thumb_url || "http://www.panoramio.com/img/panoramio-marker.png",
      shadow: "",
      iconSize: new GSize(24, 24),
      shadowSize: new GSize(22, 22),
      iconAnchor: new GPoint(9, 9),
      infoWindowAnchor: new GPoint(9, 0)
    });
  },
  
  for_type: function(type) {
    var icon = new GIcon(G_DEFAULT_ICON, 'i/map/' + type + '.png');
    if (type.indexOf('man') >= 0) {
      icon.shadow = "i/map/man.shadow.png";
      icon.iconSize = new GSize(32, 32);
      icon.shadowSize = new GSize(59, 32);
      icon.iconAnchor = new GPoint(10, 30);
      icon.infoWindowAnchor = new GPoint(24, 4);
    }
    if (type.indexOf('bump') >= 0) {
      // add shadow and adjust size
      icon.shadow = "i/map/bump_shadow.png";
      icon.iconSize = new GSize(20, 20);
      icon.shadowSize = new GSize(59, 32);
      icon.iconAnchor = new GPoint(10, 10);
      icon.infoWindowAnchor = new GPoint(15, 10);
    }
    return icon;
  }
  
}
