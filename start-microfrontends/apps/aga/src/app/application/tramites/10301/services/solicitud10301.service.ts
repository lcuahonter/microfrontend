import { RespuestaCatalog, RespuestaConsulta } from '../models/importador-exportador.model';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tramite10301Store } from '../estados/tramite10301.store';

/**
 * Servicio encargado de gestionar los datos del trámite 10301.
 * Proporciona métodos para actualizar el estado del formulario en el store
 * y obtener los datos iniciales desde un archivo JSON local.
 */
@Injectable({
  providedIn: 'root',
})
export class Solicitud10301Service {
  /**
   * URL base del servidor principal definida en la configuración del entorno.
   */
  urlServer = ENVIRONMENT.URL_SERVER;

  /**
   * URL base para obtener archivos JSON auxiliares (catálogos) desde configuración.
   */
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
   * Constructor que inyecta el cliente HTTP y el store para manejar el estado.
   * @param http Cliente HTTP para realizar peticiones.
   * @param tramite10301Store Store de Akita para gestión de estado del trámite.
   */
  constructor(private http: HttpClient, private tramite10301Store: Tramite10301Store) {
    // Constructor para inyección de dependencias
  }

  /**
   * Obtiene los datos del trámite desde un archivo JSON local.
   * Este método permite inicializar o cargar los datos previamente almacenados.
   * @returns Observable que emite un objeto de tipo Solicitud10301State con los datos del trámite.
   */
  public getDatosDeTrtamitelDoc(): Observable<RespuestaConsulta> {
    return this.http.get<RespuestaConsulta>(
      'assets/json/10301/datos-del-tramite.json'
    );
  }

  /**
   * Obtiene los datos para mostrar en la tabla.
   * @returns Un observable con la respuesta de los catálogos de datos de la tabla.
   */
  obtenerDatosTableData(): Observable<RespuestaCatalog[]> {
    return this.http.get<RespuestaCatalog[]>(`assets/json/10301/datosTabla.json`);
  }
  
}