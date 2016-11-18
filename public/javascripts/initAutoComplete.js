var map = null;
var myCenter = new Object();
var markers = [];

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
    var location = {
        url: "/img/src/location.png",
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(50, 50)
    };
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
        markers.push(new google.maps.Marker({
            map: map,
            icon: location,
            title: "You are here!",
            position: myLatlng
        }));
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
}
