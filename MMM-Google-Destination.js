/*! *****************************************************************************
  mmm-google-destination
  Version 1.0.0

  A module to show the quickest route to a specified destination for the MagicMirror² platform.
  Please submit bugs at https://github.com/jalibu/MMM-Google-Destination/issues

  (c) Jan.Litzenburger@gmail.com
  Licence: MIT

  This file is auto-generated. Do not edit.
***************************************************************************** */

!function(){"use strict";
/*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */function e(e,t,i,s){return new(i||(i=Promise))((function(r,o){function l(e){try{a(s.next(e))}catch(e){o(e)}}function n(e){try{a(s.throw(e))}catch(e){o(e)}}function a(e){var t;e.done?r(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(l,n)}a((s=s.apply(e,t||[])).next())}))}const t=[{elementType:"geometry",stylers:[{color:"#000000"}]},{elementType:"labels.icon",stylers:[{visibility:"off"}]},{elementType:"labels.text.fill",stylers:[{color:"#757575"}]},{elementType:"labels.text.stroke",stylers:[{color:"#212121"}]},{featureType:"administrative",elementType:"geometry",stylers:[{color:"#757575"},{visibility:"off"}]},{featureType:"administrative.country",elementType:"labels.text.fill",stylers:[{color:"#9e9e9e"}]},{featureType:"administrative.land_parcel",stylers:[{visibility:"off"}]},{featureType:"administrative.locality",elementType:"labels.text.fill",stylers:[{color:"#bdbdbd"}]},{featureType:"administrative.neighborhood",stylers:[{visibility:"off"}]},{featureType:"poi",stylers:[{visibility:"off"}]},{featureType:"poi",elementType:"labels.text",stylers:[{visibility:"off"}]},{featureType:"poi",elementType:"labels.text.fill",stylers:[{color:"#757575"}]},{featureType:"poi.park",elementType:"geometry",stylers:[{color:"#181818"}]},{featureType:"poi.park",elementType:"labels.text.fill",stylers:[{color:"#616161"}]},{featureType:"poi.park",elementType:"labels.text.stroke",stylers:[{color:"#1b1b1b"}]},{featureType:"road",elementType:"geometry.fill",stylers:[{color:"#2c2c2c"}]},{featureType:"road",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"road",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"road",elementType:"labels.text.fill",stylers:[{color:"#8a8a8a"}]},{featureType:"road.arterial",elementType:"geometry",stylers:[{color:"#373737"}]},{featureType:"road.highway",elementType:"geometry",stylers:[{color:"#3c3c3c"}]},{featureType:"road.highway.controlled_access",elementType:"geometry",stylers:[{color:"#4e4e4e"}]},{featureType:"road.local",elementType:"labels.text.fill",stylers:[{color:"#616161"}]},{featureType:"transit",stylers:[{visibility:"off"}]},{featureType:"transit",elementType:"labels.text.fill",stylers:[{color:"#757575"}]},{featureType:"water",stylers:[{visibility:"off"}]},{featureType:"water",elementType:"geometry",stylers:[{color:"#000000"}]},{featureType:"water",elementType:"labels.text",stylers:[{visibility:"off"}]},{featureType:"water",elementType:"labels.text.fill",stylers:[{color:"#3d3d3d"}]}];Module.register("MMM-Google-Destination",{defaults:{updateIntervalInSeconds:60,apiKey:null,height:400,width:400,start:"Heidelberg",destination:"Mainz",timeFormat:config.timeFormat||24},_state:{directionsService:null,directionsRenderer1:null,directionsRenderer2:null,lastUpdate:null},getStyles:()=>["MMM-Google-Destination.css"],getScripts:()=>["moment.js"],getTranslations:()=>({en:"translations/en.json",de:"translations/de.json"}),getTemplateData(){return{config:this.config,identifier:this.identifier}},getTemplate:()=>"templates/MMM-Google-Destination.njk",start(){const e=this,t=document.createElement("script");t.type="text/javascript",t.src=`https://maps.googleapis.com/maps/api/js?key=${this.config.apiKey}`,t.async=!0,t.onload=()=>{e.initGoogleDestinationMap()},this._state.hourSymbol=24===this.config.timeFormat?"HH":"h",document.head.appendChild(t)},initGoogleDestinationMap(){const e=new google.maps.Map(document.getElementById("destination-map-"+this.identifier),{styles:t,keyboardShortcuts:!1,zoomControl:!1,streetViewControl:!1,scaleControl:!1,rotateControl:!1,panControl:!1,mapTypeControl:!1,fullscreenControl:!1});this._state.directionsService=new google.maps.DirectionsService,this._state.directionsRenderer1=new google.maps.DirectionsRenderer({suppressMarkers:!0,polylineOptions:{strokeColor:"#fff",strokeWeight:7}}),this._state.directionsRenderer1.setMap(e),this._state.directionsRenderer2=new google.maps.DirectionsRenderer({suppressMarkers:!0,polylineOptions:{strokeColor:"#aaa",strokeWeight:5}}),this._state.directionsRenderer2.setMap(e),this.scheduleUpdate()},calculateAndDisplayRoute(){return e(this,void 0,void 0,(function*(){try{const e=yield this._state.directionsService.route({origin:{query:this.config.start},destination:{query:this.config.destination},travelMode:google.maps.TravelMode.DRIVING});if("OK"!==e.status)throw Error(status);{this._state.directionsRenderer1.setDirections(e),this._state.directionsRenderer1.setRouteIndex(1),this._state.directionsRenderer2.setDirections(e),document.getElementById("destination-error-"+this.identifier).setAttribute("style","display: none;");let t=e.routes[0];if(document.getElementById("destination-summary-"+this.identifier+"-1").innerHTML=`${t.legs[0].duration.text} via ${t.summary} (${t.legs[0].distance.text})`,e.routes.length>1){let t=e.routes[1];document.getElementById("destination-summary-"+this.identifier+"-2").innerHTML=`${t.legs[0].duration.text} via ${t.summary} (${t.legs[0].distance.text})`,document.getElementById("destination-summary-"+this.identifier+"-2").setAttribute("style","")}else document.getElementById("destination-summary-"+this.identifier+"-2").setAttribute("style","display: none;");const i=moment(Date.now());document.getElementById("destination-lastUpdate-"+this.identifier).innerHTML=`${this.translate("LAST_UPDATE")}${i.format(this._state.hourSymbol+":mm")}`}}catch(e){const t=moment(Date.now()),i=document.getElementById("destination-error-"+this.identifier);i.innerHTML=`Error: ${e.message} (${t.format(this._state.hourSymbol+":mm")})`,i.setAttribute("style","")}}))},scheduleUpdate(){this.calculateAndDisplayRoute(),setInterval(this.calculateAndDisplayRoute.bind(this),1e3*this.config.updateIntervalInSeconds)}})}();
