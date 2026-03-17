import { Tramite260201State, Tramite260201Store } from '../../tramites/260201/estados/tramite260201Store.store';
import { ENVIRONMENT } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio encargado de manejar la lógica relacionada con la solicitud del trámite 260201.
 * Se encarga de actualizar el estado de la solicitud en el store y de obtener datos precargados desde archivos JSON.
 */
@Injectable({
  providedIn: 'root',
})
export class DatosSolicitudConsultaService {
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
   * @param tramite260201Store Store personalizado para el manejo del estado del trámite 260201.
   */
  constructor(
    private http: HttpClient,
    private tramite260201Store: Tramite260201Store
  ) {
    // Lógica de inicialización si es necesario
  }

  /**
   * Actualiza el estado del formulario de la solicitud en el store con la información proporcionada.
   * Cada propiedad del objeto recibido es asignada al store correspondiente.
   * 
   * @param DATOS Objeto con la estructura completa del estado del formulario del trámite 260201.
   */
  actualizarEstadoFormulario(DATOS: Tramite260201State): void {
    this.tramite260201Store.updateDatosSolicitudFormState(DATOS.datosSolicitudFormState);
  }

  /**
   * Obtiene los datos precargados desde un archivo JSON relacionado con el registro de toma de muestras de mercancías.
   * Este archivo contiene información que se puede utilizar para precargar el estado del formulario.
   * 
   * @returns Observable con la estructura del estado de la solicitud.
   */
  getDatosSolicitudData(): Observable<Tramite260201State> {
    return this.http.get<Tramite260201State>('assets/json/260201/datos-solicitud.json');
  }
}
