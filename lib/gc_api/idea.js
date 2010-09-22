Ideas = new Resource('Idea');
// ltypes???

// idea - a template for a gathering
function idea(tag, title, atags, ltypes, json_etc){
  // var parts = tag.split(' ');
  // Resource.add_or_update(tag, $.extend({
  //   id: parts[1],
  //   item_tag: tag,
  //   title: title,
  //   atags: atags
  // }, json_etc));
}


Idea = {
  create: function(title, ceml, x) {
    return Ideas.add("I" + StreamLoader.uuid(), {
      title: title, 
      ceml: ceml
    }, x);
  }
};
