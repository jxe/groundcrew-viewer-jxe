Clicker = {
  click: function(a) {
    var item = a.attr('item');
    if (item) return Viewer.open(item);
    var atag = a.attr('atag');
    var mode = a.attr('mode');
    var atags = City.agents_by_atag();
    var crew = ItemDb.eliminate_self(atags[atag]);
    Tour.start(crew, {atag: atag, mode:mode});
  }
};
