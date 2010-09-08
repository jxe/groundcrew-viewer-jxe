$.extend(Event, {
  post: function(data, callback) {
    if (demo) { x = Demo.post_event(data); return callback && callback(x); }
    return $.post_with_squad("/event", data, function(result){
      x = eval(result);
      callback && callback(x);
    });
  }
});
