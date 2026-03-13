import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  /**
   * Observable que emite el identificador de la solicitud actualmente seleccionada.
   * @private
   */
  private idSolicitudSource = new BehaviorSubject<string>('');
  idSolicitud$ = this.idSolicitudSource.asObservable();

  /**
   * emite el id de la solicitud actualmente seleccionada.
   * @param idSolicitud
   */
  emitirIdSolicitud(idSolicitud: string): void {
    this.idSolicitudSource.next(idSolicitud);
  }

  /**
   * Observable que emite el estado de prellenado de la solicitud actualmente seleccionada.
   * @private
   */
  private esPrellenadoSource = new BehaviorSubject<boolean>(false);
  esPrellenado$ = this.esPrellenadoSource.asObservable();

  /**
   * emite el estado de prellenado de la solicitud actualmente seleccionada.
   * @param esPrellenado
   */
  emitirEsPrellenado(esPrellenado: boolean): void {
    this.esPrellenadoSource.next(esPrellenado);
  }
}
