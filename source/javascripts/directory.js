(function() {

  var handler = Gmaps.build('Google', {
                  markers: {
                    clusterer: {
                      minimumClusterSize: 7,
                      enableRetinaIcons: true,
                      styles: [
                        {
                          textSize: 12,
                          textColor: '#FFF',
                          url: 'images/directory/map-cluster-1.png',
                          height: 28,
                          width: 28
                        }, {
                          textSize: 15,
                          textColor: '#FFF',
                          url: 'images/directory/map-cluster-2.png',
                          height: 36,
                          width: 36
                        }
                      ]
                    }
                  }
                });

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
  var renderNoCards = false;
  var markerIcon = {
    "url": 'images/directory/map-pin.png',
    "width": 33,
    "height": 46
  };
  var sortedLocations;

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
      var websiteLabel = (element.website.length <= 33)?element.website:'Go to website';
      orgMarkup += "<div class='view'><a class='website' href='"+addHttp(element.website)+"' target='_blank'>"+websiteLabel+"</a></div>";
    }
    if(typeof element.twitter !== 'undefined' && element.twitter !== null){
      var twitterIcon = $("<a />", {class:"fa fa-twitter-square", href:"http://twitter.com/"+element.twitter});
      orgMarkup += "<a href='http://twitter.com/"+element.twitter+"' class='fa fa-twitter-square'></a>";
    }

    if(typeof element.facebook !== 'undefined' && element.facebook !== null){
      var facebookIcon = $("<a />", {class:"fa fa-facebook-square", href:element.facebook});
      orgMarkup += "<a href='"+element.facebook+"' class='fa fa-facebook-square'></a>";
    }

    if(typeof element.instagram !== 'undefined' && element.instagram !== null){
      var instagramIcon = $("<a />", {class:"fa fa-instagram", href:element.instagram});
      orgMarkup += "<a href='"+element.instagram+"' class='fa fa-instagram'></a>";
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
      handler.fitMapToBounds();
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
    var phoneIcon = $("<span />", {class: "fa fa-phone"});
    var addressIcon = $("<span />", {class: "fa fa-map-marker"});
    var cardCopy = $("<div />", {class: "card-copy", html: point.address}).prepend(addressIcon);

    if(typeof point.phone !== 'undefined' && point.phone !== null){
      var phone = $("<a />", {html: point.phone, href: 'tel:'+point.phone, class: 'card-phone'}).prepend(phoneIcon);
      cardCopy.append(phone)
    }

    card.append(cardHeader).append(cardCopy);
    cardsWrapper.append(card);

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

  var drawMapMarkersOnly = function(points) {
    var markers = handler.addMarkers(points);

    _.each(points, function(json, index){
      json.marker = markers[index];

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

  var bindCategories = function() {
    var categories = $("ul.categories li a");

      _.each(categories, function(category){
        $(category).on("click", function(e) {
          var currentCategory = $(this);
          var name = currentCategory.attr("href");
          var subCategoriesUl = currentCategory.next();
          var subcategories = subCategoriesUl.find('li a');
          var allSubCategories = $("ul.subcategories");

          e.preventDefault();

          if(name == 'All'){
            showAllCategories();
            allSubCategories.removeClass("show-element");
            $('.js-menu-screen').trigger('click');
          }else {
            filterCategories(name);
            if(subcategories.length > 0){
              allSubCategories.removeClass("show-element");
              subCategoriesUl.addClass("show-element");
            }else{
              $('.js-menu-screen').trigger('click');
            }
          }

        });
      });
  };

  var bindSubCategories = function() {
    var subcategories = $("ul.subcategories li a");
    _.each(subcategories, function(subcategory){
      $(subcategory).on("click", function(e) {
        var currentSubCategory = $(this);
        var name = currentSubCategory.attr("href");

        e.preventDefault();
        filterSubCategories(name);

      });
    });
  };

  var showAllCategories = function() {
    cleanMap(markerLocations);
    buildMap(markerLocations);

    handler.map.centerOn(defaultLatLng);
    handler.getMap().setZoom(16);

    $('header h2 span').html(' : All');
  };

  var belongsToSelectedCategory = function(categoryFilter, category){
    return categoryFilter==category;
  }

  var filterCategories = function(categoryFilter){

    var filteredLocations = _.filter(markerLocations, function(item){
      if ((typeof(item.category) !== 'undefined') && (item.category !== null)) {
        return belongsToSelectedCategory(categoryFilter, item.category.name);
      }
    });

    cleanMap(markerLocations);
    buildMap(filteredLocations);

    handler.map.centerOn(defaultLatLng);
    handler.getMap().setZoom(16);

    $('header h2 span').html(' : '+categoryFilter);

  };


  var filterSubCategories = function(subCategoryFilter){

    var filteredLocations = _.filter(markerLocations, function(item){
      var subCategoriesArray = [];
      if ((typeof(item.category.subcategory) !== 'undefined') && (item.category.subcategory !== null)) {
        _.each(item.category.subcategory, function(object){
          subCategoriesArray.push(object.name);
        });
        return _.include(subCategoriesArray, subCategoryFilter);
      }
    });

    cleanMap(markerLocations);
    buildMap(filteredLocations);

    handler.map.centerOn(defaultLatLng);
    handler.getMap().setZoom(16);

    $('header h2 span').html(' : '+subCategoryFilter);

  };

  var buildMap = function(points, renderNoCards) {

    handler.buildMap(mapOptions, function() {
      if(renderNoCards){
        drawMapMarkersOnly(points);
      }else {
        drawMap(points);
      }
      handler.fitMapToBounds();
    });
  };

  mapOptions = JSON.parse(mapOptions);
  locations = JSON.parse(locations);
  sortedLocations = _.sortBy(locations, function(o) { return o.name; })
  categories = JSON.parse(categories);
  mapOptions.provider.zoomControlOptions = google.maps.ZoomControlStyle.SMALL;


  setDefaultLocation();
  navigator.geolocation.getCurrentPosition(setGeolocation);

  // map all locations on page load
  _.each(sortedLocations,generateMarkerData);
  buildMap(markerLocations, true);

  google.maps.event.addDomListener(window, "resize", function() {
     var center = handler.getMap().getCenter();
     google.maps.event.trigger(handler.getMap(), "resize");
     handler.getMap().setCenter(center);
  });

  bindCategories();
  bindSubCategories();

})();
