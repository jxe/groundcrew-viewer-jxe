Questions = {};

function q(md5er, body){
  Questions[md5er] = body;
}


Q = {
  
  current: function() {
    if (This.question) return This.question;
    return $keys(Answers.here())[0];
  },
  
  // ask: function(q) {
  //   q()
  // },
  // 
  here: function() {
    return $keys(Answers.here()).map(function(x){
      return Questions[x];
    });
  }  
  
};


Answers = {
  
  here: function() {
    var hash = {};
    $.each(Agents.here(), function(){
      var agent = this;
      $.each(agent.answers_h, function(k, v){
        if (!hash[k]) hash[k] = [];
        hash[k].push(agent);
      });
    });
    return hash;
  },
  
  for_q_here: function(q) {
    if (!q) return [];
    return Answers.here()[q].map(function(x){
      var answer = x.answers_h[q];
      return {
        thumb_url: x.thumb_url.gcify_url(),
        agent: x.title,
        time: $time(answer[1]),
        answer: answer[0],
        guy: x.id
      };
    });
  }
    
};
