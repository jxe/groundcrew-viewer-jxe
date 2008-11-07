SelfIW = {       
  asDOMObj: function() {
    Item.calculate_fields(person_item);
    return $.template('#self_iw_template').blit().fillout({
      "#self_iw_status"           : person_item.mystatus,
      "#self_iw_status_dot //src" : person_item.dotimg,
      "#self_iw_wish"             : person_item.topready,
      "#self_iw_loc"              : person_item.location
    }).clicks({
      "#self_iw_status_change a"  : SelfIW.change_status
    })[0];
	}
};
