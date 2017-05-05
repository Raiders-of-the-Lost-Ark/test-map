/*  scripts.js
    This file is a collection of functions used at various locations throughout our application.
    The bulk of our UI JavaScript is located here.
*/

/*  This function initializes the main page with functioning buttons.
    It adds listeners and adds the buttons to the site. */
function initialize() {
    
        // Create the infoPanel closing button
    var infoPanelCloser = document.querySelector('.info-panel-closer');
    if (infoPanelCloser != null)
        infoPanelCloser.addEventListener("click", closeInfoPanel);

        // Create the create button
    var createButton = document.getElementById("createButton");
    if (createButton != null) 
            createButton.addEventListener("click", openCreatePanel);

        // Create the zoom to country view button
    var zoomOutButton = document.getElementById("zoomOutButton");
    if (zoomOutButton != null)
        zoomOutButton.addEventListener("click", zoomToCountryView);
}


//  Small function that switches between UTM and LAT LONG
function toggleCoordFormat(showthis,hidethis){
    document.getElementById(showthis).style.display="inline";
    document.getElementById(hidethis).style.display="none";

}

/*  This function is used to reinit the side bar, basically it
    refreshes all the data in the side bar to make it current*/

function reInitSidebar() {

        // get the delete image buttons
    var deleteImgBtns = document.getElementsByClassName("img-remover");

        // for all the elements that could be deleted
    for (var i = 0; i < deleteImgBtns.length; i++) {
        
            // Add listeners to every picture that can be deleted
        deleteImgBtns[i].addEventListener("click", function(event) {
            event.preventDefault();

                // get data from 
            var container = this.parentNode.parentNode;
            var siteId = document.getElementById("currentSite").value;
            var imgName = this.value;

                // Make sure people are sure if they want to delete something
            var confirmed = confirm("Are you sure you want to delete the image \"" + imgName + "\" ?");

                // if they confirmed delete the image
            if (confirmed) {
                var deleteReq = new XMLHttpRequest();
                var data = new FormData();
                data.append("siteId", siteId);
                data.append("imgName", imgName);
                deleteReq.open("POST", "deleteimg");
                deleteReq.addEventListener("load", function() {
                    viewPrevImage();
                    // Remove image container from screen
                    container.parentNode.removeChild(container);
                });
                deleteReq.send(data);
            }
        });
    }

    // Remove pdf buttons
    // Get all pdfs
    var deletePdfBtns = document.getElementsByClassName("pdf-remover");

        // for every pdf found add a listener
    for (var i = 0; i < deletePdfBtns.length; i++) {
        deletePdfBtns[i].addEventListener("click", function(event) {
            event.preventDefault();

                // get all information from document
            var li = this.parentNode.parentNode; // Grandparent node
            var siteId = document.getElementById("currentSite").value;
            var pdfName = this.value;

                // make sure they want to delete the pdf
            var confirmed = confirm("Are you sure you want to delete the file \"" + pdfName + "\" ?");

                // if they confirmed then delete the pdf
            if (confirmed) {
                var deleteReq = new XMLHttpRequest();
                var data = new FormData();
                data.append("siteId", siteId);
                data.append("pdfName", pdfName);
                deleteReq.open("POST", "deletepdf");
                deleteReq.addEventListener("load", function() {
                    // Remove item from the list
                    li.parentNode.removeChild(li);
                });
                deleteReq.send(data);
            }
        });
    }
}

    // function to reset the lightboxes
function resetLightboxes() {

        // select all lightboxes and clear html
    var boxContainer = document.querySelector('#lightboxes');
    boxContainer.innerHTML = "";
}

    // function to add a lightbox
function addLightbox(i, url) {

        // Get items from the document
    var boxContainer = document.querySelector('#lightboxes');
    var anchor = document.createElement('a');
    var image = document.createElement('img');
    var imgId = "img" + i;

        // anchor the new lightbox
    anchor.setAttribute("href", "#_");
    anchor.setAttribute("class", "lightbox");
    anchor.setAttribute("id", imgId);
    image.setAttribute("src", url);

        // add the image to that anchor
    anchor.appendChild(image);
    boxContainer.appendChild(anchor);
}

// function that sets up as many lightboxes as we need to use 
function setUpLightboxes(numPics) {

    // Clear lightbox container
    var boxContainer = document.querySelector('#lightboxes');
    boxContainer.innerHTML = "";

    var imgId, anchor, image;

    // Populate with lightboxes for each picture
    for (var picNum = 0; picNum < numPics; picNum++) {
        imgId = "img" + picNum;

        anchor = document.createElement('a');
        image = document.createElement('img');

        anchor.setAttribute("href", "#_");
        anchor.setAttribute("class", "lightbox");
        anchor.setAttribute("id", imgId);

        anchor.appendChild(image);
        boxContainer.appendChild(anchor);
    }
}

// Show the lightbox
function showLightbox(id) {
    var box = document.getElementById(id);
    box.classList.add('active');
}

// Hide the lightbox
function hideLightbox(el) {
    if (el.classList.contains('active')) 
        el.classList.remove('active');
}


// Fuction that toggles edit mode
function toggleSiteEdit(editOn) {

        // if edit mode is on turn it off
    if (editOn) {
        initEditMode();
        startEditMode();
    }else { // otherwise turn it on
        initViewMode();
        endEditMode();
    }
}

// Function that starts up edit mode
function startEditMode() {
    var view = document.getElementsByClassName("view-mode")[0];
    var edit = document.getElementsByClassName("edit-mode")[0];
    var create = document.getElementsByClassName("create-mode")[0];

    if (view != null)
        view.classList.remove("active");
    if (edit != null)
        edit.classList.add("active");
    if (create != null)
        create.classList.remove("active");
}

// Function to turn off edit mode
function endEditMode() {
    var view = document.getElementsByClassName("view-mode")[0];
    var edit = document.getElementsByClassName("edit-mode")[0];
    var create = document.getElementsByClassName("create-mode")[0];

    if (view != null)
        view.classList.add("active");
    if (edit != null)
        edit.classList.remove("active");
    if (create != null)
        create.classList.remove("active");
}

// Function to submit the edit form
function submitEditForm(e) {
    e.preventDefault();


        // Set up a ajax request to submit the edit form
    var form = e.target;
    var infoContainer = document.querySelector('#siteInfo_div');
    var XHR = new XMLHttpRequest();
    var data = new FormData(form);

    XHR.addEventListener("load", function(e) {
        // Update sidebar
        console.log(XHR.responseText);
        infoContainer.innerHTML = XHR.responseText;
        reInitSidebar();
        google.maps.event.trigger(map,'resize');
        initViewMode();
        endEditMode();
    });

    XHR.addEventListener("error", function(e) {
        alert('A great problem has occurred.');
    });

    XHR.open("POST", "editSite");
    XHR.send(data);
    
    infoContainer.innerHTML = "Loading...";

    return false;
}


    // Function to submit create form
function submitCreateForm(event) {
    event.preventDefault();

     var form = event.target;
     var valid=false;
     if((form.elements.name.value!=""))
     {

        if(form.elements.radio[0].checked) // radio[0] is the UTM radio button
        {
            if((form.elements.zone.value!="")&&(form.elements.easting.value!="")&&(form.elements.north.value!=""))
            {
                valid=true;
            }
            else {
            alert("Please include all three parts of UTM location (or select \"Use Lat/Long\").");
            }
        }
        else
        {
            if((form.elements.Latitude.value!="")&&(form.elements.Longitude.value!=""))
            {
                valid=true;
            }
            else {
            alert("Please include both a latitude and a longitude.");
            }

        }
     }
     else
     {
        alert("Please input a site name.");
     }
     if(valid) {
        // [ ... ]
        var XHR = new XMLHttpRequest();
        var data = new FormData(form);

        XHR.addEventListener("load", function(e) {
            // Update sidebar
            location.reload();
        });

        XHR.addEventListener("error", function(e) {
            alert('Error!');
        });

        XHR.open("POST", "sites");
        XHR.send(data);
    }
    return false;
}


// Function to toggle creating sites
function toggleSiteCreate(createOn) {

        // if create mode is true turn it on
    if (createOn) {
        startCreateMode();
    } else {
        // otherwise turn it off
        endCreateMode();
    }
}

// Function to start create mode
function startCreateMode() {
    var view = document.getElementsByClassName("view-mode")[0];
    var create = document.getElementsByClassName("create-mode")[0];
    var edit = document.getElementsByClassName("edit-mode")[0];

        // remove view and edit mode, turn on create mode
    view.classList.remove("active");
    edit.classList.remove("active");
    create.classList.add("active");
}

// Function to turn off create mode
function endCreateMode() {
    var view = document.getElementsByClassName("view-mode")[0];
    var create = document.getElementsByClassName("create-mode")[0];
    var edit = document.getElementsByClassName("edit-mode")[0];

        // Turn off create and edit, turn on view mode
    view.classList.add("active");
    create.classList.remove("active");
    edit.classList.remove("active");
}

    // Function that zooms out to the country
function zoomToCountryView() {
    // Pan to center of US and zoom out
    resetDisplayList();
    var center = new google.maps.LatLng(37.3313563, -92.6104017);
    map.setZoom(5);
    map.panTo(center); 
}


    // Function that gets the sites in the county
function postSitesInCounty(foundSites) {
    var XHR = new XMLHttpRequest();
    var jsonData = JSON.stringify(foundSites);

    var data = new FormData();
    data.append("siteList", jsonData);


    XHR.open("POST", "countySites");
    XHR.send(data);
    return false;
}

/**
 * Login functions by Duane
 */

$('.avatar').click(function(e) {
  $('.card').toggleClass('active');
  $(this).toggleClass('zmdi-close');
  $(this).toggleClass('zmdi-account');
});

function compareNewPass(){ 
    var pass1 = document.getElementById("pw1"); 
    var pass2 = document.getElementById("pw2"); 
 
    if(pass1 == pass2) 
        console.log("THESE ARE THE SAME"); 
    else 
        console.log("THESE ARE NOT THE SAME"); 
};