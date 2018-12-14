(function($) {
  'use strict';

  /**
   * Ajax request to New York Times API
   */

  $(function() {
    // set some initial variables
    let nytData, nytItems, endpoint;
    const $loader = $('.ajax-loader'),
      $stories = $('.stories');

    $('#sections')
      .selectric()
      .on('change', function() {
        // get the select value
        const section = $(this).val();

        if (!section.length) {
          return;
        }

        // build the API url
        endpoint =
          'https://api.nytimes.com/svc/topstories/v2/' +
          section +
          '.json?api-key=0751ffff01d7a70710354972fa0ad4a9:19:75124095';

        // reset all the things
        $stories.empty();
        nytData = '';
        nytItems = '';

        // adjust the header display
        $('.logo img').css({
          height: '50%',
          width: '50%'
        });

        $('.site-header')
          .css({
            'max-width': '600px',
            flex: '1 0 auto',
            'align-items': 'flex-start'
          })
          .animateAuto('height', 200);

        // hide the placeholder, show the loader gif
        $('.search-placeholder').hide();
        $loader.css('display', 'block');

        // make the call to the endpoint
        $.ajax({
          method: 'GET',
          url: endpoint,
          dataType: 'json'
        })
          .done(function(data) {
            nytData = data.results;

            let articleLink, articleCaption, articleImageUrl;

            // append the stories if we found any
            if (nytData.length !== 0) {
              // make sure we only get populate the grid with 12 stories WITH photos
              const formattedNytData = nytData
                .filter(function(item) {
                  return item.multimedia.length;
                })
                .slice(0, 12);

              nytItems += '<ul>';

              $.each(formattedNytData, function(key, value) {
                articleImageUrl = value.multimedia[4].url;
                articleCaption = value.abstract;
                articleLink = value.url;

                nytItems += '<li class="article-item">';
                nytItems += '<a href="' + articleLink + '" target="_blank">';
                nytItems += '<div class="inner-item-wrapper">';
                nytItems +=
                  '<div class="article" style="background-image:url(' +
                  articleImageUrl +
                  ')">';
                nytItems += '<div class="story-meta">';
                nytItems +=
                  '<p>' +
                  (articleCaption || 'This story has no description.') +
                  '</p>';
                nytItems += '</div>';
                nytItems += '</div>';
                nytItems += '</div>';
                nytItems += '</a>';
                nytItems += '</li>';
              });

              nytItems += '</ul>';
            } else {
              nytItems +=
                '<p class="feedback">Sorry, nothing found! Please try again.</p>';
            }

            //show and hide things now...
            $stories
              .hide()
              .fadeIn('fast')
              .append(nytItems);
          })
          .fail(function() {
            $stories.append(
              '<p class="feedback">Sorry! There was a problem, please try again.</p>'
            );
          })
          .always(function() {
            $loader.hide();
          }); // end ajax
      });
  });

  // animate height auto on window resize
  const autoThrottled = _.throttle(function() {
    if ($('.stories').html().length !== 0) {
      $('.site-header').animateAuto('height', 200);
    }
  }, 100);

  $(window).resize(autoThrottled);
})(jQuery);
