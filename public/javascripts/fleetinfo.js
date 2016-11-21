var fleetinfo = function() {
    //clear previous markers
    if (fleetinfo.markerCluster && fleetinfo.markerCluster.clearMarkers)
        fleetinfo.markerCluster.clearMarkers();

    var seletedFleet = $("#fleet-category").val();
    if (seletedFleet == "none") {
        return;
    }

    var fleet_url = "http://140.92.88.92:38080/GPSData/" + seletedFleet;
    //test
    //var fleet_url ="http://140.92.88.92:38080/ParkingSearch/ParkingSearch?lon=121.564561&lat=25.033327&range=2000";

    $.getJSON(fleet_url, function(json) {
        fleetinfo.cars = [];
        for (var i in json) {
            var myLatlng = new google.maps.LatLng(json[i].latitude, json[i].longitude);
            var icon = {
                url: "/images/cab.png",
                origin: origin,
                anchor: new google.maps.Point(21, 34),
                scaledSize: new google.maps.Size(40, 40)
            };
            var marker = new google.maps.Marker({
                position: myLatlng,
                // map: map,
                icon:icon,
                title: json[i].carId
            });
            fleetinfo.cars.push(marker);
        }
        fleetinfo.markerCluster = new MarkerClusterer(map, fleetinfo.cars);
    });

}
