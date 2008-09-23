SuggestionIW = {
  
  latest: null,
  
  assign: function(a) {
    var atag = $(a).parents('.troot:first').attr('atag');
    var agents = City.agents_by_atag()[atag];
    Tour.start(agents, {atag: atag, mode:'suggest'});
  },
  
  announce: function(a) {
    Confirmer.show(function(){
      var x = SuggestionIW.latest;
      Ajax.fetch('/gc/invite', {
        stag: x.tag(),
        atags: x.atag,
        title: x.msg,
        landmark: x.landmark_tag
      }, function(result){
        EventDb.new_event(result);
        Viewer.open(SuggestionIW.latest);
      });
    });
  },
  
  suggestion_DOMObj: function(item) {
    SuggestionIW.latest = item;
    console.log(item.landmark_tag);
    return $.template('#lmark_sugg_template').attr('atag', item.atag).showhide({
      '#lmark_nearby'       : ItemDb.agents_by_city[Viewer.selected_city].length > 1
    }).fillout({
      '#lmark_nearby_count' : ItemDb.agents_by_city[Viewer.selected_city].length,
      '#atag_desc'          : atag_desc(item.atag).singularize().indef_article().toLowerCase(),
      '#lmark_title'        : item.msg,
      '#lmark_loc'          : LandmarkDb.find_by_tag(item.landmark_tag).title
    }).clicks({
      '#sugg_assign'        : this.assign,
      '#sugg_annc'          : this.announce
    })[0];
  }
  
};
