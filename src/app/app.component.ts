import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'map_direction';

map:mapboxgl.Map | undefined;
style = 'mapbox://stylee/mapbox/streets-v11'
lat = 12.0911;
lng = 85.8211;
zoom  = 5;

constructor(){
  (mapboxgl as any).accessToken = environment.mapbox.accessToken;
}
  ngOnInit(): void {this.buildMap(); }

  buildMap() {  

  this.map = new mapboxgl.Map({
  container: 'map',
  style : this.style,
  zoom : this.zoom,
  center : [this.lng ,this.lat],
  attributionControl: false
  });

  const navControl = new mapboxgl.NavigationControl({
    visualizePitch: true
  }) 

  let geolocate = new mapboxgl.GeolocateControl({
    positionOptions:{
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading:true
  })
  var directions = new MapboxDirections({
    accessToken: environment.mapbox.accessToken,
    unit: 'metric', 
    profile: 'mapbox/driving', 
    container: 'directions', 
    steps: true,
    voice_instructions: true,
    controls: {
      inputs: true,
      instructions: true,
      profileSwitcher: true
    }
  });
  
  this.map.addControl(directions,'top-left');
  this.map.addControl(navControl, 'top-right');
  this.map.addControl(geolocate, 'top-right');
  this.map.addControl(new mapboxgl.FullscreenControl(), "top-right");
  this.map.addControl(new mapboxgl.ScaleControl(), "bottom-right");

  this.map.on("load", function () {
    geolocate.trigger(); 
  });
  geolocate.on("geolocate", locateUser);
  this.map.on('load', function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        directions.setOrigin([position.coords.longitude, position.coords.latitude]);
      });
    }
  });

}
}
function locateUser(e:any) {
  console.log("lng:" + e.coords.longitude + ", lat:" + e.coords.latitude);
}
