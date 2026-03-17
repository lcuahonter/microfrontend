import { AcuseNotificacionRequerimiento } from '../constants/confirmar-notificacion.enum';
import { AcuseResolucion } from '../models/confirmar-notificacion.model';
import { Documento } from '../models/confirmar-notificacion.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * @service ConfirmarNotificacionService
 * @description
 * Servicio encargado de obtener los datos necesarios para el proceso de confirmación de notificaciones.
 * Consume archivos JSON simulados como fuente de datos.
 */
@Injectable({
  providedIn: 'root',
})
export class ConfirmarNotificacionService {
  /**
   * @constructor
   * @param {HttpClient} http - Cliente HTTP de Angular para realizar peticiones GET.
   */
  constructor(public http: HttpClient) {}

  /**
   * @method getAcuseReciboDatos
   * @description
   * Obtiene la lista de documentos correspondientes al Acuse de Recibo.
   * Los datos son obtenidos desde un archivo JSON local.
   *
   * @returns {Observable<Documento[]>} Observable que emite un arreglo de documentos.
   */
  getAcuseReciboDatos(): Observable<Documento[]> {
    return this.http.get<Documento[]>(
      'assets/json/confirmar-notificacion/acuseDeRecibo.json'
    );
  }

  /**
   * @method getAcuseConfirmarResolucionTablaDatos
   * @description
   * Obtiene los datos de la tabla de acuse de recibo para la confirmación de resolución.
   * Realiza una petición HTTP GET para recuperar un arreglo de objetos `AcuseNotificacionRequerimiento`
   * desde un archivo JSON local.
   *
   * @returns Un observable que emite un arreglo de `AcuseNotificacionRequerimiento`.
   */
  getAcuseConfirmarResolucionTablaDatos(): Observable<AcuseNotificacionRequerimiento[]> {
    return this.http.get<AcuseNotificacionRequerimiento[]>(
      'assets/json/confirmar-notificacion/acuse-confirmar-resolucion.json'
    )
  }

  getResolucionConfirmarResolucionTablaDatos(): Observable<AcuseNotificacionRequerimiento[]> {
    return this.http.get<AcuseNotificacionRequerimiento[]>(
      'assets/json/confirmar-notificacion/resolucion-confirmar-resolucion.json'
    )
  }

  /**
   * @method getFolioDatos
   * @description
   * Obtiene los datos generales del Acuse de Resolución, incluyendo folio, tipo de solicitud, etc.
   * Los datos son obtenidos desde un archivo JSON local.
   *
   * @returns {Observable<AcuseResolucion>} Observable que emite los datos del Acuse de Resolución.
   */
  getFolioDatos(): Observable<AcuseResolucion> {
    return this.http.get<AcuseResolucion>(
      'assets/json/confirmar-notificacion/confirmar-notificacion.json'
    );
  }
}
