Questions = {};


Q = {
  
  current: function() {
    return This.question || Q.here()[0];
  },

  // array of question strings that agents here have answered, ordered by reverse answer time.
  // TODO: better to only show questions that were asked here.
  here: function() {
    var qs = {};
    $.each(Agents.here(), function(){
      var agent = this;
      $.each(agent.answers, function(q, a){
        var ts = a[1] || 1;
        if (!qs[q]) {
          qs[q] = {q: q, ts: ts};
        }
        else if (qs[q].ts < ts) {
          qs[q].ts = ts;
        }
      });
    });
    qs = $values(qs);
    qs = qs.sort_by('.ts', -1);
    return qs.map('.q');
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
    return Answers.here()[q].sort_by(function(x){
      var answer = x.answers[q];
      return answer[1] || 1;
    }, -1).map(function(x){
      var answer = x.answers[q];
      return {
        thumb_url: x.thumb_url.gcify_url(),
        agent: x.title,
        time: $time_and_or_date(answer[1]),
        answer: answer[0],
        guy: x.id
      };
    });
  }

};
