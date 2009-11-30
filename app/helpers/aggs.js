LiveHTML.widgets.push({
  aggs_exist_here: function() {
    return Aggregates.here().length > 0;
  },

  aggs_here: function() {
    return Aggregates.here().map('.size').sum();
  },

  nearby_aggs: function() {
    var aggs = Aggregates.here_by_dist(
      This._item ? This._item.lat : This.click_latlng.lat(),
      This._item ? This._item.lng : This.click_latlng.lng(), 5);
    if (!aggs || aggs.length < 1) return '';

    var agg = aggs.shift().item;
    var result = "Nearest group: " + agg.size + " contacts in " + agg.loc + ".";

    if (aggs.length > 0) {
      result += "  Other groups: " + aggs.map(function(agg) {
        return agg.item.size + " contacts in " + agg.item.loc;
      }).join('; ') + ".";
    }

    return result;
  }
});
