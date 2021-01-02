import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {environment} from '../../environments/environment';
import {AngularFirestore} from '@angular/fire/firestore';
import Annotation from '../store/annotations.model';
import {AnnotationsService} from '../annotations.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {
  @Input() figure: string;
  @Input() address: any;
  @Input() viewAddress: any;
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat;
  lng;
  coordinates;
  annotations: Annotation[];
  constructor(private annotationsService: AnnotationsService) { }

  ngOnInit() {
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.figure?.currentValue){
      if (changes.figure.currentValue === 'point') {
        this.drawFigurePoint(changes.figure.currentValue);
      }
      if (changes.figure.currentValue === 'line') {
        this.drawFigureLine(changes.figure.currentValue);
      }

    }
    if (changes?.address?.currentValue){
      this.saveAnnotation(changes.address);
      this.flyToAddress(changes.address.currentValue.center);
    }
    if (changes?.viewAddress?.currentValue){
      this.flyToAddress(changes.viewAddress.currentValue);
    }
  }
  saveAnnotation(address){
    const annotation = {
      place_name: address.currentValue.place_name,
      center: [address.currentValue.center[0], address.currentValue.center[1]],
      id: address.currentValue.id,
      text: address.currentValue.text
    };
    this.annotationsService.createAnnotation(annotation);
  }
  flyToAddress(address){
    this.map.flyTo({ center: address });
  }

  drawFigurePoint(value){
    const center = this.map.getCenter();
    this.map.flyTo({ center: [center.lng, center.lat] });
    const marker = new mapboxgl.Marker({draggable: true})
      .setLngLat([center.lng, center.lat])
      .addTo(this.map);
    marker.on('dragend', onDragEnd);


    function onDragEnd() {
      const lngLat = marker.getLngLat();
      this.coordinates = this.document.getElementById('coordinates');
      this.coordinates.style.display = 'block';
      this.coordinates.innerHTML =
        'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat;
    }
  }

  drawFigureLine(value){

  }

  initializeMap() {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition( position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.buildMap();
      });
    }
  }
  buildMap() {
    (mapboxgl as typeof mapboxgl).accessToken = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat]
    });
    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());
  }

}
