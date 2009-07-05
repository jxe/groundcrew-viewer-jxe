$(document).ready(function() {

  $(".button_dropdown").children("button").click(function() {
    var theButton = $(this);
    var theDropdown = theButton.parent().children(".dropdown");
    
    if (theButton.hasClass("idle")) {
      closeOtherDropdowns(theDropdown);
      theButton.removeClass("idle").addClass("selected");
      theDropdown.show();
    } else {
      theButton.removeClass("selected").addClass("idle");
      theDropdown.fadeOut("fast");
    }
  });
  
  // Only one dropdown may be displayed at a time
  function closeOtherDropdowns(selectedDropdown) {
    $.each($(".dropdown"), function() {
      if ($(this) != selectedDropdown && 
            $(this).css("display") != "hidden") {
        $(this).parent().children("button")
          .removeClass("selected")
          .addClass("idle");
        $(this).fadeOut("fast");
      }
    });
  }
});
