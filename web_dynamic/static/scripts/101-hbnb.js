const HOST = '127.0.0.1';
let objs = {};
const amenObjs = {};
const stateObjs = {};
const cityObjs = {};

$(document).ready(function () {
  $('.amenities .popover input').change(function () {
    objs = amenObjs;
    checkObjs.call(this, 1);
  });
  $('.state_input').change(function () {
    objs = stateObjs;
    checkObjs.call(this, 2);
  });
  $('.city_input').change(function () {
    objs = cityObjs;
    checkObjs.call(this, 3);
  });
  statusCheck();
  searchPlaces();
  usersReviews();
});

function checkObjs (objAll) {
  if ($(this).is(':checked')) {
    objs[$(this).data('name')] = $(this).data('id');
  } else if ($(this).is(':not(:checked)')) {
    delete objs[$(this).data('name')];
  }
  const names = Object.keys(objs);
  if (objAll === 1) {
    $('.amenities h4').text(names.sort().join(', '));
  } else if (objAll === 2) {
    $('.locations h4').text(names.sort().join(', '));
  }
}

function statusCheck () {
  const statusURL = `http://${HOST}:5001/api/v1/status/`;
  $.get(statusURL, function (data) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });
}

function searchPlaces () {
  $('button').on('click', function () {
    const placeURL = `http://${HOST}:5001/api/v1/places_search/`;
    $.ajax({
      url: placeURL,
      type: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        amenities: Object.values(amenObjs),
        states: Object.values(stateObjs),
        cities: Object.values(cityObjs)
      }),
      success: function (res) {
        $('section.places').empty();
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
            <br>
            <div class="reviews" id=${r.id}>
              <h2 style="text-align: left;">Review</h2>
              <hr />
              <span class="display" id=${r.id}>Show</span>
            </div>
          </article>`;
          $('section.places').append(article);
        }
      },
      error: function (err) {
        console.log(err);
      }
    });
  });
}

function usersReviews () {
  $('.places').on('click', '.display', function () {
    const reviewId = $(this).attr('id');
    if ($(this).text() === ' Show') {
      $(this).text(' Hide');
      $.ajax({
        type: 'GET',
        url: `http://${HOST}:5001/api/v1/places/` + $(this).attr('id') + '/reviews',
        success: function (reviews) {
          const reviewsNumbers = Object.keys(reviews).length;
          $('#' + reviewId + ' h2').prepend(reviewsNumbers + ' ');
          $('#' + reviewId + ' h2').text(() => reviewsNumbers > 1 ? 'Reviews' : 'Review');
          $.each(reviews, function (index, review) {
            const date = review.created_at.split('T')[0];
            $.ajax({
              type: 'GET',
              url: `http://${HOST}:5001/api/v1/users/` + review.user_id,
              success: function (user) {
                $('#' + reviewId).append(
                  '<ul>' +
                  '<li>' +
                  '<h3>' + 'From ' + user.first_name + ' ' + user.last_name +
                  ' ' + date + '</h3>' +
                  '<p>' + review.text + '</p>' +
                  '</li>' +
                '</ul>'
                );
              }
            });
          });
        }
      });
    } else {
      $('.reviews h2').text('Reviews');
      $('span').text(' Show');
      $('#' + reviewId + ' ul').css('display', 'none');
    }
  });
}
