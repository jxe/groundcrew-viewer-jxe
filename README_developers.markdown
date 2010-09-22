Title:  Groundcrew Viewer Developer's Guide
Author: Joe Edelman; Citizen Logistics, Inc.


Extending and Working with the Groundcrew Viewer
================================================

Internal URLs
-------------

The viewer uses an internal URL scheme to keep track of state, to make buttons work, to simplify javascript transitions, etc.  So, from any viewer JavaScript, you can write:

    go("mode=Dispatch;tool=assign_agents;item=p1");

to select the given tool and the given item on the map.  This also works in HTML links, which are automagically rewired to support this scheme:

    <a href="#mode=Dispatch;tool=assign_agents;item=p1">dispatch me!</a>

and it will work when loading the viewer initially (useful for debugging or linking from other sites):

    http://groundcrew.us/viewer#mode=Dispatch;tool=assign_agents;item=p1

### Special Parameters

The following parameters have special app-wide meanings when used in these internal URLs:  `item`, `mode`, `tool`, and `squad`.

#### Item

The `item` parameter handles both city selection and selection and opening/closing of info windows on the map.  It must always be set to an _object tag_, which is a string of the form "Person\_\_1" or more generally "[Object Type]\_\_[id]".  Valid object types are `Person`, `City`, `Landmark`, `Resource`, `Wish`, and `Op`.

In many cases you need to be in the right mode to select a certain kind of object.  For instance, selecting a Op(eration) in "make a wish" mode will not work.

To deselect any item on the map, set item to the city you're in:

    go('item=' + This.city);

and to go to the worldwide view, you can set item to nothing:

    go('item=');

### Modes and Tools

The mode refers to which tool tab is selected.  Conceptually, a given tool may be available in more than one mode, so it is generally a good idea to specify a mode in a link whenever you specify a tool.

The set of modes and tools is visible and editable in app/chrome/console.js.

Tools
-----

The selection of which mapwindow to show when the user clicks a thing on the map, and the display of HUDs when a tool is active, are both managed purely by css classes and ids.

### Displaying HUDs when a tool is selected

If you have a HUD that you want to show up when a tool (say "assign_agents") is active, just add these classes to the top level div:

	<div class="hud assign_agents_tool hidden_unless_active">
	... your hud here
	</div>

...and put it in the "app/tools" dir.  It's that simple!

### Displaying a special info window when the user clicks a certain kind of object using a certain tool

If you have an info window that you want to display when the user clicks a certain kind of object using a certain tool, put a div with these classes and this id in "app/templates":

	<div id="[object_type]_for_[tool_name]" class="mapwindow template">...</div>

for instance

	<div id="agent_for_assign_agents_tool" class="mapwindow template">...</div>

it's that simple!
