//= require vendor/jquery-2.0.3
//= require underscore
//= require directory
//= require analytics

$(document).ready(function () {
  $('.js-menu-trigger').on('click touchstart', function (e) {
    $('.js-menu').toggleClass('is-visible');
    $('.js-main-push').toggleClass('menu-is-visible');
    $('.js-menu-screen').toggleClass('is-visible');

    if($('.js-main-push').hasClass('menu-is-visible')){
      $('.js-main-push').width($('.js-main-push').width()-220);
    }
    e.preventDefault();
  });

  $('.js-menu-screen').on('click touchstart', function (e) {
    $('.js-menu').toggleClass('is-visible');
    $('.js-main-push').toggleClass('menu-is-visible');
    $('.js-menu-screen').toggleClass('is-visible');

    if(!$('.js-main-push').hasClass('menu-is-visible')){
      $('.js-main-push').width('100%');
    }
    e.preventDefault();
  });
});
