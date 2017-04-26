// The Map
var map;
var siteArray = [];
var circlesArr = [];
var countyPoly;


var infoWindow = null;
var sites = null;
var loggedIn = null;

county_layer = null;
state_layer = null;
circle_layer = null;

function initSites(incomingSites){
    sites = incomingSites;
}

function initLogged(incLogged){
    loggedIn = incLogged;
}

// Init
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: {lat: 38.4956029, lng: -92.4205979},
        MapTypeControl: true,
        mapTypeControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT
    },
        mapTypeId: 'terrain',
        styles: [
            {
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#ebe3cd"
                }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#523735"
                }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                {
                    "color": "#f5f1e6"
                }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                {
                    "color": "#c9b2a6"
                }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "geometry.stroke",
                "stylers": [
                {
                    "color": "#dcd2be"
                }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#ae9e90"
                }
                ]
            },
            {
                "featureType": "landscape.man_made",
                "stylers": [
                {
                    "visibility": "off"
                }
                ]
            },
            {
                "featureType": "landscape.natural",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#dfd2ae"
                }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#dfd2ae"
                }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#93817c"
                }
                ]
            },
            {
                "featureType": "poi.business",
                "stylers": [
                {
                    "visibility": "off"
                }
                ]
            },
            {
                "featureType": "poi.government",
                "stylers": [
                {
                    "visibility": "off"
                }
                ]
            },
            {
                "featureType": "poi.medical",
                "stylers": [
                {
                    "visibility": "off"
                }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [
                {
                    "color": "#a5b076"
                }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#447530"
                }
                ]
            },
            {
                "featureType": "poi.place_of_worship",
                "stylers": [
                {
                    "visibility": "off"
                }
                ]
            },
            {
                "featureType": "poi.school",
                "stylers": [
                {
                    "visibility": "off"
                }
                ]
            },
            {
                "featureType": "poi.sports_complex",
                "stylers": [
                {
                    "visibility": "off"
                }
                ]
            },
            {
                "featureType": "road",
                "stylers": [
                {
                    "visibility": "off"
                }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#f5f1e6"
                }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#fdfcf8"
                }
                ]
            },
            {
                "featureType": "road.highway",
                "stylers": [
                {
                    "visibility": "off"
                }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#f8c967"
                }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                {
                    "color": "#e9bc62"
                }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#e98d58"
                }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry.stroke",
                "stylers": [
                {
                    "color": "#db8555"
                }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#806b63"
                }
                ]
            },
            {
                "featureType": "transit",
                "stylers": [
                {
                    "visibility": "off"
                }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#dfd2ae"
                }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#8f7d77"
                }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "labels.text.stroke",
                "stylers": [
                {
                    "color": "#ebe3cd"
                }
                ]
            },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [
                {
                    "color": "#dfd2ae"
                }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                {
                    "color": "#b9d3c2"
                }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                {
                    "color": "#92998d"
                }
                ]
            }
        ]
    }); // End map styles

    //=======================================================================================================================

    // Create data layers for counties and states
    county_layer = new google.maps.Data;
    state_layer = new google.maps.Data;
    var points;
    var countyBorders = [];

    // Load local county data
    var dataReq = new XMLHttpRequest();
    dataReq.open("GET", 'mo.json', true);
    dataReq.onload = function() {
        var counties = JSON.parse(dataReq.responseText);
        county_layer.setStyle({
          fillColor: '#FFFFFF',
          fillOpacity: 0.005,
          strokeWeight: 1,
          strokeOpacity: 0.2
        });
        county_layer.addGeoJson(counties);
        for(var i = 0; i < counties.features.length; i++){
            //console.log(counties.features[i].properties.NAMELSAD10);
            points = counties.features[i].geometry;
            countyBorders.push({poly:points,
                                name:counties.features[i].properties.NAMELSAD10});
            // countyPoly.push(points);
            // countyBorders.push(counties.features[i].geometry.coordinates);
            //console.log(countyBorders[i]);
        }        
    };
    dataReq.send();


    // Load local state data
    var dataReq2 = new XMLHttpRequest();
    dataReq2.open("GET", 'states.json', true);
    dataReq2.onload = function() {
        var states = JSON.parse(dataReq2.responseText);
        state_layer.setStyle({
          fillColor: '#FFFFFF',
          fillOpacity: 0.005,
          strokeWeight: 1,
          strokeOpacity: 0.2
        });
        state_layer.addGeoJson(states);
    };
    dataReq2.send();
    

    // State listeners
    state_layer.addListener('mouseover', function(event) {
        state_layer.revertStyle();
        state_layer.overrideStyle(event.feature, {fillOpacity: 0.5});
        //console.log(event.feature.getProperty("NAME"));  
    });
    state_layer.addListener('mouseout', function(event) {
        state_layer.revertStyle();
    });
    state_layer.addListener('click', function(event) {
        var currentLat = event.feature.getProperty('INTPTLAT');
        var currentLong = event.feature.getProperty('INTPTLON');
        var currentPos = new google.maps.LatLng(currentLat, currentLong);
        map.setZoom(7);
        map.panTo(currentPos);
    });

    // County listeners
    county_layer.addListener('mouseover', function(event) {
        county_layer.revertStyle();
        county_layer.overrideStyle(event.feature, {fillOpacity: 0.5});
        //console.log(event.feature.getProperty('NAMELSAD10'));  
    });
    county_layer.addListener('mouseout', function(event) {
        county_layer.revertStyle();
    });
    county_layer.addListener('click', function(event) {
        var currentLat = event.feature.getProperty('INTPTLAT10');
        var currentLong = event.feature.getProperty('INTPTLON10');
        var currentPos = new google.maps.LatLng(currentLat, currentLong);
        // console.log(event.feature.getProperty('NAMELSAD10'));  

        var ind = 0;
        while(ind < countyBorders.length){
            // console.log(countyBorders[ind].name);
            if(countyBorders[ind].name == event.feature.getProperty('NAMELSAD10')){
                console.log("FOUND THE COUNTY: " + countyBorders[ind].name + " AT: " + ind);
                break;
            }
            ind++;
        }

        var polyPath = [];
        for(var x = 0; x < countyBorders[ind].poly.coordinates[0].length; x++){
            // console.log(countyBorders[ind].poly.coordinates[0][x]);
            var tempPoint = new google.maps.LatLng(countyBorders[ind].poly.coordinates[0][x][1], countyBorders[ind].poly.coordinates[0][x][0]);
            polyPath.push(tempPoint);
        }

        for(var i = 0; i < sites.length; i++){
            var point = new google.maps.LatLng(sites[i].lat, sites[i].lng);
            // console.log(sites[i].name)
            // console.log(countyBorders[0].poly.coordinates);
            //console.log(sites[i].lat);
            var tempPoly = new google.maps.Polygon({
                paths: polyPath
            });

            //console.log(point.lat);

            //console.log(" AM I HERE ?1?1?1/1!?");
             if(google.maps.geometry.poly.containsLocation(point, tempPoly)){
                 if(sites[i].isPublic){                
                    console.log("FOUND A SITE: " + sites[i].name);
                 }
             }
        }

        map.setZoom(8);
        map.panTo(currentPos);
    });

    


    // Add state and county layers to map
    //state_layer.setMap(map);             // Maybe not
    county_layer.setMap(map);

    // Map listeners
    map.addListener('zoom_changed', function(event) {
        if ((map.getZoom() > 13) || (map.getZoom() <= 5)) county_layer.setMap(null); 
        else county_layer.setMap(map);
        if (map.getZoom() > 5) state_layer.setMap(null); 
        else state_layer.setMap(map);
    });

    // Create infowindow for use in all site bubbles
    infowindow = new google.maps.InfoWindow({
        content: "Loading...",
        maxWidth: 300   
    });

    // this section does an async get request and puts circles on the map based off data from
    // the mongodb database, right now it just has a couple cities with small circles
    console.log(loggedIn);
    for(var i = 0; i < sites.length; i++)
    {                        
        if(sites[i].isPublic == true || loggedIn == true){
        //console.log(siteArray[i]);
            var siteCircle = new google.maps.Circle({   
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            clickable: true,
            lat: sites[i].lat,
            long: sites[i].lng,
            center: {lat: obscureSite(sites[i].lat), lng: obscureSite(sites[i].lng)},
            radius: 8000,
            name: sites[i].name,
            misc: sites[i].misc,
            siteId: sites[i].id,
            siteInd: i,
            zIndex: 200
            });

        google.maps.event.addListener(siteCircle, 'click', function () {
            selectMarker(this.siteInd);
        });

        circlesArr.push(siteCircle);
        }
    }            

    function obscureSite(point){
        var newPoint = parseFloat(point);
        var min = -0.06;
        var max = 0.06;
        var newNum = Math.random() * (max - min) + min;
        newPoint += newNum;
        return newPoint;
    }   

    //=======================================================================================================================

    // ADDING CIRCLES AND CLICKABLE CIRCLES

    // END ADDING CIRCLES AND CLICKABLE CIRCLES

    // Map area restrictions
	var allowedBounds = new google.maps.LatLngBounds(
	  new google.maps.LatLng(33.3353104, -124.4519655),
	  new google.maps.LatLng(44.7186249, -64.1323508)
	);
	var boundLimits = {
		maxLat : allowedBounds.getNorthEast().lat(),
		maxLng : allowedBounds.getNorthEast().lng(),
		minLat : allowedBounds.getSouthWest().lat(),
		minLng : allowedBounds.getSouthWest().lng()
	};

	var lastValidCenter = map.getCenter();
	var newLat, newLng;
	google.maps.event.addListener(map, 'center_changed', function() {
		center = map.getCenter();
		if (allowedBounds.contains(center)) {
			// still within valid bounds, so save the last valid position
			lastValidCenter = map.getCenter();
			return;
		}
		newLat = lastValidCenter.lat();
		newLng = lastValidCenter.lng();
		if(center.lng() > boundLimits.minLng && center.lng() < boundLimits.maxLng){
			newLng = center.lng();
		}
		if(center.lat() > boundLimits.minLat && center.lat() < boundLimits.maxLat){
			newLat = center.lat();
		}
		map.panTo(new google.maps.LatLng(newLat, newLng));
	});

    // Zoom restrictions
    map.setOptions({ 
        minZoom: 5, 
        maxZoom: 21,    
        streetViewControl: false
    });


    
} // End map init 


function selectMarker(index) {
    // Get site marker from array
    var marker = circlesArr[index];

    // Pan to the marker
    map.panTo(new google.maps.LatLng(marker.lat, marker.long));

    // Create bubble content
    var bubbleContainer, bubbleContent, moreLink, rippleContainer;
    bubbleContainer = document.createElement('div');
    bubbleContent = document.createElement('div');
    bubbleContent.setAttribute("class", "bubbleContent");
    moreLink = document.createElement('button');
    moreLink.setAttribute("href", "#");
    moreLink.setAttribute("class", "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent bubbleButton");
    rippleContainer = document.createElement('span');
    rippleContainer.setAttribute("class", "mdl-button__ripple-container");
    rippleEffect = document.createElement('span');


    moreLink.addEventListener("click", openInfoPanel);
    moreLink.innerHTML = "More...";
    bubbleContainer.appendChild(bubbleContent);
    bubbleContainer.appendChild(moreLink);
    moreLink.appendChild(rippleContainer);

    // Add bubble content to info window
    infowindow.setContent(bubbleContainer);
    infowindow.setPosition(marker.center);
    infowindow.open(map, marker);

    // Send request for bubble info
    var bubbleRequest = new XMLHttpRequest(); 
    bubbleRequest.open("GET", "/bubble?site=" + marker.name, true);
    bubbleRequest.onload = function(){
        // Populate site bubble 
        document.querySelector('.bubbleContent').innerHTML = bubbleRequest.responseText;
    };
    bubbleRequest.send(); 

    // Send request for sidebar info
    var infoRequest = new XMLHttpRequest();
    infoRequest.open("GET", "/viewSite?site=" + marker.name, true);
    infoRequest.onload = function(){
        // Populate sidebar 
        document.querySelector('#siteInfo_div').innerHTML = infoRequest.responseText;
    };  
    infoRequest.send(); 

    var lightboxRequest = new XMLHttpRequest();
    lightboxRequest.open("GET", "/lightbox?site=" + marker.name, true);
    lightboxRequest.onload = function(){
        // Populate lightbox container
        document.querySelector('#lightboxes').innerHTML = lightboxRequest.responseText;
    };  
    lightboxRequest.send(); 

}