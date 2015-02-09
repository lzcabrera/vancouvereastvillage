//= require vendor/jquery-2.0.3
//= require underscore
//= require directory
//= require analytics

$(document).ready(function () {
  $('.js-menu-trigger').on('click touchstart', function (e) {
    $('.js-menu').toggleClass('is-visible');
    $('.js-menu-screen').toggleClass('is-visible');
    e.preventDefault();
  });

  $('.js-menu-screen').on('click touchstart', function (e) {
    $('.js-menu').toggleClass('is-visible');
    $('.js-menu-screen').toggleClass('is-visible');
    e.preventDefault();
  });
});
