(function($) {
  "use strict";

  //Run function When Document Ready
  $(document).ready(function() {
    initClickedEvents();
    initNavbarSrcoll();
    initCheckNav();
    conditionNavbar();
    initGetHWindow();
    initTooltip();
    initPage();
  });
  //Run function When PACE (page loader) hide
  function initPage() {
    $('.wrapper').css('visibility', 'visible').animate({opacity: 1.0}, 2000, function() {
      initCheckNav();
    });
    //check if url contain hash(#)
    if (window.location.hash) {
      $('.link-inpage[href="' + window.location.hash + '"]').first().trigger('click');
    }
  };


  //Click Envents
  function initClickedEvents() {
    $('.link-inpage').click(function(e) {
      var target = this.hash, $target = $(target);
      $('html, body').stop().animate({
        'scrollTop': $target.offset().top - ($('.menu-area').outerHeight() - 1)
      }, 1500, 'easeInOutExpo', function() {
        //window.location.hash = target;
      });
      return false;
    });
  }

  //Navbar Scroll
  function initNavbarSrcoll() {
    if ($('.main-header').length > 0) {
      var mainbottom = $('.main-header').offset().top + $('.main-header').height();
      $(window).on('scroll', function() {
        var stopWindow = Math.round($(window).scrollTop()) + $('.menu-area').outerHeight();
        conditionNavbar(stopWindow, mainbottom);
      });
    }
  }

  //Check Navar Show
  function initCheckNav() {
    if ($('.main-header').length > 0) {
      var mainbottom = $('.main-header').offset().top + $('.main-header').height();
      var stopWindow = Math.round($(window).scrollTop()) + $('.menu-area').outerHeight();
      conditionNavbar(stopWindow, mainbottom);
    }
  }

  //Condition Navbar
  function conditionNavbar(stopWindow, mainbottom) {
    if (stopWindow > mainbottom) {
      $('.menu-area').addClass('nav-fixed');
    } else {
      $('.menu-area').removeClass('nav-fixed nav-white-bg');
    }
    if ((stopWindow) > $('.menu-area').outerHeight()) {
      $('.menu-area').addClass('nav-white-bg');
    }
  }

  //Set header to window
  function initGetHWindow() {
    var wHeight = $(window).height();
    if (wHeight > 600 && !$('.main-header').hasClass('no-window')) {
      $('.main-header, .header-content-fixed').height(wHeight);
    }
  }

  //Tooltip Bootrapt
  function initTooltip() {
    $('[data-toggle="tooltip"]').tooltip();
  }

})(jQuery);
