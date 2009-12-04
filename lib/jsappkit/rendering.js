function link(text, url){
  return tag('a', {content: text, href:url});
}

function tag(name, attrs) {
  var content = '';
  if (typeof attrs == "string" && attrs.length) attrs = {content: attrs};
  if (name.contains('.')) {
    var words = name.split('.');
    name = words[0];
    attrs['class'] = words.slice(1).join(' ');
  }
  if (name == 'a' && !attrs.href) attrs.href = '#';
  if (attrs.content) {
    content = attrs.content;
    delete attrs.content;
  }
  if (attrs.cls) {
    attrs['class'] = attrs.cls;
    delete attrs.cls;
  }
  var attr = $pairs(attrs).map(function(x){ return x.key + "=\"" + x.val + "\""; }).join(' ');
  return "<" + name + " " + attr + ">" + content + "</" + name + ">";
}

//calculate rgb component
function hToC(x, y, h) {
  var c;
  if (h < 0) h += 1;
  if (h > 1) h -= 1;
  if (h < 1/6) c = x +(y - x) * h * 6;
  else {
    if (h < 1/2) c = y;
    else {
      if (h < 2/3) c = x + (y - x) * (2 / 3 - h) * 6;
      else c=x;
    }
  }
  return c;
}

//convert hsl to rgb (all values 0..1)
function hsl(h, s, l){
  var y = (l > .5) ? l + s - l * s : l * (s + 1);
  var x = l * 2 - y;
  var r = hToC(x, y, h + 1 / 3);
  var g = hToC(x, y, h);
  var b = hToC(x, y, h - 1 / 3);
  return "#" + (r * 255).to_hex_byte() +
    (g * 255).to_hex_byte() + (b * 255).to_hex_byte();
}

function number_word(n) {
  if (n > 15) return n;
  return [
    'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen'
  ][n];
}

function pluralize_with_number_word(n, singular, plural) {
  if (!plural) plural = singular + "s";
  if (n == 1) return "One " + singular;
  return number_word(n) + " " + plural;
}

function pluralize(n, singular, plural) {
  if (!plural) plural = singular + "s";
  if (n == 1) return n + " " + singular;
  return n + " " + plural;
}

function english_list(items) {
  if (items.length == 1) return items[0];
  if (items.length == 2) return items[0] + " and " + items[1];
  var last = items.pop();
  return items.join(', ') + " and " + last;
}
