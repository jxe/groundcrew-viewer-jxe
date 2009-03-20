function Resource(tname, options){
  this.tname = tname;
  this.db = { '#id':{} };
  this.all = [];
  if (options) $.extend(this, options);
}

Resource.add_or_update = function(item){
  return item.item_tag.resource_class().add_or_update(item);
};

$.extend(Resource.prototype, {
  id: function(n) {
    return this.db['#id'][n];
  },
  
  local: function(options) {
    options.id = "local_" + Math.rand(10000);
    options.item_tag = this.tname + "__" + options.id;
    this.add_or_update(options);
    return options;
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
      : (this.all || (this.all = $values(this.db['#id'])));

    if (action[0] == '=') 
      return this.db[spec] = start_db.group_by(action.slice(1));
    else if (action[0] == '#')
      return this.db[spec] = start_db.index_by(action.slice(1));
    else if (action[0] == ':')
      return this.db[spec] = start_db.repackage(action.slice(1));

    if (!start_db[action] && spec_words.length == 1 && spec_words[0][0] == '=') {
      var f = "load_by_" + spec_words[0].slice(1);
      this[f] && this[f](action);
    } else if (!start_db[action]) start_db[action] = [];

    return this.db[spec] = start_db[action];
  },
  
  add_or_update: function(item) {
    var exists = this.db['#id'][item.id];
    if (this.all) {
      if (exists) this.all = null;
      else        this.all.push(item);
    }
    this.db['#id'][item.id] = item;
    this.db = { "#id": this.db['#id'] };
    if (this.enhancer) this.enhancer(item);
    if (this.changed) this.changed(item, exists ? 'updated' : 'added');
    return item;
  },

  remove: function(item) {
    delete this.db['#id'][item.id];
    this.all = null;
    this.db = { "#id": this.db['#id'] };
    if (this.changed) this.changed(item, 'removed');
  },
  
  register_all: function(all) {
    this.all = all;
    this.db = {};
    this.find('#id');
    this.enhance_all(all);
  },
  
  register_indexed: function(indexed) {
    this.all = $values(indexed);
    this.db = { '#id': indexed };
    this.enhance_all(all);
  },
  
  enhance_all: function(all) {
    if (!this.enhancer) return;
    for (var i=0; i < all.length; i++) this.enhancer(all[i]);
  },  
  
  add_partition: function(attr, value, all) {
    attr = "=" + attr;
    this.all = this.all.concat(all);
    if (!this.db[attr]) this.db[attr] = {};
    this.db[attr][value] = all;
    this.enhance_all(all);
    for (var i=0; i < all.length; i++)
      this.db["#id"][all[i].id] = all[i];
  }
});
