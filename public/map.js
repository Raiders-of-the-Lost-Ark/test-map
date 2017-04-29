// The Map
var map;
var siteArray = [];
var circlesArr = [];

var infoWindow = null;
var sites = null;

var state_layer = null;
var county_layer = null;
var circle_layer = null;

var current_state =  null;

var stateInfo = new Map;     // Used to look up state data objects by ID

function initSites(incomingSites){
    sites = incomingSites;
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
    state_layer = new google.maps.Data;
    state_layer.setStyle({
        fillColor: '#FFFFFF',
        fillOpacity: 0.005,
        strokeWeight: 1,
        strokeOpacity: 0.2
    });
    county_layer = new google.maps.Data;
    county_layer.setStyle({
        fillColor: '#FFFFFF',
        fillOpacity: 0.005,
        strokeWeight: 1,
        strokeOpacity: 0.2,
        zIndex: 1
    });

    // Create request for state data
    var stateReq = new XMLHttpRequest();
    // When state data arrives, build state and county data layers
    stateReq.onload = function() {
        var states = JSON.parse(stateReq.responseText);

        // Create request for county data
        var countyReq = new XMLHttpRequest();
        countyReq.onload = function() {
            // When county data arrives, finish building data layers
            var counties = JSON.parse(countyReq.responseText);
            setUpCounties(states, counties);
        };
        // Send county data request
        countyReq.open("GET", 'counties.json', true);
        countyReq.send();

        // Set up state data layer
        state_layer.addGeoJson(states);
        state_layer.forEach(function(item){
            item.setProperty("isFocused", false);
        });
        // Add state layer to map
        state_layer.setMap(map);
    };
    // Send state data request
    stateReq.open("GET", 'states.json', true);
    stateReq.send();

    // Define state listeners
    // ----------------------
    state_layer.addListener('mouseover', function(event) {
        state_layer.overrideStyle(event.feature, {fillOpacity: 0.5});
    });

    state_layer.addListener('mouseout', function(event) {
        state_layer.overrideStyle(event.feature, {fillOpacity: 0.005});
    });

    state_layer.addListener('click', function(event) {
        current_state = event.feature.getProperty('STATEFP');
        state_layer.revertStyle();
        state_layer.overrideStyle(event.feature, {strokeWeight: 5});
        // Get info for clicked state
        var currentLat = event.feature.getProperty('INTPTLAT');
        var currentLong = event.feature.getProperty('INTPTLON');
        var currentState = event.feature.getProperty('STATEFP');
        // Get county data for current state
        var countyObj = stateInfo.get(currentState);
        // Remove existing county layer and create a new one
        county_layer.setMap(null);
        county_layer.forEach(function(item){
            county_layer.remove(item);
        });
        // Add county data to new layer on map
        county_layer.addGeoJson(countyObj);
        county_layer.setMap(map);
        // Pan and zoom to clicked state
        var currentPos = new google.maps.LatLng(currentLat, currentLong);
        map.setZoom(7);
        map.panTo(currentPos);
    });

    // Define county listeners
    // -----------------------
    county_layer.addListener('mouseover', function(event) {
        county_layer.overrideStyle(event.feature, {fillOpacity: 0.5});
    });

    county_layer.addListener('mouseout', function(event) {
        county_layer.revertStyle();
    });

    county_layer.addListener('click', function(event) {
        // Get info for clicked county
        var currentLat = event.feature.getProperty('INTPTLAT10');
        var currentLong = event.feature.getProperty('INTPTLON10');
        var currentPos = new google.maps.LatLng(currentLat, currentLong);
        // Pan and zoom to clicked county

        var found_counties = null;

        for(var [stateID, stateObj] of stateInfo)
        {
            if(stateID == current_state){
                console.log("THIS IS THE STATE OBJECT");
                console.log(stateObj);
                console.log("THIS IS THE STATE OBJECT");
                found_counties = stateObj;
            }
        }

        console.log(event.feature.getProperty(''));
        console.log(found_counties.features);

        //console.log(event);

        map.setZoom(8);
        map.panTo(currentPos);
    });

    // Define map listeners
    // -----------------------
    map.addListener('zoom_changed', function(event) {
        // If zoomed out to country view, reset selected states
        if (map.getZoom() <= 5) {
            state_layer.revertStyle();
            county_layer.setMap(null);
        } 
    });

    // Create infowindow for use in all site bubbles
    infowindow = new google.maps.InfoWindow({
        content: "Loading...",
        maxWidth: 300   
    });

    // this section does an async get request and puts circles on the map based off data from
    // the mongodb database, right now it just has a couple cities with small circles

    for(var i = 0; i < sites.length; i++)
    {                        
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
            center: {lat: parseFloat(sites[i].lat), lng: parseFloat(sites[i].lng)},
            radius: 10000,
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
        reInitSidebar();
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

function setUpCounties(stateData, countyData) {
    var stateId;
    var stateFeatures = [];
    var stateObj = {};
    // Iterate through states
    for (var feature in stateData.features) {
        var propList = stateData.features[feature].properties;
        // Find ID of state
        for (var prop in propList) {
            if (prop == "STATEFP") {
                stateId = propList[prop];   
                stateFeatures = [];        
                // Populate state features
                var countyId;
                var countyObj = {};
                // Iterate through counties
                for (var feature in countyData.features) {
                    var propList = countyData.features[feature].properties;
                    // Find counties that belong to state
                    for (var prop in propList) {
                        if (prop == "STATEFP10") {
                            countyId = propList[prop];
                            if (countyId == stateId) {
                                // Add county data to state features as an object
                                countyObj = countyData.features[feature];
                                stateFeatures.push(countyObj);  
                            }
                        }
                    }
                }
                // Complete the GeoJSON for this state
                stateObj = {
                    type: "FeatureCollection",
                    features: stateFeatures
                };
                // Link state ID to data object
                stateInfo.set(stateId, stateObj);
            }
        }
    }
}