function initialize() {
    // Everything here will be called after the site loads
    
    // Add listeners
    
    var infoPanelCloser = document.querySelector('.info-panel-closer');
    if (infoPanelCloser != null)
        infoPanelCloser.addEventListener("click", closeInfoPanel);

    var createButton = document.getElementById("createButton");
    if (createButton != null) 
            createButton.addEventListener("click", openCreatePanel);

    var zoomOutButton = document.getElementById("zoomOutButton");
    if (zoomOutButton != null)
        zoomOutButton.addEventListener("click", zoomToCountryView);
}

function toggleCoordFormat(showthis,hidethis){
    document.getElementById(showthis).style.display="inline";
    document.getElementById(hidethis).style.display="none";

}

function reInitSidebar() {
    // Add event listeners to sidebar

    // Remove img buttons
    var deleteImgBtns = document.getElementsByClassName("img-remover");
    for (var i = 0; i < deleteImgBtns.length; i++) {
        deleteImgBtns[i].addEventListener("click", function(event) {
            event.preventDefault();
            var container = this.parentNode.parentNode;
            var siteId = document.getElementById("currentSite").value;
            var imgName = this.value;
            var confirmed = confirm("Are you sure you want to delete the image \"" + imgName + "\" ?");
            if (confirmed) {
                var deleteReq = new XMLHttpRequest();
                var data = new FormData();
                data.append("siteId", siteId);
                data.append("imgName", imgName);
                deleteReq.open("POST", "deleteimg");
                deleteReq.addEventListener("load", function() {
                    // Remove image container from screen
                    container.parentNode.removeChild(container);
                });
                deleteReq.send(data);
            }
        });
    }

    // Remove pdf buttons
    var deletePdfBtns = document.getElementsByClassName("pdf-remover");
    for (var i = 0; i < deletePdfBtns.length; i++) {
        deletePdfBtns[i].addEventListener("click", function(event) {
            event.preventDefault();
            var li = this.parentNode.parentNode; // Grandparent node
            var siteId = document.getElementById("currentSite").value;
            var pdfName = this.value;
            var confirmed = confirm("Are you sure you want to delete the file \"" + pdfName + "\" ?");
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
        initEditMode();
        startEditMode();
    }
    else {
        initViewMode();
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
        reInitSidebar();
        google.maps.event.trigger(map,'resize');
    });

    XHR.addEventListener("error", function(e) {
        alert('A great problem has occurred.');
    });

    XHR.open("POST", "editSite");
    XHR.send(data);


        initViewMode();
        endEditMode();
    
    return false;
}

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
    var view = document.getElementsByClassName("view-mode")[0];
    var create = document.getElementsByClassName("create-mode")[0];
    var edit = document.getElementsByClassName("edit-mode")[0];

    view.classList.remove("active");
    edit.classList.remove("active");
    create.classList.add("active");
}

function endCreateMode() {
    var view = document.getElementsByClassName("view-mode")[0];
    var create = document.getElementsByClassName("create-mode")[0];
    var edit = document.getElementsByClassName("edit-mode")[0];

    view.classList.add("active");
    create.classList.remove("active");
    edit.classList.remove("active");
}

function zoomToCountryView() {
    // Pan to center of US and zoom out
    resetDisplayList();
    var center = new google.maps.LatLng(37.3313563, -92.6104017);
    map.setZoom(5);
    map.panTo(center); 
}


function postSitesInCounty(foundSites) {
    var XHR = new XMLHttpRequest();
    var jsonData = JSON.stringify(foundSites);

    var data = new FormData();
    data.append("siteList", jsonData);


    XHR.open("POST", "countySites");
    XHR.send(data);
    return false;
}

