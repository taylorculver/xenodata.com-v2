jQuery(function($) {'use strict',

	//#main-slider
	$(function(){
		$('#main-slider.carousel').carousel({
			interval: 8000
		});
	});


	// accordian
	$('.accordion-toggle').on('click', function(){
		$(this).closest('.panel-group').children().each(function(){
		$(this).find('>.panel-heading').removeClass('active');
		 });

	 	$(this).closest('.panel-heading').toggleClass('active');
	});

	//Initiat WOW JS
	new WOW().init();

	// portfolio filter
	$(window).load(function(){'use strict';
		var $portfolio_selectors = $('.portfolio-filter >li>a');
		var $portfolio = $('.portfolio-items');
		$portfolio.isotope({
			itemSelector : '.portfolio-item',
			layoutMode : 'fitRows'
		});
		
		$portfolio_selectors.on('click', function(){
			$portfolio_selectors.removeClass('active');
			$(this).addClass('active');
			var selector = $(this).attr('data-filter');
			$portfolio.isotope({ filter: selector });
			return false;
		});
	});

  // Contact form
  const $form = $('#main-contact-form');
  $form.on('submit', function (event) {
    event.preventDefault();

    // Create the `contact` data object
    const contact = $form.serializeArray().reduce((object, field) => {
      const { name, value } = field
      Reflect.set(object, name, value)
      return object
    }, {});

    // Disable the form button
    $form.find('button').html(
      '<i class="fa fa-spinner fa-spin"></i> &nbsp;' +
      'Email is sending...'
    ).prop('disabled', true)

    $.ajax({
      contentType: 'application/json',
      crossDomain: true,
      data: JSON.stringify({ contact: contact }),
      dataType: 'json',
      'headers': {
        'x-api-key': $form.data('api-key'),
      },
      method: 'POST',
      url: $form.attr('action'),
    }).done(function (data) {
      $('#contact-form-alert-success')
        .text(data.message)
        .show();

      $form.fadeOut();
    });
  });

	
	//goto top
	$('.gototop').click(function(event) {
		event.preventDefault();
		$('html, body').animate({
			scrollTop: $("body").offset().top
		}, 500);
	});	

	//Pretty Photo
	$("a[rel^='prettyPhoto']").prettyPhoto({
		social_tools: false
	});	
});