////
// This is the "Application" controller
//
Viewer = App = {
  initted: false,
  modes: {},
  tools: {},
  most_recent_tool: {},

  search_form_submitted: function(data, state, form) {
    go('q=' + data.q);
    $(form).enable();
  },

  clear_query: function() {
    $('#search').val('');
    go('q=');
  },

  query: function() {
    return This.q;
  },

  zoomed_out: function() {
    return !This.city;
  },

  closeclick: function() {
    This.city ? go('@' + This.city) : go('tool=');
  },

  update: function(changed) {
    if (!This.prev_url) changed.tool = changed.item = changed.city = true;

    if (changed.tool && This.tool && This._item && !changed.item) set('item', This.city);

    if (changed.item) {
      if (!This.item) {
        This._item = null;
        set('city', null);
      } else if (This.item.startsWith('City__')) {
        This._item = null;
        set('city', This.item);
      } else {
        This._item = This.item && This.item.resource();
        if (This._item) set('city', 'City__' + This._item.city_id);
      }
    }

    if (changed.city || changed.q) {
      This.city_id = This.city && This.city.replace('City__', '');
      set('agents', Agents.here());
      $('#flexbar').scrollLeft(0);
      if (This.city) $('body').removeClass('zoomed_out');
      else $('body').addClass('zoomed_out');
    }

    if (changed.city) {
      if (This.city) Map.set_focus_on_city();
      else Map.set_focus_worldwide();
    }

    if (changed.agents) {
      Facebar.populate(This.agents);
      if (!changed.city) Map.layer_recalculate('agents');
    }

    if (changed.mode) {
      if (This.mode != '') $('#modetray').app_paint().show();
      else $('#modetray').hide();
      $('.' + This.mode + '_mode').activate('mode');
      Frame.resize();

      This.first_responders[0] = {};
      This.first_responders[1] = App.modes[This.mode.toLowerCase()] || {};
    }

    if (changed.tool) {
      App.most_recent_tool[This.mode] = This.tool;
      $('.' + This.tool + '_tool').activate('tool');
      This.first_responders[0] = App.tools[This.tool] || {};
    }

    if (changed.item || changed.mode || changed.tool) App.refresh_mapwindow();

    $('.magic').app_paint();
    $('.hud:visible').app_paint();
    App.loaded = true;

  },

  go_login: function() {
    $.cookie('back', window.location.href);
    window.location = '../login';
  },

  error_on_non_immediate: function(item_ids) {
    if (!App.use_slow_agents) return false;
    var items = item_ids.map(function(id) { return id && id.resource(); }).compact();
    var slow_items = items.grep(function(item) { return !item.immediate; });
    if (slow_items.length == 0) return false;

    var slow_names = slow_items.map(function(item) { return item.title || "unnamed agent"; }).join(', ');
    var msg = slow_names + (slow_items.length > 1 ? ' are' : ' is') +
      ' reachable only via email, which does not support this operation.';
    alert(msg);
    return true;
  },

  request_agent_update_location: function() {
    if (App.error_on_non_immediate([This.item])) return "redo";

    // TODO: check comm3 and don't allow if we bugged them recently
    if (demo) return Demo.update_loc(This.item);
    return Operation.exec(CEML.script_for("msg", "Our location for you looks old or imprecise. " +
        "Where are you? Please respond with 'at' and then your address."),
      This.item, This.item, function(){
      $('#make_it_happen_form').html('Message sent!');
    });
  },


  demo_mode: function() {
    return demo;
  },

  refresh_mapwindow: function() {
    if (!This._item) {
      GM.closeInfoWindow();
    }
    else {
      var thing = This.item.resource_type().toLowerCase();
      var best_mapwindow_template = $.template('#' + thing + '_for_' + This.mode + '_mode') || $.template('#' + thing + '_for_any_mode');
      if (best_mapwindow_template) {
        MapMarkers.window(best_mapwindow_template);
      } else {
        //TODO:  if there's no template, there should be no selection
        console.log('no good template for ' + thing);
        GM.closeInfoWindow();
      }
    }
  },

  map_clicked: function() {
    return;
  },

  did_add_events: function(state) {
    // TODO: temp fix.  Need to make events intelligently cause related windows to refresh
    // (e.g. agent window refreshes if agent reported)
    if (This.item && This.item.resource_type() == 'Op') App.refresh_mapwindow();
    if (This.tool == 'view_events') $('.view_events_tool').app_paint();
  },

  live_event_info: function (state) {
    $.each(op_children[This.item] || [], function(){ Event.improve(this); });
    return Actions.event_t.tt(op_children[This.item]);
  },
  
  // TODO: get stack trace (see http://eriwen.com/javascript/js-stack-trace/)
  // and include some state like This.url, form submitted, etc.
  report_error: function(msg, e, place) {
    console.log(e);
    var report = '';
    report += msg;
    report += " at " + place;
    if (e) report += "\nException: " + e;
    if (e && e.stack) report += "\nStack trace: " + e.stack;
    console.log(report);
    $.post('/api/bugreport', {issue: report}, function(){
      // TODO: turn user alerts back on (and make them not call alert()) when we're confident
      // that spurious errors are being handled

      // Notifier.error('A bug occurred in the Groundcrew viewer!' +
      //   '\n\nIt has been reported to our developers, but you might need to reload the viewer. Sorry!');
    });
  },

  handle_error: function(msg, uri, line) {
    // map script loading fails sometimes, but seems to automatically reload
    if (msg.type == 'error') {
      uri = msg.target && msg.target.src;
      if (uri && uri.indexOf("http://maps") >= 0) return false;
    }
    if (uri && uri.indexOf("http://www.panoramio.com/map/get_panoramas.php") >= 0) return false;
    if (uri && uri.indexOf("http://maps") >= 0 && msg == "Error loading script") return false;

    App.report_error(msg, null, uri + ": " + line);
    return false; // don't suppress the error
  },


  // ======================
  // = App initialization =
  // ======================

  init: function() {
    if (App.initted) return;
    App.initted = true;

    // error handling
    if (window.location.href.indexOf('localhost') < 0 && window.authority != 'pedbe82b8576a') {
      $(window).error(App.handle_error);
    }

    // init the UI
    Frame.init();
    if (demo) $('body').addClass('demo_mode');
    $('body').addClass('stream_role_' + window.stream_role);
    LiveHTML.init();
    $('body').removeClass('loading');
    Map.establish();
    $('._mode').activate('mode');

    // start communication with server
    Ajax.init();

    if (window.location.hash) Ajax.go_on_load = window.location.hash.slice(1);
    else {
      var start_city = '';
      var agents_by_city = Agents.find('=city_id');
      delete agents_by_city[0];
      var active_cities = $keys(agents_by_city);
      if (active_cities.length == 1) start_city = active_cities[0];
      if (active_cities.length == 0 && most_recent_item) {
        start_city = 'City__' + most_recent_item.city_id;
      }
      Ajax.go_on_load = 'item=' + start_city;
    }

    Ajax.maybe_trigger_load();

    if (demo) Demo.init_manual();
  },

  switch_to_question: function(value, ch) {
    if (ch == '?') {
      $('form input[value=question]').attr('checked', 'checked');
    }
  },

  maxchar: function(max, where, value, chr, obj) {
    setTimeout(function(){
      var current = obj.val().length;
      var diff = Number(max) - Number(current);
      $(where).html(diff);
      if (diff < 5) $(where).addClass('red');
      else $(where).removeClass('red');
    }, 50);
  },

  require_selection: function(value) {
    $('.require_selection').toggle(value == 'require_selection');
  },

  go_to_self: function() {
    go('@' + This.user.tag);
  },

  decorate_map: function() {
    if (Map.layer_visible['landmarks'])
      MapLandmarks.fetch_landmarks_in_bounds(GM.getBounds());
  },

  help_form_submitted: function(data) {
    $.post('/api/bugreport', {issue: data.issue}, function(){
      Notifier.success('Thanks!', 'Submitted');
      go('tool=');
    });
  },
  
  reverse_geocode_landmark: function(data) {
    var geocoder = new GClientGeocoder();
    geocoder.getLocations(new GLatLng(data.lat, data.lng), function(response) {
      if (response && response.Status.code==200) {
        var place = response.Placemark[0];
        data.name = place.address;
        App.post_landmark(data);
      }
    });
  },

  post_landmark: function(data, callback) {
    if (!App.stream_role_organizer()) return Notifier.error("You must be an organizer on this squad to edit landmarks.");
    if (!This.city) {
      alert('Sorry, landmarks can only be created in a city.');
      return "redo";
    }

    if (!data.lm_id)  data.lm_id = 'l' + authority + '_' + Date.unix();
    if (!data.lat)    data.lat = This.click_latlng.lat();
    if (!data.lng)    data.lng = This.click_latlng.lng();
    if (!data.kind)   data.kind = 'l';
    if (!data.city)   data.city = This.city_id;
    if (!data.latch)  data.latch = "unlatched";
    if (!data['float']) data['float'] = "onmap";

    if (!data.name) {
      App.reverse_geocode_landmark(data);
      data.name = "Landmark at " + Math.round(data.lat*100)/100 + " latitude and " + 
        Math.round(data.lng*100)/100 + " longitude";
    }

    if (demo) {
      lm = item(data['city'], data['lm_id'], data['name'] || 'A landmark', null,
        data['lat'], data['lng'], data['with_tags'], "unlatched", null, null, {});
      Map.site_add('landmarks', lm.id, MapLandmarks.marker_for_lm(lm));

      callback && callback(lm);
      return true;
    }

    return $.post('/api/items/'+data.lm_id, data, function(landmark_js){
      var lm = eval(landmark_js);
      Map.site_add('landmarks', lm.id, MapLandmarks.marker_for_lm(lm));

      callback && callback(lm);
    }, 'text');
  },

  send_landmark_form_submitted: function(data) {
    if (!data.name) {
      alert('Please provide a location name!');
      return "redo";
    }
    if (This.item && This.item.resource_type() == 'Landmark') {
      data.lm_id = This.item;
      data.lat = This._item.lat;
      data.lng = This._item.lng;
    }
    return App.post_landmark(data, function(lm) { go('@'+lm.id); });
  },

  delete_landmark: function(data) {
    var r = confirm("Are you sure you wish to remove the landmark?  You will no longer be able " +
      "to view missions that took place at it.");
    if (!r) return "redo";

    if (demo) {
      off(This.item);
      return App.closeclick();
    }

    return $.delete_('/api/items/' + This.item, null, function() {
      off(This.item);
      App.closeclick();
    });
  },

  radial_invite_form_submitted: function(data) {
    if (data.agents == "require_selection") data.agents = Selection.agent_ids().join(' ');
    if (App.error_on_non_immediate(data.agents.split(' '))) return "redo";
    if (!data.title) {
      alert('Please provide an assignment!');
      return "redo";
    }
    if (!data.agents) {
      alert('There are no agents to invite!');
      return "redo";
    }
    if (demo) return Demo.invite(data.agents.split(' '), This.item, data.title, data.assignment);
    return Operation.exec(CEML.script_for_invite(data.title, data.assignment), data.agents, This.item, function(){
      $('#radial_invite_form').html('message sent!');
    });
  },

  mission_landmark_invite_form_submitted: function(data) {
    if (!App.stream_role_organizer()) return Notifier.error("You must be an organizer on this squad to run operations.");
    if (data.agents == "require_selection") data.agents = Selection.agent_ids().join(' ');
    if (App.error_on_non_immediate(data.agents.split(' '))) return "redo";
    if (!data.title) {
      alert('Please provide an assignment!');
      return "redo";
    }
    if (!data.name) {
      alert('Please provide a location name!');
      return "redo";
    }
    if (!data.agents || data.agents.size == 0) {
      alert('There are no agents to invite!');
      return "redo";
    }
    if (!This.city) {
      alert('Sorry, landmark missions can only be started in a city.');
      return "redo";
    }

    return App.post_landmark(data, function(lm) {
      if (demo) return Demo.invite(data.agents.split(' '), lm.id, data.title, data.assignment);

      return Operation.exec(CEML.script_for_invite(data.title, data.assignment), data.agents, lm.id,
        function(){ $('#mission_landmark_invite_form').html('message sent!'); });
    });
  },

  question_landmark_form_submitted: function(data) {
    if (!App.stream_role_organizer()) return Notifier.error("You must be an organizer on this squad to ask questions.");

    if (!data.question || data.question.length < 5) {
      alert('Please provide a question to ask that\'s at least 5 characters!');
      return "redo";
    }
    if (!This.city) {
      alert('Sorry, landmark-based questions can only be asked in a city.');
      return "redo";
    }

    if (data.agents == "require_selection") data.agents = Selection.agent_ids().join(' ');

    if (!data.agents || data.agents.size == 0) {
      alert('There are no agents to ask!');
      return "redo";
    }

    return App.post_landmark(data, function(lm) {
      if (demo) return Demo.question(data.question, data.agents.split(' '), lm.id);

      return Operation.exec(CEML.script_for('question', data.question), data.agents, lm.id);
    });
  },

  ask_question_form_submitted: function(data) {
    var agent_ids = Agents.here().map('.id');
    if (!agent_ids || agent_ids.length < 1) {
      alert('There are no agents to ask!');
      return "redo";
    }
    if (!This.city) {
      alert('Sorry, asking a question worldwide is not permitted at this time.');
      return "redo";
    }
    if (!data.question || data.question.length < 5) {
      alert('Please provide a question to ask that\'s at least 5 characters!');
      return "redo";
    }
    if (demo) return Demo.question(data.question, agent_ids);
    agent_ids = agent_ids.join(' ');
    return Operation.exec(CEML.script_for('question', data.question), agent_ids, agent_ids);
  },

  blast_message_form_submitted: function(data) {
    if (!data.message || data.message.length < 5) {
      alert('Please provide a message that\'s at least 5 characters!');
      return "redo";
    }
    params = { msg: data.message, sys: 'm' };
    if (data.tags) {
      params['query'] = data.tags.split(/[,\s]+/).map(function(tag) {return 'tag:' + tag;}).join(' ');
    }
    if (This.city_id) params['city'] = This.city_id;
    if (demo) { Notifier.success("Blasting message to agents!"); return go('tool='); }

    if (window.remaining <= 0) {
      $.post('/api/bugreport', {issue: window.current_stream + ' has run out of text messages!'});
      alert('You have reached your limit on text messages!  ' +
        'Please contact Groundcrew support to purchase more.');
      return false;
    }

    if (!App.stream_role_organizer()) return Notifier.error("You must be an organizer on this squad to blast messages.");

    return $.post('/api/blast_message', params, function(data){
      go('tool=');
      Notifier.success("Blasting message to " + data + " agents!");
    });
  },

  blast_email_form_submitted: function(data) {
    if (!data.subject || !data.body || data.body.length < 5) {
      alert('Please provide a subject and a message body!');
      return "redo";
    }
    if (This.city_id) data['city'] = This.city_id;
    if (data.tags) {
      data['query'] = data.tags.split(/[,\s]+/).map(function(tag) {return 'tag:' + tag;}).join(' ');
    }

    if (demo) { Notifier.success("Blasting email to agents!"); return go('tool='); }

    if (!App.stream_role_organizer()) return Notifier.error("You must be an organizer on this squad to blast messages.");

    return $.post('/api/blast_email', data, function(data){
      go('tool=');
      Notifier.success("Blasting email to " + data + " agents!");
    });
  },

  tag_agents_form_submitted: function(data) {
    var agents = Selection.agent_ids();
    if (!agents || agents.length == 0) {alert('Please select some agents to tag.'); return "redo";}
    if (!data.tags) { alert('Please provide some tags!'); return "redo"; }

    var params = { agent_ids: agents.join(' ') };
    if (data.tags.startsWith('stream:')) {
      params['with_stream'] = data.tags.replace(/^stream:/, '');
    } else {
      params['with_tag'] = data.tags;
    }
    if (demo) return Demo.tag(agents, data.tags, function(){go('tool=');});
    if (!App.stream_role_organizer()) return Notifier.error("You must be an organizer on this squad to tag agents.");
    return $.post('/api/agents/update_all', params, function(){
      go('tool=');
    });
  },

  setmode: function(mode) {
    if (This.mode != mode) return go('mode=' + mode);
    else {
      if (mode == 'dispatch') return true;
      $('#modetray').toggle();
      return Frame.resize();
    }
  },


  make_it_happen_form_submitted: function(data) {
    if (!data.assign) {
      alert('Please provide an assignment!');
      return "redo";
    }
    if (demo && data.kind == "question") return Demo.question(data.assign, [This.item]);
    if (demo && data.kind == "msg")      return Demo.message([This.item], data.assign,
      function() {$('#make_it_happen_form').html('Message sent!');});
    if (demo && data.kind == "mission")  return Demo.assign([This.item], data.assign);
    if (data.kind == "mission" && App.error_on_non_immediate([This.item])) return "redo";
    return Operation.exec(CEML.script_for(data.kind, data.assign), This.item, This.item, function(){
      $('#make_it_happen_form').html('Message sent!');
    });
  },

  group_interact_form_submitted: function(data, state, form) {
    var agents = Selection.agent_ids();

    if (!This.city) {
      alert('Sorry, interactions can only be started in a city.');
      return "redo";
    }
    if (!data.assign) {
      alert('Please provide an assignment!');
      return "redo";
    }

    if (demo && data.kind == "question") return Demo.question(data.assign, agents);
    if (demo && data.kind == "msg")      return Demo.message(agents, data.assign,
      function(){go('tool='); return Notifier.success("Message sent!");});
    if (demo && data.kind == "mission")  return Demo.assign(agents, data.assign, Selection.clear);
    if (data.kind == "mission" && App.error_on_non_immediate(agents)) return "redo";
    return Operation.exec(CEML.script_for(data.kind, data.assign), agents.join(' '), agents.join(' '), function(){
      go('tool=');
      Notifier.success('Message sent!');
      Selection.clear();
    });
  },

  invite_agents_form_submitted: function(data, state) {
    if (demo) {Notifier.success('Invitations sent!'); return go('tool=;mode=');}
    if (!App.stream_role_organizer()) return Notifier.error("You must be an organizer on this squad to invite agents.");
    var today = (new Date()).toDateString().slice(4).toLowerCase().replace(/ /g, '_');
    tags = 'invited_on_' + today;
    if (data.groups && data.groups.match(/organizers/)) tags += ' group:organizers';
    return $.post('/api/people/invite', {
      emails:     data.emails,
      groups:     data.groups   || null,
      reply_to:   data.reply_to,
      with_tags:  tags
    }, function(){
      go('tool=view_events;mode=interact');
    });
  },


  go_where: function() {
    var where = prompt("Find:");
    if (!where) return;
    var tabAccuracy = new Array(2,4,6,10,12,13,16,16,17);
    var geocoder = new GClientGeocoder();
    geocoder.getLocations(where, function(response) {
      if(response.Status.code==200){
        place = response.Placemark[0];
        accuracy = place.AddressDetails.Accuracy;
        map.setCenter(new GLatLng(place.Point.coordinates[1], place.Point.coordinates[0]), tabAccuracy[accuracy]);
        go('city=' + City.closest());
      }
    });
  },

  use_slow_agents: function() {
    return App.current_stream_systems().indexOf('e') >= 0;
  },

  stream_has_flag: function(flag) {
    if (!window.current_stream_systems) return false;
    return window.current_stream_flags.indexOf(flag) >= 0;
  },

  current_stream_systems: function() {
    if (window.demo) return 'm';
    return window.current_stream_systems || '';
  },

  stream_role_leader: function() { return demo || window.stream_role == 'leader'; },
  stream_role_organizer: function() { return demo || window.stream_role == 'leader' || window.stream_role == 'organizer'; },

  interact_mode: function() { App.setmode('interact'); },
  manage_mode: function() { App.setmode('manage'); },
  dispatch_mode: function() { App.setmode(''); }
};
