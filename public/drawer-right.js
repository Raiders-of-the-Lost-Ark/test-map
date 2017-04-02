// This file is an abomination and will be replaced with Vanilla JS

$('#left-bar-btn').click(function(){
 if($('.mdl-layout__drawer').hasClass('active')){       
    $('.mdl-layout__drawer').removeClass('active'); 
 }
 else{
    $('.mdl-layout__drawer').addClass('active'); 
 }
});

$('.mdl-layout__obfuscator').click(function(){
 if($('.mdl-layout__drawer').hasClass('active')){       
    $('.mdl-layout__drawer').removeClass('active'); 
 }
 else{
    $('.mdl-layout__drawer').addClass('active'); 
 }
});

$('.right-bar-btn').click(function(e){
 e.preventDefault();
 if($('.mdl-layout__drawer-right').hasClass('active')){   
    $('.mdl-layout__drawer-right').removeClass('active'); 
 }
 else{
    $('.mdl-layout__drawer-right').addClass('active'); 
 }
});

$('.mdl-layout__obfuscator-right').click(function(){
 if($('.mdl-layout__drawer-right').hasClass('active')){       
    $('.mdl-layout__drawer-right').removeClass('active'); 
 }
 else{
    $('.mdl-layout__drawer-right').addClass('active'); 
 }
});

function openRightSidebar(e) {
    e.preventDefault();
    var drawer = document.querySelector('.mdl-layout__drawer-right');
    if (drawer.classList.contains('active')) 
        drawer.classList.remove('active');
    else 
        drawer.classList.add('active');
}