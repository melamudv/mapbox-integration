import { createAction, props } from '@ngrx/store';
import Annotation from './annotations.model';

export const GetAnnotationAction = createAction('[Annotation] - Get Annotation');

export const CreateAnnotationAction = createAction(
  '[Annotation] - Create Annotation',
  props<Annotation>()
);

export const BeginGetAnnotationAction = createAction('[Annotation] - Begin Get Annotation');

export const SuccessGetAnnotationAction = createAction(
  '[Annotation] - Success Get Annotation',
  props<{ payload: Annotation[] }>()
);

export const BeginCreateAnnotationAction = createAction(
  '[Annotation] - Begin Create Annotation',
  props<{ payload: Annotation }>()
);

export const SuccessCreateAnnotationAction = createAction(
  '[Annotation] - Success Create Annotation',
  props<{ payload: Annotation }>()
);

export const ErrorAnnotationAction = createAction('[Annotation] - Error', props<Error>());
