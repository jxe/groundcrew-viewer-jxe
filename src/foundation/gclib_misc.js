function $w(string){
  return string.split(' ');
}


function __compare__(a, b) {
  if (a > b) return 1;
  if (b > a) return -1;
  return 0;
}


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




function tag(name, attrs) {
  var content = '';
  if (attrs.length) attrs = {content: attrs};
  if (name.contains('.')) {
    var words = name.split('.');
    name = words[0];
    attrs['class'] = words.slice(1).join(' ');
  }
  if (name == 'a' && !attrs.href) attrs.href = '#';
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
