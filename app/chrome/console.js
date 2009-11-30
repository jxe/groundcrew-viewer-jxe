Console = {
  modes: [],
  tools: {}
};

// add_action_idea//wand30  edit_activities//lightbulb_icon29  identify_resource//gift23  upload_landmarks//landmark21
// 'dispatch     assign_agents            start_something           join_something'

$.each([
  {mode: 'assess', tools: [
    {tool: 'add_mission_landmark', name: 'start mission', local_only: true},
    {tool: 'show_answers',  img: 'scroll'},
    {tool: 'ask_a_question', local_only: true},
    {tool: 'blast_message', flag: 'blast_message'},
    {tool: 'view_events', img: 'scroll'}
  ]},
  {mode: 'manage', tools: [
    {tool: 'add_landmark', img: 'landmark21', local_only: true},
    {tool: 'approve_deputies'},
    {tool: 'chat', img: 'chat_icon18'},
    {tool: 'squad_settings'},
    {tool: 'invite_agents'},
    {tool: 'current_invitations'},
    {tool: 'tag_agents'}
  ]}
], function(){
  var mode = this['mode'];
  Console.modes.push(mode);
  Console.tools[mode] = this['tools'];
});


LiveHTML.widgets.push({

  tool_buttons: function() {
    if (!This.mode || !Console.tools[This.mode]) return '';
    return Console.tools[This.mode].map(function(tool){
      if (tool['flag']) {
        if (!window.current_stream_flags || current_stream_flags.indexOf(tool['flag']) == -1) {
          return '';
        }
      }
      var tval = tool['tool'];
      var tname = tool['name'] ? tool['name'] : tval.replace(/_/g, ' ');
      var img = tool['img'] && '<img src="i/icons/'+tool['img']+'.png"/>' || '';
      var t_if = tool['local_only'] && ' if="!zoomed_out" ' || '';
      var tclass = tool['local_only'] && ' local_only ' || '';
      return '<a class="'+tval+'_tool '+ tclass + '" ' + t_if +
        ' href="#tool='+tval+'">'+img+tname+'</a>';
    }).join('');
  }

});



// HELP


// <div id="coordinate_mode_buttons">
//   <img reveal="places_palette" src="i/icons/landmark21.png" title="see local places"/>
//   <img reveal="recent_content" src="i/icons/scroll.png" title="view recent events"/>
// </div>
// <div id="listen_mode_buttons">
//   <img reveal="share_palette" src="i/icons/gift23.png" title="free stuff"/>
//   <img reveal="chat_palette" src="i/icons/chat_icon18.png" title="chat with other organizers"/>
//   <img reveal="wish_palette" src="i/icons/wand30.png" title="make or view wishes"/>
// </div>

