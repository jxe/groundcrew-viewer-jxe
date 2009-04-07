//
// GROUNDCREW VIEWER<->SERVER COMMUNICATIONS
//
// To communicate with the server, the viewer polls a file every 20s
// at http://[SERVER]/data/this10.js, which contains all events from 
// the last few minutes.  The server returns javascript which calls a 
// limited set of four functions: {item,event,city,idea}, defined in 
// models.js.  These functions, when called, add or update
// entries in an in-browser, in-memory database which is used to draw
// them map and fill out the UI.
//


Ajax = {
  interval: 20 * 1000,
  timer: null,
  post_process_new_events: {},

  uuid: function() {
    return CurrentUser.tag + '_' + new Date().getTime();
  },
  
  init: function() {
    $("body").bind("ajaxSend", function(){
      clearTimeout(Ajax.timer);
      $(this).addClass('refresh');
    }).bind("ajaxComplete", function(){
      Ajax.schedule_autoload();
      $(this).removeClass('refresh');
    });

    $.ajaxSetup({
      error: function(req, textStatus, errorThrown){
        if (req.status == 404) return;
        if (errorThrown){ throw errorThrown; }
        if (req.responseText) $.facebox(req.responseText);
      }
    });

    EventDb.new_events_are_new = true;
    Ajax.schedule_autoload();
  },

  schedule_autoload: function(){
    if (Ajax.timer) clearTimeout(Ajax.timer);
    Ajax.timer = setTimeout(Ajax.autoload, Ajax.interval);
  },

  autoload: function(){
    $.getScript('/data/this10.js');
    $.each(Ajax.post_process_new_events, function(i, obj){ obj(); });
    Ajax.post_process_new_events = {};
  },

  fetch: function(url, options, after){
    $.getJSON(url, options, function(obj){
      if (obj.error){ alert("Note: " + obj.error); return; }
      if (after) after(obj);
    });
  }

};


// item - an item on the map
function item(city_id, tag, title, thumb_url, lat, lng, atags, latch, comm, req, json_etc){
  var parts = tag.split('__');
  return Resource.add_or_update($.extend({
    id: parts[1],
    item_tag: tag,
    title: title,
    thumb_url: thumb_url,
    city_id: city_id,
    lat: lat,
    lng: lng,
    atags: atags,
    latch: latch,
    comm: comm,
    req: req
  }, json_etc));
}

var cities = {};
var city_locs = {};

// city - a city in which there is groundcrew activity
function city(id, title, lat, lng, agent_count){
  var parts = title.split(', ');
  cities[id] = parts[0];
  city_locs[id] = [lat, lng];
}

// idea - a template for a gathering
function idea(tag, title, atags, ltypes, json_etc){
  var parts = tag.split('__');
  Resource.add_or_update($.extend({
    id: parts[1],
    item_tag: tag,
    title: title,
    atags: atags
  }, json_etc));
}

EventDb = {};
EventDb.events = [];
EventDb.by_tag = {};
EventDb.watched = {};
EventDb.new_events_are_new = false;

// event - anything that happened
function event(annc_tag, created_at, atype, actor_tag, re, atags, city_id, item_tag, item_changes, json_etc){

  if (EventDb.by_tag[annc_tag]) return;

  var event = $.extend({
    annc_tag: annc_tag,
    item_tag: item_tag,
    created_at: created_at,
    atype: atype,
    actor_tag: actor_tag,
    re: re,
    atags: atags,
    city_id: city_id
  }, json_etc);
  
  EventDb.by_tag[annc_tag] = event;

  // handle any item changes packed in this event
  if (item_tag && item_changes) {
    var item = item_tag.resource();
    $.extend(item, item_changes);
    Resource.add_or_update(item);
  };

  // add it to the list of all events
  Event.improve(event);
  EventDb.events.push(event);
  if (atype == 'said') Chat.chats.push(event);
  if (atype == 'off') Agents.remove(item_tag);

  if (!EventDb.new_events_are_new) return event;

  Notifier.did_add_new_event(event);
  if (atype == 'said') $('#chat_palette').app_paint();
  
  // do app specific stuff
  if (Viewer.current_app.on_new_event) Viewer.current_app.on_new_event(event);

  return event;
}

// login - called to specify the operator of the viewer
function login(user_info){
  CurrentUser = user_info.tag.resource();
  if (!CurrentUser) {
    var user_item_json  = $.cookie('user_item');
    eval(user_item_json);
    CurrentUser = user_info.tag.resource();
  }
  $.extend(CurrentUser, user_info);
  CurrentUser.logged_in = true;
}



// Ajax.fetch('/agent/update', { availability: newstatus }, Agents.add_or_update);    

// Ajax.fetch('/agent/update', {readyto: data.readyto}, function(x){
//   Agents.add_or_update(x);
//   City.recalc_city();
// });

// Ajax.fetch('/agent/update', {location: data.newloc}, Agents.add_or_update);    

// Ajax.fetch('/agent/contact', {
//   new_state: 'assigned',
//   msg: data.assign,
//   item: Viewer.item,
//   topic: Viewer.apps.mobilize.state.atag
// }, EventDb.add);

// Ajax.fetch('/gc/invite', {
//   topic: Viewer.apps.mobilize.state.atag,
//   landmark: MapMarkers.iw_item && MapMarkers.iw_item.landmark_tag,
//   what: data.action,
//   payload: data.instr
// }, function(result){
//   $.facebox.close();
//   EventDb.new_event(result);
//   // Viewer.open(SuggestionIW.latest);
//   alert('your invite has been sent!');
// });
