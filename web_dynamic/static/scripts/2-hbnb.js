$(document).ready(init);

const HOST = '0.0.0.0'
function init () {
  const amenityDict = {}
  $('.amenities .popover input').change(function () {
    if ($(this).is(':checked')) {
      amenityDict[$(this).attr('data-name')] = $(this).attr('data-id');
    } else if ($(this).is(':not(:checked)')) {
      delete amenityDict[$(this).attr('data-name')];
    }
    const amenKeys = Object.keys(amenityDict);
    $('.amenities h4').text(amenKeys.sort().join(', '));
  });
  apiStat();
}

function apiStat () {
  const API_URL = `http://$(HOST):5001/api/v1/status/`;
  $.get(API_URL, (data, textStatus) => {
    if (textStatus === 'success' && data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
}
