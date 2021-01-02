import {Action, createReducer, on} from '@ngrx/store';
import * as AnnotationActions from './annotations.action';
import Annotation from './annotations.model';
import AnnotationState, {initializeState} from './annotations.state';

export const intialState = initializeState();

const reducer = createReducer(
  intialState,
  on(AnnotationActions.GetAnnotationAction, state => state),
  on(AnnotationActions.CreateAnnotationAction, (state: AnnotationState, annotation: Annotation) => {
    return { ...state, Annotations: [...state.Annotations, annotation], ToDoError: null };
  }),
  on(AnnotationActions.SuccessGetAnnotationAction, (state: AnnotationState, { payload }) => {
    return { ...state, Annotations: payload };
  }),
  on(AnnotationActions.SuccessCreateAnnotationAction, (state: AnnotationState, { payload }) => {
    return { ...state, Annotations: [...state.Annotations, payload], AnnotationError: null };
  }),
  on(AnnotationActions.ErrorAnnotationAction, (state: AnnotationState, error: Error) => {
    console.log(error);
    return { ...state, ToDoError: error };
  })
);

export function AnnotationReducer(state: AnnotationState | undefined, action: Action) {
  return reducer(state, action);
}
