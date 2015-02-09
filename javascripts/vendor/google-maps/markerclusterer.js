function ClusterIcon(t,e){t.getMarkerClusterer().extend(ClusterIcon,google.maps.OverlayView),this.cluster_=t,this.className_=t.getMarkerClusterer().getClusterClass(),this.styles_=e,this.center_=null,this.div_=null,this.sums_=null,this.visible_=!1,this.setMap(t.getMap())}function Cluster(t){this.markerClusterer_=t,this.map_=t.getMap(),this.gridSize_=t.getGridSize(),this.minClusterSize_=t.getMinimumClusterSize(),this.averageCenter_=t.getAverageCenter(),this.printable_=t.getPrintable(),this.markers_=[],this.center_=null,this.bounds_=null,this.clusterIcon_=new ClusterIcon(this,t.getStyles())}function MarkerClusterer(t,e,r){this.extend(MarkerClusterer,google.maps.OverlayView),e=e||[],r=r||{},this.markers_=[],this.clusters_=[],this.listeners_=[],this.activeMap_=null,this.ready_=!1,this.gridSize_=r.gridSize||60,this.minClusterSize_=r.minimumClusterSize||2,this.maxZoom_=r.maxZoom||null,this.styles_=r.styles||[],this.title_=r.title||"",this.zoomOnClick_=!0,void 0!==r.zoomOnClick&&(this.zoomOnClick_=r.zoomOnClick),this.averageCenter_=!1,void 0!==r.averageCenter&&(this.averageCenter_=r.averageCenter),this.ignoreHidden_=!1,void 0!==r.ignoreHidden&&(this.ignoreHidden_=r.ignoreHidden),this.printable_=!1,void 0!==r.printable&&(this.printable_=r.printable),this.imagePath_=r.imagePath||MarkerClusterer.IMAGE_PATH,this.imageExtension_=r.imageExtension||MarkerClusterer.IMAGE_EXTENSION,this.imageSizes_=r.imageSizes||MarkerClusterer.IMAGE_SIZES,this.calculator_=r.calculator||MarkerClusterer.CALCULATOR,this.batchSize_=r.batchSize||MarkerClusterer.BATCH_SIZE,this.batchSizeIE_=r.batchSizeIE||MarkerClusterer.BATCH_SIZE_IE,this.clusterClass_=r.clusterClass||"cluster",-1!==navigator.userAgent.toLowerCase().indexOf("msie")&&(this.batchSize_=this.batchSizeIE_),this.setupStyles_(),this.addMarkers(e,!0),this.setMap(t)}ClusterIcon.prototype.onAdd=function(){var t,e,r=this;this.div_=document.createElement("div"),this.div_.className=this.className_,this.visible_&&this.show(),this.getPanes().overlayMouseTarget.appendChild(this.div_),google.maps.event.addListener(this.getMap(),"bounds_changed",function(){e=t}),google.maps.event.addDomListener(this.div_,"mousedown",function(){t=!0,e=!1}),google.maps.event.addDomListener(this.div_,"click",function(s){if(t=!1,!e){var i,o,n=r.cluster_.getMarkerClusterer();google.maps.event.trigger(n,"click",r.cluster_),google.maps.event.trigger(n,"clusterclick",r.cluster_),n.getZoomOnClick()&&(o=n.getMaxZoom(),i=r.cluster_.getBounds(),n.getMap().fitBounds(i),setTimeout(function(){n.getMap().fitBounds(i),null!==o&&n.getMap().getZoom()>o&&n.getMap().setZoom(o+1)},100)),s.cancelBubble=!0,s.stopPropagation&&s.stopPropagation()}}),google.maps.event.addDomListener(this.div_,"mouseover",function(){var t=r.cluster_.getMarkerClusterer();google.maps.event.trigger(t,"mouseover",r.cluster_)}),google.maps.event.addDomListener(this.div_,"mouseout",function(){var t=r.cluster_.getMarkerClusterer();google.maps.event.trigger(t,"mouseout",r.cluster_)})},ClusterIcon.prototype.onRemove=function(){this.div_&&this.div_.parentNode&&(this.hide(),google.maps.event.clearInstanceListeners(this.div_),this.div_.parentNode.removeChild(this.div_),this.div_=null)},ClusterIcon.prototype.draw=function(){if(this.visible_){var t=this.getPosFromLatLng_(this.center_);this.div_.style.top=t.y+"px",this.div_.style.left=t.x+"px"}},ClusterIcon.prototype.hide=function(){this.div_&&(this.div_.style.display="none"),this.visible_=!1},ClusterIcon.prototype.show=function(){if(this.div_){var t=this.getPosFromLatLng_(this.center_);this.div_.style.cssText=this.createCss(t),this.div_.innerHTML=this.cluster_.printable_?"<img src='"+this.url_+"'><div style='position: absolute; top: 0px; left: 0px; width: "+this.width_+"px;'>"+this.sums_.text+"</div>":this.sums_.text,this.div_.title="undefined"==typeof this.sums_.title||""===this.sums_.title?this.cluster_.getMarkerClusterer().getTitle():this.sums_.title,this.div_.style.display=""}this.visible_=!0},ClusterIcon.prototype.useStyle=function(t){this.sums_=t;var e=Math.max(0,t.index-1);e=Math.min(this.styles_.length-1,e);var r=this.styles_[e];this.url_=r.url,this.height_=r.height,this.width_=r.width,this.anchor_=r.anchor,this.anchorIcon_=r.anchorIcon||[parseInt(this.height_/2,10),parseInt(this.width_/2,10)],this.textColor_=r.textColor||"black",this.textSize_=r.textSize||11,this.textDecoration_=r.textDecoration||"none",this.fontWeight_=r.fontWeight||"bold",this.fontStyle_=r.fontStyle||"normal",this.fontFamily_=r.fontFamily||"Arial,sans-serif",this.backgroundPosition_=r.backgroundPosition||"0 0"},ClusterIcon.prototype.setCenter=function(t){this.center_=t},ClusterIcon.prototype.createCss=function(t){var e=[];return this.cluster_.printable_||(e.push("background-image:url("+this.url_+");"),e.push("background-position:"+this.backgroundPosition_+";")),"object"==typeof this.anchor_?(e.push("number"==typeof this.anchor_[0]&&this.anchor_[0]>0&&this.anchor_[0]<this.height_?"height:"+(this.height_-this.anchor_[0])+"px; padding-top:"+this.anchor_[0]+"px;":"height:"+this.height_+"px; line-height:"+this.height_+"px;"),e.push("number"==typeof this.anchor_[1]&&this.anchor_[1]>0&&this.anchor_[1]<this.width_?"width:"+(this.width_-this.anchor_[1])+"px; padding-left:"+this.anchor_[1]+"px;":"width:"+this.width_+"px; text-align:center;")):e.push("height:"+this.height_+"px; line-height:"+this.height_+"px; width:"+this.width_+"px; text-align:center;"),e.push("cursor:pointer; top:"+t.y+"px; left:"+t.x+"px; color:"+this.textColor_+"; position:absolute; font-size:"+this.textSize_+"px; font-family:"+this.fontFamily_+"; font-weight:"+this.fontWeight_+"; font-style:"+this.fontStyle_+"; text-decoration:"+this.textDecoration_+";"),e.join("")},ClusterIcon.prototype.getPosFromLatLng_=function(t){var e=this.getProjection().fromLatLngToDivPixel(t);return e.x-=this.anchorIcon_[1],e.y-=this.anchorIcon_[0],e},Cluster.prototype.getSize=function(){return this.markers_.length},Cluster.prototype.getMarkers=function(){return this.markers_},Cluster.prototype.getCenter=function(){return this.center_},Cluster.prototype.getMap=function(){return this.map_},Cluster.prototype.getMarkerClusterer=function(){return this.markerClusterer_},Cluster.prototype.getBounds=function(){var t,e=new google.maps.LatLngBounds(this.center_,this.center_),r=this.getMarkers();for(t=0;t<r.length;t++)e.extend(r[t].getPosition());return e},Cluster.prototype.remove=function(){this.clusterIcon_.setMap(null),this.markers_=[],delete this.markers_},Cluster.prototype.addMarker=function(t){var e,r,s;if(this.isMarkerAlreadyAdded_(t))return!1;if(this.center_){if(this.averageCenter_){var i=this.markers_.length+1,o=(this.center_.lat()*(i-1)+t.getPosition().lat())/i,n=(this.center_.lng()*(i-1)+t.getPosition().lng())/i;this.center_=new google.maps.LatLng(o,n),this.calculateBounds_()}}else this.center_=t.getPosition(),this.calculateBounds_();if(t.isAdded=!0,this.markers_.push(t),r=this.markers_.length,s=this.markerClusterer_.getMaxZoom(),null!==s&&this.map_.getZoom()>s)t.getMap()!==this.map_&&t.setMap(this.map_);else if(r<this.minClusterSize_)t.getMap()!==this.map_&&t.setMap(this.map_);else if(r===this.minClusterSize_)for(e=0;r>e;e++)this.markers_[e].setMap(null);else t.setMap(null);return this.updateIcon_(),!0},Cluster.prototype.isMarkerInClusterBounds=function(t){return this.bounds_.contains(t.getPosition())},Cluster.prototype.calculateBounds_=function(){var t=new google.maps.LatLngBounds(this.center_,this.center_);this.bounds_=this.markerClusterer_.getExtendedBounds(t)},Cluster.prototype.updateIcon_=function(){var t=this.markers_.length,e=this.markerClusterer_.getMaxZoom();if(null!==e&&this.map_.getZoom()>e)return void this.clusterIcon_.hide();if(t<this.minClusterSize_)return void this.clusterIcon_.hide();var r=this.markerClusterer_.getStyles().length,s=this.markerClusterer_.getCalculator()(this.markers_,r);this.clusterIcon_.setCenter(this.center_),this.clusterIcon_.useStyle(s),this.clusterIcon_.show()},Cluster.prototype.isMarkerAlreadyAdded_=function(t){var e;if(this.markers_.indexOf)return-1!==this.markers_.indexOf(t);for(e=0;e<this.markers_.length;e++)if(t===this.markers_[e])return!0;return!1},MarkerClusterer.prototype.onAdd=function(){var t=this;this.activeMap_=this.getMap(),this.ready_=!0,this.repaint(),this.listeners_=[google.maps.event.addListener(this.getMap(),"zoom_changed",function(){t.resetViewport_(!1),(this.getZoom()===(this.get("minZoom")||0)||this.getZoom()===this.get("maxZoom"))&&google.maps.event.trigger(this,"idle")}),google.maps.event.addListener(this.getMap(),"idle",function(){t.redraw_()})]},MarkerClusterer.prototype.onRemove=function(){var t;for(t=0;t<this.markers_.length;t++)this.markers_[t].setMap(this.activeMap_);for(t=0;t<this.clusters_.length;t++)this.clusters_[t].remove();for(this.clusters_=[],t=0;t<this.listeners_.length;t++)google.maps.event.removeListener(this.listeners_[t]);this.listeners_=[],this.activeMap_=null,this.ready_=!1},MarkerClusterer.prototype.draw=function(){},MarkerClusterer.prototype.setupStyles_=function(){var t,e;if(!(this.styles_.length>0))for(t=0;t<this.imageSizes_.length;t++)e=this.imageSizes_[t],this.styles_.push({url:this.imagePath_+(t+1)+"."+this.imageExtension_,height:e,width:e})},MarkerClusterer.prototype.fitMapToMarkers=function(){var t,e=this.getMarkers(),r=new google.maps.LatLngBounds;for(t=0;t<e.length;t++)r.extend(e[t].getPosition());this.getMap().fitBounds(r)},MarkerClusterer.prototype.getGridSize=function(){return this.gridSize_},MarkerClusterer.prototype.setGridSize=function(t){this.gridSize_=t},MarkerClusterer.prototype.getMinimumClusterSize=function(){return this.minClusterSize_},MarkerClusterer.prototype.setMinimumClusterSize=function(t){this.minClusterSize_=t},MarkerClusterer.prototype.getMaxZoom=function(){return this.maxZoom_},MarkerClusterer.prototype.setMaxZoom=function(t){this.maxZoom_=t},MarkerClusterer.prototype.getStyles=function(){return this.styles_},MarkerClusterer.prototype.setStyles=function(t){this.styles_=t},MarkerClusterer.prototype.getTitle=function(){return this.title_},MarkerClusterer.prototype.setTitle=function(t){this.title_=t},MarkerClusterer.prototype.getZoomOnClick=function(){return this.zoomOnClick_},MarkerClusterer.prototype.setZoomOnClick=function(t){this.zoomOnClick_=t},MarkerClusterer.prototype.getAverageCenter=function(){return this.averageCenter_},MarkerClusterer.prototype.setAverageCenter=function(t){this.averageCenter_=t},MarkerClusterer.prototype.getIgnoreHidden=function(){return this.ignoreHidden_},MarkerClusterer.prototype.setIgnoreHidden=function(t){this.ignoreHidden_=t},MarkerClusterer.prototype.getImageExtension=function(){return this.imageExtension_},MarkerClusterer.prototype.setImageExtension=function(t){this.imageExtension_=t},MarkerClusterer.prototype.getImagePath=function(){return this.imagePath_},MarkerClusterer.prototype.setImagePath=function(t){this.imagePath_=t},MarkerClusterer.prototype.getImageSizes=function(){return this.imageSizes_},MarkerClusterer.prototype.setImageSizes=function(t){this.imageSizes_=t},MarkerClusterer.prototype.getCalculator=function(){return this.calculator_},MarkerClusterer.prototype.setCalculator=function(t){this.calculator_=t},MarkerClusterer.prototype.getPrintable=function(){return this.printable_},MarkerClusterer.prototype.setPrintable=function(t){this.printable_=t},MarkerClusterer.prototype.getBatchSizeIE=function(){return this.batchSizeIE_},MarkerClusterer.prototype.setBatchSizeIE=function(t){this.batchSizeIE_=t},MarkerClusterer.prototype.getClusterClass=function(){return this.clusterClass_},MarkerClusterer.prototype.setClusterClass=function(t){this.clusterClass_=t},MarkerClusterer.prototype.getMarkers=function(){return this.markers_},MarkerClusterer.prototype.getTotalMarkers=function(){return this.markers_.length},MarkerClusterer.prototype.getClusters=function(){return this.clusters_},MarkerClusterer.prototype.getTotalClusters=function(){return this.clusters_.length},MarkerClusterer.prototype.addMarker=function(t,e){this.pushMarkerTo_(t),e||this.redraw_()},MarkerClusterer.prototype.addMarkers=function(t,e){var r;for(r=0;r<t.length;r++)this.pushMarkerTo_(t[r]);e||this.redraw_()},MarkerClusterer.prototype.pushMarkerTo_=function(t){if(t.getDraggable()){var e=this;google.maps.event.addListener(t,"dragend",function(){e.ready_&&(this.isAdded=!1,e.repaint())})}t.isAdded=!1,this.markers_.push(t)},MarkerClusterer.prototype.removeMarker=function(t,e){var r=this.removeMarker_(t);return!e&&r&&this.repaint(),r},MarkerClusterer.prototype.removeMarkers=function(t,e){var r,s,i=!1;for(r=0;r<t.length;r++)s=this.removeMarker_(t[r]),i=i||s;return!e&&i&&this.repaint(),i},MarkerClusterer.prototype.removeMarker_=function(t){var e,r=-1;if(this.markers_.indexOf)r=this.markers_.indexOf(t);else for(e=0;e<this.markers_.length;e++)if(t===this.markers_[e]){r=e;break}return-1===r?!1:(t.setMap(null),this.markers_.splice(r,1),!0)},MarkerClusterer.prototype.clearMarkers=function(){this.resetViewport_(!0),this.markers_=[]},MarkerClusterer.prototype.repaint=function(){var t=this.clusters_.slice();this.clusters_=[],this.resetViewport_(!1),this.redraw_(),setTimeout(function(){var e;for(e=0;e<t.length;e++)t[e].remove()},0)},MarkerClusterer.prototype.getExtendedBounds=function(t){var e=this.getProjection(),r=new google.maps.LatLng(t.getNorthEast().lat(),t.getNorthEast().lng()),s=new google.maps.LatLng(t.getSouthWest().lat(),t.getSouthWest().lng()),i=e.fromLatLngToDivPixel(r);i.x+=this.gridSize_,i.y-=this.gridSize_;var o=e.fromLatLngToDivPixel(s);o.x-=this.gridSize_,o.y+=this.gridSize_;var n=e.fromDivPixelToLatLng(i),a=e.fromDivPixelToLatLng(o);return t.extend(n),t.extend(a),t},MarkerClusterer.prototype.redraw_=function(){this.createClusters_(0)},MarkerClusterer.prototype.resetViewport_=function(t){var e,r;for(e=0;e<this.clusters_.length;e++)this.clusters_[e].remove();for(this.clusters_=[],e=0;e<this.markers_.length;e++)r=this.markers_[e],r.isAdded=!1,t&&r.setMap(null)},MarkerClusterer.prototype.distanceBetweenPoints_=function(t,e){var r=6371,s=(e.lat()-t.lat())*Math.PI/180,i=(e.lng()-t.lng())*Math.PI/180,o=Math.sin(s/2)*Math.sin(s/2)+Math.cos(t.lat()*Math.PI/180)*Math.cos(e.lat()*Math.PI/180)*Math.sin(i/2)*Math.sin(i/2),n=2*Math.atan2(Math.sqrt(o),Math.sqrt(1-o)),a=r*n;return a},MarkerClusterer.prototype.isMarkerInBounds_=function(t,e){return e.contains(t.getPosition())},MarkerClusterer.prototype.addToClosestCluster_=function(t){var e,r,s,i,o=4e4,n=null;for(e=0;e<this.clusters_.length;e++)s=this.clusters_[e],i=s.getCenter(),i&&(r=this.distanceBetweenPoints_(i,t.getPosition()),o>r&&(o=r,n=s));n&&n.isMarkerInClusterBounds(t)?n.addMarker(t):(s=new Cluster(this),s.addMarker(t),this.clusters_.push(s))},MarkerClusterer.prototype.createClusters_=function(t){var e,r,s,i=this;if(this.ready_){0===t&&(google.maps.event.trigger(this,"clusteringbegin",this),"undefined"!=typeof this.timerRefStatic&&(clearTimeout(this.timerRefStatic),delete this.timerRefStatic)),s=this.getMap().getZoom()>3?new google.maps.LatLngBounds(this.getMap().getBounds().getSouthWest(),this.getMap().getBounds().getNorthEast()):new google.maps.LatLngBounds(new google.maps.LatLng(85.02070771743472,-178.48388434375),new google.maps.LatLng(-85.08136444384544,178.00048865625));var o=this.getExtendedBounds(s),n=Math.min(t+this.batchSize_,this.markers_.length);for(e=t;n>e;e++)r=this.markers_[e],!r.isAdded&&this.isMarkerInBounds_(r,o)&&(!this.ignoreHidden_||this.ignoreHidden_&&r.getVisible())&&this.addToClosestCluster_(r);n<this.markers_.length?this.timerRefStatic=setTimeout(function(){i.createClusters_(n)},0):(delete this.timerRefStatic,google.maps.event.trigger(this,"clusteringend",this))}},MarkerClusterer.prototype.extend=function(t,e){return function(t){var e;for(e in t.prototype)this.prototype[e]=t.prototype[e];return this}.apply(t,[e])},MarkerClusterer.CALCULATOR=function(t,e){for(var r=0,s="",i=t.length.toString(),o=i;0!==o;)o=parseInt(o/10,10),r++;return r=Math.min(r,e),{text:i,index:r,title:s}},MarkerClusterer.BATCH_SIZE=2e3,MarkerClusterer.BATCH_SIZE_IE=500,MarkerClusterer.IMAGE_PATH="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclustererplus/images/m",MarkerClusterer.IMAGE_EXTENSION="png",MarkerClusterer.IMAGE_SIZES=[53,56,66,78,90];