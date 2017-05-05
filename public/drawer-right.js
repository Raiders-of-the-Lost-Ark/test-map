/**
 * Modified version of MDL's "drawer-left"
 * (Required extra work to put it on the right side.)
 * Most regrettably uses jQuery (commonly used in MDL), 
 * besides the functions we converted to Vanilla.
 */

// Left bar button listener
$('#left-bar-btn').click(function(){
 if($('.mdl-layout__drawer').hasClass('active')){       
    $('.mdl-layout__drawer').removeClass('active'); 
 }
 else{
    $('.mdl-layout__drawer').addClass('active'); 
 }
});

// Obfuscator listener
$('.mdl-layout__obfuscator').click(function(){
 if($('.mdl-layout__drawer').hasClass('active')){       
    $('.mdl-layout__drawer').removeClass('active'); 
 }
 else{
    $('.mdl-layout__drawer').addClass('active'); 
 }
});

// Right bar button listener (opens right bar)
$('#right-bar-btn').click(function(e){
 e.preventDefault();
 if($('#sidebar').hasClass('active')){   
    $('#sidebar').removeClass('active'); 
 }
 else{
    $('#sidebar').addClass('active'); 
 }
});

// Right bar closer listener (closes right bar)
$('.right-bar-closer').click(function(e){
 e.preventDefault();
 if($('#sidebar').hasClass('active')){   
    $('#sidebar').removeClass('active'); 
 }
 else{
    $('#sidebar').addClass('active'); 
 }
});

// Obfuscator listener
$('.mdl-layout__obfuscator-right').click(function(){
 if($('.mdl-layout__drawer-right').hasClass('active')){       
    $('.mdl-layout__drawer-right').removeClass('active'); 
 }
 else{
    $('.mdl-layout__drawer-right').addClass('active'); 
 }
});

// Opens the right sidebar containing search features
function openSidePanel() {
    var sidebar = document.querySelector('#sidebar');
    var info_panel = document.querySelector('#info-panel');

    if (info_panel.classList.contains('active')) 
        info_panel.classList.remove('active');
    sidebar.classList.add('active');
}

// Opens the site info panel on the side
function openInfoPanel(event) {
    event.preventDefault();
    initViewMode();
    var info_panel = document.querySelector('#info-panel');
    var sidebar = document.querySelector('#sidebar');

    if (sidebar.classList.contains('active')) 
        sidebar.classList.remove('active');
    info_panel.classList.add('active');
}

// Closes the site info panel on the side
function closeInfoPanel(event) {
    event.preventDefault();
    var info_panel = document.querySelector('#info-panel');
    
    if (info_panel.classList.contains('active')) 
        info_panel.classList.remove('active');
}

// Handle delete button on info form
function deleteItem(deleteform) {
    var x=confirm("Are you sure you want to delete this battle site? All information will be lost. All of it. You cannot get it back. \n Are you sure?");
	if(x==true)
	{
	    deleteform.submit();
	}
	
}

// Open create form and send request for "create form" content
function openCreatePanel(event) {
    event.preventDefault();

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
        reInitSidebar();
    });
    newFormReq.send();
    document.querySelector('#siteInfo_div').innerHTML = "Loading...";
}

