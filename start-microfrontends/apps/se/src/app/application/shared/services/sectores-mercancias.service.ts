import { CATALOGO_SECTOR, COMUN_URL } from '@libs/shared/data-access-user/src';
import {
  SolicitudSectoresYMercanciasState,
  TramiteSectoresYMercanciasStore,
} from '../estados/stores/sectores-y-mercancias.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Catalogo } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';

import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';

@Injectable({
  providedIn: 'root',
})
export class SectoresMercanciasService {

  /**
     * URL base del host para todas las consultas de catálogos.
     *
     * Esta propiedad almacena la URL base configurada desde las variables de entorno
     * y se utiliza como prefijo para construir todos los endpoints de los catálogos.
     *
     * @type {string}
     * @readonly
     * @since 1.0.0
     */
    host!: string;


     /**
   * Servicio para obtener datos de terceros relacionados y permisos.
   *
   * @param http - Instancia de HttpClient para realizar solicitudes HTTP.
   */
  constructor(
    private readonly http: HttpClient,
    private tramiteSectoresYMercanciasStore: TramiteSectoresYMercanciasStore
  ) {

      this.host = `${COMUN_URL.BASE_URL}`;
    // No se necesita lógica de inicialización adicional.
  }

  /**
   * Método para actualizar el estado del formulario con los datos proporcionados.
   * @param DATOS - Objeto que contiene el estado del trámite.
   */
  actualizarEstadoFormulario(DATOS: SolicitudSectoresYMercanciasState): void {
    this.tramiteSectoresYMercanciasStore.setFraccion(DATOS.fraccion);
    this.tramiteSectoresYMercanciasStore.setRfc(DATOS.rfc);
    this.tramiteSectoresYMercanciasStore.setSector(DATOS.sector);
  }

  /**
   * Método para obtener los datos del registro de toma de muestras de mercancías.
   * @returns Observable que emite el estado del trámite.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<SolicitudSectoresYMercanciasState> {
    return this.http.get<SolicitudSectoresYMercanciasState>(
      'assets/json/90202/registro_toma_muestras_mercancias.json'
    );
  }

  /**
   * Obtiene el catálogo de sectores desde un archivo JSON local.
   *
   * @returns Un observable que emite la respuesta del catálogo de sectores.
   */
  // getSectorCatalog(): Observable<RespuestaCatalogos> {
  //   return this.http.get<RespuestaCatalogos>('assets/json/90202/sector.json');
  // }

    getSectorCatalog(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_SECTOR(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }
}
