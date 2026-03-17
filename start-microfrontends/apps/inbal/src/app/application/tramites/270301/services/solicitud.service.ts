import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Catalogo } from '@libs/shared/data-access-user/src';
import { Observable } from 'rxjs';

import { ObraTablaDatos } from '../components/datos-de-la-solicitud-plastica/datos-de-la-solicitud-plastica.component';
/**
 * @class SolicitudService
 * @description
 * Servicio encargado de realizar solicitudes HTTP para obtener datos relacionados 
 * con el trámite 270201. Proporciona métodos para recuperar información de diferentes 
 * catálogos como operación, movimiento, país, transporte, aduana, entre otros.
 */
@Injectable({
  providedIn: 'root',
})
export class SolicitudService {
  /**
   * @constructor
   * @description
   * Inicializa el servicio con una instancia de HttpClient para realizar solicitudes HTTP.
   * @param {HttpClient} http - Cliente HTTP para realizar las solicitudes.
   */
  constructor(private http: HttpClient) {
    //
  }

  /**
   * @method getOperacionData
   * @description
   * Obtiene los datos del catálogo de operaciones desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos de operaciones.
   */
  getOperacionData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/270301/operacion.json');
  }

  /**
   * @method getMovimientoData
   * @description
   * Obtiene los datos del catálogo de movimientos desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos de movimientos.
   */
  getMovimientoData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/270301/movimiento.json');
  }

  /**
   * @method getPaisData
   * @description
   * Obtiene los datos del catálogo de países desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos de países.
   */
  getPaisData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/270301/pais.json');
  }

  /**
   * @method getTransporteData
   * @description
   * Obtiene los datos del catálogo de transportes desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos de transportes.
   */
  getTransporteData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/270301/transporte.json');
  }

  /**
   * @method getAduanaData
   * @description
   * Obtiene los datos del catálogo de aduanas desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos de aduanas.
   */
  getAduanaData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/270301/aduana.json');
  }

  /**
   * @method getMotivoData
   * @description
   * Obtiene los datos del catálogo de motivos desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos de motivos.
   */
  getMotivoData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/270301/motivo.json');
  }

  /**
   * @method getMonedaData
   * @description
   * Obtiene los datos del catálogo de monedas desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos de monedas.
   */
  getMonedaData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/270301/moneda.json');
  }

  /**
   * @method getArancelariaData
   * @description
   * Obtiene los datos del catálogo de fracciones arancelarias desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos arancelarios.
   */
  getArancelariaData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/270301/arancelaria.json');
  }

  /**
 * @method getObraDeArteTabla
 * @description
 * Obtiene los datos de las columnas para la tabla de obras de arte desde un archivo JSON localizado en 'assets/json/270201/obra-de-arte.json'.
 * @returns {Observable<string[]>} Un observable que emite un arreglo de cadenas (`string[]`) representando los datos de las columnas.
 */
  getObraDeArteTabla(): Observable<ObraTablaDatos> {
    return this.http.get<ObraTablaDatos>('assets/json/270301/obra-de-arte.json');
  }
}
