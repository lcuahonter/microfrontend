import { API_POST_SOLICITUD_GUARDAR, COMUN_URL } from '@libs/shared/data-access-user/src/core/servers/api-router';
import { Solicitud140103State, Solicitud140103Store } from '../estados/store/solicitud140103.store';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para gestionar las operaciones relacionadas con la solicitud 140103.
 *
 * Este servicio interactúa con el store `Tramite140103Store` para actualizar el estado del formulario
 * y proporciona métodos para obtener datos desde archivos JSON externos.
 *
 * @providedIn root
 */
@Injectable({
  providedIn: 'root',
})
export class Solicitud140103Service {
  /** Host base para las peticiones HTTP*/
  host: string;
  /** URL base del servidor para servicios backend */
  urlServer = ENVIRONMENT.URL_SERVER;
  /** URL base para obtener catálogos JSON auxiliares */
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;
  /**
   * Constructor del servicio que inyecta HttpClient y Tramite140103Store.
   * @param http Cliente HTTP para realizar peticiones REST.
   * @param tramite140103Store Store para gestionar el estado de la solicitud 140103.
   */
  constructor(
    private http: HttpClient,
    private solicitud140103Store: Solicitud140103Store
  ) {
    this.host = `${COMUN_URL.BASE_URL}`;
  }

  /**
   * Actualiza el estado del formulario en el store con los datos proporcionados.
   * Solo actualiza los campos que estén definidos en el objeto DATOS.
   *
   * @param DATOS Estado parcial o completo de la solicitud 140103.
   */
  actualizarEstadoFormulario(DATOS: Solicitud140103State): void {
    if (DATOS.regimen) {
      this.solicitud140103Store.setRegimen(DATOS.regimen);
    }
    if (DATOS.mecanismo) {
      this.solicitud140103Store.setMecanismo(DATOS.mecanismo);
    }
    if (DATOS.tratado) {
      this.solicitud140103Store.setTratado(DATOS.tratado);
    }
    if (DATOS.producto) {
      this.solicitud140103Store.setProducto(DATOS.producto);
    }
    if (DATOS.subproducto) {
      this.solicitud140103Store.setSubproducto(DATOS.subproducto);
    }
    if (DATOS.representacion) {
      this.solicitud140103Store.setRepresentacion(DATOS.representacion);
    }
    this.solicitud140103Store.setCantidad(DATOS.cantidad);
  }

  /**
   * Obtiene los datos de registro para la toma de muestras de mercancías desde un archivo JSON.
   *
   * @returns Observable con el estado de la solicitud 140103.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud140103State> {
    return this.http.get<Solicitud140103State>(
      'assets/json/140103/cancelacion-de-cupo.json'
    );
  }

  /*
   * Guarda los datos de la solicitud.
   * @param {number} tramite - El ID del trámite.
   * @param {any} payload - Los datos a guardar.
   * @returns {Observable<BaseResponse<any>>} - Observable con la respuesta del servidor.
   */

  postGuardarDatos<T>(tramite: string, payload: T): Observable<BaseResponse<T>> {
    const ENDPOINT = `${this.host}${API_POST_SOLICITUD_GUARDAR(tramite)}`;
    return this.http.post<BaseResponse<T>>(ENDPOINT, payload);
  }
}
