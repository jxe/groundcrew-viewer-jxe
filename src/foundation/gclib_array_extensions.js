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

Array.prototype.each_call = function(msg){
  $.each(this, function(k, listener){
    if (!listener[msg]){
      // console.log("skipping msg " + msg + " on::"+ listener);
    } else {
      var f = listener[msg];
      if (listener[f]) {
        // console.log('redirecting ' + msg + " on " + listener);
        listener[f].apply(listener);
      } else {
        // console.log('calling ' + msg + " on " + listener);
        listener[msg].apply(listener);
      }
    }
  });
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

Array.prototype.as_option_list = function(selected){
  return this.map(function(x){ 
    return "<option "+ (selected == x.item_tag ? " selected " : "") +"value='"+x.item_tag+"'>" + x.title + "</option>"; 
  }).join();
};
