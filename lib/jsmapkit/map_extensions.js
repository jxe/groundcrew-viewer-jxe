/*
 * Calculate distance (in m) between two points specified by
 * latitude/longitude with Haversine formula
 *
 * from: Haversine formula - R. W. Sinnott, "Virtues of the Haversine",
 *       Sky and Telescope, vol 68, no 2, 1984
 *       http://www.census.gov/cgi-bin/geo/gisfaq?Q5.1
 * and:  Mike Williams
 *       http://groups.google.com/group/Google-Maps-API/browse_thread/thread/2ef089ac7277e828/ccb6679034dd5c72
 */
google.maps.LatLng.prototype.distanceFrom = function(other) {
  var R = 6371000; // earth's mean radius in m
  var dLat = rad(this.lat() - other.lat());
  var dLng = rad(this.lng() - other.lng());

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(rad(this.lat())) * Math.cos(rad(other.lat())) * Math.sin(dLng/2)
          * Math.sin(dLng/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;

  return d.toFixed(3);
};

// Convert degrees to radians
rad = function(x) {return x*Math.PI/180;};
