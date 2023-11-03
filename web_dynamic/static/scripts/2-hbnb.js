$(document).ready(function () {
  const amenities = {};
  $("input[type='checkbox']").on('change', function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');
    if ($(this).prop('checked')) {
      amenities[amenityId] = amenityName;
    } else {
      delete amenities[amenityId];
    }
    const amenityNames = Object.values(amenities);
    const amenityText = amenityNames.join(', ');
    $('div.amenities H4').text(amenityText);
  });
  $.get('http://127.0.0.1:5001/api/v1/status/', function (data, st) {
    if (st === 'success' && data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });
});
