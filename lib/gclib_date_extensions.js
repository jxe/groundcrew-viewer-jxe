Date.unix = function(){
  return Math.floor(new Date().getTime() / 1000);
};

function $time(t){
  var x = new Date(t  * 1000);
  var hour=x.getHours();
  var minutes=x.getMinutes();
  var ampm=(hour>=12)? "PM" : "AM";
  hour=(hour>12)? hour-12 : hour;
  minutes = minutes<=9 ? "0" + minutes : minutes;
  return hour + ":" + minutes + " " + ampm;
}

function $from_now(n){
  return "<span class='from_now' t='" +n+ "'>" + $from_now_(n) + "</span>";
}

function $from_now_(n){
   var now = Math.floor(new Date().getTime() / 1000);
   var delta = n - now;
   var minutes = Math.round(delta / 60);
   if (minutes > 90) {
      var hours = Math.floor(minutes / 6) / 10;
      return hours + "hrs";
   } else if (minutes < -10) {
      return "???";
   } else if (minutes < 1) {
      return "< 1min";
   } else {
      return minutes + "min";
   }
}

function $long_ago(t){
  var now = Math.floor(new Date().getTime() / 1000);
  var delta = now - Number(t);
  var minutes = Math.round(delta / 60);
  if (minutes > 90) {
     var hours = Math.floor(minutes / 6) / 10;
     if (hours > 24) {
       var days = Math.floor(hours / 2.4) / 10;
       return days + "days";
     }
     return hours + "hours";
  } else {
     return minutes + "minutes";
  }
}

$.fn.update_times = function(){
  this.each(function(){
    $this = $(this);
    $this.html($from_now_($this.attr('t')));
  });
};
