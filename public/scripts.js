function initialize() {
    // Everything here will be called after the site loads
    
    // Add listeners
    
    var info_panel_closer = document.querySelector('.info-panel-closer');
    info_panel_closer.addEventListener("click", closeInfoPanel);
}


function resetLightboxes() {
    var boxContainer = document.querySelector('#lightboxes');
    boxContainer.innerHTML = "";
}

function addLightbox(i, url) {
    var boxContainer = document.querySelector('#lightboxes');
    var anchor = document.createElement('a');
    var image = document.createElement('img');
    var imgId = "img" + i;

    anchor.setAttribute("href", "#_");
    anchor.setAttribute("class", "lightbox");
    anchor.setAttribute("id", imgId);
    image.setAttribute("src", url);

    anchor.appendChild(image);
    boxContainer.appendChild(anchor);
}

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

function showLightbox(id) {
    var box = document.getElementById(id);
    box.classList.add('active');
}

function hideLightbox(el) {
    if (el.classList.contains('active')) 
        el.classList.remove('active');
}


function toggleSiteEdit(editOn) {
    // Kill me
    if (editOn) {
        startEditMode();
    }
    else {
        endEditMode();
    }
}

function startEditMode() {
    var view = document.getElementsByClassName("view-mode")[0];
    var edit = document.getElementsByClassName("edit-mode")[0];
    var btn  = document.getElementById("siteEditButton");

    view.classList.remove("active");
    edit.classList.add("active");
    btn.setAttribute("onclick", "toggleSiteEdit(false)");
}

function endEditMode() {
    var view = document.getElementsByClassName("view-mode")[0];
    var edit = document.getElementsByClassName("edit-mode")[0];
    var btn  = document.getElementById("siteEditButton");

    view.classList.add("active");
    edit.classList.remove("active");
    btn.setAttribute("onclick", "toggleSiteEdit(true)");
}