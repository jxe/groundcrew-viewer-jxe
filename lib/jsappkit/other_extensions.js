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
  var date = new Date();
  var offset = date.getTimezoneOffset() * 60;
  return Math.floor(date.getTime() / 1000) - offset;
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
