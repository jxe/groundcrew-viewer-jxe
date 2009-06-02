function $w(string){
  return string.split(' ');
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

function isEmpty(ob){
  for(var i in ob){ return false;}
  return true;
}
