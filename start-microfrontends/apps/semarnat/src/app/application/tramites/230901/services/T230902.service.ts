import { HttpClient } from '@angular/common/http';

import { Injectable, inject } from '@angular/core';

import { toSignal } from '@angular/core/rxjs-interop';

import { ENVIRONMENT } from '@libs/shared/data-access-user/src';

import { Observable, Subject, map, switchMap } from 'rxjs';
import { API_POST_GUARDA_SOLICITUD } from '../constantes/api-constants';
import { SolicitudPayload } from '../estados/store/tramite230901.store';

import { SimpleCatalogoResponse } from '../interfaces/catalogos.interface';


export interface GuardaSolicitudResponse {
  id_solicitud: number;
  fecha_creacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class T230902Service {
  /** http inicializa el HttpClient para realizar solicitudes HTTP */
  private httpClient = inject(HttpClient)
  /** Host base de la API (se obtiene de la configuración de entorno) */
  private urlServer = `${ENVIRONMENT.API_HOST}/api/`;


  /** Subject utilizado para gestionar la desuscripción de observables y prevenir fugas de memoria. */
  private guardarSolicitudSubject = new Subject<SolicitudPayload>();

  /** Se expone como Observable para evitar que los componentes llamen directamente a next(). */
  private guardaSolicitud$ = this.guardarSolicitudSubject.pipe(
    switchMap(params => this.crearSolicitud(params))
  );

  /** Emite un valor de forma sincrónica inmediatamente después de la suscripción  */
  public datosSolicitudGuardado = toSignal(this.guardaSolicitud$);

  // Convierte la informacion. en una señal y actualiza la información solicitada.
  public guardaSolicitud(data: SolicitudPayload): void {
    this.guardarSolicitudSubject.next(data);
  }

  /**
   * Metodo para guardar la  Solicitud.
   * @solicitudPayload dtos requeridos para el guardado
   * @returns Observable<GuardaSolicitudResponse> Respuesta del guardado de la solicitud
   */
  private crearSolicitud(
    SOLICITUD_PAYLOAD: SolicitudPayload
  ): Observable<SimpleCatalogoResponse<GuardaSolicitudResponse>> {
    const URL = `${this.urlServer}${API_POST_GUARDA_SOLICITUD}`;
    return this.httpClient.post<SimpleCatalogoResponse<GuardaSolicitudResponse>>(URL, SOLICITUD_PAYLOAD)
  }

}
