function $values(hash){
  var ms = [];
  $.each(hash, function(i, obj){ ms.push(obj); });
  return ms;
}  

function $keys(hash){
  var ms = [];
  $.each(hash, function(i, obj){ ms.push(i); });
  return ms;
}


function index_item_by(db, item, fields) {
  var dir = db;
  for (var i=0; i < fields.length; i++) {
    var value = item[fields[i]];
    if (dir[value]) {
      dir = dir[value];
    } else {
      if (i == fields.length - 1) {
        dir = dir[value] = [];
      } else {
        dir = dir[value] = {};
      }
    }
  };
  dir.push(item);
  return db;
}

function index_items_by(items, fields) {
  var db = {};
  for (var i=0; i < items.length; i++) {
    index_item_by(db, items[i], fields);
  };
  return db;
}



if (!window.console) {
  window.console = {};
  if (!console.log) {
    console.log = function(x){};
  }
}
