function $w(string){
  return string.split(' ');
}

function isEmpty(ob){
  for(var i in ob){ return false;}
  return true;
}

function $keys(hash){
  var ms = [];
  $.each(hash, function(i, obj){ ms.push(i); });
  return ms;
}


function $values(hash){
  var ms = [];
  $.each(hash, function(i, obj){ ms.push(obj); });
  return ms;
}  

function $pairs(hash){
  var ms = [];
  $.each(hash, function(i, obj){ ms.push({key:i, val: obj}); });
  return ms;
}

Math.rand = function(n){
  return Math.floor(n * Math.random());
};

Math.randSort = function(){
  return 0.5 - Math.random();
};

Function.prototype.to_func = function(){ return this; };

if (!window.console) {
  window.console = {};
  if (!console.log) {
    console.log = function(x){};
  }
}

Date.within = function(ts, seconds){
  return Date.unix() - Number(ts) < seconds;
};

Date.unix = function(){
  // getTime returns the number of milliseconds since 1 January 1970 00:00:00 according to
  // universal time.
  return Math.floor(new Date().getTime() / 1000);
};

$.extend(Number.prototype, {
  pan: function(a, b){
    return (this * b) + ((1-this) * a);
  },

  to_hex_byte: function(){
    var x = Math.floor(this);
    if (x > 15) return x.toString(16);
    else return '0' + x.toString(16);
  },

  reverse_nibbles: function(){
    var nibbles = this.to_hex_byte();
    return eval("(0x"+nibbles[1]+nibbles[0]+")");
  }
});
