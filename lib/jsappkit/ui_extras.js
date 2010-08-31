LiveHTML = {};

UIExtras = {
  init: function() {
    $(document).keydown(function(e){
     	LiveHTML.shiftOn = e.shiftKey;
     	LiveHTML.metaOn = e.metaKey || e.altKey;
    }).keyup(function(e){
     	LiveHTML.shiftOn = e.shiftKey;
     	LiveHTML.metaOn = e.metaKey || e.altKey;
    }).mousedown(function(e){
     	LiveHTML.shiftOn = e.shiftKey;
     	LiveHTML.metaOn = e.metaKey || e.altKey;
    });
    $('[scrollr]').live('click', function(){
      var thing = $($(this).attr('scrollr'));
      var end = $(this).attr('scroll_end') ? $($(this).attr('scroll_end')) : null;
      if (end && (end.offset().left + 100) < thing.width()) return false;
      thing.animate({scrollLeft:thing[0].scrollLeft + 800}, 200);
      return false;
    });

    $('[scrolll]').live('click', function(){
      var thing = $($(this).attr('scrolll'));
      thing.animate({scrollLeft:thing[0].scrollLeft - 800}, 200);
      return false;
    });

    $('[mousewheel]').live('mousewheel', function(event){
      var scroll_delta = event.normalized_delta * -20;
      var thing = $($(this).attr('mousewheel'));
      if (scroll_delta > 0) {
        var end = $(this).attr('scroll_end') ? $($(this).attr('scroll_end')) : null;
        if (end && (end.offset().left + 100) < thing.width()) return false;
      }
      thing.animate({scrollLeft:thing[0].scrollLeft + scroll_delta}, 0);
      return false;
    });    
    
    // open dropdowns
    $(".button_dropdown button").live('click', function(){

      var theButton = $(this);
      var theDropdown = theButton.parent().children(".dropdown");
      var wasIdle = theButton.hasClass("idle");

      // close any open dropdowns
      $(".button_dropdown button.selected").each(function(){
        $(this).removeClass('selected').addClass('idle');
        $(this).parent().children('.dropdown').fadeOut('fast');
        $('body').removeClass('dropdownOpen');
      });

      if (wasIdle) {
        theButton.removeClass("idle").addClass("selected");
        theDropdown.show();
        $('body').addClass('dropdownOpen');
      };

    });
    
    // close dropdowns when links are clicked
    $(".button_dropdown .dropdown dl, .button_dropdown .dropdown li, .button_dropdown .dropdown a").live('click', function(){
      $(".button_dropdown button.selected").each(function(){
        $(this).removeClass('selected').addClass('idle');
        $(this).parent().children('.dropdown').fadeOut('fast');
      });
      return true;
    });
  }
  
};
