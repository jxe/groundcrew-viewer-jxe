$.extend(String.prototype, {
  to_mspec: function() {
    var m = this.match(/^(\w+) ?(\d+)?-?(\d+)? ?(.*)$/)
    return {
      mode: m[1],
      start: m[2] && Number(m[2]),
      end: m[3] && Number(m[3]),
      tags: m[4].split(' '),

      ended: function() {
        return this.end && this.end < Date.unix();
      }
    };
  }
});
