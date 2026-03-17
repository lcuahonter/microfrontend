import {Tramite260912Store, Tramites260912State } from '../estados/tramite-260912.store';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * @description
 * Servicio encargado de gestionar las operaciones relacionadas con el trámite 120402,
 * incluyendo la actualización del estado del formulario y la obtención de datos de ejemplo
 * para la toma de muestras de mercancías.
 */
@Injectable({
  providedIn: 'root',
})
export class Solocitud260912Service {
  /**
   * @description
   * URL base del servidor principal de la aplicación, proveniente de las variables de entorno.
   */
  urlServer = ENVIRONMENT.URL_SERVER;

  /**
   * @description
   * URL del servidor de catálogos JSON auxiliares, utilizado para obtener datos estáticos.
   */
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
   * @description
   * Constructor del servicio que inyecta las dependencias necesarias.
   * 
   * @param http Cliente HTTP para realizar solicitudes al servidor.
   * @param tramite260912Store Estado global relacionado con el trámite 120402.
   */
  constructor(
    private http: HttpClient,
    private tramite260912Store: Tramite260912Store,
  ) {
    // Inicialización adicional si es necesario
  }

  /**
   * @description
   * Actualiza el estado del formulario del trámite 120402 dentro del store.
   *
   * @param DATOS Objeto con el nuevo estado del trámite 120402.
   */
  actualizarEstadoFormulario(DATOS: Tramites260912State): void {
    this.tramite260912Store.setTramite260912State(DATOS);
  }

  /**
   * @description
   * Obtiene los datos de ejemplo para el formulario de registro de toma de muestras
   * de mercancías desde un archivo JSON local.
   *
   * @returns Observable que emite un objeto con el estado del trámite 120402.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Tramites260912State> {
    return this.http.get<Tramites260912State>('assets/json/260912/consulta-journy-data.json');
  }

}
