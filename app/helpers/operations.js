go.push({
  op_created_ts: function() {
    return This._item.created_ts > 0 ? $time_and_or_date(This._item.created_ts) : 'a while ago';
  },
  op_updated_ts: function() {
    var last_update_ts = Operation.last_update_ts(This._item);
    return last_update_ts > 0 ? $time_and_or_date(last_update_ts) : 'a while ago';
  },
  op_organizer_name: function() {
    return This._item.architect_name;
  },
  op_count: function(type) {
    Operation.coalesce(This.item);
    return op_counts[type] > 0 ? op_counts[type]  + ' ' + type : null;
  },
  op_counts: function() {
    Operation.coalesce(This.item);
    return $pairs(op_counts[This.item]).map(function(x){
      var type = x.key;
      if (type == 'reported') type = 'report'.pluralize(x.val);
      return x.val > 0 ? tag('li', x.val + ' ' + type) : '';
    }).join('');
  }
});
