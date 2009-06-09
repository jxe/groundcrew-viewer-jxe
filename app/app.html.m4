<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html>
<head>
	<title>Groundcrew Viewer - Tell us what to do</title>
	<link href="viewer.css" media="screen" rel="stylesheet" type="text/css"/>
  
  <script src="http://maps.google.com/maps?file=api&amp;v=2.x&amp;key=ABQIAAAAGqp2ukVwjWFfmC-XmCCZFRRGsPIMf82DrFSwJZKzmHDVn9CoiRSfPwbMs9LeX9Qw4ba2CuYyrEQBZw&amp;hl=" type="text/javascript"></script> 
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.1/jquery.min.js" type="text/javascript"></script>
  <script src="viewer.js" type="text/javascript"></script>
	<!--[if lte IE 6]>
	<script type="text/javascript" src="/javascripts/supersleight-min.js"></script>
	<![endif]-->
  <script src="data/vstart.js" type="text/javascript"></script>
  <style type='text/css'>@import url('http://s3.amazonaws.com/getsatisfaction.com/feedback/feedback.css');</style>
  <script src='http://s3.amazonaws.com/getsatisfaction.com/feedback/feedback.js' type='text/javascript'></script>
</head>
<body id="viewer" class="loading">

<div id="header">
  <div id="header_menubar">
		<img id="load_spinner" src="i/spinner.gif"/>
		<a class="m_item" reveal="help">HELP</a>
		<a class="m_item" target="_" href="http://groups.google.com/group/groundcrew-users">discuss</a>
		<a class="m_item loo" href="/login">log in</a>
		<a class="m_item lio" href="/settings" id="settings">settings</a>
		<a class="m_item lio" href="/logout">sign out</a>
	</div>
	<span id="logo" class="std_click">
	  <img id="logo_gc" src="i/gc.png"/>
	  <div style="font-size: 28px">
	    <img href="#//welcome/leader" src="i/icons/globe.png"/>
	    Demo Squad <img src="i/white_toggler.png"/> 
    </div>
	</span>
</div>
<div id="youbox" class="lio magic divcenter">
  <b fill="self_name" onclick="Viewer.open(This.user.tag);"></b> &mdash;
  you've caused
  <b fill="self_posx_pts">0</b>
  <a reveal="about_posx">positive experiences</a> so far
</div>
<div id="demo_mode">
  DEMO MODE:  assignments / responses are simulated
</div>
<div id="unsupported">
  Internet Explorer has not been tested.  Try <a href="http://getfirefox.com">Firefox</a>.
</div>
<div id="screen">
  <div id="map_div"></div>
  <div id="group_actions" class="divcenter" style="display:none">
    &uarr; 
    <a href="#//ops/:city">DEPLOY SELECTED AGENTS</a>
    (<a href="##clear_selection">x</a>) 
    &uarr;
  </div>
  <div id="flexbar">
    <div id="agents">
      <div id="neglected_agents">
        <div id="neglected_agent_thumbs"></div>
        <h2><em>neglected</em></h2>
      </div>
      <div id="ready_agents">
        <div id="ready_agent_thumbs"></div>
        <h2><em>ready</em></h2>
      </div>
      <div id="assigned_agents">
        <div id="assigned_agent_thumbs"></div>
        <h2><em>assigned</em></h2>
      </div>
      <div id="available_agents">
        <div id="available_agent_thumbs"></div>
        <h2><em>available</em></h2>
      </div>
      <div id="inaccessible_agents">
        <div id="inaccessible_agent_thumbs"></div>
        <h2><em>inaccessible</em></h2>
      </div>
    </div>
  </div>
</div>

<div class="magic">
  <img class="lside" style="bottom: 15px; left: 5px" src="i/arrows/lw.png"  scrolll="#flexbar"/>
  <img class="rside" style="bottom: 15px; right: 5px" src="i/arrows/rw.png" scrollr="#flexbar"/>
  
  <img class="rside" style="top:80px; right:0px" reveal="cities_palette" src="i/icons/city27.png" title="switch cities"/>
  <img class="rside" style="top:125px; right:6px" reveal="people_palette" src="i/icons/people_icon35.png" title="see available agents"/>
  <img class="rside" style="top:170px; right:4px" reveal="places_palette" src="i/icons/landmark21.png" title="see local places"/>
  <!-- <img class="rside" style="top:210px; right:5px" reveal="ideas_palette" src="i/icons/lightbulb_icon29.png" title="start something"/> -->
  <!-- <img class="rside" style="top:140px; right:0px" reveal="share_palette" src="i/icons/gift23.png" title="free stuff"/> -->
  <!-- <img class="rside" style="top:180px; right: -5px" reveal="wish_palette" src="i/icons/wand30.png" title="make or view wishes"/> -->
  <img class="rside" style="bottom:100px" reveal="chat_palette" src="i/icons/chat_icon18.png" title="chat with other organizers"/>
  <!-- <img class="lside" style="top:90px; left: 2px" reveal="recent_content" src="i/icons/scroll.png" title="view recent events"/> -->
</div>


<div id="offscreen" style="display:none">
<script>
if($.browser.msie) $('#unsupported').show();
$(function(){ViewerUI.init()});
</script>

m4_syscmd(`cat app/chrome/*.html app/modes/*/*.html')

<div id="idea_bank" class="hidden">
m4_syscmd(`cat app/ideas.ceml')
</div>
</div>
<script type="text/javascript" charset="utf-8">
  var tab_options = {}
  tab_options.placement = "left";  // left, right, bottom, hidden
  tab_options.color = "#222"; // hex (#FF0000) or color (red)
  GSFN.feedback('http://getsatisfaction.com/groundcrew/feedback/topics/new?display=overlay&style=idea', tab_options);
</script>
</body>
</html>
