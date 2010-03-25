function $time(ts){
  var x = new Date(ts * 1000);
  var hour=x.getHours();
  var minutes=x.getMinutes();
  var ampm=(hour>=12)? "PM" : "AM";
  hour=(hour>12)? hour-12 : hour;
  minutes = minutes<=9 ? "0" + minutes : minutes;
  return hour + ":" + minutes + " " + ampm;
}

var month3LetterNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function $mon_date(ts) {
  var x = new Date(ts * 1000);
  return month3LetterNames[x.getMonth()] + " " + x.getDate();
}

function $is_today(ts) {
  d = new Date(ts * 1000);
  now = new Date();
  return d.getDate() == now.getDate() && d.getMonth() == now.getMonth() && d.getYear() == now.getYear();
}

function $time_and_or_date(ts){
  if (!ts || ts == 0) return null;
  if ($is_today(ts)) return $time(ts);
  var hours_delta = (Math.floor(new Date().getTime() / 1000) - Number(ts)) / (60*60);
  if (hours_delta < 7*24) return $mon_date(ts) + " " + $time(ts);
  return $mon_date(ts);
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
  if (delta < 5) delta = 5;
  if (delta < 60) return delta + " seconds";
  var minutes = Math.round(delta / 60);
  if (minutes > 90) {
     var hours = Math.floor(minutes / 6) / 10;
     if (hours > 24) {
       var days = Math.floor(hours / 2.4) / 10;
       return days + " days";
     }
     return hours + " hours";
  } else {
     return minutes + " minutes";
  }
}

$.fn.update_times = function(){
  this.each(function(){
    $this = $(this);
    $this.html($from_now_($this.attr('t')));
  });
};
