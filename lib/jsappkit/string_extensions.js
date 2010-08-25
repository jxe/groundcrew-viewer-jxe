String.PEARSON_HASHING_TABLE = [
  251, 117, 191, 48, 37, 199, 178, 157, 9, 50, 183, 197, 42, 40, 104, 
  146, 83, 156, 250, 215, 14, 233, 33, 74, 253, 128, 10, 36, 73, 217, 224, 
  147, 116, 86, 132, 204, 20, 2, 80, 55, 222, 5, 207, 201, 129, 216, 165, 
  148, 155, 159, 236, 19, 146, 108, 124, 112, 0, 58, 92, 70, 152, 135, 88, 
  149, 97, 122, 61, 255, 184, 211, 214, 141, 67, 79, 18, 62, 101, 173, 
  150, 238, 154, 170, 164, 130, 229, 252, 205, 43, 81, 94, 149, 59, 151, 
  151, 93, 45, 25, 166, 139, 44, 143, 16, 188, 30, 91, 218, 77, 60, 142, 
  152, 168, 47, 176, 13, 49, 34, 102, 31, 65, 203, 76, 240, 78, 115, 84, 
  153, 244, 32, 11, 175, 247, 209, 242, 71, 163, 167, 35, 136, 22, 237, 
  154, 134, 56, 181, 17, 4, 24, 206, 192, 105, 63, 89, 239, 6, 72, 53, 
  155, 219, 69, 227, 133, 15, 161, 68, 120, 12, 111, 179, 245, 100, 103, 
  156, 8, 148, 107, 144, 127, 160, 26, 241, 162, 213, 1, 220, 150, 82, 
  157, 190, 96, 98, 137, 174, 145, 46, 243, 125, 198, 231, 66, 234, 177, 
  158, 212, 210, 226, 95, 228, 21, 254, 27, 28, 121, 196, 187, 54, 249, 
  159, 109, 208, 153, 232, 194, 113, 23, 140, 235, 158, 248, 182, 202, 
  160, 186, 147, 119, 225, 87, 126, 64, 221, 193, 246, 169, 189, 90, 180, 
  161, 138, 57, 38, 75, 230, 41, 123, 110, 223, 118, 106, 7, 172, 114, 
  162, 131, 99, 51, 185, 39, 171, 195, 52, 29, 200, 3, 85
];

$.extend(String.prototype, {
  contains: function(x){
    return (this.indexOf(x) >= 0);
  },

  startsWith: function(x){
    return (this.indexOf(x) == 0);
  },

  to_func: function(){
    if (this.charAt(0) == '.') {
      var prop = this.slice(1);
      return function(y){ return y[prop]; };
    };
  },

  t: function(data) {
    if (data.indexOf) return this.t({x:data});
    return this.replace(/#\{(.*?)\}/g, function(_, p1){ return data[p1]; });
  },
  
  tt: function(arr) {
    if (!arr) return '';
    var self = this;
    return arr.map(function(x){ return self.t(x); }).join('');
  },
  
  pearson_hash: function(){
    var h = 0;
    for (var i=0; i < this.length; i++) {
      h = String.PEARSON_HASHING_TABLE[h ^ this.charCodeAt(i)];
    }
    return h;
  },
  
  semisplit: function(){
    return this.replace(/\s+\[\d+\]/g, '').split('; ');
  },
  
  to_color: function(){
    var hash = this.pearson_hash();
    var inverse = hash.reverse_nibbles();
    var hue        = (hash%20/19).pan(0,1);  // 20 distinct hues
    var lightness = (inverse%12/11).pan(0.4, 0.8); // 12 distinct brightnesses
    return hsl(hue, 0.76, lightness);
  },
  
  ellipticise: function(max_length) {
    max_length = max_length || 25;
    if (this.length < max_length) return this;
    else return this.slice(0, max_length) + "...";
  },
  
  gcify_url: function(){
    if (this.charAt(0) == '/') {
      if (window.location.href.indexOf("localhost:9292") >= 0) {
        return "http://localhost:9292" + this;
      } else {
        return "http://groundcrew.us" + this;
      }
    }
    else return this;
  },

  singularize: function(){
    return this.replace(/s$/, '');
  },
  
  pluralize: function() {
    if (this == 'creation') return 'creative projects';
    return this + 's';
  },
  
  sanitize: function() {
    return this.replace(' ', '_');
  },

  indef_article: function(){
    var vowels = 'aeiouAEIOU';
    var first_letter = this.charAt(0);
    if (vowels.indexOf(first_letter) >= 0) {
      return "an " + this;
    } else {
      return "a " + this;
    }
  },
  
  to_obj: function() {
    return eval('(' + this + ')');
  },
  
  to_words: function(){
    var regex = /\b(after|another|brief|by|mostly|partner|recognize|speak|something|prop|shop|first|go|minutes|meeting|next|one|only|pick|place|things|try|with|ways|a|and|up|out|to|of|are|as|at|be|do|else|buy|for|get|if|in|is|it|let|location|on|or|other|others|put|s|say|short|someone|task|that|the|their|them|then|there|too|when|whichever|will|you|your|yours|\d\w+)\b/g;
    return this.toLowerCase().replace(/\W+/g, ' ').replace(regex, ' ').split(' ').uniq();
  },

  yesno_question: function(){
    var r = /^(anyone|who)?\W*(can|will|want|should|could)/i;
    return r.test(this);
  },

  pretty_m_sysid: function() {
    var m = this.replace('+1', '');
    if (m.length == 10) {
      m = m.substring(0, 3) + ' ' + m.substring(3, 6) + '-' + m.substring(6, 10);
    }
    return m;
  },

  resource: function(){
    return this.resource_class().by_tag[this];
  },
  
  resource_type: function(){
    if (this.startsWith('e')) return 'Event';
    if (this.match(/^p\w+_\w+_\w+/)) return 'Op'; // old-style op ids
    if (this.startsWith('v')) return 'Op';
    if (this.startsWith('p')) return 'Person';
    if (this.startsWith('l')) return 'Landmark';
    // city has no resource class, but may be assigned to This.item
    if (this.startsWith('City__')) return null;
    throw 'unknown resource type for ' + this;
  },

  resource_class: function(){
    return eval(this.resource_type() + "s");
  }

});
