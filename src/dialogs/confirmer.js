Confirmer = {
  cb: null,
  
  clicked: function() {
    Confirmer.cb();
    Confirmer.cb = null;
    $.facebox.close();
    return false;
  },
  
  show: function(callback) {
    this.cb = callback;
    $('#confirmer').facebox();
    var me = $.template('#confirmer').find('a').click(this.clicked).end();
    $.facebox(me);
  }
  
};
