import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  /**
   * Emitir el id de la solicitud registrada.
   */
  private idSolicitudSource = new BehaviorSubject<string>('');
  idSolicitud$ = this.idSolicitudSource.asObservable();

  /**
   * Emitir el id de la solicitud registrada.
   * @param idSolicitud
   */
  emitirIdSolicitud(idSolicitud: string): void {
    this.idSolicitudSource.next(idSolicitud);
  }

  /**
   * Emitir el estado de prelleno del formulario.
   */
  private esPrellenadoSource = new BehaviorSubject<boolean>(false);
  esPrellenado$ = this.esPrellenadoSource.asObservable();

  /**
   * Emitir el estado de prelleno del formulario.
   * @param esPrellenado
   */
  emitirEsPrellenado(esPrellenado: boolean): void {
    this.esPrellenadoSource.next(esPrellenado);
  }
}
