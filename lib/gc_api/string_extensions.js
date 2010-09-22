// Groundcrew-specific extensions to String
$.extend(String.prototype, {

  sanitize: function() {
    return this.replace(' ', '_');
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
  }

});