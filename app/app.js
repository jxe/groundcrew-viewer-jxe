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

  },

  go_login: function() {
    $.cookie('back', window.location.href);
    window.location = '../login';
  },

  request_agent_update_location: function() {
    // TODO: check comm3 and don't allow if we bugged them recently
    Operation.exec("askfor location: Our location for you looks old.  Where are you?", This.item, This.item, function(){
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
        alert('no good template for ' + thing);
        GM.closeInfoWindow();
      }
    }
  },

  map_clicked: function() {
    return;
  },

  did_add_events: function(state) {
    App.refresh_mapwindow();
  },

  live_event_info: function (state) {
    $.each(This._item.children, function(){ Event.improve(this); });
    return Actions.event_t.tt(This._item.children);
  },


  // ======================
  // = App initialization =
  // ======================

  init: function() {
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

    // set up app state
    // CEML.parse($('#idea_bank').html());
  },

  switch_to_question: function(value, ch) {
    if (ch == '?') {
      $('form input[value=question]').attr('checked', 'checked');
    }
  },

  go_to_self: function() {
    go('@' + This.user.tag);
  },

  help_form_submitted: function(data) {
    $.post('/api/bugreport', {issue: data.issue}, function(){
      alert('Submitted.  Thanks!');
      go('tool=');
    });
  },

  radial_invite_form_submitted: function(data) {
    var agents = data.agents;
    if (!data.assignment) {
      alert('Please provide an assignment!');
      return "redo";
    }
    if (!data.agents) {
      alert('There are no agents to invite!');
      return "redo";
    }
    if (demo) return Demo.invite(This.item, data.title, data.assignment);
    Operation.exec(CEML.script_for_invite(data.title, data.assignment), agents, This.item, function(){
      $('#radial_invite_form').html('message sent!');
    });
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
      data.lat = This.click_lat;
      data.lng = This.click_lng;
    }
    
    data.kind = 'l';
    data.city = This.city_id;
    data.latch = "unlatched";
    data['float'] = "onmap";
    $.post('/api/items/'+lm_id, data, function(landmark_js){
      var lm = eval(landmark_js);
      Map.add_to_layer('landmarks', MapLandmarks.marker_for_lm(lm));
      go('@' + "Landmark__"+lm_id);
      App.refresh_mapwindow();
      // setTimeout(function(){}, 0);
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
      alert('Please provide a question to ask!');
      return "redo";
    }
    if (demo) return Demo.question(data.question, agent_ids);
    agent_ids = agent_ids.join(' ').agent_ids.replace(/Person__/g, '').split(' ');
    Operation.exec(CEML.script_for('question', data.question), agents, agents, function(){
      $('#ask_question_form').html('Message sent!');
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
    if (demo && data.kind == "msg")      return alert("sending a msg");
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
    if (demo && data.kind == "msg")      return alert("sending a msg to " + agents);
    if (demo && data.kind == "mission")  return Demo.assign(agents, data.assign, Selection.clear);
    Operation.exec(CEML.script_for(data.kind, data.assign), agents.join(' '), agents.join(' '), function(){
      $('#group_interact_form').html('Message sent!');
      Selection.clear();
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
