Questions = {};


Q = {
  
  current: function() {
    if (This.question) return This.question;
    return $keys(Answers.here())[0];
  },
  
  here: function() {
    return $keys(Answers.here());
  }  
  
};


Answers = {
  
  here: function() {
    var hash = {};
    $.each(Agents.here(), function(){
      var agent = this;
      $.each(agent.answers, function(k, v){
        if (!hash[k]) hash[k] = [];
        hash[k].push(agent);
      });
    });
    return hash;
  },
  
  for_q_here: function(q) {
    if (!q || !Answers.here()[q]) return [];
    return Answers.here()[q].map(function(x){
      var answer = x.answers[q];
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
