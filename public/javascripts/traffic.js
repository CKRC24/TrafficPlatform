    var myLatlng = null;
    var myOptions = null;
    var map = null;
    var data = null;
    var trafficFlowFlag = false;
    var eventFlag = false;
    var parkingFlag = false;
    var cmsFlag = false;
    var cameraFlag = false;
    var tpegFlag = false;
    var vdFlag = false;
    var markersArray = [];
    var ctaLayer = null;
    google.maps.Map.prototype.clearOverlays = function() {
        if (ctaLayer != null) {
            ctaLayer.setMap(null);
        }
        /*
        if (markersArray) {
            for (var i = 0; i < markersArray.length; i++) {
                markersArray[i].setMap(null);
            }
        }
        */
        clearMarkers();
    }

    function clearMarkers() {
    	if (markersArray) {
            for (var i = 0; i < markersArray.length; i++) {
                markersArray[i].setMap(null);
            }
        }
    	markersArray = [];
    }

    function initialize() {
        myLatlng = new google.maps.LatLng(25.033674, 121.564776);
        myOptions = {
            zoom: 15,
            center: myLatlng,
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
        map = new google.maps.Map(document.getElementById("map_canvas"),
            myOptions);
    }

    function setParkingInfo() {
        if (parkingFlag) {
            $('#park').removeClass('enabled');
            parkingFlag = false;
        } else {
            $('#park').addClass('enabled');
            parkingFlag = true;
        }
        redraw();
    }

    function showParkingInfo() {
        //var parking_json_url = "http://140.92.88.92:38080/ParkingSearch/ParkingSearch?lon=121.564561&amp;lat=25.033327&amp;range=50000";
        var   parking_json_url = "http://140.92.88.92:38080/ParkingSearch/ParkingSearch?lon=121.564561&lat=25.033327&range=2000";
        $.getJSON(parking_json_url, function(json) {
            var parkingImage = "icon/parking.png";
            for (var i in json) {
                var myLatlng = new google.maps.LatLng(json[i].latitude, json[i].longitude);
                var info = json[i].name + " 空位:" + json[i].available;
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    icon: parkingImage,
                    title: info
                });
                markersArray.push(marker);
            }
        });
    }

    function setCMSInfo() {
        if (cmsFlag) {
            $('#cms').removeClass('enabled');
            cmsFlag = false;
        } else {
            $('#cms').addClass('enabled');
            cmsFlag = true;
        }
        redraw();
    }

    function showCMSInfo() {

        $.getJSON("CMSSearch.json", function(json) {
        	//http://140.92.88.92:38080/CMSSearch/CMSSearch?type=1

            var parkingImage = "icon/cms.html";
            for (var i in json) {
                var myLatlng = new google.maps.LatLng(json[i].y, json[i].x);
                var info = "設備編號: " + json[i].id + "\n" + "位置: " + json[i].location + "\n" + "內容: " + json[i].content;
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    icon: parkingImage,
                    title: info
                });
                markersArray.push(marker);
            }
        });
    }

    function setCameraInfo() {
        if (cameraFlag) {
            $('#camera').removeClass('enabled');
            cameraFlag = false;
        } else {
            $('#camera').addClass('enabled');
            cameraFlag = true;
        }
        redraw();
    }

    function showCameraInfo() {

        $.getJSON("TaipeiCamera.json", function(json) {
        	//http://140.92.88.92:38080/TaipeiCamera/TaipeiCamera?type=1
            var parkingImage = "icon/cam.html";
            for (var i in json) {
                var myLatlng = new google.maps.LatLng(json[i].y, json[i].x);
                var info = "設備編號: " + json[i].id + "\n" + "位置: " + json[i].location;
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    icon: parkingImage,
                    title: info
                });
                markersArray.push(marker);
            }
        });
    }

    function setTPEGInfo() {
        if (tpegFlag) {
            $('#tpeg').removeClass('enabled');
            tpegFlag = false;
        } else {
            $('#tpeg').addClass('enabled');
            tpegFlag = true;
        }
    }

    function setVDInfo() {
        if (vdFlag) {
            $('#vd').removeClass('enabled');
            vdFlag = false;
        } else {
            $('#vd').addClass('enabled');
            vdFlag = true;
        }
        redraw();
    }

    function showVDInfo() {

        $.getJSON("http://140.92.88.92:38080/TaipeiVD/TaipeiVD?type=go", function(json) {
            var parkingImage = "icon/vd.html";
            for (var i in json) {
                var myLatlng = new google.maps.LatLng(json[i].y, json[i].x);
                var info = "設備編號: " + json[i].id + "\n" + "位置: " + json[i].location + "\n" + "資料時間: " + json[i].exchange_time + "\n" + "車流平均速度: " + json[i].speed;
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    icon: parkingImage,
                    title: info
                });
                markersArray.push(marker);
            }
        });
    }

    function setTrafficEvent() {
        if (eventFlag) {
            $('#event').removeClass('enabled');
            eventFlag = false;
        } else {
            $('#event').addClass('enabled');
            eventFlag = true;
        }
        redraw();
    }

    function showTrafficEvent() {
        var traffic_event_json_url = "http://140.92.88.92:38080/TrafficEvent/TrafficEvent?type=go&amp;lon=121.564561&amp;lat=25.033327&amp;range=10000";
        $.getJSON(traffic_event_json_url, function(json) {
            var exImage = "icon/ex.html";
            for (var i in json) {
                var myLatlng = new google.maps.LatLng(json[i].latitude, json[i].longitude);
                var info = "事件主類別: " + json[i].type + "\n" + "發生時間: " + json[i].happen_time + "\n" + "路段一: " + json[i].road1 + "\n" + "路段二: " + json[i].road2 + "\n" + "說明: " + json[i].comment + "\n" + "事件次類別: " + json[i].name;

                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    icon: exImage,
                    title: info
                });
                markersArray.push(marker);
            }
        });
    }

    function setTrafficFlow() {
        if (trafficFlowFlag) {
            $('#road').removeClass('enabled');
            trafficFlowFlag = false;
        } else {
            $('#road').addClass('enabled');
            trafficFlowFlag = true;
        }
        redraw();
    }

    function showTrafficFlow() {
        if (ctaLayer == null) {
            google.maps.Map.prototype.clearOverlays();
            ctaLayer = new google.maps.KmlLayer('http://140.92.88.92:38080/TrafficPlatform/traffic_condition.kml');
            ctaLayer.setMap(map);
        } else {
        	/*
            if (markersArray) {
            	/*
                for (var i = 0; i < markersArray.length; i++) {
                    markersArray[i].setMap(null);
                }
                
                markersArray = [];
            }*/
            clearMarkers();
            ctaLayer.setMap(map);
        }
    }

    function redraw() {
        google.maps.Map.prototype.clearOverlays();
        if (trafficFlowFlag) {
            showTrafficFlow();
        }
        if (eventFlag) {
            showTrafficEvent();
        }
        if (parkingFlag) {
            showParkingInfo();
        }
        if (cmsFlag) {
            showCMSInfo();
        }
        if (cameraFlag) {
            showCameraInfo();
        }
        if (vdFlag) {
            showVDInfo();
        }
    }
    google.maps.event.addDomListener(window, 'load', initialize);