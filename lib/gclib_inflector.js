String.prototype.t = function(data){
  if (data.indexOf) return this.t({x:data});
  return this.replace(/#\{(.*?)\}/g, function(_, p1){ return data[p1]; });
};

String.prototype.singularize = function(){
  return this.replace(/s$/, '');
};

String.prototype.indef_article = function(){
  var vowels = 'aeiouAEIOU';
  var first_letter = this[0];
  if (vowels.indexOf(first_letter) >= 0) {
    return "an " + this;
  } else {
    return "a " + this;
  }
};

function number_word(n) {
  if (n > 15) return n;
  return [
    'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen'
  ][n];
}

function number_plural(n, singular, plural) {
  if (n == 1) return "One " + singular;
  return number_word(n) + " " + plural;
}

function english_list(items) {
  if (items.length == 1) return items[0];
  if (items.length == 2) return items[0] + " and " + items[1];
  var last = items.pop();
  return items.join(', ') + " and " + last;
}
