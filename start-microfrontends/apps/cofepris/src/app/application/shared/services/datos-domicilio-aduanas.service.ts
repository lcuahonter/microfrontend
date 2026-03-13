import {
  Catalogo,
  RespuestaCatalogos,
} from '@libs/shared/data-access-user/src';
import {
  MercanciasTabla,
  RespuestaTabla,
} from '../components/domicilio-establecimiento-aduanas/domicilio-establecimiento-aduanas.component';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PermisoModel } from '../models/datos-domicilio-legal.model';

/**
 * @description
 * Servicio para gestionar las operaciones relacionadas con los datos del domicilio legal.
 * Este servicio proporciona métodos para obtener datos desde archivos JSON locales.
 */
@Injectable({
  providedIn: 'root',
})
export class ServicioDatosDomicilioLegal {
  /**
   * @description
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar solicitudes a archivos JSON locales.
   */
  constructor(public http: HttpClient) {
    //constructor
  }

  /**
   * @description
   * Obtiene la lista de estados desde un archivo JSON local.
   * @returns Observable que emite un objeto de tipo `RespuestaCatalogos`.
   */
  getObtenerEstadoList(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/260501/seleccion.json'
    );
  }

  /**
   * @description
   * Obtiene los datos de la tabla desde un archivo JSON local.
   * @returns Observable que emite un objeto de tipo `RespuestaTabla`.
   */
  getObtenerTablaDatos(): Observable<RespuestaTabla> {
    return this.http.get<RespuestaTabla>('assets/json/260501/tablaDatos.json');
  }

  /**
   * @description
   * Obtiene los datos de mercancías desde un archivo JSON local.
   * @returns Observable que emite un objeto de tipo `MercanciasTabla`.
   */
  getObtenerMercanciasDatos(): Observable<MercanciasTabla> {
    return this.http.get<MercanciasTabla>(
      'assets/json/260501/mercanciasDatos.json'
    );
  }

  /**
   * @description
   * Obtiene los datos de terceros relacionados desde un archivo JSON local.
   * @returns Observable que emite un arreglo de objetos `Catalogo`.
   */
  getData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      'assets/json/260501/terceros-relacionados.json'
    );
  }

  /**
   * @description
   * Obtiene los datos de la tabla de terceros desde un archivo JSON local.
   * @returns Observable que emite un arreglo de objetos `PermisoModel`.
   */
  getTable(): Observable<PermisoModel[]> {
    return this.http.get<PermisoModel[]>('assets/json/260501/terceros.json');
  }
}
