!function(){var e=Gmaps.build("Google"),a=$("meta[name=mapOptions]").attr("content"),n=$("meta[name=locations]").attr("content"),t=$("meta[name=categories]").attr("content"),o=[],r=($(".list a"),{lat:49.282982,lng:-123.056554}),i=new google.maps.LatLng(r.lat,r.lng),c=$(".js-menu > ul"),s=$(".cards"),p={url:"images/directory/map-pin.png",width:33,height:39},l=function(e){var a="";a+="<h2 class='name'>"+e.name+"</h2>",a+="<div class='address'>"+e.address+"</div>",a+="<div class='view'><a href='"+e.website+"' target='_blank'>Go to website</a></div>",e.infowindow="<div class='map-marker'>"+a+"</div>",e.picture=p,e.lat&&e.lng&&o.push(e)},m=function(e){return e.replace(/[^a-z0-9\s]/gi,"").replace(/[_\s]/g,"-")},g=function(){e.buildMap(a,function(){e.map.centerOn(i),e.getMap().setZoom(14)})},d=function(a){e.getMap().setZoom(a!=r.lat?16:14)},u=function(a){var n=a.coords,t=new google.maps.LatLng(n.latitude,n.longitude);e.map.centerOn(t),d(e.getMap().getCenter().k)},f=function(e){var a=m(e.name),n=$("<div />",{"class":"card"}),t=$("<a />",{html:e.name,"class":a}),o=$("<div />",{"class":"card-header"}).append(t),r=$("<p />",{html:e.phone}),i=$("<div />",{"class":"card-copy",html:e.address}).append(r);n.append(o).append(i),s.append(n)},v=function(a){var n=e.addMarkers(a);_.each(a,function(a,t){a.marker=n[t],f(a);var o=m(a.name);$(document).on("click","."+o,function(n){n.preventDefault(),e.getMap().setZoom(18),a.marker.setMap(e.getMap()),a.marker.panTo(),google.maps.event.trigger(a.marker.getServiceObject(),"click"),$("html, body").animate({scrollTop:0},"slow")})}),e.bounds.extendWith(n)},h=function(){e.removeMarkers(),s.html("")},M=function(e){var a=$("<a />",{html:e.name,href:"#"}),n=$("<li />").append(a);c.append(n),a.on("click",function(){"All"==e.name?w():O(e.name),$(".js-menu-screen").trigger("click")})},k=function(){_.each(t,M)},w=function(){h(o),b(o),e.map.centerOn(i),e.getMap().setZoom(18)},O=function(a){var n=_.filter(o,function(e){return"undefined"!=typeof e.category&&null!==e.category?e.category.name==a:void 0});h(o),b(n),e.map.centerOn(i),e.getMap().setZoom(16)},b=function(n){e.buildMap(a,function(){v(n)})};a=JSON.parse(a),n=JSON.parse(n),t=JSON.parse(t),a.provider.zoomControlOptions=google.maps.ZoomControlStyle.SMALL,g(),navigator.geolocation.getCurrentPosition(u),_.each(n,l),b(o),google.maps.event.addDomListener(window,"resize",function(){var a=e.getMap().getCenter();google.maps.event.trigger(e.getMap(),"resize"),e.getMap().setCenter(a)}),k()}();