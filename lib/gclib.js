Date.unix = function(){
  return Math.floor(new Date().getTime() / 1000);
};


$.fn.showhide = function(obj){
  var self = this;
  $.each(obj, function(k, v){
    if (v){
      self.find(k).show();
    }
    else {
      self.find(k).remove();
    }
  });
  return self;
};

function $L(obj, str) {
  return obj[obj[str]] || obj[str];
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

function number_word(n) {
  if (n > 15) return n;
  return [
    'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen'
  ][n];
}

function number_plural(n, singular, plural) {
  if (n == 1) return "One " + singular;
  return number_word(n) + " " + plural;
}


$.templates = {};
$.template = function(sel){
  if ($.templates[sel]) return $.templates[sel].clone();
  $.templates[sel] = $(sel).remove().show();
  return $.template(sel);
};

$.fn.forms = function(obj){
  var self = this;
  $.each(obj, function(k, v){
    var form = self.find(k);
    form.submit(function(){
      v(this);
      return false;
    });
  });
  return self;
};




$.fn.fillout = function(obj){
  var self = this;
  $.each(obj, function(k, v){
    if (k.indexOf(' //') >= 0) {
      var tmp = k.split(' //');
      self.find(tmp[0]).attr(tmp[1], v);
    } else {
      if (v instanceof Array) {
        self.find(k).append(v);
      } else {
        self.find(k).html(v || ' ');
      }
    }
  });
  return self;
};

$.fn.clicks = function(obj){
  var self = this;
  $.each(obj, function(k, v){
    self.find(k).click(function(){ v(this); return false; });
  });
  return self;
};



function __compare__(a, b) {
  var i = 0;
  while (a[i] || b[i]) {
    if (a[i] > b[i]) return 1;
    if (a[i] < b[i]) return -1;
    i++;
  }
  return 0;
}

function english_list(items) {
  if (items.length == 1) return items[0];
  if (items.length == 2) return items[0] + " and " + items[1];
  var last = items.pop();
  return items.join(', ') + " and " + last;
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


function $T(t, data){
  return t.replace(/#\{(.*?)\}/g, function(_, p1){ return data[p1]; });
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

Array.prototype.index_by = function(fn){
  if (fn instanceof RegExp) {
    return this.index_by(function(x){ 
      res = x.match(fn); return res && res[0]; 
    });
  }

  var result = {};
  $.each(this, function(){
    if (res = fn(this)) {
      if (!result[res]) result[res] = [];
      result[res].push(this);
    }
  });
  return result;
};

// inefficient!
Array.prototype.sort_by = function(fn){
  return this.sort(function(a, b){ return __compare__(fn(a), fn(b)); });
};

Array.prototype.map = function(fn){
  var ms = [];
  $.each(this, function(i, obj){ ms.push(fn(obj)); });
  return ms;
};

Array.prototype.compact = function(fn){
  var ms = [];
  $.each(this, function(i, obj){ if (obj) ms.push(obj); });
  return ms;
};

Array.prototype.grep = function(regex, line){
  var res = [];
  $.each(this, function(){
    if (matches = this.match(regex)) res.push(line ? this : matches[0]);
  });
  return res;
};

Array.prototype.uniq = function(){
  var hash = {};
  $.each(this, function(i, obj){ hash[obj] = true; });
  return $keys(hash);
};

$.wire_up = function(e){
  e = e || document;
  $(function(){
      $('a[rel*=facebox]', e).facebox();
      $('div[facebox]', e).click(function(){
        $.facebox.loading(true);
        var target = $(this).attr('facebox');
        var elements = $(target).clone().show().find('a[squad_action]').squad_action_link().end();
        $.facebox.reveal(elements);
        return false;
      });
  });
  $('.from_now', e).update_times();
  $('.locwidget').locwidget();

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

$.fn.center = function(){
  var window_width = window.innerWidth || window.document.body.clientWidth;
  this.each(function(){
    var $e = $(this);
    $e.css('left', window_width/2 - $e.width()/2);
  });
  return this;
};

$.fn.tb_activate = function(fn){
  this.change(fn);
  this.keypress(function(e){ if (e.which == 13) return fn(); });
  return this;
};

$.fn.ul_expando = function(){
  this.each(function(){
    var self = $(this);
    if (self.find('li').length <= 5) return;
    var elided, more;
    more = $("<a class='more' href='#'>..more..</a>").click(function(){
      more.replaceWith(elided);
      return false;
    });
    var others = self.find('li:gt(4)');
    elided = others.clone(true);
    others.remove();
    self.append(more);
  });
  return this;
};

$.fn.locwidget = function(){
  this.each(function(){
    var self = $(this);
    var div = self.find('div');
    var size = self.attr('size');
    var alias = self.attr('alias');
    var try_load = function(){
      div.html('<img src="/i/spinner.gif"/>');
      var loc = self.find('input').val();
      $.getJSON('/agent/setloc', {size:size, alias:alias, loc:loc}, function(json){
        if (!json[0]){
          div.html('Please enter a recognizable address.').addClass('invalid');
        } else {
          div.html($T("<img src='#{map_url}'/>", {map_url:json[2]}));
          self.find('input').val(json[1]);
        }
      });
      return false;
    };
    self.find('input').tb_activate(try_load);
  });
};

$.fn.ajax_update = function(url){
  return this.html("loading...").load(url);
};

$.fn.squad_action_link = function(){
  this.click(function(){
    var $this = $(this);
    var squad_id = $this.parents('[squad_id]').attr('squad_id');
    var squad_action = $this.attr('squad_action');
    jQuery(document).trigger('close.facebox');
    $('#membox_' + squad_id).load('/membership/update/' + squad_id, { 'membership[accessibility]': squad_action }, function(){
      $.wire_up(this);
      $(this).find('div[facebox]').click();
    });
    return false;
  });
  return this;
};

$.fn.update_times = function(){
  this.each(function(){
    $this = $(this);
    $this.html($from_now_($this.attr('t')));
  });
};

$.fn.scrollDown = function(){
  this.each(function(){
    this.scrollTop = this.scrollHeight;
  });
  return this;
};

if (!window.console) {
  window.console = {};
  if (!console.log) {
    console.log = function(x){};
  }
}

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

function $w(string){
  return string.split(' ');
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
