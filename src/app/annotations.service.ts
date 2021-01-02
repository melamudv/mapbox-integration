import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import Annotation from './store/annotations.model';


@Injectable({
  providedIn: 'root'
})
export class AnnotationsService {

  constructor(private firestore: AngularFirestore) { }

  getAnnotations() {
    return this.firestore.collection('annotations').snapshotChanges();
  }

  createAnnotation(annotation: Annotation){
    return this.firestore.collection('annotations').add(annotation);
  }

  deleteAnnotation(annotationId: string){
    this.firestore.doc('annotations/' + annotationId).delete();
  }
}
