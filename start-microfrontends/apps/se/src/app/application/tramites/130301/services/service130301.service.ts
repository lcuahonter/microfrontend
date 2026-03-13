import { Solicitud130301State, Tramite130301Store } from '../../../estados/tramites/tramite130301.store';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio encargado de manejar la lógica relacionada con la solicitud del trámite 130301.
 * Se encarga de actualizar el estado de la solicitud en el store y de obtener datos precargados desde archivos JSON.
 */
@Injectable({
  providedIn: 'root',
})
export class Solocitud130301Service {
    /**
     * Convierte los datos crudos de la solicitud en un objeto Solicitud130301State.
     * @param DATOS Datos obtenidos de la solicitud.
     * @returns Estado del formulario mapeado.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reverseBuildSolicitud130301(DATOS: Record<string, any>): Solicitud130301State {
      return {
        idSolicitud: DATOS['idSolicitud'] ?? 0,
        folioPermiso: DATOS['folioPermiso'] ?? '',
        paisEmisorCertificado: DATOS['paisEmisorCertificado'] ?? '',
        mixed: DATOS['mixed'] ?? '',
        paisDeOrigen: DATOS['paisDeOrigen'] ?? '',
        motivoJustificacion: DATOS['motivoJustificacion'] ?? '',
        otrasDeclaraciones: DATOS['otrasDeclaraciones'] ?? '',
        // Agrega aquí otros campos requeridos por Solicitud130301State
      } as Solicitud130301State;
    }
  /**
   * URL base del servidor principal.
   */
  urlServer = ENVIRONMENT.URL_SERVER;

  /**
   * URL base del servidor que contiene los catálogos auxiliares en formato JSON.
   */
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar solicitudes a servicios o archivos locales.
   * @param tramite130301Store Store personalizado para el manejo del estado del trámite 130301.
   */
  constructor(
    private http: HttpClient,
    private tramite130301Store: Tramite130301Store
  ) {
    // Lógica de inicialización si es necesario
  }

  /**
   * Actualiza el estado del formulario de la solicitud en el store con la información proporcionada.
   * Cada propiedad del objeto recibido es asignada al store correspondiente.
   * 
   * @param DATOS Objeto con la estructura completa del estado del formulario del trámite 130301.
   */
  actualizarEstadoFormulario(DATOS: Solicitud130301State): void {
    this.tramite130301Store.setPaisEmisorCertificado(DATOS.paisEmisorCertificado);
    this.tramite130301Store.setMixed(DATOS.mixed);
    this.tramite130301Store.setPaisDeOrigen(DATOS.paisDeOrigen);
    this.tramite130301Store.setMotivoJustificacion(DATOS.motivoJustificacion);
    this.tramite130301Store.setOtrasDeclaraciones(DATOS.otrasDeclaraciones);
  }

  /**
   * Obtiene los datos precargados desde un archivo JSON relacionado con el registro de toma de muestras de mercancías.
   * Este archivo contiene información que se puede utilizar para precargar el estado del formulario.
   * 
   * @returns Observable con la estructura del estado de la solicitud.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud130301State> {
    return this.http.get<Solicitud130301State>('assets/json/130301/registro_toma_muestras_mercancias.json');
  }
}
