function Resource(tname, options){
  this.tname = tname;
  this.db = {};
  this.by_tag = {};
  this.all = [];
  this.what_changed = {};
  this.changed_timer = null;
  if (options) $.extend(this, options);
}

Resource.add_or_update = function(tag, item, xtra){
  return tag.resource_class().add_or_update(tag, item, xtra);
};

Resource.handle_changes = false;

$.extend(Resource.prototype, {
  id: function(n) {
    return this.by_tag[ this.tname + "__" + n ];
  },
  
  everything: function(){
    return $values(this.by_tag);
  },
  
  find: function(spec) {
    if (this.db[spec]) return this.db[spec];

    var spec_words = spec.split(' ');
    var action = spec_words.pop();
    if (action == "undefined") {
      console.log('resource find called with undefined!');
      window.fucker();
    }
    var start_db = spec_words.length
      ? this.find(spec_words.join(' ')) 
      : (this.all || (this.all = $values(this.by_tag)));

    if (action[0] == '=') 
      return this.db[spec] = start_db.group_by(action.slice(1));
    else if (action[0] == '#')
      return this.db[spec] = start_db.index_by(action.slice(1));
    else if (action[0] == ':')
      return this.db[spec] = start_db.repackage(action.slice(1));
    else if (action[0] == ';')
      return this.db[spec] = start_db.semirepackage(action.slice(1));

    return this.db[spec] = start_db[action] || [];
  },
  
  add: function(tag, item, xtra) {
    if (this.by_tag[tag]) return;
    if (xtra) $.extend(item, xtra);
    item.id = tag;
    this.by_tag[tag] = item;
    if (this.all) this.all.push(item);
    this.handle_change(item);
    return item;
  },
  
  add_or_update: function(tag, item, xtra) {
    if (xtra) $.extend(item, xtra);
    if (this.by_tag[tag]) {
      $.extend(this.by_tag[tag], item);
    } else {
      item.id = tag;
      this.by_tag[tag] = item;
      if (this.all) this.all.push(item);
    }
    this.handle_change(this.by_tag[tag]);
    if (item.ts && (!Resource.ts || item.ts > Resource.ts)) Resource.ts = item.ts;
    return item;
  },
  
  handle_change: function(item) {
    this.db = {};
    if (this.enhancer) this.enhancer(item);
    if (!Resource.handle_changes) return;
    if (this.changed) {
      if (!this.changed_timer) {
        var self = this;
        this.changed_timer = setTimeout(function(){
          self.changed(self.what_changed);
          self.what_changed = {};
          self.changed_timer = null;
        }, 0);
      }
      this.what_changed[item.id] = item;
    }
  },  
  
  remove: function(tag) {
    delete this.by_tag[tag];
    this.all = null;
    this.db = {};
    // this.handle_change(this.by_tag[tag]);
  }
  
});
