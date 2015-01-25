(function() {

  var handler = Gmaps.build('Google');
  var mapOptions = $('meta[name=mapOptions]').attr('content');
  var locations = $('meta[name=locations]').attr('content');
  var categories = $('meta[name=categories]').attr('content');

  var markerLocations = [];
  var filteredLocations = [];
  var meetupList = $('.list a');
  var defaultCoord = {lat: 49.282982, lng: -123.056554};
  var categoryList = $('.categories > ul');

  var generateMarkerData = function(element) {

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

  var setDefaultLocation = function() {
    var latlng = new google.maps.LatLng(defaultCoord.lat, defaultCoord.lng);

    handler.buildMap(mapOptions, function() {
      handler.map.centerOn(latlng);
      handler.getMap().setZoom(14);
    });
  }

  var setZoomBasedOnLatitudePosition = function (latitudePosition) {
    if(latitudePosition != defaultCoord.lat){
      handler.getMap().setZoom(16);
    }else{
      handler.getMap().setZoom(14);
    }
  }

  var setGeolocation = function(pos) {
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
        handler.getMap().setZoom(16);
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
        handler.getMap().setZoom(20);
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
    handler.getMap().setZoom(18);
  }

  var generateCategoriesList = function(element) {
    var link = $("<a />", {html: element.name, href: '#'});//.on('click', filterCategories(element.name));
    var listItem = $("<li />").append(link);
    categoryList.append(listItem);
    console.log('e '+element.name);
    link.on('click', filterCategories(element.name));
  }

  var generateCategories = function() {
    console.log('categories '+categories.length);
    console.dir(categories);
    _.each(categories, generateCategoriesList);
  }

  var filterCategories = function(categoryFilter){

    var filteredLocations = _.filter(markerLocations, function(item){
      if ((typeof(item.category) !== 'undefined') && (item.category !== null)) {
        return item.category.name == categoryFilter;
      }
    });

    markerLocations = filteredLocations;
    console.log('filteredLocations '+filteredLocations.length);
    handler.buildMap(mapOptions, function() {
      drawMap();
    });

  }

  var clearMarkers = function() {
    setMapMarkers(null);
  }

  var setMapMarkers = function() {

  }

  mapOptions = JSON.parse(mapOptions);
  locations = JSON.parse(locations);
  categories = JSON.parse(categories);
  mapOptions.provider.zoomControlOptions = google.maps.ZoomControlStyle.SMALL;


  setDefaultLocation();
  navigator.geolocation.getCurrentPosition(setGeolocation);
  _.each(locations,generateMarkerData);
  handler.buildMap(mapOptions, function() {
    drawMap();
  });

  //generateCategories();


})();
