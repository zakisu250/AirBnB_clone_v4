$(document).ready(function () {
  const HOST = '0.0.0.0';
  const amenityDict = {};
  $('.amenities .popover input').click(function () {
    if ($(this).prop('checked')) {
      amenityDict[$(this).data('name')] = $(this).data('id');
    } else {
      delete amenityDict[$(this).data('name')];
    }
    const amenKeys = Object.keys(amenityDict);
    $('.amenities h4').text(amenKeys.sort().join(', '));
  });

  const statusURL = `http://${HOST}:5001/api/v1/status/`;
  $.get(statusURL, function (data) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  $('button').on('click', function () {
    const placeURL = `http://${HOST}:5001/api/v1/places_search/`;
    const amenityIds = $('.amenities .popover input:checked').map((i, e) => $(e).data('id')).get();
    $.ajax({
      url: placeURL,
      type: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({ amenities: amenityIds }),
      success: function (res) {
        let articles = '';
        for (const r of res) {
          const article = `<article>
         <div class="title_box">
            <h2>${r.name}</h2>
            <div class="price_by_night">$${r.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">${r.max_guest} Guest(s)</div>
            <div class="number_rooms">${r.number_rooms} Bedroom(s)</div>
            <div class="number_bathrooms">${r.number_bathrooms} Bathroom(s)</div>
          </div>
          <div class="description">${r.description}</div>
        </article>`;
          articles += article;
        }
        $('section.places').html(articles);
      },
      error: function (err) {
        console.log(err);
      }
    });
  });
});