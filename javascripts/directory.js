!function(){var e=Gmaps.build("Google"),n=$("meta[name=mapOptions]").attr("content"),t=$("meta[name=locations]").attr("content"),a=$("meta[name=categories]").attr("content"),o=[],r=($(".list a"),{lat:49.282982,lng:-123.056554}),i=new google.maps.LatLng(r.lat,r.lng),s=$(".js-menu > ul"),c=$(".cards"),p={url:"images/directory/map-pin.png",width:33,height:39},d=function(e){var n="";n+="<h2 class='name'>"+e.name+"</h2>",n+="<div class='address'>"+e.address+"</div>",n+="<div class='view'><a href='"+e.website+"' target='_blank'>Go to website</a></div>",e.infowindow="<div class='map-marker'>"+n+"</div>",e.picture=p,e.lat&&e.lng&&o.push(e)},l=function(){e.buildMap(n,function(){e.map.centerOn(i),e.getMap().setZoom(14)})},g=function(n){e.getMap().setZoom(n!=r.lat?16:14)},m=function(n){var t=n.coords,a=new google.maps.LatLng(t.latitude,t.longitude);e.map.centerOn(a),g(e.getMap().getCenter().k)},u=function(e){var n=$("<div />",{"class":"card"}),t=$("<div />",{"class":"card-header",html:e.name}),a=$("<p />",{html:e.phone}),o=$("<div />",{"class":"card-copy",html:e.address}).append(a);n.append(t).append(o),c.append(n)},f=function(n){var t=e.addMarkers(n);_.each(n,function(e,n){e.marker=t[n],u(e)}),e.bounds.extendWith(t)},v=function(){e.removeMarkers(),c.html("")},h=function(e){var n=$("<a />",{html:e.name,href:"#"}),t=$("<li />").append(n);s.append(t),n.on("click",function(){w(e.name),$(".js-menu-screen").trigger("click")})},M=function(){_.each(a,h)},w=function(n){var t=_.filter(o,function(e){return"undefined"!=typeof e.category&&null!==e.category?e.category.name==n:void 0});v(o),k(t),e.map.centerOn(i),e.getMap().setZoom(16)},k=function(t){e.buildMap(n,function(){f(t)})};n=JSON.parse(n),t=JSON.parse(t),a=JSON.parse(a),n.provider.zoomControlOptions=google.maps.ZoomControlStyle.SMALL,l(),navigator.geolocation.getCurrentPosition(m),_.each(t,d),k(o),google.maps.event.addDomListener(window,"resize",function(){var n=e.getMap().getCenter();google.maps.event.trigger(e.getMap(),"resize"),e.getMap().setCenter(n)}),M()}();