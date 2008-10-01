WishletsIW = {

  submit: function() {
    var form = $(this);
    var verb = form.find('select').val();
    var msg = verb + " " + form.find('input[type=text]').val();
    Wishlets.by_city[Viewer.selected_city].push({msg:msg});
    Viewer.open("W" + Viewer.selected_city);
    return false;
  },
  
  domObj: function() {
    var t = $.template('#wishticker_iw_template').blit();
    WishletsIW.top_wishlets().appendTo(t.find('.wishes'));
    return t.find('select').change(function(){
      $('.wisher .curverb').html($(this).val());
    })
    .end()
    .find('form')
      .submit(WishletsIW.submit)
    .end()
    [0];    
  },
  
  top_wishlets: function() {
    var wishlets = Wishlets.by_city[Viewer.selected_city].sort_by(function(x){ return -(x.reviewed_at || x.created_at); }).slice(0, 10);
    return $($.map(wishlets, function(x){
      return $.template('#wish_t').fillout({
        '.agent_ct': '15',
        '.want': x.msg,
        '.points': '45'
      });
    }));
  }
  
};
