(function() {

  var handler = Gmaps.build('Google', {
                  markers: {
                    clusterer: {
                      minimumClusterSize: 4,
                      enableRetinaIcons: true,
                      styles: [
                        {
                          textSize: 12,
                          textColor: '#FFF',
                          url: '/images/directory/map-cluster-1.png',
                          height: 28,
                          width: 28
                        }, {
                          textSize: 15,
                          textColor: '#FFF',
                          url: '/images/directory/map-cluster-2.png',
                          height: 36,
                          width: 36
                        }
                      ]
                    }
                  }
                });
  var mapOptions = $('meta[name=mapOptions]').attr('content');
  var locations = $('meta[name=locations]').attr('content');

  var markerLocations = [];
  var meetupList = $('.list a');

  var generateMarkerData = function(element) {
    console.log(element.name);

    var markerIcon = {
        "url": '/images/directory/map-pin.png',
        "width": 33,
        "height": 39
    };

    var orgMarkup = "";

    orgMarkup += "<h2 class='name'>"+element.name+"</h2>";
    orgMarkup += "<div class='address'>"+element.address+"</div>";
    orgMarkup += "<div class='view'><a href='"+element.website+"' target='_blank'>Go to website</a></div>";

    element.infowindow = "<div class='map-marker'>"+orgMarkup+"</div>";
    element.picture = markerIcon;

    if(element.lat && element.lng){
      markerLocations.push(element);
    }

  }

  var defaultLocation = function() {
    var latlng = new google.maps.LatLng(3, -13);

    handler.buildMap(mapOptions, function() {
      handler.map.centerOn(latlng);
      handler.getMap().setZoom(2);
    });
  }

  var setZoomBasedOnLatitudePosition = function (latitudePosition) {
    if(latitudePosition != 3){
      handler.getMap().setZoom(8);
    }else{
      handler.getMap().setZoom(2);
    }
  }

  var success = function(pos) {
    var crd = pos.coords;
    var latlng = new google.maps.LatLng(crd.latitude, crd.longitude);
    handler.map.centerOn(latlng);
    setZoomBasedOnLatitudePosition(handler.getMap().getCenter().k);
  }

  var bindLiToMarker = function(json_array) {
    _.each(json_array, function(json){

      var markerId = json.name.toLowerCase().replace(/\W/g, '');
      var currentMarker = $('#'+markerId);

      currentMarker.on('click', function(e){
        meetupList.removeClass('active');
        $(this).addClass("active");
        e.preventDefault();
        handler.getMap().setZoom(14);
        json.marker.setMap(handler.getMap()); //because clusterer removes map property from marker
        json.marker.panTo();
        google.maps.event.trigger(json.marker.getServiceObject(), 'click');

        $("html, body").animate({
          scrollTop:0
        },"slow");
      });

      google.maps.event.addListener(json.marker.getServiceObject(), 'click', function(){
        meetupList.removeClass('active');
        currentMarker.addClass("active");
        handler.getMap().setZoom(14);
      });
    });
  }

  var drawMap = function() {
    var markers = handler.addMarkers(markerLocations);

    _.each(markerLocations, function(json, index){
      json.marker = markers[index];
    });

    bindLiToMarker(markerLocations);

    handler.bounds.extendWith(markers);

    setZoomBasedOnLatitudePosition(handler.getMap().getCenter().k);
  }

  var zoomToPosition = function(position) {
    var marker = handler.addMarker({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });
    handler.map.centerOn(marker);
    handler.bounds.extendWith(marker);
    handler.getMap().setZoom(8);
  }

  mapOptions = JSON.parse(mapOptions);
  mapOptions.provider.zoomControlOptions = google.maps.ZoomControlStyle.SMALL;
  locations = JSON.parse(locations);

  defaultLocation();
  navigator.geolocation.getCurrentPosition(success);

  // console.log(locations);
  _.each(locations,generateMarkerData);
  //locations.forEach(generateMarkerData);

  handler.buildMap(mapOptions, function() {
    drawMap();
  });



})();
