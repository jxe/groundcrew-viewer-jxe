Math.rand = function(n){
  return Math.floor(n * Math.random());
};

Function.prototype.to_func = function(){ return this; };

if (!window.console) {
  window.console = {};
  if (!console.log) {
    console.log = function(x){};
  }
}

Date.unix = function(){
  var date = new Date();
  var offset = date.getTimezoneOffset() * 60;
  return Math.floor(date.getTime() / 1000) - offset;
};
