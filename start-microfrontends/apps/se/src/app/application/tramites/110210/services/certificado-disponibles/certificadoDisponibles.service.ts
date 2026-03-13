/**
 *  Este servicio proporciona métodos para obtener datos relacionados con tratados y acuerdos.
 */

import { CertificadoDisponibles, HttpCoreService } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CertificadoDisponiblesService {

  /**
   * {HttpCoreService} http - Servicio HTTP para realizar solicitudes.
   */
  constructor(private http: HttpCoreService) { }

  /**
   * @method getData
   *  Obtiene los datos de tratados y acuerdos desde un archivo JSON.
   * @returns {Observable<CertificadoDisponibles[]>} Un observable que emite los datos obtenidos.
   */
  getData(): Observable<CertificadoDisponibles[]> {
    return this.http.get('./assets/json/110210/certificado-disponibles.json');
  }
}
