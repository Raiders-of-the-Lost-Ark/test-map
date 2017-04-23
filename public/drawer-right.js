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

// Vanilla JS from here on

function openSidePanel(event) {
    event.preventDefault();
    var sidebar = document.querySelector('#sidebar');
    var info_panel = document.querySelector('#info-panel');

    if (info_panel.classList.contains('active')) 
        info_panel.classList.remove('active');
    sidebar.classList.add('active');
}

function openInfoPanel(event) {
    event.preventDefault();
    var info_panel = document.querySelector('#info-panel');
    var sidebar = document.querySelector('#sidebar');

    if (sidebar.classList.contains('active')) 
        sidebar.classList.remove('active');
    info_panel.classList.add('active');
}

function closeInfoPanel(event) {
    event.preventDefault();
    var info_panel = document.querySelector('#info-panel');
    
    if (info_panel.classList.contains('active')) 
        info_panel.classList.remove('active');
}

function deleteItem(deleteform) {
    var x=confirm("Are you sure you want to delete this battle site? All information will be lost. All of it. You cannot get it back. \n Are you sure?");
	if(x==true)
	{
	deleteform.submit();
	}
	
}

function openCreatePanel(event) {
    event.preventDefault();

    // Need to close InfoWindow here

    // Show loading indicator
    document.querySelector('#siteInfo_div').innerHTML = "Loading...";

    // Open sidebar
    var info_panel = document.querySelector('#info-panel');
    var sidebar = document.querySelector('#sidebar');

    if (sidebar.classList.contains('active')) 
        sidebar.classList.remove('active');
    info_panel.classList.add('active');

    // Request form
    var newFormReq = new XMLHttpRequest();
    newFormReq.open("GET", "/createSiteMode");
    newFormReq.addEventListener("load", function() {
        // Populate sidebar when HTML is received
        document.querySelector('#siteInfo_div').innerHTML = newFormReq.responseText;
    });
    newFormReq.send();
}