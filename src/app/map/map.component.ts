import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {environment} from '../../environments/environment';
import Annotation from '../store/annotations.model';
import {AnnotationsService} from '../annotations.service';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';

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
  style = 'mapbox://styles/mapbox/dark-v9';
  lat;
  lng;
  annotations: Annotation[];
  draw;
  constructor(private annotationsService: AnnotationsService) { }

  ngOnInit() {
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.figure?.currentValue){
      if (changes.figure.currentValue === 'point') {
        this.drawFigurePoint();
      }
      if (changes.figure.currentValue === 'line') {
        this.drawFigureLine();
      }
      if (changes.figure.currentValue === 'polygon') {
        this.drawFigurePolygon();
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

  drawFigurePoint(){
    if(this.draw){
      this.map.removeControl(this.draw);
    }
    const center = this.map.getCenter();
    const popup = new mapboxgl.Popup({offset:[0, -30]})
      .setText('Position ' + center);
    this.map.flyTo({ center: [center.lng, center.lat] });
    const marker = new mapboxgl.Marker({draggable: true})
      .setLngLat([center.lng, center.lat])
      .addTo(this.map);
    marker.on('dragend', onDragEnd);
    const popupMarker = new mapboxgl.Marker({draggable: true})
      .setLngLat([center.lng, center.lat])
      .setPopup(popup)
      .getPopup()
      .addTo(this.map);


    function onDragEnd() {
      popupMarker.remove();
    }
  }

  drawFigureLine(){
    if(this.draw){
      this.map.removeControl(this.draw);
    }
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: false,
        line_string: true,
        trash: true
      }
    });
    this.map.addControl(this.draw);
  }
  drawFigurePolygon(){
    if(this.draw){
      this.map.removeControl(this.draw);
    }
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      drawing: true,
      controls: {
        polygon: true,
        trash: true
      }
    });
    this.map.addControl(this.draw);
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
