////
// This is the "Application" controller and selection model
//
Viewer = {
  
  selected_city: 'nothing',
  
  // stuff to select

  open: function(thing) {
    var item_and_type = Viewer.resolve(thing);
    var item = item_and_type[0];
    var type = item_and_type[1];
    if (!type) return;
    var city_id = item.city_id || (type == 'city' && item);
    if (city_id && Number(city_id) != Number(Viewer.selected_city)) Viewer.select_city(city_id);
    if (type == 'city' && Tour.current) Tour.stop();
    MapMarkers.open(item, type);
    if (type == 'agent') Facebar.selected_agent(item);
  },
  
  close: function(thing) {
    if (this.iw_item_type == 'agent') Facebar.selected_agent(null);
    MapMarkers.close(thing);
  },
  
  select_city: function(city_id) {
    if (Number(Viewer.selected_city) == Number(city_id)) return;
    ItemDb.agents_by_city = ItemDb.index_all_items_by(['city_id']);
    Viewer.selected_city = city_id;
    Tour.stop();
    if (city_id) LandmarkDb.ensure_landmarks(city_id);
    City.recalc_city();
    MapMarkers.select_city(city_id);
    NQueue.fire('did_change_selected_city');
    NQueue.fire('did_change_viewer_state');
  },
  
  city_summary: function() {
    Viewer.open(Viewer.selected_city);
    return false;
  },
  
  zoom_out: function(){ 
    Viewer.select_city(null); 
    return false;
  },

  go_to_self: function() {
    Viewer.open(person_item);
    return false;
  },
    

  // messages
  
  join_please: function() {
    $.facebox($('#join_fbox').html());
  },
  
  
  // private
  
  resolve: function(item) {
    if (item.html) return [item, 'pano'];
    if (item.landmark_tag) item = item.landmark_tag;
    if (item.item_tag) item = item.item_tag;
    if (item[0] == 'P') return [ItemDb.items[item], 'agent'];
    if (item[0] == 'L') {
      var readyto = Tour.cur_readyto();
      if (readyto) {
        var i = Initiative.createLocal('gathering', readyto, {landmark_tag:item});
        return [i, 'gathering'];
      } else {
        return [LandmarkDb.find_by_tag(item), 'lmark'];
      }
    }
    if (item[0] == 'A') return [Initiatives.all[item], 'gathering'];
    if (Number(item)) return [item, 'city'];
    alert('unrecognized viewer object:  ' + item);
    console.log(item);
    return [false, false];
  }
  
};
