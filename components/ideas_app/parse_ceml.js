// meet for "some quiet time" as Idea_111
//   for 10m with tags "quiet observation connection peace"
// 
// assignment Idea_111 {
//   to signal you're ready:  sit, crossing your hands on your left leg
//   for 10 minutes: sit in silence, hearing what's around you
//   after: scowl or frown and get up
//   and: one person will leave at a time
// }

// rendezvous for "some quiet time" using clothing
//   as Idea_111 with tags "quiet observation connection peace"
// 
// assignment Idea_111 {
//   for 10 minutes: sit in silence, hearing what's around you
//   after: scowl or frown and get up
//   and: one person will leave at a time
// }

function _idea(tag, rank, type, title, atags, json_etc){
  var parts = tag.split('__');
  Resource.add_or_update($.extend({
    id: parts[1],
    item_tag: tag,
    rank: rank,
    type: type,
    title: title,
    atags: atags
  }, json_etc));
}


function parse_ceml(ceml){
  var elide = function(_, string){ return string.elide(); };
  
  errors = 
  ceml.
  replace(/"(.*?)"/g, elide).          // elide strings
  replace(/\{\s*.*?\s*\}/g, elide).    // elide braces
  replace(/\n\s+/g, '').               // indented lines collapse
  replace(/^\s*\n/g, '').               // blank lines removed
  replace(/\bwith (\w+)\b/g, 'with_$1').
  replace(/\b(\w+) (about|by|for)\b/g, '$1_$2').
  replace(/^meet for (.*?)\n/g, function(_, args){
    var words = args.split(' ');
    var title = args.shift().unelide;
    var args = args.to_pairwise_hash();
    var rank = Number(args.with_rank || 20);
    _idea(args.as, rank, 'meeting', title, args.with_tags.unelide(), args);
    return '';
  }).
  replace(/^assignment (\w+) (.*?)\n/g, function(_, label, content){
    label.resource().content = content.unelide().split(/\n\s*/).map(function(line){
      return line.split(':');
    });
    return '';
  });
  
  if (errors.length) alert( "ceml errors: " + errors);
}
