import Annotation from './annotations.model';

export default class AnnotationsState {
  Annotations: Array<Annotation>;
  AnnotationsError: Error;
}

export const initializeState = (): AnnotationsState => {
  return { Annotations: Array<Annotation>(), AnnotationsError: null };
};
