<!DOCTYPE html>
<html>
<head>
	<title>Groundcrew Viewer</title>
	<link href="viewer.css" media="screen" rel="stylesheet" type="text/css"/>
</head>

<body id="viewer" class="loading notcollapsed">
  <h1 class="magic"><span fill="current_stream_name">Oil Spill Volunteering</span></h1>
  m4_include(`app/chrome/sidebar.html')

  m4_include(`app/chrome/header.html')
  m4_include(`app/chrome/branding.html')

  <!-- the main block is the main, chrome-y part of the viewer -->
  <!-- it consists of the facebar, the map, and the console -->
  <div id="tool">
    m4_include(`app/chrome/facebar.html')
    <div id="map">
      <div id="gmap"></div>
      <!--> we put some stuff on top of the gmap <-->
      m4_include(`app/chrome/selection_tools.html')
      m4_include(`app/chrome/mapnav.html')
      m4_include(`app/chrome/help_prompt.html')
    </div>
    m4_include(`app/chrome/console.html')
  </div>

  <!-- some offscreen stuff like templates -->
  m4_syscmd(`cat app/tools/*.html')
  <div id="offscreen" style="display:none">m4_syscmd(`cat app/maplayers/*.html')</div>
  <div id="screen"></div>

  <script src="http://maps.google.com/maps?file=api&amp;v=2.x&amp;key=ABQIAAAAGqp2ukVwjWFfmC-XmCCZFRRGsPIMf82DrFSwJZKzmHDVn9CoiRSfPwbMs9LeX9Qw4ba2CuYyrEQBZw"></script>
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>
  <script src="viewer.js"></script>
  <script> App.initialize(); </script>
</body>
</html>
