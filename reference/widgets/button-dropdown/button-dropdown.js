$(document).ready(function() {

  $(".button_dropdown").children("button").click(function() {
    var theButton = $(this);
    var theDropdown = theButton.parent().children(".dropdown");
    
    if (theButton.hasClass("idle")) {
      var pos = theButton.offset();  
      var width = theButton.outerWidth();
      var height = theButton.outerHeight();
      var dropdownHeight = theDropdown.outerHeight();
      // How far does the dropdown verticaly overlap the button
      var dropdownVertOffset = 5;
      // How far does the dropdown horizontaly overlap the button
      var dropdownHorzOffset = 10;
      
      // Determine positioning for north or south dropdowns
      if (theDropdown.hasClass("south")) {
        var posTop = (pos.top+height-dropdownVertOffset)+"px";
      } else if (theDropdown.hasClass("north")) {
        var posTop = (pos.top-dropdownHeight+dropdownVertOffset)+"px";
      }
      var posLeft = (pos.left-dropdownHorzOffset)+"px";
      
      // Ensure all other dropdowns are closed
      closeOtherDropdowns(theDropdown);
      
      // Switch the button, position the dropdown, then show it
      theButton.removeClass("idle").addClass("selected");
      // theDropdown.css({"left": posLeft, "top":posTop});
      theDropdown.show();

    } else {
      // Switch the button, then hide the dropdown
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
        $(this).fadeOut("fast")
      }
    });
  }
});