////
// This is the "Application" controller and selection model
//
Viewer = {
  loc: '',
  state: {},
  done_before: false,

  go: function(url) {
    console.log('go called w/ ' + url);
    Viewer.go_url(url);
    console.log('new url: ' + Viewer.loc);
    var x = Viewer.loc.split('/');
    // /city/atag/idea/item
    Viewer.changed = {};
    $.each(['city', 'atag', 'idea', 'item'], function(i, o){
      if (Viewer.done_before && Viewer.state[o] == x[i+1]) return;
      Viewer.state[o] = x[i+1];
      Viewer.changed[o] = true;
      if (Viewer[o + '_changed']) Viewer[o + '_changed']();
      if (x[i+1]) {
        $('body').addClass('has_' + o).removeClass('no_' + o);
      } else {
        $('body').addClass('no_' + o).removeClass('has_' + o);
      }
    });
    Viewer.done_before = true;
    $('#more_breadcrumbs').html(Viewer.more_breadcrumbs());
    if (Viewer.changed.city || Viewer.changed.atag) {
      Facebar.regen();
      $('.divcenter').center();
      $(document).blit();
    }
    if (Viewer.state.city && !Viewer.state.atag) Categories.update_chooser();
  },
  
  more_breadcrumbs: function() {
    var html = '';
    if (Viewer.state.atag) html += "&raquo; " + tag('a', {
      content: Category[Viewer.state.atag] || Viewer.state.atag,
      href: '/' + Viewer.state.city + '/' + Viewer.state.atag
    });
    return html;
  },
    
  open: function(thing) {
    var item_and_type = Viewer.resolve(thing);
    var item = item_and_type[0];
    var type = item_and_type[1];
    if (!type) return;
    var city_id = item.city_id || (type == 'city' && item);
    if (city_id && Number(city_id) != Number(Viewer.selected_city)) Viewer.select_city(city_id);
    MapMarkers.open(item, type);
    if (type == 'agent') Facebar.selected_agent(item);
  },
  
  city_changed: function() {
    var city_id = null;
    ItemDb.agents_by_city = ItemDb.index_all_items_by(['city_id']);
    if (Viewer.state.city) {
      city_id = Viewer.state.city.split('__')[1];
      Viewer.selected_city = city_id;
      LandmarkDb.ensure_landmarks(city_id);
      City.recalc_city();
    } else {
      Viewer.selected_city = city_id;
      CityChooser.update();
    }
    MapMarkers.select_city(city_id);
  },


  // functions

  city_summary: function() {
    Viewer.open(Viewer.selected_city);
    return false;
  },

  zoom_out: function(){ 
    Viewer.go('/');
    return false;
  },

  go_to_self: function() {
    Viewer.open(person_item);
    return false;
  },

  join_please: function() {
    $.facebox($('#join_fbox').html());
  },


  // url util

  go_url: function(url) {
    url = url.replace('CITY', Viewer.state.city);
    if (url.startsWith('/')) return Viewer.loc = url;
    if (url.startsWith('../')) {
      url = url.slice(3);
      Viewer.loc = Viewer.loc.replace(/\/\w+$/, '');
    }
    return Viewer.loc += '/' + url;
  },



  // old!!
  
  close: function(thing) {
    if (this.iw_item_type == 'agent') Facebar.selected_agent(null);
    MapMarkers.close(thing);
  },

  resolve: function(item) {
    if (item[0] == 'P') return [ItemDb.items[item], 'agent'];
    if (item[0] == 'L') {
      return [LandmarkDb.find_by_tag(item), 'lmark'];
      // if (readyto) {
      //   var i = Initiative.createLocal('gathering', readyto, {landmark_tag:item});
      //   return [i, 'gathering'];
      // }
    }
    if (item[0] == 'A') return [Initiatives.all[item], 'gathering'];
    if (Number(item)) return [item, 'city'];
    alert('unrecognized viewer object:  ' + item);
    console.log(item);
    return [false, false];
  }

};
