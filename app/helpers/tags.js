Tags = {
  // For an array of tags [t], returns an array of tag objects { t, count },
  // sorted by count desc.
  // TODO: is this fast enough for a large squad? If not, maybe build up tag_db
  // as items appear on the stream, or pick a subset of agents.
  tag_cloud: function(tag_array, n) {
    n = n || 20;
    var tags_db = {};

    $.each(tag_array, function(i, t) {
      if (typeof t != 'string' || t.length == 0) return;
      if (tags_db[t]) {
        tags_db[t].count += 1;
      }
      else {
        tags_db[t] = { t: t, count: 1 };
      }
    });

    var tags = $values(tags_db);
    tags.sort(function(a, b) {
      if (a.count == b.count) {
        return a.t < b.t ? -1 : (a.t == b.t ? 0 : 1);
      }
      else {
        return a.count < b.count ? 1 : -1;
      }
    });

    return tags.slice(0, n);
  },

  agent_tags: function(n) {
    var tags = Agents.everything().map(function(i){ return i.atags && i.atags.split(' '); }).flatten();
    return Tags.tag_cloud(tags, n);
  },

  tag_t: '#{t} <span class="count descr">#{count}</span>',

  tags_as_cbs: function(n) {
    return Tags.agent_tags(n).map(function(t){
      var display = Tags.tag_t.t(t);
      return tag('div.tag', tag('input', { type: 'checkbox', name: 'tags[]', value: t.t, content: display } ));
    }).join('');
  }
};

go.push(Tags);
