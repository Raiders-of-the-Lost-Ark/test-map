function initialize() {
    // Everything here will be called after the site loads
    
    // Add listeners
    
    var infoPanelCloser = document.querySelector('.info-panel-closer');
    infoPanelCloser.addEventListener("click", closeInfoPanel);

    var createButton = document.getElementById("createButton");
    createButton.addEventListener("click", openCreatePanel);
}

function toggleCoordFormat(showthis,hidethis){
    document.getElementById(showthis).style.display="inline";
    document.getElementById(hidethis).style.display="none";

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
    var create = document.getElementsByClassName("create-mode")[0];

    view.classList.remove("active");
    edit.classList.add("active");
    create.classList.remove("active");
}

function endEditMode() {
    var view = document.getElementsByClassName("view-mode")[0];
    var edit = document.getElementsByClassName("edit-mode")[0];
    var create = document.getElementsByClassName("create-mode")[0];

    view.classList.add("active");
    edit.classList.remove("active");
    create.classList.remove("active");
}

function submitEditForm(e) {
    e.preventDefault();

    var form = e.target;
    var XHR = new XMLHttpRequest();
    var data = new FormData(form);

    XHR.addEventListener("load", function(e) {
        // Update sidebar
        console.log(XHR.responseText);
        document.querySelector('#siteInfo_div').innerHTML = XHR.responseText;
        google.maps.event.trigger(map,'resize');
    });

    XHR.addEventListener("error", function(e) {
        alert('A great problem has occurred.');
    });

    XHR.open("POST", "editSite");
    XHR.send(data);

    return false;
}

function submitCreateForm(event) {
    event.preventDefault();

    var form = event.target;

    // Validation
    // console.log( form.elements[0].value );
    // console.log( form.elements[1].value );
    // [ ... ]

    var XHR = new XMLHttpRequest();
    var data = new FormData(form);

    XHR.addEventListener("load", function(e) {
        // Update sidebar
        location.reload();
    });

    XHR.addEventListener("error", function(e) {
        alert('A great problem has occurred.');
    });

    XHR.open("POST", "cities");
    XHR.send(data);

    return false;
}

// THIS IS FOR CREATING SITES

function toggleSiteCreate(createOn) {
    // Kill me (again)
    if (createOn) {
        startCreateMode();
    }
    else {
        endCreateMode();
    }
}

function startCreateMode() {
    
    console.log("HELLO WORLDO");
    var view = document.getElementsByClassName("view-mode")[0];
    var create = document.getElementsByClassName("create-mode")[0];
    var edit = document.getElementsByClassName("edit-mode")[0];

    view.classList.remove("active");
    edit.classList.remove("active");
    create.classList.add("active");
}

function endCreateMode() {
    console.log("THIS IS BULLCRAP");
    var view = document.getElementsByClassName("view-mode")[0];
    var create = document.getElementsByClassName("create-mode")[0];
    var edit = document.getElementsByClassName("edit-mode")[0];

    view.classList.add("active");
    create.classList.remove("active");
    edit.classList.remove("active");
}