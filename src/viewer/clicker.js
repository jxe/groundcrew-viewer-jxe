Clicker = {
  click: function(a) {
    if (a.stopPropagation) a = $(this);
    var item, atag, action;
    if (item = a.attr('item')) {
      return Viewer.open(item);
    } else if (atag = a.attr('atag')) {
      var mode = a.attr('mode');
      var atags = City.agents_by_atag();
      var crew = ItemDb.eliminate_self(atags[atag]);
      Tour.start(crew, {atag: atag, mode:mode});
    } else if (action = a.attr('action')) {
      if (action.indexOf('.') >= 0) {
        return eval(action)();
      } else {
        return Viewer[action]();
      }
    }
  }
};
