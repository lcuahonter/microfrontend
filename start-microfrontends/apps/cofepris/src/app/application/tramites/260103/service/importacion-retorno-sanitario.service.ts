
import { Facturador } from '../models/importicon-retorno.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tramite260103Store } from '../estados/tramite260103Store.store';

import { JSONResponse } from '@libs/shared/data-access-user/src';
import { PROC_260103 } from '../servers/api.route';

@Injectable({
  providedIn: 'root',
})
export class ImportacionRetornoSanitarioService {
  /**
   * @property {string} jsonUrl
   * Ruta relativa al archivo JSON que contiene los datos del domicilio.
   * Usado para cargar información desde el frontend (assets).
   * @private
   */
  private jsonUrl = 'assets/json/260103/';

  /**
   * Servicio para gestionar operaciones relacionadas con la importación y retorno sanitario.
   * Proporciona métodos para obtener datos de facturadores y actualizar el estado del formulario
   * en el store correspondiente.
   */
  constructor(public httpServicios: HttpClient,private tramite260103Store: Tramite260103Store) {
    // Constructor necesario para inyectar el servicio HttpClient
  }

  /**
   * Método para obtener datos de un "Facturador" desde un archivo JSON remoto.
   * Realiza una solicitud HTTP GET a la URL especificada y devuelve un observable
   * que emite el resultado de la petición.
   * 
   * @returns {Observable<Facturador>} Un observable que emite los datos de un facturador.
   */
  obtenerOstro(): Observable<Facturador> {
    return this.httpServicios.get<Facturador>(
      this.jsonUrl + 'buscar-otros.json'
    );
  }
  /**
   * Actualiza el estado del formulario en el store a partir de los datos proporcionados.
   * @param datos Estado actual del formulario de trámite 260203.
   */
  actualizarEstadoFormulario(datos: Tramite260103Store): void {
    this.tramite260103Store.update((state) => {
      return {
        ...state, ...datos
      }
    });
  }

  /**
   * Obtiene los datos del trámite 260203 desde un archivo JSON local.
   *
   * @returns {Observable<Tramite260203State>} Un observable que emite el estado del trámite 260203.
   */
  getTramiteDatos(): Observable<Tramite260103Store> {
    return this.httpServicios.get<Tramite260103Store>('assets/json/260103/respuestaDeActualizacionDe.json');
  }

  getRegistroTomaMuestrasMercanciasData(id: string): Observable<JSONResponse> {
    return this.httpServicios.get<JSONResponse>(PROC_260103.MOSTRA(id));
  }

}
