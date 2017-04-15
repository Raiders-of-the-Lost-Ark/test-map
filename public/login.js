$('.avatar').click(function(e) {
  $('.card').toggleClass('active');
  $(this).toggleClass('zmdi-close');
  $(this).toggleClass('zmdi-account');
});