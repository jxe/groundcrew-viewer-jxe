// =======
// = etc =
// =======

$.fn.position = function(position, where, anchor){
  if (position == 'vtop'){
    this.css('top', anchor.offset().top - $(where).offset().top);
  }
  if (position == 'subm'){
    this.css('top', anchor.offset().top - $(where).offset().top + 25);
    this.css('left', anchor.offset().left - $(where).offset().left + 20);
  }
  if (position == 'spinner'){
    this.css('top', anchor.offset().top - $(where).offset().top - 20);
    this.css('right',  $(where).width() - (anchor.offset().left - $(where).offset().left));
  };
};

