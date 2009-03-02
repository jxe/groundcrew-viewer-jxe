Array.prototype.last = function(){
  return this[this.length - 1];
};

Array.prototype.max = function(){
  var max = this[0];
  $.each(this, function(){
    if (this > max) max = this;
  });
  return max;
};

Array.prototype.choose_random = function(){
  return this[Math.rand(this.length)];
}


Array.prototype.uniq = function(){
  return $keys(this.to_h());
};

Array.prototype.sum = function(){
  var sum = 0;
  $.each(this, function(){
    sum += this;
  });
  return sum;
};


String.prototype.contains = Array.prototype.contains = function(x){
  return (this.indexOf(x) >= 0);
};

String.prototype.startsWith = Array.prototype.startsWith = function(x){
  return (this.indexOf(x) == 0);
};

function $w(string){
  return string.split(' ');
}

Array.prototype.to_h = function(){
  var h = {};
  $.each(this, function(){ h[this] = true; });
  return h;
};

function __compare__(a, b) {
  if (a > b) return 1;
  if (b > a) return -1;
  return 0;
}

Array.prototype.sort_by = function(fn){
  return this.sort(function(a, b){ return __compare__(fn(a), fn(b)); });
};

Array.prototype.map = function(fn){
  fn = to_f(fn);
  var ms = [];
  $.each(this, function(i, obj){ ms.push(fn(obj)); });
  return ms;
};

Array.prototype.compact = function(fn){
  var ms = [];
  $.each(this, function(i, obj){ if (obj) ms.push(obj); });
  return ms;
};

Array.prototype.flatten = function(fn){
  var ms = [];
  $.each(this, function(i, obj){ ms = ms.concat(obj); });
  return ms;
};

if(!Array.indexOf){
  Array.prototype.indexOf = function(obj){
    for(var i=0; i<this.length; i++){
      if(this[i]==obj){
        return i;
      }
    }
    return -1;
  };
}

Array.prototype.as_option_list = function(selected, title_attr, value_attr){
  if (!title_attr) title_attr = 'title';
  if (!value_attr) value_attr = 'item_tag';
  return this.map(function(x){
    var value = x[value_attr] || x;
    var title = x[title_attr] || x;
    return "<option "+ (selected == value ? " selected " : "") +"value='"+value+"'>" + title + "</option>"; 
  }).join();
};

Array.prototype.dispatch = function(method, args){
  var args = $.makeArray(arguments);
  var method = args.shift();
  var result = null;

  for(var i=0; i<this.length; i++){
    if(this[i][method]){
      result = this[i][method].apply(this[i], args);
      break;
    }
  }

  return result;
};

Array.prototype.trigger = function(method, args){
  var args = $.makeArray(arguments);
  var method = args.shift();
  $.each(this, function(){
    if (this[method]) this[method].apply(this, args);
  });
};
