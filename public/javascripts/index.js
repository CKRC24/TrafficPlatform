var data = null;
var start = {
    lat: 25.058760,
    lng: 121.554818
};
var destination = {
    lat: 25.101565,
    lng: 121.547826
};

var mapFlags = {
    trafficFlow: false,
    event: false,
    parking: false,
    cms: false,
    camera: false,
    tpeg: false,
    vd: false,
    convenient: false
};
//navigation setup
var directionsService = new google.maps.DirectionsService();
var directionsDisplay;
var rendererOptions = {
    map: map,
    suppressMarkers: true
}
directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
directionsDisplay.setMap(map);


var modal = {
    title: "Modal Title",
    exinfo: {
        text: "This is an {0} exinfo",
        num: "60"
    },
    exdetail: [{
        name: "detail name: ",
        value: "detail value"
    }],
    setup: function() {
        $('#modal-wrap').find('.modal-title').prop('innerHTML', modal.title);

        var modal_exinfo = modal.exinfo.text;
        if (modal.exinfo.text && modal.exinfo.text.indexOf("{0}") >= 0) {
            modal_exinfo = String.format(modal.exinfo.text, "<span class='num'>" + modal.exinfo.num + "</span>");
        }
        $('#modal-wrap').find('.exinfo').prop('innerHTML', modal_exinfo);

        var modal_exdetail = "";
        $.each(modal.exdetail, function(index, value) {
            modal_exdetail += String.format("<p>{0}<span>{1}</span></p>", value.name, value.value);
        });
        $('#modal-wrap').find('.exdetail').prop('innerHTML', modal_exdetail)
    },
    center: function() {
        var modalHeight = $('#modal-wrap').height();
        var windowHeight = $('#col-right').height();
        var topBotMargin = (windowHeight - (modalHeight + 30)) / 2;
        $('#modal-wrap').css('margin-top', topBotMargin);
        $('#modal-wrap').css('margin-bottom', topBotMargin);
    },
    setNavigationModalCenter: function() {
        var modalHeight = $('#navigation-modal').height();
        var windowHeight = $('#col-right').height();
        var topBotMargin = (windowHeight - (modalHeight + 30)) / 2;
        $('#navigation-modal').css('margin-top', topBotMargin);
        $('#navigation-modal').css('margin-bottom', topBotMargin);
    }
}

var timetype = ["instant", "15min", "30min", "history"];
var activeInfoWindow = null;

var formItems = {
    datetime: "",
    timetype: "",
    dataCat: "",
    eventCat: "",
    infoSelect: "",
    infoCat: "",
    parkingType: "",
    parkingHourly: ""
}
var markersArray = [];
var ctaLayer = null;
var kmlUrl = {
    beta_url: "https://ulcac3l8d4.execute-api.ap-northeast-1.amazonaws.com/beta/",
    prod_url: "https://ulcac3l8d4.execute-api.ap-northeast-1.amazonaws.com/prod/"
}
var BaseUrl = kmlUrl.beta_url;

var range = "3000";

var json_paths = {
    history: {
        CMSSearch: "/json/CMSSearch3.json",
        TaipeiCamera: "/json/TaipeiCamera2.json",
        parking: "/json/Parking5000.json",
        TaipeiVD: "/json/TaipeiVD.json",
        TrafficEvent: "/json/TrafficEvent.json",
        convenient: "/json/convenient2.json",
        trafficFlow: "http://140.92.88.92:38080/TrafficPlatform/traffic_condition.kml",
        roadinfo: "roadinfo?period=0&lon=121.556916&lat=25.057415&uuid=1234567777",
        roadSpeed: "roadspeed?uuid=1234567777&lon=121.556916&lat=25.057415",
        parkingInfo: "/json/parkingInfo.json",
    },
    instant: {
        CMSSearch: "http://140.92.88.92:38080/CMSSearch/CMSSearch?lon=121.564561&lat=25.033327&range=5000&datetime=201506192321&type=1",
        TaipeiCamera: "http://140.92.88.92:38080/TaipeiCamera/TaipeiCamera?lon=121.564561&lat=25.033327&range=5000&datetime=201506192321&type=1",
        //"parking": "http://140.92.88.92:38080/ParkingSearch/ParkingSearch?lon=121.564561&lat=25.033327&range=2000",
        parking: "http://140.92.88.92:38080/ParkingSearch/ParkingSearch?lon=121.564561&lat=25.033327&range=50000",

        TaipeiVD: "http://140.92.88.92:38080/TaipeiVD/TaipeiVD?type=go",
        TrafficEvent: "http://52.196.208.172:8080/TrafficEvent/TrafficEvent2?lon=121.564561&lat=25.033327&range=5000",
        convenient: "http://52.196.208.172:8080/PoiInfo?lat=25.038189&lon=121.532990&range=50000&toilet=1&oil=1&rest=1&carFactory=1&hospital=1&police=1&carWasher=1&alarmRoad=1&public=1",
        trafficFlow: "http://140.92.88.92:38080/TrafficPlatform/traffic_condition.kml",
        roadinfo: "roadinfo?period=0&lon=121.556916&lat=25.057415&uuid=1234567777",
        roadSpeed: "roadspeed?uuid=1234567777&lon=121.556916&lat=25.057415",
        parkingInfo: "parkinginfo?period=0&lon=121.556916&lat=25.057415&range=1000&hourly=0&vendor=0&uuid=1234567777",
        routePlan: "http://52.196.208.172:8080/TrafficPlatform/kaiwan/1125112402000055.kml",
        coverage:"http://52.196.208.172:8080/Coverage"
    },
    dynamic: {
        CMSSearch: function() {
            return String.format("http://140.92.88.92:38080/CMSSearch/CMSSearch?lon={0}&lat={1}&range=5000&datetime=201506192321&type=1", myCenter.lat, myCenter.lng);
        },
        TaipeiCamera: function() {
            return String.format("http://140.92.88.92:38080/TaipeiCamera/TaipeiCamera?lon={0}&lat={1}&range={2}&datetime=201506192321&type=1", myCenter.lat, myCenter.lng, range);
        },
        //"parking": "http://140.92.88.92:38080/ParkingSearch/ParkingSearch?lon=121.564561&lat=25.033327&range=2000",
        parking: function() {
            return String.format("http://140.92.88.92:38080/ParkingSearch/ParkingSearch?lon={0}&lat={1}&range={2}", myCenter.lat, myCenter.lng, range);
        },
        TaipeiVD: function() {
            return String.format("http://140.92.88.92:38080/TaipeiVD/TaipeiVD?lon={0}&lat={1}&type=go", myCenter.lat, myCenter.lng);
        },
        TrafficEvent: function() {
            var path = String.format("trafficevent?lat={0}&lon={1}&range={2}&uuid=1234567777", myCenter.lat, myCenter.lng, "50000");
            var targetUrl = BaseUrl + path;
            //console.log('TrafficEvent:');
            //console.log(targetUrl);
            return targetUrl;
        },
        convenient: function() {
            var period = timetype.indexOf(formItems.timetype);
            var ConvPar = getConvPar();
            var path = String.format("poiinfo?lat={0}&lon={1}&range={2}&uuid=1234567777&period={3}{4}", myCenter.lat, myCenter.lng, range, period, ConvPar);
            var targetUrl = BaseUrl + path;
            //console.log('convenient:');
            //console.log(targetUrl);
            return targetUrl;
            //return String.format("http://52.196.208.172:8080/PoiInfo?lon={0}&lat={1}&range=50000{2}", myCenter.lat, myCenter.lng,"&toilet=1&oil=1&rest=1&carFactory=1&hospital=1&police=1&carWasher=1&alarmRoad=1&public=1");
            //return String.format("http://52.196.208.172:8080/PoiInfo?lat=25.038189&lon=121.532990&range=2000{2}", myCenter.lat, myCenter.lng, ConvPar);
        },
        trafficFlow: function() {
            var period = timetype.indexOf(formItems.timetype);
            var path = String.format("roadinfo?lat={0}&lon={1}&uuid=1234567777&period={2}", myCenter.lat, myCenter.lng, period);
            //console.log('trafficFlow:');
            //console.log(path);
            var targetUrl = BaseUrl + path;
            return targetUrl;
        },
        //json_paths.dynamic.roadSpeed
        roadSpeed: function(latLng) {
            var path = String.format("roadspeed?uuid=1234567777&lat={0}&lon={1}", latLng.lat(), latLng.lng())
            var targetUrl = BaseUrl + path;
            return targetUrl;
            /*
            $.getJSON(targetUrl, function(json) {
                console.log('roadSpeed: ' + targetUrl);
                console.log(json);
            });*/
        },
        //json_paths.dynamic.parkingInfo
        parkingInfo: function() {
            var period = timetype.indexOf(formItems.timetype);
            var path = String.format("parkinginfo?lat={0}&lon={1}&range={2}&period={3}&hourly=0&vendor=0&uuid=1234567777", myCenter.lat, myCenter.lng, range, period);
            var targetUrl = BaseUrl + path;
            //console.log('parkingInfo:');
            //console.log(targetUrl);
            return targetUrl;
        },
        //json_paths.dynamic.routePlan
        routePlan: function() {
            var path = String.format("routeplan?srclon={0}&srclat={1}&dstlon={2}&dstlat={3}", start.lng, start.lat, destination.lng, destination.lat);
            var targetUrl = BaseUrl + path;
            return targetUrl;
        }
    }
};
var json_path = json_paths.instant;
//console.log(json_path);
var origin = new google.maps.Point(0, 0);
var searchMarkerScaleSize = new google.maps.Size(50, 50);
var searchMarkerAnchor = new google.maps.Point(21, 34);
var iconSize = new google.maps.Size(29, 39);
var iconAnchor = new google.maps.Point(14.5, 37);
var eventMarkerSize = new google.maps.Size(42, 50);
var eventMarkerAnchor = new google.maps.Point(21, 46);
var parkingMarkerSize = new google.maps.Size(34, 47);
var parkingMarkerAnchor = new google.maps.Point(17, 47);
var parkingLabelAnchor = new google.maps.Point(20, 37);
var speedMarkerSize = new google.maps.Size(34, 38);
var speedMarkerAnchor = new google.maps.Point(17, 38);
var speedLabelAnchor = new google.maps.Point(20, 29);
var navigationAnchor = new google.maps.Point(17, 34);
var navigationSize = new google.maps.Size(20, 35);


var markerIcons = {
    event: {
        url: "/img/markers/sign01@2x.png",
        scaledSize: eventMarkerSize
    },
    events: [{
        //1.阻塞
        url: "/img/markers/sign03@2x.png",
        scaledSize: eventMarkerSize
    }, {
        //2.事故
        url: "/img/markers/sign02@2x.png",
        scaledSize: eventMarkerSize
    }, {
        //3.道路施工
        url: "/img/markers/sign06@2x.png",
        scaledSize: eventMarkerSize
    }, {
        //4.交通障礙
        url: "/img/markers/sign07@2x.png",
        scaledSize: eventMarkerSize
    }, {
        //5.交通管制
        url: "/img/markers/sign08@2x.png",
        scaledSize: eventMarkerSize
    }, {
        //6.號誌故障
        url: "/img/markers/sign05@2x.png",
        scaledSize: eventMarkerSize
    }, {
        //7.災變
        url: "/img/markers/sign09@2x.png",
        scaledSize: eventMarkerSize
    }, {
        //8.其他
        url: "/img/markers/sign01@2x.png",
        scaledSize: eventMarkerSize
    }],
    parking: "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=P|5796cf|444444",
    cms: "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=S|58ac45|444444",
    camera: "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=C|0099ff|444444",
    vd: "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=V|ff66cc|444444",
    oil: {
        url: "/img/markers/sign-info01.png",
        scaledSize: iconSize //new google.maps.Size(29, 39)
    },
    toilet: {
        url: "/img/markers/sign-info02.png",
        scaledSize: iconSize //new google.maps.Size(29, 39)
    },
    carFactory: {
        url: "/img/markers/sign-info03.png",
        scaledSize: iconSize //new google.maps.Size(29, 39)
    },
    hospital: {
        url: "/img/markers/sign-info05.png",
        scaledSize: iconSize //new google.maps.Size(29, 39)
    },
    rest: {
        url: "/img/markers/sign-info07.png",
        scaledSize: iconSize //new google.maps.Size(29, 39)
    },
    carWasher: {
        url: "/img/markers/sign-info04.png",
        scaledSize: iconSize //new google.maps.Size(29, 39)
    },
    police: {
        url: "/img/markers/sign-info06.png",
        scaledSize: iconSize //new google.maps.Size(29, 39)
    },
    speed: {
        //url: "img/markers/pin-speed-pink-hdpi.png",
        url: "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=30|58ac45|FFFFFF"
            //scaledSize: new google.maps.Size(31, 35)
            //scaledSize: new google.maps.Size(25,28)
    },
    speeds: [{
        url: "/img/markers/pin-speed-green-mdpi.png",
        anchor: speedMarkerAnchor,
        scaledSize: speedMarkerSize
    }, {
        url: "/img/markers/pin-speed-orange-mdpi.png",
        anchor: speedMarkerAnchor,
        scaledSize: speedMarkerSize
    }, {
        url: "/img/markers/pin-speed-pink-mdpi.png",
        anchor: speedMarkerAnchor,
        scaledSize: speedMarkerSize
    }, {
        url: "/img/markers/pin-speed-red-mdpi.png",
        anchor: speedMarkerAnchor,
        scaledSize: speedMarkerSize
    }],
    activeSpeeds: function(lvl, speed) {
        var color = ["58ac45", "ffad00", "ff66cc", "d94e59"];

        return String.format("https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld={0}|{1}|FFFFFF", speed, color[lvl]);
    },
    parkings: [{
        url: "/img/markers/pin-park-full.png",
        anchor: parkingMarkerAnchor,
        scaledSize: parkingMarkerSize
    }, {
        url: "/img/markers/pin-park-min.png",
        anchor: parkingMarkerAnchor,
        scaledSize: parkingMarkerSize
    }, {
        url: "/img/markers/pin-park-max.png",
        anchor: parkingMarkerAnchor,
        scaledSize: parkingMarkerSize
    }],
    startIcon: {
        url: "/img/src/pin-start.png",
        anchor: navigationAnchor,
        scaledSize: navigationSize
    },
    endIcon: {
        url: "/img/src/pin-final.png",
        anchor: navigationAnchor,
        scaledSize: navigationSize
    }
};

google.maps.Map.prototype.clearOverlays = function() {
    if (ctaLayer != null) {
        ctaLayer.setMap(null);
    }
    clearMarkers();
}

google.maps.Map.prototype.panToWithOffset = function(latlng, offsetX, offsetY) {
    //console.log(offsetY);
    var map = this;
    var ov = new google.maps.OverlayView();
    ov.onAdd = function() {
        var proj = this.getProjection();
        var aPoint = proj.fromLatLngToContainerPixel(latlng);
        aPoint.x = aPoint.x + offsetX;
        aPoint.y = aPoint.y + offsetY;
        map.panTo(proj.fromContainerPixelToLatLng(aPoint));
    };
    ov.draw = function() {};
    ov.setMap(this);
};

function getConvPar() {
    var checkedValues = getCheckedValues('rdo-conv');
    var paramString = "";
    if (checkedValues.indexOf("all") > -1) {
        checkedValues = getAllValues('rdo-conv');
    }
    $.each(checkedValues, function(index, value) {
        if (value !== "all") {
            paramString += String.format("&{0}=1", value);
        }
    });
    return paramString;
}

function clearMarkers() {
    if (markersArray) {
        for (var i = 0; i < markersArray.length; i++) {
            markersArray[i].setMap(null);
        }
    }
    markersArray = [];
}

function setParkingInfo() {
    if (parking) {
        $('#park').removeClass('enabled');
        parking = false;
    } else {
        $('#park').addClass('enabled');
        parking = true;
    }
    redraw();
}



function setCMSInfo() {
    if (cms) {
        $('#cms').removeClass('enabled');
        cms = false;
    } else {
        $('#cms').addClass('enabled');
        cms = true;
    }
    redraw();
}



function setCameraInfo() {
    if (camera) {
        $('#camera').removeClass('enabled');
        camera = false;
    } else {
        $('#camera').addClass('enabled');
        camera = true;
    }
    redraw();
}


function setTPEGInfo() {
    if (tpeg) {
        $('#tpeg').removeClass('enabled');
        tpeg = false;
    } else {
        $('#tpeg').addClass('enabled');
        tpeg = true;
    }
}

function setVDInfo() {
    if (vd) {
        $('#vd').removeClass('enabled');
        vd = false;
    } else {
        $('#vd').addClass('enabled');
        vd = true;
    }
    redraw();
}


function setTrafficEvent() {
    if (mapFlags.event) {
        $('#event').removeClass('enabled');
        mapFlags.event = false;
    } else {
        $('#event').addClass('enabled');
        mapFlags.event = true;
    }
    redraw();
}



function setTrafficFlow() {
    if (mapFlags.trafficFlow) {
        $('#road').removeClass('enabled');
        mapFlags.trafficFlow = false;
    } else {
        $('#road').addClass('enabled');
        mapFlags.trafficFlow = true;
    }
    redraw();
}

function addMarkerWithInfo(myLatlng, info, icon, thisMap) {

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: thisMap,
        icon: icon,
        title: info.title
    });

    google.maps.event.addListener(marker, 'click', function() {
        var markerPosition = marker.getPosition();
        showModal(info, markerPosition);
    });
    markersArray.push(marker);
}

function addMarkerListener(marker, info) {
    console.log("Add Marker Listen");
    google.maps.event.addListener(marker, 'click', function() {
        var markerPosition = marker.getPosition();
        showModal(info, markerPosition);
        destination.lat = markerPosition.lat();
        destination.lng = markerPosition.lng();
    });
    markersArray.push(marker);
}

function showModal(info, markerPosition) {
    console.log("Show Ordinary Modal");
    $('#modal-wrap').addClass('hidden');
    modal.title = info.title;
    modal.exinfo = info.exinfo;
    modal.exdetail = info.exdetail;
    modal.setup();

    $('#modal-wrap').css('opacity', 0);
    $('#modal-wrap').removeClass('hidden');
    $('#modal-wrap').animate({
        opacity: 1
    }, 300);
    modal.center();
    var modalHeight = $('.modal-app-msg').height();
    //window.setTimeout(function() {
    map.panToWithOffset(markerPosition, -1, modalHeight * -1 / 2 - 55);
    //}, 1000);
    //window.setTimeout(function() {
    $('#modal-pointer').css('opacity', 0);
    $('#modal-pointer').removeClass('hidden');
    $('#modal-pointer').animate({
        opacity: 1
    }, 300);
    //}, 500);
}
function directNavigation(){
  $('#')
  mapShow.routePlan();
  showNavigationModal();
}
//navigate modal
function setUpNavigation() {
    $('#navigate-modal-footer').removeClass('hidden');
    $('#navigation-input').removeClass('hidden');
    $('#routeInfo').addClass('hidden');
    $('#modal-routeSearch').removeClass('hidden');
    //set origin searchBox
    var origin_input = document.getElementById('origin-input');
    var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
    origin_autocomplete.bindTo('bounds', map);

    //set destination searchBox
    var destination_input = document.getElementById('destination-input');
    var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
    destination_autocomplete.bindTo('bounds', map);
    showNavigationModal();

    //Listen to User input
    origin_autocomplete.addListener('place_changed', function() {
        var place = origin_autocomplete.getPlace();
        if (!place.geometry) {
            return;
        } else {
            start.lat = place.geometry.location.lat();
            start.lng = place.geometry.location.lng();
        }
    });
    destination_autocomplete.addListener('place_changed', function() {
        var place = destination_autocomplete.getPlace();
        if (!place.geometry) {
            return;
        } else {
            destination.lat = place.geometry.location.lat();
            destination.lng = place.geometry.location.lng();
        }
    });

    $('#modal-routeSearch').click(function() {
        mapShow.routePlan();
        $('#navigate-modal-footer').addClass('hidden');
    });

    $('#modal-navigate-dismiss').click(function() {
        $('#navigation-modal').addClass('hidden');
    });
}

function showNavigationModal() {
    console.log("Show Navigate Modal");
    $('#modal-wrap').addClass('hidden');
    $('#navigation-modal').css('opacity', 0);
    $('#navigation-modal').removeClass('hidden');
    $('#navigation-modal').animate({
        opacity: 1
    }, 300);
    modal.setNavigationModalCenter();
    var modalHeight = $('.modal-app-msg').height();
}
//modify Navigation Modal
function modifyNavigationModal(json) {
    var routeInfo = "";
    //Fastest Route info
    var fastestRoute = "";
    fastestRoute += String.format("<div id=\"fastestRoute\"><a href=\"#\"><h2>路徑1-最快到達</h2><p>{0}分鐘<span> {1} 公里</span></p></a></div>", json.fastest.time, json.fastest.length);
    // Shortest Route info
    var shortestRoute = "";
    shortestRoute += String.format("<div id=\"shortestRoute\"><a href=\"#\"><h2>路徑2-最短距離</h2><p>{0}分鐘<span> {1} 公里</span></p></a></div>", json.shortest.time, json.shortest.length);
    routeInfo = fastestRoute + shortestRoute;
    $('#navigation-modal').find('#routeInfo').prop('innerHTML', routeInfo);
    $('#navigate-modal-footer').addClass('hidden');
    $('#modal-routeSearch').addClass('hidden');
    //$('#modal-navigate').removeClass('hidden');
    $('#routeInfo').removeClass('hidden');
    $('#navigation-input').addClass('hidden');
}

var mapShow = {
    //mapShow.TrafficEvent
    TrafficEvent: function() {
        if (formItems.eventCat && formItems.eventCat !== "none") {
            $.getJSON(json_path.TrafficEvent, function(json) {
                //var exImage = "icon/ex.html";
                for (var i in json) {
                    var thisj = json[i];
                    var thisMap = null;
                    var myLatlng = new google.maps.LatLng(thisj.latitude, thisj.longitude);
                    //var info = "事件主類別: " + json[i].type + "\n" + "發生時間: " + json[i].happen_time + "\n" + "路段一: " + json[i].road1 + "\n" + "路段二: " + json[i].road2 + "\n" + "說明: " + json[i].comment + "\n" + "事件次類別: " + json[i].name;
                    var info = {};
                    info.title = "事件: " + thisj.type;
                    info.exinfo = {
                        text: ""
                    };
                    info.exdetail = [{
                        name: "編號: ",
                        value: thisj.event_id
                    }, {
                        name: "來源: ",
                        value: thisj.source
                    }, {
                        name: "可靠度: ",
                        value: thisj.reliability
                    }, {
                        name: "資訊: ",
                        value: thisj.comment
                    }, {
                        name: "區域: ",
                        value: thisj.area
                    }];

                    var icon = markerIcons.event;
                    var event_type = json[i].event_type;
                    if (event_type && event_type > 0 && event_type < 10) {
                        icon = markerIcons.events[event_type - 1];
                    }

                    switch (formItems.eventCat) {
                        case "official":
                            if (json[i].source === "公部門") {
                                //markersArray.push(marker);
                                thisMap = map;
                            } else {
                                thisMap = null;
                            }
                            break;
                        case "by-passers":
                            if (json[i].source === "用路人回報") {
                                //markersArray.push(marker);
                                thisMap = map;
                            } else {
                                thisMap = null;
                            }
                            break;
                        case "conversion":
                            if (json[i].source === "速率轉事件") {
                                //markersArray.push(marker);
                                thisMap = map;
                            } else {
                                thisMap = null;
                            }
                            break;
                        default:
                            thisMap = map;
                            break;
                    }

                    addMarkerWithInfo(myLatlng, info, icon, thisMap);

                }
            });
        }

    },
    //mapShow.trafficFlow
    trafficFlow: function() {
        if (json_path.trafficFlow.indexOf('Please provide correct') > -1) {
            showDialog('無法以目前的座標查詢路況!\n請嘗試放大地圖對市區道路做查詢!')
            return;
        }
        ctaLayer = new google.maps.KmlLayer({
            url: json_path.trafficFlow,
            map: map,
            preserveViewport: true
        });
        //ctaLayer.setMap(map);
        google.maps.event.addListener(ctaLayer, 'click', function(kmlEvent) {
            console.log('kmlEvent:');
            console.log(kmlEvent.latLng);
            mapShow.roadSpeed(kmlEvent.latLng);
        });
    },
    //mapShow.DynamicTrafficFlow
    DynamicTrafficFlow: function() {
        var path = json_paths.dynamic.trafficFlow();
        console.log(path);
        $.getJSON(path, function(json) {
            if (json) {
                json_path.trafficFlow = json;
                console.log('trafficFlow:');
                console.log(json_path.trafficFlow);
            }
        }).done(function() {
            if (mapFlags.trafficFlow) {
                mapShow.trafficFlow();
            }
        });

        return path;
    },
    //mapShow.routePlan
    routePlan: function() {
        var path = json_paths.dynamic.routePlan();
        console.log(path);
        $.getJSON(path, function(json) {
            if (json)
                modifyNavigationModal(json);
            $('#fastestRoute').click(function() {
                console.log("Fastest Route");
                json_path.routePlan = json.fastest.kml;
                mapShow.navigate();
                mapShow.timer(json.fastest.time);
            });
            $('#shortestRoute').click(function() {
                console.log("Shortest Route");
                json_path.routePlan = json.shortest.kml;
                mapShow.navigate();
                mapShow.timer(json.shortest.time);
            });
        });
    },
    //mapShow.navigate
    navigate: function() {
        google.maps.Map.prototype.clearOverlays();
        ctaLayer = new google.maps.KmlLayer({
            url: json_path.routePlan,
            map: map,
            preserveViewport: true
        });
        console.log(ctaLayer.url);
        //push start & end marker
        markersArray.push(new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(start.lat, start.lng),
            icon: markerIcons.startIcon
        }));
        markersArray.push(new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(destination.lat, destination.lng),
            icon: markerIcons.endIcon
        }));
        google.maps.event.addListener(ctaLayer, 'click', function(kmlEvent) {
            console.log('kmlEvent:');
            console.log(kmlEvent.latLng);
            mapShow.roadSpeed(kmlEvent.latLng);
        });
        $('#navigation-modal').addClass('hidden');
        map.panTo(start);
        map.setZoom(16);
    },
    //mapShow.timer
    timer: function(json){
      console.log("show timer");
      $('#timer').removeClass('hidden');
      var timerDiv = "";
      timerDiv += String.format("<h2>預估<big>{0}</big>分後到達</h2>",json);
      $('#timer').prop('innerHTML',timerDiv);
    },
    //mapShow.ParkingInfo
    ParkingInfo: function() {
        $.getJSON(json_path.parkingInfo, function(json) {

            console.log('Parking');
            console.log(json);
            for (var i in json) {
                var thisJ = json[i];
                var myLatlng = new google.maps.LatLng(thisJ.latitude, thisJ.longitude);
                var hourly = thisJ.hourly;
                var hourlyInt = parseInt(thisJ.hourly) || -1;
                var available = thisJ.available;
                var icon = markerIcons.parkings[0];
                if (available) {
                    if (available > 0 && available <= 5) {
                        icon = markerIcons.parkings[1];
                    } else if (available > 5) {
                        icon = markerIcons.parkings[2];
                    } else {
                        icon = markerIcons.parkings[0];
                    }
                }

                if (hourly && hourly !== "N/A") {
                    hourly = '$' + hourly;
                } else {
                    hourly = 'n/a';
                }

                var access = "無";
                if (thisJ.access == 1) {
                    access = "有";
                } else if (thisJ.access == 0) {
                    access = "無";
                } else {
                    access = thisJ.access;
                }

                var type = "";
                switch (thisJ.type) {
                    case 1:
                        type = "公營";
                        break;
                    case 2:
                        type = "嘟嘟房";
                        break;
                    case 3:
                        type = "台灣聯通";
                        break;
                    case 4:
                        type = "便利";
                        break;
                    case 5:
                        type = "福慧網";
                        break;
                    case 6:
                        type = "times";
                        break;
                    case 99:
                        type = "其他";
                        break;
                    default:
                        type = thisJ.type;
                        break;
                }

                var feeType = "";
                switch (thisJ.feetype) {
                    case 1:
                        feeType = "按時計費";
                        break
                    case 2:
                        feeType = "按次計費";
                        break
                    default:
                        feeType = "";
                        break
                }
                var info = {};
                info.title = thisJ.name;
                info.exinfo = {
                    text: "每小時 {0} 元",
                    num: hourly
                }
                info.exdetail = [

                    {
                        name: "地址: ",
                        value: thisJ.address
                    }, {
                        name: "剩餘車位: ",
                        value: thisJ.available
                    }, {
                        name: "總車位數: ",
                        value: thisJ.total
                    }, {
                        name: "收費上限: ",
                        value: thisJ.feelimit
                    }, {
                        name: "計費方式: ",
                        value: feeType
                    }, {
                        name: "收費資訊: ",
                        value: thisJ.detail
                    }, {
                        name: "營業時間: ",
                        value: thisJ.open
                    }, {
                        name: "無障礙服務: ",
                        value: access
                    }, {
                        name: "停車場業者: ",
                        value: type
                    }, {
                        name: "型態: ",
                        value: thisJ.subType
                    }, {
                        name: "限高: ",
                        value: thisJ.height
                    }, {
                        name: "TEL: ",
                        value: thisJ.tel
                    }
                ];


                if (formItems.parkingType !== "all") {
                    if (formItems.parkingType != thisJ.type) {
                        continue;
                    }
                }

                if (formItems.parkingHourly !== "all") {
                    if (hourlyInt < 0) {
                        continue;
                    } else if (hourlyInt <= 30) {
                        if (formItems.parkingHourly != "30") {
                            continue;
                        }
                    } else if (hourlyInt > 30 && hourlyInt <= 60) {
                        if (formItems.parkingHourly != "60") {
                            continue;
                        }
                    } else if (hourlyInt > 60 && hourlyInt <= 90) {
                        if (formItems.parkingHourly != "90") {
                            continue;
                        }
                    } else if (hourlyInt > 90) {
                        if (formItems.parkingHourly != "above") {
                            continue;
                        }
                    }
                }

                var marker = new MarkerWithLabel({
                    position: myLatlng,
                    map: map,
                    icon: icon,
                    labelContent: hourly,
                    //labelAnchor: new google.maps.Point(22, 0),
                    labelClass: "labels-parking", // the CSS class for the label
                    labelAnchor: parkingLabelAnchor,
                    title: info.title
                        //label: "HOW",
                });

                addMarkerListener(marker, info);
            }
        });
    },
    //mapShow.CMSInfo
    CMSInfo: function() {

        $.getJSON(json_path.CMSSearch, function(json) {
            //http://140.92.88.92:38080/CMSSearch/CMSSearch?type=1
            for (var i in json) {
                var myLatlng = new google.maps.LatLng(json[i].y, json[i].x);
                var info = "設備編號: " + json[i].id + "\n" + "位置: " + json[i].location + "\n" + "內容: " + json[i].content;
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    /*
                    icon: {
                        //url : "icon/black.png",
                        url: markerIcons.cms,
                        //anchor:
                        scaledSize: new google.maps.Size(30,30)
                    },*/
                    icon: markerIcons.cms,
                    title: info
                });
                markersArray.push(marker);
            }
        });
    },
    //mapShow.CameraInfo
    CameraInfo: function() {

        $.getJSON(json_path.TaipeiCamera, function(json) {

            //var parkingImage = "icon/cam.html";
            for (var i in json) {
                var myLatlng = new google.maps.LatLng(json[i].y, json[i].x);
                var info = "設備編號: " + json[i].id + "\n" + "位置: " + json[i].location;
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    /*
                    icon: {
                        //url : "icon/blue.png",
                        url: markerIcons.camera,
                        //anchor:
                        scaledSize: new google.maps.Size(30,30)
                    },*/
                    icon: markerIcons.camera,
                    title: info
                });
                markersArray.push(marker);
            }
        });
    },
    //mapShow.VDInfo
    VDInfo: function() {

        $.getJSON(json_path.TaipeiVD, function(json) {
            //var parkingImage = "icon/vd.html";
            for (var i in json) {
                var thisJ = json[i];
                var myLatlng = new google.maps.LatLng(thisJ.y, thisJ.x);
                //var info = "設備編號: " + json[i].id + "\n" + "位置: " + json[i].location + "\n" + "資料時間: " + json[i].exchange_time + "\n" + "車流平均速度: " + json[i].speed;
                var info = {};
                info.title = '';
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    icon: markerIcons.vd,
                    title: info.title
                });
                markersArray.push(marker);
            }
        });
    },
    //mapShow.convenient
    convenient: function() {
        //var parking_json_url = "http://140.92.88.92:38080/ParkingSearch/ParkingSearch?lon=121.564561&amp;lat=25.033327&amp;range=50000";
        //var parking_json_url = "http://140.92.88.92:38080/ParkingSearch/ParkingSearch?lon=121.564561&lat=25.033327&range=2000";
        var AllValues = getCheckedValues('rdo-conv');

        $.getJSON(json_path.convenient, function(json) {
            $.each(AllValues, function(index, value) {
                var jsonVal = json[value];
                if (jsonVal && jsonVal !== undefined && jsonVal.length > 0) {
                    /*$.each(jsonVal, function(i,value) {

                    });*/
                    for (var i in jsonVal) {
                        var thisJ = jsonVal[i];
                        var myLatlng = new google.maps.LatLng(thisJ.lat, thisJ.lon);
                        var info = {};
                        var icon = markerIcons[value];
                        if (!icon) {
                            icon = markerIcons["parking"];
                        }
                        switch (value) {
                            case "hospital":
                                info.title = thisJ.name;
                                info.exinfo = {
                                    text: ""
                                };
                                info.exdetail = [{
                                    name: "資訊類別: ",
                                    value: thisJ.type
                                }, {
                                    name: "地址: ",
                                    value: thisJ.address
                                }];

                                break;
                            default:

                                //jsonVal[i].name; // + " 空位:" + jsonVal[i].available;
                                //info.title = thisJ.type + ': ' + thisJ.name;
                                info.title = thisJ.name;
                                info.exinfo = {
                                    text: ""
                                };
                                info.exdetail = [{
                                    name: "類別: ",
                                    value: thisJ.type
                                }, {
                                    name: "地址: ",
                                    value: thisJ.address
                                }];

                        }
                        var marker = new google.maps.Marker({
                            position: myLatlng,
                            map: map,
                            icon: icon,
                            title: info.title
                        });

                        addMarkerListener(marker, info);
                    }
                }
            });
        });

    },
    //mapShow.roadSpeed
    roadSpeed: function(latLng) {
        json_path.roadSpeed = json_paths.dynamic.roadSpeed(latLng);
        $.getJSON(json_path.roadSpeed, function(json) {
            var arr = json.split(',');
            if (!arr.length || arr.length < 5) {
                showDialog('伺服器資料錯誤!')
            }
            var lat = arr[0];
            var lng = arr[1];
            var speed = arr[2];
            var roadName = arr[3];
            var lvl = arr[4];

            var dataObj = decode(lat, lng, speed);
            lat = dataObj.lat;
            lng = dataObj.lon;
            speed = dataObj.speed;

            console.log(arr);
            console.log(dataObj);
            console.log(latLng);

            var info = {};
            info.title = roadName;
            info.exinfo = {
                text: "時速 {0} 公里",
                num: speed
            }
            info.exdetail = [{
                name: "速率等級: ",
                value: lvl
            }];

            var icon = markerIcons.speeds[lvl];
            var marker = new MarkerWithLabel({
                position: latLng,
                map: map,
                icon: icon,
                labelContent: speed,
                labelClass: "labels", // the CSS class for the label
                labelAnchor: speedLabelAnchor,
                title: info.title
            });
            addMarkerListener(marker, info);
        });
    },
}

function decode(lat, lon, speed) {
    var decodeObj = {
        lat: 0,
        lon: 0,
        speed: 0
    };

    lat /= 514229;
    lat -= 7654321;
    var latData = lat / 1000000;
    decodeObj.lat = latData;
    lon /= 426389;
    lon += 87654321;
    var lonData = lon / 1000000;
    decodeObj.lon = lonData;
    speed -= 57;
    if (speed >= 0 && speed <= 99) {
        var a = speed / 10;
        var b = speed % 10;
        speed = b * 10 + a;
        speed = Math.ceil(speed);
        decodeObj.speed = speed;
    } else {
        decodeObj.speed = speed;
    }
    return decodeObj
}

function redraw() {

    console.log('redraw');

    var show = false;
    if (mapFlags.event) {
        mapShow.TrafficEvent();
        show = true;
    }
    if (mapFlags.parking) {
        mapShow.ParkingInfo();
        show = true;
    }
    if (mapFlags.cms) {
        mapShow.CMSInfo();
        show = true;
    }
    if (mapFlags.camera) {
        mapShow.CameraInfo();
        show = true;
    }
    if (mapFlags.vd) {
        mapShow.VDInfo();
        show = true;
    }
    if (mapFlags.convenient) {
        mapShow.convenient();
        show = true;
    }
    if (mapFlags.trafficFlow) {
        show = true;
    }

    if (!show) {
        showDialog('未選擇顯示項目，標記已清空!');
    } else {
        console.log("顯示標記項目");
    }
    //hide timer
    $('#timer').addClass('hidden');

}

function showDialog(msg) {
    $('#confirm-dialog p').prop('innerHTML', msg);
    $("#confirm-dialog").dialog("open");
}

function showDialogCalender() {
    //$('#form-dialog').find('fieldset').prop('innerHTML', $('#calender-wrap').html());
    $("#form-dialog").dialog("open");
}



$.fn.extend({
    //draw coverage table
    drawTable: function() {
      console.log("Draw");
        $(this).empty();
        $(this).addClass('simple-data-grid');
        $(this).append("<thead><tr></tr></thead>");
        $(this).append("<tbody><tr></tr></tbody>");
        var target = $(this);

        $.getJSON(json_path.coverage, function(json) {
          console.log("coverage json");
          var countyLength = Object.keys(json).length;
            if (json && Object.keys(json).length > 0) {
              var county = "";
              var coverage = "";
              county = Object.keys(json).toString().split(",");
              coverage = Object.values(json).toString().split(",");
              for( var i = 1; i < countyLength ; i++){
                $(target).find("thead").find("tr").append(String.format('<th data-key="{0}" class="sdg-col_{0}">{0}</th>',county[i]));
                $(target).find("tbody").find("tr").append(String.format('<td class="sdg-col_{0}">{1}</td>', county[i],coverage[i]));
              }
            }
        });
    }
});


function SetCenter() {
    //var gCenter = map.getCenter();
    myCenter.lat = map.getCenter().lat().toFixed(8);
    myCenter.lng = map.getCenter().lng().toFixed(8);
    console.log('center:' + myCenter.lat + ', ' + myCenter.lng);
    json_path.CMSSearch = json_paths.dynamic.CMSSearch();
    json_path.TaipeiCamera = json_paths.dynamic.TaipeiCamera();
    json_path.parking = json_paths.dynamic.parking();
    json_path.TaipeiVD = json_paths.dynamic.TaipeiVD();
    json_path.TrafficEvent = json_paths.dynamic.TrafficEvent();
    json_path.convenient = json_paths.dynamic.convenient();
    //json_path.trafficFlow = json_paths.dynamic.trafficFlow();
    json_path.parkingInfo = json_paths.dynamic.parkingInfo();
    //json_path.roadSpead = json_paths.dynamic.roadSpead();
    //json_paths.dynamic.trafficFlow();
    json_path.routePlan = json_paths.dynamic.routePlan();

}


function drawDataTable() {
    var infoCat = $("#info-category").val();
    switch (infoCat) {
        case 'county':
            $('#coverage-table').drawTable();
            break;
        case 'roads':
            $('#coverage-table').drawTable();
            break;
    }
}

function onselectmenuchange(event, ui) {
    //alert('hi');
    console.log(ui.item.value);
}


function getCheckedValues(name) {
    var checkedValues = $("input[name='" + name + "']:checked").map(function() {
        return this.value;
    }).get();
    return checkedValues;
}

function getAllValues(name) {
    var allValues = $("input[name='" + name + "']").map(function() {
        if (this.value !== "all")
            return this.value;
    }).get();
    return allValues;
}

function getCheckedValuesWithoutAll(name) {
    var withoutAll = jQuery.grep(getCheckedValues(name), function(value) {
        return (value !== "all");
    });
    return withoutAll;
}

$(window).load(function() {
    //$('#row-top').height($('#row-top').height());
    //$('fieldset.hidden').removeClass('hidden');
});


function syncDateTime() {
    var date = $("#calendar").val();
    var hh = $('#hour-spinner').val();
    if (!hh) {
        hh = 0;
    }
    if (hh < 10) {
        hh = '0' + hh;
    }
    var mm = $('#minute-spinner').val();
    if (!mm) {
        mm = 0;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    $('#lbl-datetime').text(date + ' ' + hh + ':' + mm);
}

function syncDateTime2() {
    var date = $("#calendar2").val();
    $('#lbl-datetime2').text(date);
}

/*function StartPositionSetUp() {
    var input = document.getElementById('start-input');
    var searchBox = new google.maps.places.SearchBox(input);
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        places.forEach(function(place) {
            var icon = {
                url: "/img/src/location.png",
                origin: origin,
                anchor: searchMarkerAnchor,
                scaledSize: searchMarkerScaleSize
            };

            // Create a marker for each place.
            var marker = new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            });
            markersArray.push(marker);
            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}*/

function CreateSearchBox() {
    //Create searchBox on the map
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        clearMarkers();
        console.log(markersArray.length);

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            var info = [];
            info.title = place.name;
            info.exinfo = {
                text: ''
            };
            info.exdetail = [{
                name: '電話：',
                value: place.formatted_phone_number
            }, {
                name: '地址：',
                value: place.formatted_address
            }];
            var icon = {
                url: "/img/src/location.png",
                origin: origin,
                anchor: searchMarkerAnchor,
                scaledSize: searchMarkerScaleSize
            };

            // Create a marker for each place.
            var marker = new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            });
            addMarkerListener(marker, info);

            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });

}
$(document).ready(function() {
    CreateSearchBox();
    //$('#col-left').height($('#col-left').height());

    var dt = new Date();
    var dthr = dt.getHours();
    var dtmin = dt.getMinutes();
    dtmin = parseInt(dtmin / 5) * 5;

    $("#hour-spinner").spinner({
        max: 23,
        min: 0,
        spin: function() {
            syncDateTime();
        }
    }).val(dthr);
    $("#hour-spinner2").spinner({
        max: 23,
        min: 0,
        spin: function() {
            syncDateTime2();
        }
    }).val(dthr);
    $("#minute-spinner").spinner({
        max: 55,
        min: 0,
        step: 5,
        spin: function() {
            syncDateTime();
        }
    }).val(dtmin);
    $("#minute-spinner2").spinner({
        max: 55,
        min: 0,
        step: 5,
        spin: function() {
            syncDateTime2();
        }
    }).val(dtmin);

    //$('fieldset.hidden').removeClass('hidden');
    $("#tabs").tabs({
        active: 0
    });

    $("#confirm-dialog").dialog({
        autoOpen: false,
        show: {
            duration: 100
        },
        hide: {
            duration: 100
        },
        modal: true,
        buttons: {
            Ok: function() {
                $(this).dialog("close");
            }
        }
    });

    $("#form-dialog").dialog({
        width: 360,
        height: 518,
        autoOpen: false,
        show: {
            duration: 100
        },
        hide: {
            duration: 100
        },
        modal: true,
        buttons: {
            Ok: function() {
                $(this).dialog("close");
                $('#lbl-time-left').text($('#lbl-datetime').text());
                $('#lbl-datetime-caption').text($('#lbl-datetime-caption-dialog').text());
                $('#datetime-table').removeClass('hidden');
            }
        }
    });

    $('#calendar').datepicker({
        inline: true,
        firstDay: 1,
        showOtherMonths: true,
        dateFormat: "yy/mm/dd",
        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
        onSelect: function(dateText, inst) {
            syncDateTime();
        }
    });
    $('#calendar2').datepicker({
        inline: true,
        firstDay: 1,
        showOtherMonths: true,
        dateFormat: "yy-mm-dd",
        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
        onSelect: function(dateText, inst) {
            syncDateTime2();
        }
    });
    $("input[name='rdo-time']:first").prop("checked", true);
    $("input[name='rdo-time']").checkboxradio({
        icon: false
    });
    //$("input[name='rdo-conv']:first").prop("checked", true);
    $("input[name='rdo-conv']").checkboxradio({
        icon: false
    });

    $("#data-category").selectmenu();
    $("#event-category").selectmenu();
    $("#info-selector").selectmenu();
    $("#info-category").selectmenu();
    $("#parking-hourly").selectmenu();
    $("#parking-type").selectmenu();
    $("#info-category").on("selectmenuchange", drawDataTable);

    //joseph
    $("#fleet-category").selectmenu();
    $("#fleet-category").on("selectmenuchange", fleetinfo);

    //$("fieldset").controlgroup();

    $("input[name='rdo-time']").on('change', function(e) {
        console.log($("input[name='rdo-time']:checked").val());
        syncDateTime();
        var value = $("input[name='rdo-time']:checked").val();
        if (value == "history") {
            $('#calender-wrap').removeClass('hidden');
            $('#calender-wrap').effect("highlight", {}, 1000);
            showDialogCalender();
        } else {
            $('#calender-wrap').addClass('hidden');
            $('#datetime-table').addClass('hidden');
        }
    });

    $("input[name='rdo-conv']").on('change', function() {
        if ($(this).attr("value") == "all") {
            if ($(this).prop('checked') !== true) {
                $('#flipswitch').switchButton({
                    checked: false
                });
                $('input[name="rdo-conv"]').prop("checked", false).checkboxradio('refresh');
            }
        } else {
            var withoutAll = getCheckedValuesWithoutAll('rdo-conv');
            if (withoutAll.length == 7) {
                $('#rdo-conv-1').prop('checked', true).checkboxradio('refresh');
            } else {
                $('#rdo-conv-1').prop('checked', false).checkboxradio('refresh');
            }
        }
        tempcheckedValues = getCheckedValues('rdo-conv');
        if (tempcheckedValues.indexOf("all") > -1) {
            $('#flipswitch').switchButton({
                checked: true
            });
            $('input[name="rdo-conv"]').prop('checked', true).checkboxradio('refresh');

        } else if (tempcheckedValues.length > 0) {
            $('#flipswitch').switchButton({
                checked: true
            });
        } else {
            $('#flipswitch').switchButton({
                checked: false
            });
        }
        checkedValues = getCheckedValues('rdo-conv');
        console.log(checkedValues);
    });

    $('#traffic-button').click(function() {
        $(this).toggleClass('on');
        if ($(this).hasClass('on')) {
            //$('fieldset')
        }
    });

    $('#event-button').click(function() {
        $(this).toggleClass('on');
        if ($(this).hasClass('on')) {
            $('#event-field').removeClass('hidden');
            /*$('#event-field').animate({
                'background-color': #CCC
            }, 300, function() {

            });*/
            $('#event-field').effect("highlight", {}, 1000);
        } else {
            $('#event-field').addClass('hidden');
        }
    });

    $('#parking-button').click(function() {
        $(this).toggleClass('on');
        if ($(this).hasClass('on')) {
            $('#parking-field').removeClass('hidden');
            $('#parking-field').effect("highlight", {}, 1000);
        } else {
            $('#parking-field').addClass('hidden');
        }
    });

    $('#vd-button').click(function() {
        $(this).toggleClass('on');
        if ($(this).hasClass('on')) {
            //$('fieldset')
        }
    });

    $("#flipswitch").switchButton({
        checked: false,
        width: 100,
        height: 40,
        button_width: 50,
        labels_placement: "right",
        show_labels: true
    });

    $('#flipswitch').change(function() {
        console.log($(this).prop('checked'));
        if ($(this).prop('checked') == false) {
            $('input[name="rdo-conv"]').prop("checked", false).checkboxradio('refresh');
        }
    });

    $("fieldset legend").click(function() {
        if ($(this).parent().children().length == 2)
            $(this).parent().find(".table-wrap").toggle();
        else {
            $(this).parent().wrapInner("<div class='table-wrap'>");
            $(this).appendTo($(this).parent().parent());
            $(this).parent().find(".table-wrap").toggle();
        }
    });

    $('.panel-buttons').click(function() {
        //$(this).toggleClass('on');
    });

    $('#calendar').change(function() {
        //alert('change');
    });

    $('#road-submit-button2').click(btn_click);

    $('#modal-btn-close').click(function() {
        $('#modal-wrap').addClass('hidden');
    });
    $('#modal-navigate-btn-close').click(function() {
        $('#navigation-modal').addClass('hidden');
    });

    $('#modal-dismiss').click(function() {
        $('#modal-wrap').addClass('hidden');
    });
    $('#navigation-button').click(function() {
        setUpNavigation();
    });
    $('#modal-goto').click(function() {
        $('#modal-wrap').addClass('hidden');
        directNavigation();
    });

    var currentDate = $(".selector").datepicker("getDate");
});


function btn_click() {
    formItems.datetime = $('#calendar').val();
    formItems.timetype = $("input[name='rdo-time']:checked").val();
    formItems.dataCat = $("#data-category").val();
    formItems.eventCat = $("#event-category").val();
    formItems.infoSelect = $("#info-selector").val();
    formItems.infoCat = $("#info-category").val();
    formItems.parkingType = $('#parking-type').val();
    formItems.parkingHourly = $('#parking-hourly').val();

    //console.log(formItems);

    if (!$('#modal-wrap').hasClass('hidden')) {
        $('#modal-wrap').addClass('hidden');
    }

    if ($('#traffic-button').hasClass('on')) {
        mapFlags.trafficFlow = true;
    } else {
        mapFlags.trafficFlow = false;
    }
    if ($('#event-button').hasClass('on')) {
        mapFlags.event = true;
    } else {
        mapFlags.event = false;
    }

    if ($('#parking-button').hasClass('on')) {
        mapFlags.parking = true;
    } else {
        mapFlags.parking = false;
    }

    if ($('#vd-button').hasClass('on')) {
        mapFlags.vd = true;
    } else {
        mapFlags.vd = false;
    }

    if ($('#flipswitch').prop('checked')) {
        mapFlags.convenient = true;
    } else {
        mapFlags.convenient = false;
    }

    google.maps.Map.prototype.clearOverlays();

    if (formItems.timetype === "history") {
        json_path = json_paths.history;
        console.log(json_path);
        if (mapFlags.trafficFlow) {
            mapShow.trafficFlow();
        }

    } else {
        SetCenter();
        if (mapFlags.trafficFlow) {
            mapShow.DynamicTrafficFlow();
        }
    }


    redraw();
    drawDataTable();
}
$('#coverage-submit-button').click(coveragebtn_click);

function coveragebtn_click() {
    setdatasource();
    drawcoveragechart();
    calculatecoveragetable();
}



function drawcoveragechart() {
    //$("#chartContainer").empty();
    //svg = dimple.newSvg("#chartContainer", 750, 800);
    d3.json($('#lbl-datasource').text(), function(data) {
        var r = [];
        //alert(Date.parse(dd.slice(0,19)));
        for (var i in data) {

            r.push([new Date(Date.parse(data[i].DATA_TIME.slice(0, 19) + "+08:00")),
                data[i].DATA // line
            ]);
        }
        //document.write( r +"<br>")
        var orig_range = [r[0][0].valueOf(), r[r.length - 1][0].valueOf()];
        var g = new Dygraph(
            document.getElementById("div_g2"),
            r, {
                rollPeriod: 7,
                animatedZooms: true,
                // errorBars: true,
                width: 600,
                height: 300,

                labels: ["Date", "coverage"]
            }
        );


    });
}


function setdatasource() {
    var date = $("#calendar2").val();
    var area = $("#data-area").val();
    var scale = $("#data-scale").val();
    $('#lbl-datasource').text('https://ulcac3l8d4.execute-api.ap-northeast-1.amazonaws.com/prod/coverage?scale=' + scale + '&date=' + date + '&region=' + area);

}


function calculatecoveragetable(table) {
    $("#coveragetable-table tbody").html("");
    d3.json($('#lbl-datasource').text(), function(data) {
        var scale = $("#data-scale").val();
        if (scale = 0)

            var result = new Array(Math.ceil(data.length / 12));
        for (var i = 0; i < Math.ceil(data.length / 12); i++) {
            result[i] = new Array(13);
            result[i][0] = i + '時';
        }

        for (var j = 0; j < Math.ceil(data.length / 12); j++)
            for (var k = 0; k < 12; k++) {
                var a = j * 12 + k;
                if (j == Math.floor(data.length / 12)) {
                    if (k >= data.length % 12)
                        result[j][k + 1] = 0;
                    else result[j][k + 1] = data[a].DATA;
                } else result[j][k + 1] = data[a].DATA;
            }

        console.dir(result[Math.floor(data.length / 12)]);
        //alert(result.length);



        $('#coveragetable-table').drawcoverTable(result);
    });

}

$.fn.extend({
    drawcoverTable: function(data) {
        //alert('hi');
        //console.dir(data[0]);

        var target = $(this);
        //alert(data.length);
        for (var min = 0; min < data.length; min++) {
            var row = $("<tr>")
                .append($("<td>").html(data[min][0]))
                .append($("<td>").html(data[min][1]))
                .append($("<td>").html(data[min][2]))
                .append($("<td>").html(data[min][3]))
                .append($("<td>").html(data[min][4]))
                .append($("<td>").html(data[min][5]))
                .append($("<td>").html(data[min][6]))
                .append($("<td>").html(data[min][7]))
                .append($("<td>").html(data[min][8]))
                .append($("<td>").html(data[min][9]))
                .append($("<td>").html(data[min][10]))
                .append($("<td>").html(data[min][11]))
                .append($("<td>").html(data[min][12]));
            $(target).find("tbody").append(row);
        }
        $('#coveragetable-table').removeClass('hidden');
    }
});
