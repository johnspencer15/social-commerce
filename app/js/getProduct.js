//retrieve product information
$(function() {
  
  //id of product
  var id = document.URL.split('id=')[1];
  
  $.ajax({
    type : 'get',
    url : '/getProduct',
    data : { id : id }
  }).done(function(response) {
    showProduct(response);
  }).fail(function() {
    console.log('fail');
  });
  
  $.ajax({
    type : 'get',
    url : '/getReviews',
    data : { id : id }
  }).done(function(response) {
    showReviews(response);
  }).fail(function() {
    console.log('fail');
  });
  
  function showReviews(data) {
    var container,
        col,
        panel,
        heading,
        body,
        text,
        starsContainer,
        stars,
        i,
        j;
    
    if (data.length === 0) {
      $('#reviews').append('<p class="no-reviews">No reviews yet!</p>');
    }
    
    for (i = 0; i < data.length; i++) {
      col = $('<div class="col-sm-3">');
      container = $('<div class="panel-body">');
      panel = $('<div class="panel panel-default">');
      heading = $('<div class="panel-heading">')
        .html(data[i].title);
      body = $('<div class="panel-body">');
      text = $('<p>')
        .html(data[i].description);
      starsContainer = $('<p>')
          .addClass('starRating display')
          .append($('<span class="star"></span>'),$('<span class="star"></span>'),
                  $('<span class="star"></span>'),$('<span class="star"></span>'),
                  $('<span class="star"></span>')); 
      
      for (j = 0; j < 5; j++) {
        if (j >= data[i].rating) {
          $(starsContainer.children()[j])
            .append(
              $('<img>').attr('src', '/fonts/star-off.svg')
            );
        } else {
          $(starsContainer.children()[j])
            .append(
              $('<img>').attr('src', '/fonts/star-on.svg')
            );
        }
      }
      
      //shorten description if it's too long
      if (data[i].description.length > 100) {
        text.html(data[i].description);
      }
      body.append(text, starsContainer);
      panel.append(heading, body);
      container.append(panel);
      col.append(container);
      $('#reviews').append(col);
    }
  }
  
  function showProduct(data) {
    console.log(data);
    var attr;
    for (attr in data) {
      $("[data-name=" + attr + "]").html(data[attr]);
    }
    
    $('#reviewLink').attr('href', '/createReview?id=' + data._id);
    $('#editLink').attr('href', '/editProduct?id=' + data._id);
    
    $("#picture")
      .css('background', 'url("/img/' + data.img + '") no-repeat')
      .css('background-size', 'contain')
      .css('height', '300px');
    
    $(window).resize(function() {
      if ($(window).width() < 800) {
        $('.product-image').each(function() {
          $(this).css('height', $(this).width());
        });
      } else {
        $('.product-image').each(function() {
          $(this).css('height', '300px');
        });
      }
    }); 
  }
  
    
  
});