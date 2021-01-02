import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as AnnotationActions from './annotations.action';
import Annotation from './annotations.model';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable()
export class AnnotationEffects {
  constructor(private http: HttpClient, private action$: Actions, private firestore: AngularFirestore) {}

  private ApiURL: string = 'https://localhost:44308/api/ToDo';

  getAnnotations() {
    return this.firestore.collection('annotations').snapshotChanges();
  }

  GetAnnotations$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(AnnotationActions.BeginGetAnnotationAction),
      
      //mergeMap(action =>

        // this.http.get(this.getAnnotations()).pipe(
        //   map((data: Annotation[]) => {
        //     return AnnotationActions.SuccessGetAnnotationAction({ payload: data });
        //   }),
        //   catchError((error: Error) => {
        //     return of(AnnotationActions.ErrorAnnotationAction(error));
        //   })
        // )
      //)
    )
  );

  CreateAnnotations$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(AnnotationActions.BeginCreateAnnotationAction),
      mergeMap(action =>
        this.http
          .post(this.ApiURL, JSON.stringify(action.payload), {
            headers: { 'Content-Type': 'application/json' }
          })
          .pipe(
            map((data: Annotation) => {
              return AnnotationActions.SuccessCreateAnnotationAction({ payload: data });
            }),
            catchError((error: Error) => {
              return of(AnnotationActions.ErrorAnnotationAction(error));
            })
          )
      )
    )
  );
}
