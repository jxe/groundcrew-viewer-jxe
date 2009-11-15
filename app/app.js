////
// This is the "Application" controller
//
Viewer = App = {
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
    go('@' + This.city);
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
      This.city_id = This.city && This.city.resource_id();
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
      Frame.populate_flexbar_agents(This.agents);
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

  request_agent_update_location: function() {
    // TODO: check comm3 and don't allow if we bugged them recently
    Operation.exec(CEML.script_for("msg", "Our location for you looks old or imprecise. " +
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
      var thing = This.item.split('__')[0].toLowerCase();
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
    App.refresh_mapwindow();
    if (This.tool == 'view_events') $('.view_events_tool').app_paint();
  },

  live_event_info: function (state) {
    $.each(This._item.children, function(){ Event.improve(this); });
    return Actions.event_t.tt(This._item.children);
  },

  // TODO: get stack trace (see http://eriwen.com/javascript/js-stack-trace/)
  // and include some state like This.url, form submitted, etc.
  report_error: function(msg, e, place) {
    console.log(msg);
    console.log(e);
    console.log(place);
    var report = '';
    report += msg;
    report += " at " + place;
    if (e) report += "\nException: " + e;
    if (e && e.stack) report += "\nStack trace: " + e.stack;

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
    // error handling
    $(window).error(App.handle_error);

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
      if (active_cities.length == 1) start_city = "City__" + active_cities[0];
      if (active_cities.length == 0) {
        if (most_recent_item) {
          start_city = "City__" + most_recent_item.city_id;
        }
      }
      Ajax.go_on_load = 'item=' + start_city;
    }

    Ajax.maybe_trigger_load();

    if (demo) Demo.init_manual();

    // set up app state
    // CEML.parse($('#idea_bank').html());
  },

  switch_to_question: function(value, ch) {
    if (ch == '?') {
      $('form input[value=question]').attr('checked', 'checked');
    }
  },

  go_to_self: function() {
    go('@' + This.user.vtag);
  },

  help_form_submitted: function(data) {
    $.post('/api/bugreport', {issue: data.issue}, function(){
      Notifier.success('Thanks!', 'Submitted');
      go('tool=');
    });
  },

  radial_invite_form_submitted: function(data) {
    var agents = data.agents;
    if (!data.title) {
      alert('Please provide an assignment!');
      return "redo";
    }
    if (!data.agents) {
      alert('There are no agents to invite!');
      return "redo";
    }
    if (demo) return Demo.invite(agents.split(' '), This.item, data.title, data.assignment);
    Operation.exec(CEML.script_for_invite(data.title, data.assignment), agents, This.item, function(){
      $('#radial_invite_form').html('message sent!');
    });
  },

  decorate_map: function() {
    if (Map.layer_visible['landmarks'])
      MapLandmarks.fetch_landmarks_in_bounds(GM.getBounds());
  },

  send_landmark_form_submitted: function(data) {
    var lm_id;
    if (This.item && This.item.startsWith('Landmark__')) {
      lm_id = This.item.replace('Landmark__', '');
      data.lat = This._item.lat;
      data.lng = This._item.lng;
      data.thumb_url = This._item.thumb_url;
    } else {
      lm_id = 'l' + authority + '_' + Date.unix();
      data.lat = This.click_latlng.lat();
      data.lng = This.click_latlng.lng();
    }

    data.kind = 'l';
    data.city = This.city_id;
    data.latch = "unlatched";
    data['float'] = "onmap";

    if (demo) {
      lm = item(data['city'], "Landmark__" + data['lat'] + data['lng'], data['name'], null,
        data['lat'], data['lng'], data['with_tags'], "unlatched", null, null, {});
      Map.site_add('landmarks', lm.id, MapLandmarks.marker_for_lm(lm));
      return go('@'+lm.id);
    }

    $.post('/api/items/'+lm_id, data, function(landmark_js){
      var lm = eval(landmark_js);
      Map.site_add('landmarks', lm.id, MapLandmarks.marker_for_lm(lm));
      go('@'+lm.id);
      // App.refresh_mapwindow();
    }, 'text');
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
    agent_ids = agent_ids.join(' ').replace(/Person__/g, '');
    Operation.exec(CEML.script_for('question', data.question), agent_ids, agent_ids);
  },

  blast_message_form_submitted: function(data) {
    if (Agents.here().length < 1) {
      alert('There are no agents to message!');
      return "redo";
    }
    if (!data.message || data.message.length < 5) {
      alert('Please provide a message that\'s at least 5 characters!');
      return "redo";
    }
    params = { msg: data.message, city: This.city_id };
    if (demo) return Notifier.success("Blasting message to all agents!");

    if (window.remaining <= 0) {
      $.post('/api/bugreport', {issue: window.current_stream + ' has run out of text messages!'});
      alert('You have reached your limit on text messages!  ' +
        'Please contact Groundcrew support to purchase more.');
      return false;
    }

    $.post('/api/blast_message', params, function(data){
      go('tool=');
      Notifier.success("Blasting message to " + data + " agents!");
    });
  },

  tag_group_form_submitted: function(data) {
    var agents = $keys(Selection.current);
    if (!agents || agents.length == 0) {alert('Please select some agents to tag.'); return "redo";}
    if (!data.tags) { alert('Please provide some tags!'); return "redo"; }

    var params = { agent_ids: agents.join(' ').replace(/Person__/g, '') };
    if (data.tags.startsWith('stream:')) {
      params['with_stream'] = data.tags.replace(/^stream:/, '');
    } else {
      params['with_tag'] = data.tags;
    }
    $.post('/api/agents/update_all', params, function(){
      go('tool=');
    });
  },

  setmode: function(mode) {
    if (This.mode != mode) return go('mode=' + mode);
    else {
      if (mode == 'dispatch') return;
      $('#modetray').toggle();
      Frame.resize();
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
    Operation.exec(CEML.script_for(data.kind, data.assign), This.item, This.item, function(){
      $('#make_it_happen_form').html('Message sent!');
    });
  },

  group_interact_form_submitted: function(data, state, form) {
    var agents = $keys(Selection.current);

    if (!data.assign) {
      alert('Please provide an assignment!');
      return "redo";
    }

    if (demo && data.kind == "question") return Demo.question(data.assign, agents);
    if (demo && data.kind == "msg")      return Demo.message(agents, data.assign,
      function(){go('tool='); return Notifier.success("Message sent!");});
    if (demo && data.kind == "mission")  return Demo.assign(agents, data.assign, Selection.clear);
    Operation.exec(CEML.script_for(data.kind, data.assign), agents.join(' '), agents.join(' '), function(){
      go('tool=');
      Notifier.success('Message sent!');
      Selection.clear();
    });
  },

  invite_agents_form_submitted: function(data, state) {
    var today = (new Date()).toDateString().slice(4).toLowerCase().replace(/ /g, '_');
    $.post('/api/people/invite', {
      emails: data.emails,
      groups: 'organizers',
      with_tags: 'group:organizers invited_on_' + today
    }, function(){
      go('tool=view_events;mode=assess');
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


  assess_mode: function() { App.setmode('assess'); },
  manage_mode: function() { App.setmode('manage'); },
  dispatch_mode: function() { App.setmode(''); }
};
