<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html>
<head>
  <link href="viewer.css" media="screen" rel="stylesheet" type="text/css"/>
  <script src="../vendor/jquery/jquery.min.js" type="text/javascript"></script>
  <script src="viewer.js" type="text/javascript"></script>
	<script src="data/vstart.js" type="text/javascript"></script>
	<style>
	.mapwindow {
	  background: #fff;
	  position: relative;
	}
	#iw_menu_place {
	  background: #fff;
	  position: relative;
	}
	</style>
</head>
<body>
  Javascript loaded.

<div id="idea_bank" style="display:none">
m4_syscmd(`cat app/ideas.ceml')
</div>

<div id="offscreen" style="display:none"></div>
<div class="mapwindow">
  <div id="foo" fill="ideas_for_agent"></div>
  <div id="iw_menu_place"></div>
</div>

<script>
  CEML.parse($('#idea_bank').html());
  Viewer.set_state('/organize/squad/City__220/Person__1');
  LiveHTML.init();
  $('body').app_paint();
</script>
</body>
</html>
