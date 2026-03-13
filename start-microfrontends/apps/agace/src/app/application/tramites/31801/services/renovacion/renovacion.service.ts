import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ManifiestosRespuesta, RenovacionRespuesta } from '../../models/renovacion.model';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';

import { Renovacion31801State, Tramite31801Store } from '../../../../estados/tramites/tramite31801.store';

/**
 * Servicio para gestionar la renovación de un trámite.
 */
@Injectable({
  providedIn: 'root'
})

/**
 * Clase que representa el servicio de renovación.
 * Proporciona métodos para obtener datos relacionados con la renovación.
 */
export class RenovacionService {

  /**
   * Constructor del servicio.
   * @param http - Instancia de HttpClient para realizar solicitudes HTTP.
   */
  constructor(
    private http: HttpClient, private Tramite31801Store: Tramite31801Store
  ) { 
    // Constructor vacío, se utiliza para la inyección de dependencias.
  }

  /**
   * Obtiene los datos del documentos seleccionados.
   * @returns Observable con los datos del documentos seleccionados.
   */
  obtenerDocumentosSeleccionados(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/31801/documentos-seleccionados.json');
  }

  /**
   * Obtiene los datos del renovacion.
   * @returns Observable con los datos del renovacion.
   */
  obtenerRenovacionDatos(): Observable<RenovacionRespuesta> {
    return this.http.get<RenovacionRespuesta>('assets/json/31801/renovacion-datos.json');
  }

  /**
   * Obtiene la lista de manifiestos desde un archivo JSON.
   * 
   * @returns Observable con la respuesta de los manifiestos.
   */
  getManifiestos(): Observable<ManifiestosRespuesta> {
    return this.http.get<ManifiestosRespuesta>('assets/json/31801/manifiestos.json');
  }

  /**
   * Actualiza el estado del formulario en el store con los datos proporcionados.
   * {Solicitud230902State} DATOS - Datos para actualizar el estado.
   */
  actualizarEstadoFormulario(DATOS: Renovacion31801State): void {
    this.Tramite31801Store.setTramite31801State(DATOS);
  }

  /**
   * Obtiene los datos de registro de toma de muestras y mercancías desde un archivo JSON.
   * {Observable<Solicitud230902State>} Observable con los datos de la solicitud.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Renovacion31801State> {
    return this.http.get<Renovacion31801State>('assets/json/31801/registro_toma_muestras_mercancias.json');
  }
}
