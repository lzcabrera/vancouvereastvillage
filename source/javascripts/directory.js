(function() {

  var handler = Gmaps.build('Google');
  // console.dir(handler);
  var mapOptions = $('meta[name=mapOptions]').attr('content');
  var locations = $('meta[name=locations]').attr('content');
  var categories = $('meta[name=categories]').attr('content');

  var markerLocations = [];
  var filteredLocations = [];
  var meetupList = $('.list a');
  var defaultCoord = {lat: 49.282974, lng: -123.059724};
  var defaultLatLng = new google.maps.LatLng(defaultCoord.lat, defaultCoord.lng);
  var categoryList = $('.js-menu > ul');
  var cardsWrapper = $('.cards');
  var markerIcon = {
    "url": 'images/directory/map-pin.png',
    "width": 33,
    "height": 39
  };

  var addHttp = function(url) {
    if (!/^(f|ht)tps?:\/\//i.test(url)) {
      url = "http://" + url;
    }
    return url;
  };

  var generateMarkerData = function(element) {

    var orgMarkup = "";

    orgMarkup += "<h2 class='name'>"+element.name+"</h2>";
    orgMarkup += "<div class='address'>"+element.address+"</div>";
    if(typeof element.website !== 'undefined' && element.website !== null){
      var websiteLabel = (element.website.length <= 36)?element.website:'Go to website';
      orgMarkup += "<div class='view'><a href='"+addHttp(element.website)+"' target='_blank'>"+websiteLabel+"</a></div>";
    }
    element.infowindow = "<div class='map-marker'>"+orgMarkup+"</div>";
    element.picture = markerIcon;

    if(element.lat && element.lng){
      markerLocations.push(element);
    }

  };

  var getCardClass = function(name) {
    return name.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');
  };

  var setDefaultLocation = function() {
    handler.buildMap(mapOptions, function() {
      handler.map.centerOn(defaultLatLng);
      handler.getMap().setZoom(14);
    });
  };

  var setZoomBasedOnLatitudePosition = function (latitudePosition) {
    if(latitudePosition != defaultCoord.lat){
      handler.getMap().setZoom(16);
    }else{
      handler.getMap().setZoom(14);
    }
  };

  var setGeolocation = function(pos) {
    var crd = pos.coords;
    var latlng = new google.maps.LatLng(crd.latitude, crd.longitude);
    handler.map.centerOn(latlng);
    setZoomBasedOnLatitudePosition(handler.getMap().getCenter().k);
  };

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
  };

  var createCard = function(point){

    var cardClass = getCardClass(point.name);
    var card = $("<div />", {class: "card"});
    var markerLink = $("<a />", {html: point.name, class: cardClass});
    var cardHeader = $("<div />", {class: "card-header"}).append(markerLink);
    var phoneIcon = $("<span />", {class: "fa fa-phone-square"});
    var phone = $("<a />", {html: point.phone, href: 'callto:'+point.phone, class: 'card-phone'}).prepend(phoneIcon);
    var cardCopy = $("<div />", {class: "card-copy", html: point.address}).append(phone);

    card.append(cardHeader).append(cardCopy);
    cardsWrapper.append(card);

    //console.log($('.'+cardClass));
  };

  var drawMap = function(points) {
    var markers = handler.addMarkers(points);

    _.each(points, function(json, index){
      json.marker = markers[index];

      createCard(json);

      var cardClass = getCardClass(json.name);
      $(document).on('click', '.'+cardClass, function(e) {
          e.preventDefault();
          handler.getMap().setZoom(18);
          json.marker.setMap(handler.getMap()); //because clusterer removes map property from marker
          json.marker.panTo();
          google.maps.event.trigger(json.marker.getServiceObject(), 'click');
          $("html, body").animate({
            scrollTop:0
          },"slow");
      });

    });

    handler.bounds.extendWith(markers);

    // setZoomBasedOnLatitudePosition(handler.getMap().getCenter().k);
  };

  var cleanMap = function(points) {
    handler.removeMarkers();
    cardsWrapper.html('');
  };

  var zoomToPosition = function(position) {
    var marker = handler.addMarker({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });
    handler.map.centerOn(marker);
    handler.bounds.extendWith(marker);
    handler.getMap().setZoom(18);
  };

  var generateCategoriesList = function(element) {
    var link = $("<a />", {html: element.name, href: '#'});
    var listItem = $("<li />").append(link);
    categoryList.append(listItem);
    link.on('click', function(e){

      if(element.name == 'All'){
        showAllCategories();
      }else {
        filterCategories(element.name);
      }
      $('.js-menu-screen').trigger('click');
    });
  };

  var generateCategories = function() {
    _.each(categories, generateCategoriesList);
  };

  var showAllCategories = function() {
    cleanMap(markerLocations);
    buildMap(markerLocations);

    handler.map.centerOn(defaultLatLng);
    handler.getMap().setZoom(16);

    $('h1 span').html(' : All');
  };

  var filterCategories = function(categoryFilter){

    var filteredLocations = _.filter(markerLocations, function(item){
      if ((typeof(item.category) !== 'undefined') && (item.category !== null)) {
        return item.category.name == categoryFilter;
      }
    });

    cleanMap(markerLocations);
    buildMap(filteredLocations);

    handler.map.centerOn(defaultLatLng);
    handler.getMap().setZoom(16);

    $('h1 span').html(' : '+categoryFilter);

  };

  var buildMap = function(points) {
    handler.buildMap(mapOptions, function() {
      drawMap(points);
    });
  };

  mapOptions = JSON.parse(mapOptions);
  locations = JSON.parse(locations);
  categories = JSON.parse(categories);
  mapOptions.provider.zoomControlOptions = google.maps.ZoomControlStyle.SMALL;


  setDefaultLocation();
  navigator.geolocation.getCurrentPosition(setGeolocation);

  // map all locations on page load
  _.each(locations,generateMarkerData);
  buildMap(markerLocations);

  google.maps.event.addDomListener(window, "resize", function() {
     var center = handler.getMap().getCenter();
     google.maps.event.trigger(handler.getMap(), "resize");
     handler.getMap().setCenter(center);
  });

  generateCategories();


})();
