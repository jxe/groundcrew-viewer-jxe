function to_f(x){
  if (x.constructor == Function) return x;
  if (x.length && x[0] == '.') return function(y){
    return y[x.slice(1)];
  };
}

function rebuzz(xs, splitter, mapper){
  var bins_arr = [];
  var bins = {};
  $.each(xs, function(i, x){
    $.each(to_f(splitter)(x), function(j, bin){
      var mybin = bins[bin];
      if (!mybin) {
        mybin = [x];
        mybin.bin = bin;
        bins_arr.push(mybin);
        bins[bin] = mybin;
      } else {
        mybin.push(x);
      }
    });
  });
  return bins_arr.sort_by(function(x){ return -x.length; }).map(mapper);
}


function tag(name, attrs) {
  var content = '';
  if (name.contains('.')) {
    var words = name.split('.');
    name = words[0];
    attrs['class'] = words.slice(1).join(' ');
  }
  if (name == 'a' && !attrs.href) attrs.href = '#';
  if (attrs.length) attrs = {content: attrs};
  if (attrs.content) {
    content = attrs.content;
    delete attrs.content;
  }
  if (attrs.cls) {
    attrs['class'] = attrs.cls;
    delete attrs.cls;
  }
  var attr = $pairs(attrs).map(function(x){ return x.key + "=\"" + x.val + "\""; }).join(' ');
  return "<" + name + " " + attr + ">" + content + "</" + name + ">";
}


function json_eval(x){
  return eval('(' + x + ')');
}


function $pairs(hash){
  var ms = [];
  $.each(hash, function(i, obj){ ms.push({key:i, val: obj}); });
  return ms;
}

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
