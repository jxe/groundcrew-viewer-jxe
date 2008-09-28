////
// ItemDB
// - a database of on-map items in the viewer (agents, for now)
//
ItemDb = {
  
  items: {},

  add_all: function(items) {
    $.each(items, function(){
      if (this.lat && this.lng) {
        if (this.status == 'dead' && this.item_tag != agent_tag) return;
        Item.calculate_fields(this);
        ItemDb.items[this.item_tag] = this;
      }
    });
  },
  
  eliminate_self: function(crew) {
    var new_crew = [];
    $.each(crew, function(){
      if (this.item_tag != agent_tag) new_crew.push(this);
    });
    return new_crew;
  },
  
  add_or_update: function(item) {
    if (item.status == 'dead' && item.item_tag != agent_tag) 
      return ItemDb.remove(item);
    if (!(item.lat && item.lng))
      return;
    if (item.item_tag[0] == 'L') return LandmarkDb.add(item);
    if (item.item_tag[0] != 'P') return;
    Item.calculate_fields(item);
    var how = ItemDb.items[item.item_tag] ? 'updated' : 'added';
    ItemDb.items[item.item_tag] = item;
    ItemDb.changed(item, how);
  },
  
  remove: function(item) {
    var item = item.item_tag ? item : ItemDb.items[item];
    delete ItemDb.items[item.item_tag];
    item.title = null;
    ItemDb.changed(item, 'removed');
  },

  index_all_items_by: function(fields) {
    return index_items_by(this.all_items(), fields);
  },
      
  all_items: function() {
    return $values(ItemDb.items);
  },

  // private
  changed: function(item, how) {
    $.each([MapMarkers, Facebar], function(){
      this.did_change_item(item, how);
    });
  }
      
};
