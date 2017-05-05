/*  login.js
    This page has some jquery that does stuff in the login
    page.  I don't know what though.*/

$('.avatar').click(function(e) {
  $('.card').toggleClass('active');
  $(this).toggleClass('zmdi-close');
  $(this).toggleClass('zmdi-account');
});