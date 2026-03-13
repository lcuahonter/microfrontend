import { Observable } from 'rxjs';
import { Query } from '@datorama/akita';

export interface SolicitudState {
  [key: string]: unknown;
}

export interface SolicitudQuery<T extends SolicitudState> extends Query<T> {
  selectSolicitud$: Observable<T>;
}
