import { AcusesYResoluciones } from '../../../models/shared/subsecuentes.model';
import { BotonDeAccion } from '../../../models/shared/subsecuentes.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * @service SubsecuentesService
 * @description
 * Servicio encargado de obtener datos relacionados con acuses, resoluciones y botones de acción
 * para el flujo de trámites subsecuentes.
 */
@Injectable({
  providedIn: 'root',
})
export class SubsecuentesService {
  /**
   * @constructor
   * @param {HttpClient} http - Cliente HTTP de Angular para realizar peticiones GET.
   */
  constructor(public http: HttpClient) {}

  /**
   * Obtiene los datos de acuses y resoluciones.
   * Los datos son obtenidos desde un archivo JSON local.
   *
   * @returns {Observable<AcusesYResoluciones>} Observable que emite los datos de acuses y resoluciones.
   */
  getAcusesYResolucionesDatos(): Observable<AcusesYResoluciones> {
    return this.http.get<AcusesYResoluciones>(
      '/assets/json/subsecuentes/acusesYResolucionesDatos.json'
    );
  }

  /**
   * Obtiene la lista de botones de acción configurados.
   * Los datos son obtenidos desde un archivo JSON local.
   *
   * @returns {Observable<BotonDeAccion[]>} Observable que emite un arreglo de botones de acción.
   */
  getButtonesAcciones(): Observable<BotonDeAccion[]> {
    return this.http.get<BotonDeAccion[]>(
      '/assets/json/subsecuentes/BotonDeAccion.json'
    );
  }
}
