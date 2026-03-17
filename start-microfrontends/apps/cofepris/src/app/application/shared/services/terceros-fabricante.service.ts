import {
  CATALOGO_PAISES,
  COMUN_URL,
  Catalogo,
  RespuestaCatalogos,
} from '@libs/shared/data-access-user/src';
import {
  MercanciasTabla,
  RespuestaTabla,
} from '../components/domicilio-establecimiento/domicilio-establecimiento.component';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PermisoModel } from '../models/datos-domicilio-legal.model';
import { TercerosFabricanteQuery } from '../estados/queries/terceros-fabricante.query';
import { TercerosFabricanteState } from '../estados/stores/terceros-fabricante.store';

/**
 * Servicio para obtener datos de terceros relacionados y permisos desde archivos JSON locales.
 */
@Injectable({
  providedIn: 'root',
})
export class TercerosFabricanteService {

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
   * Constructor del servicio TercerosFabricanteService.
   *
   * @param http - Instancia de HttpClient para realizar solicitudes HTTP.
   */
  constructor(public http: HttpClient,private query: TercerosFabricanteQuery) {
    this.host = `${COMUN_URL.BASE_URL}`;
  }

  /**
   * Obtiene los datos de selección desde un archivo JSON local.
   * @returns Observable que emite un objeto Catalogo.
   */
  getPaisList(tramite: string): Observable<BaseResponse<Catalogo[]>> { 
    const ENDPOINT = `${this.host}${CATALOGO_PAISES(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT); 
  }

  /**
   * Obtiene los datos de un archivo JSON local.
   *
   * @returns Observable que emite un objeto RespuestaCatalogos.
   */
  getObtenerEstadoList(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/260501/seleccion.json'
    );
  }

  /**
   * Obtiene los datos de un archivo JSON local.
   *
   * @returns Observable que emite un objeto RespuestaCatalogos.
   */
  getObtenerTablaDatos(): Observable<RespuestaTabla> {
    return this.http.get<RespuestaTabla>('assets/json/260501/tablaDatos.json');
  }

  /**
   * Obtiene los datos de un archivo JSON local.
   *
   * @returns Observable que emite un objeto RespuestaCatalogos.
   */
  getObtenerMercanciasDatos(): Observable<MercanciasTabla> {
    return this.http.get<MercanciasTabla>(
      'assets/json/260501/mercanciasDatos.json'
    );
  }

  /**
   * Obtiene los datos de terceros relacionados desde un archivo JSON local.
   *
   * @returns Observable que emite un arreglo de objetos Catalogo.
   */
  getData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      'assets/json/260501/terceros-relacionados.json'
    );
  }

 /**
 * Recupera los datos desde un archivo JSON local.
 *
 * @returns Un `Observable` que emite un arreglo de objetos `PermisoModel`.
 */
  getTable(): Observable<PermisoModel[]> {
    return this.http.get<PermisoModel[]>('assets/json/260501/terceros.json');
  }

  /**
 * Obtiene el estado actual de "Terceros Fabricante" desde el store.
 *
 * @returns Un `Observable` que emite el objeto `TercerosFabricanteState`.
 */
  getTercerosFabricanteState(): Observable<TercerosFabricanteState> {
       return this.query.selectSolicitud$;
     }
}
