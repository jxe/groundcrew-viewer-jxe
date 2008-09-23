CityJumper = {
  
  wire: function() {
    var html = '<option value="global">Worldwide</option>';
    $.each(cities, function(k, v){
      html += '<option value="'+k+'">'+v+'</option>';
    });
    $('#city_jumper').html(html).change(function(){
      var new_val = $(this).val();
      Viewer.open(new_val == 'global' ? null : Number(new_val));
      return true;
    });
    
    NQueue.receivers.push(CityJumper);    
  },
  
  did_change_selected_city: function() {
    $('#city_jumper').val(Viewer.selected_city || 'global');
    if (!Viewer.selected_city || Viewer.selected_city == 'nothing') {
      $('#city_label').hide();
    } else {
      $('#city_label').show();
    }
  }
  
};
