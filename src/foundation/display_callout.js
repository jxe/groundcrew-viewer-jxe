
// ==========
// = popups =
// ==========

$.popups = {};
$.popups.current_open = null;
$.popups.close = function(){
  $.popups.current_open && $.popups.current_open.hide();
};
$.fn.popup_open = function(){
  $.popups.close();
  this.show().find(':text:first').focus();
  $.popups.current_open = this;
  return this;
};
$.fn.attach_popup = function(outer){
  if (outer.toUpperCase || outer.length == 0) alert('attach popup called without a real outer');
  var link = this;
  // we can't let click events bubble up past popups, it causes problems with the map
  var falsie = function(e){ e.stopPropagation(); };
  outer.click(falsie).mousedown(falsie).mouseup(falsie).dblclick(falsie);
  outer.keypress(function(e){
    if (e.which == 27 || e.keyCode == 27) { $.popups.close(); return false; }
  });
  link.click(function(){
    var inner = outer.children('div:first');
    if (inner.is(':visible')) inner.hide();
    else inner.popup_open();
    return false;
  });
};
$.fn.popups = function(){
  return this.find('div.popup').each(function(){
    $(this).prev('div,a').attach_popup($(this));
  }).end();
};










// ==============
// = the future =
// ==============

$.fn.display_callout = function(attached_to, direction, offset){
  // create the containing obj if it's not added to the DOM already
  // set the title
  // set the nose
  
};




// =========
// = pmenu =
// =========



(function(){
          
  function run_x_times_at_interval(x, t, f, g){
  	var i = 0;
  	var iid;
    f();
  	iid = setInterval(function(){
  		f();
  		if (i++ < x) return;
			clearInterval(iid);
			if (g) g();
  	}, t);
  }
    
  var link_relative_bottom_y = function(container, link){
    return link.offset().top + link.height() - container.offset().top;
  };
  
  var link_center_rightness = function(container, link){
    return container.offset().left + container.width() - (link.offset().left + link.width() / 2);
  };

  var link_center_leftness = function(container, link){
    return link.offset().left - container.offset().left + (link.width() / 2);
  };
  
  var position = function(auto, container, link, div){
    if (auto == 'bc'){
      var link_bottom_rel_y = link_relative_bottom_y(container, link);
      var link_ctr = link_center_leftness(container, link);
      var nose_lead = 40;
      div.css({
        left: link_ctr - nose_lead,
        top: link_bottom_rel_y + 7,
        position: 'absolute'
      });
      div.find('.nose').css({
        left: nose_lead - 7,
        top: -14,
        position: 'absolute',
        zIndex: 210
      });
    }
    if (auto == 'bcl'){
      var link_bottom_rel_y = link_relative_bottom_y(container, link);
      var link_ctr_r = link_center_rightness(container, link);
      var nose_lead = 40;
      div.css({
        right: link_ctr_r - nose_lead,
        top: link_bottom_rel_y + 7,
        position: 'absolute'
      });
      div.find('.nose').css({
        right: nose_lead + 7,
        top: -14,
        position: 'absolute',
        zIndex: 210
      });
    }
  };
  
  var document_clicker_installed = false;
  var install_document_clicker = function(){
    if (!document_clicker_installed) { 
      $(document).click(function(){
        $('.insert_popper_here').empty();
        $('.popped').removeClass('popped');
      });
      document_clicker_installed = true;
    }
  };  
  
  $.fn.open_popper = function(){
    var self = this;
    var widget = self.parents('.widget:first');
    var where = widget.find('.insert_popper_here:first');
    var was_empty = where.is(':empty');

    if (!widget.length) alert('widget missing');
    if (!where.length) alert('where missing');

    where.empty();
    widget.find('.popped').removeClass('popped');

    if (was_empty) {
      
      widget.unbind('click').click(function(e){ e.stopPropagation(); });
      
      var obj = eval(widget.attr('widget')) || {};
      var plink = self.attr('popper');
      var pos = null;
      if (plink.indexOf('/')) {
        var parts = plink.split('/');
        plink = parts[0];
        pos = parts[1];
      }
      var clone = $(plink).clone();
      if (!clone.length) alert('unable to clone ' + plink);

      // configure it
      var x, click, blit;
      if (x = clone.attr('blitter')) {
        eval(x)(clone, self);
      } else {
        clone.blit();
      }
      if (clone.hasClass('menu')){
        if (x = clone.attr('clickhandler')) click = eval(x).click;
        if (!click && obj && obj.click) click = obj.click;
        if (!click) click = Clicker.click;
        clone.wire_menu_items(click, self).show();
      }
      if (pos) position(pos, widget, self, clone);

      // actually install it
      install_document_clicker();
      self.addClass('popped');
      where.append(clone);
      clone.find('form input[type=text]:first').focus();
    }
  };
  
  $.fn.wiggle_and_close = function(){
    var self = this;
    run_x_times_at_interval(3, 75, function(){
    	self.toggleClass('trigger');
    }, function(){
    	self.removeClass('trigger');
  	  self.parent().hide();
  	  self.parents('.insert_popper_here:first').empty();
    });
    return self;
  };
  
  $.fn.wire_menu_items = function(f, menu){
    this.find('a').unbind('click').click(function(e){
    	var self = $(this);
    	self.wiggle_and_close();
    	$('.popped').removeClass('popped');
      if (f) f(self, menu);
    	return false;
    });
    this.find('a.subm').unbind('hover').hover(function(){ open_in_200(this, f); }, close_in_200);
    return this;
  };
  
  $.fn.wire_popper_links = function(container){
    this.unbind('click').click(function(){ $(this).open_popper(); return false; });
    return this;
  };


  var submenu = null;
  var open_cancelled = false;
  var close_cancelled = false;
  
  function open_in_200(element, f){
    var link = $(element);
    if (submenu) return keep_open(link);
    submenu = $(link.attr('href'));
    open_cancelled = false;
    close_cancelled = true;
  	setTimeout(function(){
  	  if (!submenu || open_cancelled) return;
      var pos = link.offset();
  		submenu.css('left', pos.left + link.width() + 10).css('top', pos.top - 1).show().unbind('hover').hover(keep_open, close_in_200);
  		submenu.wire_menu_items(function(x){
    	  link.parents('.insert_popper_here:first').empty();
  		  f(x, link);
  		});
  	}, 200);
  }
  
  function close_in_200(){
    open_cancelled = true;
    close_cancelled = false;
  	setTimeout(function(){
  	  if (!submenu || close_cancelled) return;
  	  submenu.hide();
  	  submenu = false;
  	}, 200);
  }
  
  function keep_open(){
    open_cancelled = false;
    close_cancelled = true;
	}
  
})();

// var active_menus = [];
// var active_links = [];
// var latest = null;

// $('.menu a.subm').hover(function(e){
//  var self = latest = this;
//  active_menus.push($sub[0]);
//  active_links.push(self);
//  $(active_links).addClass('pick');
//  setTimeout(function(){
//    if (self != latest) return;
//    var pos = $this.offset();
//    $sub.css('left', pos.left + $(self).width() + 10).css('top', pos.top - 1).show();
//  }, 200);
//  return true;
// }, function(){
//  return true;
// });
