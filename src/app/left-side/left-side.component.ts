import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Feature, MapboxServiceService} from '../mapbox-service.service';
import {AnnotationsService} from '../annotations.service';
import Annotation from '../store/annotations.model';

@Component({
  selector: 'app-left-side',
  templateUrl: './left-side.component.html',
  styleUrls: ['./left-side.component.scss']
})
export class LeftSideComponent implements OnInit {
  @Output() figureClicked = new EventEmitter();
  @Output() addressClicked = new EventEmitter();
  @Output() viewAddress = new EventEmitter();
  value = 'Clear me';
  addresses: any[] = [];
  selectedAddress = null;
  annotations: Annotation[];

  constructor(private mapboxService: MapboxServiceService, private annotationsService: AnnotationsService) { }

  ngOnInit(): void {
    this.getAllAnnotation();
  }
  getAllAnnotation() {
    this.annotationsService.getAnnotations().subscribe(data => {
      this.annotations = data.map(e => {
        return {
          idFirebase: e.payload.doc.id,
          ...e.payload.doc.data() as any
        } as Annotation;
      });
    });
  }

  search(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.length > 0) {
      this.mapboxService
        .search_word(searchTerm)
        .subscribe((features: Feature[]) => {
          this.addresses = features.map(feat => feat);
        });
    } else {
      this.addresses = [];
    }
  }

  onSelect(address: any) {
    this.addressClicked.emit(address);
    this.selectedAddress = address.place_name;
    this.addresses = [];
  }

  onClick(value) {
    this.figureClicked.emit(value);
  }

  onView(point: number[]) {
    this.viewAddress.emit(point);
  }

  onDelete(id: string) {
    this.annotationsService.deleteAnnotation(id);
    this.getAllAnnotation();
  }
}
