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

$('#right-bar-btn').click(function(e){
 e.preventDefault();
 if($('#sidebar').hasClass('active')){   
    $('#sidebar').removeClass('active'); 
 }
 else{
    $('#sidebar').addClass('active'); 
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

function openSidePanel(e) {
    e.preventDefault();
    var drawer = document.querySelector('#sidebar');
    if (drawer.classList.contains('active')) 
        drawer.classList.remove('active');
    else 
        drawer.classList.add('active');
}

function openInfoPanel(e) {
    e.preventDefault();
    var drawer = document.querySelector('#info-panel');
    if (drawer.classList.contains('active')) 
        drawer.classList.remove('active');
    else 
        drawer.classList.add('active');
}