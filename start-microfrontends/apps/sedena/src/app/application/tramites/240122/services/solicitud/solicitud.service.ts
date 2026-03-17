import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tramite240122State } from '../../estados/tramite240122Store.store';

/**
 * Servicio encargado de manejar operaciones relacionadas con la solicitud
 * del trámite 240122. Utiliza HttpClient para obtener datos desde archivos locales o endpoints.
 */
@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  /**
   * Constructor del servicio de solicitud.
   *
   * @param http - Cliente HTTP inyectado para realizar llamadas HTTP.
   */
  constructor(private readonly http: HttpClient) {}

  /**
   * Obtiene el estado inicial del trámite 240122 desde un archivo JSON local.
   *
   * @method getPermisoExtraordinario
   * @returns {Observable<Tramite240122State>} Observable que emite el estado inicial del trámite 240122.
   *
   * @remarks
   * Este método puede utilizarse para inicializar el store con datos base.
   */
  getPermisoExtraordinario(): Observable<Tramite240122State> {
    return this.http.get<Tramite240122State>('assets/json/240122/createInitialState.json');
  }
}
