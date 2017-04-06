// The Map
var map;

var cityArray = [];
var cityConst = function(name, lat, lng, id, misc)
{
    this.name = name;
    this.lat = lat;
    this.lng = lng;
    this.id = id;
    this.misc = misc;
};
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

    // Load local county data
    var dataReq = new XMLHttpRequest();
    dataReq.open("GET", 'mo.json', true);
    dataReq.onload = function() {
        var counties = JSON.parse(dataReq.responseText);
        map.data.setStyle({
          fillColor: '#FFFFFF',
          fillOpacity: 0.005,
          strokeWeight: 1,
          strokeOpacity: 0.2
        });
        map.data.addGeoJson(counties);
    };
    dataReq.send();

    // County listeners
    map.data.addListener('mouseover', function(event) {
        map.data.revertStyle();
        map.data.overrideStyle(event.feature, {fillOpacity: 0.5});
        console.log(event.feature.getProperty('NAMELSAD10'));  
    });
    map.data.addListener('mouseout', function(event) {
        map.data.revertStyle();
    });
    map.data.addListener('click', function(event) {
        var currentLat = event.feature.getProperty('INTPTLAT10');
        var currentLong = event.feature.getProperty('INTPTLON10');
        var currentPos = new google.maps.LatLng(currentLat, currentLong);
        map.setZoom(10);
        map.panTo(currentPos);
    });


    // this section does an async get request and puts circles on the map based off data from
    // the mongodb database, right now it just has a couple cities with small circles

    var infoWindow = null;
    var circlesArr = [];
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/cities", true);
    xhr.onload = function (e) { 
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var cityData = JSON.parse(xhr.responseText);
                for (var city in cityData) {
                    cityArray.push(new cityConst(cityData[city].name, cityData[city].lat, cityData[city].lng, cityData[city]._id, cityData[city].misc));
                }
                    for(var i = 0; i < cityArray.length; i++)
                    {                        
                        //console.log(cityArray[i]);
                        var cityCircle = new google.maps.Circle({
                            strokeColor: '#FF0000',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: '#FF0000',
                            fillOpacity: 0.35,
                            map: map,
                            clickable: true,
                            center: {lat: parseFloat(cityArray[i].lat), lng: parseFloat(cityArray[i].lng)},
                            radius: 10000,
                            name: cityArray[i].name,
                            misc: cityArray[i].misc,
                            siteId: cityArray[i].id
                        });
                        circlesArr.push(cityCircle);
                        //console.log(circlesArr);
                    }
                    var bubbleContainer, bubbleContent, moreLink;
                    for(var i = 0; i < circlesArr.length; i++)
                    {
                        infowindow = new google.maps.InfoWindow({
                            content: "holding...",
                            maxWidth: 300   
                        });
                        var onecircle = circlesArr[i];
                        google.maps.event.addListener(onecircle, 'click', function () {
                        // where I have added .html to the marker object.

                            // Create bubble content
                            bubbleContainer = document.createElement('div');
                            bubbleContent = document.createElement('div');
                            bubbleContent.setAttribute("class", "bubbleContent");
                            moreLink = document.createElement('a');
                            moreLink.setAttribute("href", "#");
                            moreLink.addEventListener("click", openRightSidebar);
                            moreLink.innerHTML = "More...";
                            bubbleContainer.appendChild(bubbleContent);
                            bubbleContainer.appendChild(moreLink);

                            // Add bubble content to info window
                            infowindow.setContent(bubbleContainer);
                            infowindow.setPosition(this.center);
                            infowindow.open(map, this);

                            // Send request for bubble info
                            var bubbleRequest = new XMLHttpRequest(); 
                            bubbleRequest.open("GET", "/bubble?site=" + this.name, true);
                            bubbleRequest.onload = function(){
                                // Populate site bubble 
                                document.querySelector('.bubbleContent').innerHTML = bubbleRequest.responseText;
                            };
                            bubbleRequest.send(); 

                            // Send request for sidebar info
                            var infoRequest = new XMLHttpRequest();
                            infoRequest.open("GET", "/viewSite?site=" + this.name, true);
                            infoRequest.onload = function(){
                                // Populate sidebar 
                                document.querySelector('#siteInfo_div').innerHTML = infoRequest.responseText;
                            };  
                            infoRequest.send(); 
                        });
                    }
                } else {
                console.error(xhr.statusText);
            }
        }
    };
    xhr.onerror = function (e) {
        console.error(xhr.statusText);
    };
    xhr.send(null);
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