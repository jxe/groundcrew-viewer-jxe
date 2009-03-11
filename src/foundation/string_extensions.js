$.extend(String.prototype, {

  t: function(data) {
    if (data.indexOf) return this.t({x:data});
    return this.replace(/#\{(.*?)\}/g, function(_, p1){ return data[p1]; });
  },
  
  tt: function(arr) {
    if (!arr) return '';
    var self = this;
    return arr.map(function(x){ return self.t(x); }).join('');
  },
  
  ellipticise: function(max_length) {
    max_length = max_length || 25;
    if (this.length < max_length) return this;
    else return this.slice(0, max_length) + "...";
  },
  
  gcify_url: function(){
    if (this[0] == '/') return "http://groundcrew.us" + this;
    else return this;
  },

  singularize: function(){
    return this.replace(/s$/, '');
  },
  
  sanitize: function() {
    return this.replace(' ', '_');
  },

  indef_article: function(){
    var vowels = 'aeiouAEIOU';
    var first_letter = this[0];
    if (vowels.indexOf(first_letter) >= 0) {
      return "an " + this;
    } else {
      return "a " + this;
    }
  },
  
  contains: function(x){
    return (this.indexOf(x) >= 0);
  },

  startsWith: function(x){
    return (this.indexOf(x) == 0);
  },
  
  to_obj: function() {
    return eval('(' + this + ')');
  },
  
  to_func: function(){
    if (this[0] == '.') {
      var prop = this.slice(1);
      return function(y){ return y[prop]; };
    };
  },
  
  to_words: function(){
    var regex = /\b(after|another|brief|by|mostly|partner|recognize|speak|something|prop|shop|first|go|minutes|meeting|next|one|only|pick|place|things|try|with|ways|a|and|up|out|to|of|are|as|at|be|do|else|buy|for|get|if|in|is|it|let|location|on|or|other|others|put|s|say|short|someone|task|that|the|their|them|then|there|too|when|whichever|will|you|your|yours|\d\w+)\b/g;
    return this.toLowerCase().replace(/\W+/g, ' ').replace(regex, ' ').split(' ').uniq();
  },

  resource: function(){
    var parts = this.split('__');
    if (parts[0] == 'Person') parts[0] = 'Agent';
    return eval(parts[0] + "s").id(parts[1]);
  },

  resource_class: function(){
    var parts = this.split('__');
    if (parts[0] == 'Person') parts[0] = 'Agent';
    return eval(parts[0] + "s");
  },

  resource_id: function(){
    return this.split('__')[1];
  }
  
});
