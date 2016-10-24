var map = null;
var myCenter = new Object();

if (!String.format) {
    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

function initMap() {
    var markers = [];
    var myOptions = {
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        panControl: true,
        panControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        streetViewControl: false
    }


    map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
    //joseph : set default pos. when exception
    var mapSet = false;
    var setDefaultPos = function (){
        mapSet = true;
        myCenter.lat = 25.0553088;
        myCenter.lng = 121.5541152;
        var myLatlng = new google.maps.LatLng(myCenter.lat, myCenter.lng);
        map.setCenter(myLatlng);

    }
    //browser offers locating service
    if (navigator.geolocation) {
        try {
            navigator.geolocation.getCurrentPosition(function(position) {
                mapSet = true;
                myCenter.lat = position.coords.latitude;
                myCenter.lng = position.coords.longitude;
                var myLatlng = new google.maps.LatLng(myCenter.lat, myCenter.lng);
                map.setCenter(myLatlng);
                //location icon setup
                var location = {
                    url: "/img/src/location.png",
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(50, 50)
                };
                markers.push(new google.maps.Marker({
                    map: map,
                    icon: location,
                    title: "You are here!",
                    position: myLatlng
                }));
            });
        }catch (e){
            setDefaultPos();
        }
    } else { /* default location for no locating servive browsers */
        setDefaultPos();
    }
    if(!mapSet)
        setDefaultPos();

    map.addListener('center_changed', function() {
        // 3 seconds after the center of the map has changed, pan back to the
        // marker.
        if ($('#modal-pointer').hasClass('hidden')) {

        } else {
            if ($('#modal-pointer').css('opacity') == 1) {
                $('#modal-pointer').animate({
                    opacity: 0
                }, 300);
            }
        }
    });
}

function initAutocomplete() {
    initMap();
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });
    // [START region_getplaces]
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
    // [END region_getplaces]

}
