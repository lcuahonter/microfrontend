import { Injectable } from '@angular/core';

import { AvisoValor, PermisoModel } from '../models/permiso-importacion.model';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';

/**
 * @service PermisoPetroleoService
 * @description Servicio que proporciona métodos para obtener datos relacionados con permisos de petróleo.
 */
@Injectable({
  providedIn: 'root'
})
export class PermisoPetroleoService {
  /**
   * @constructor
   * @description Constructor del servicio que inyecta el cliente HTTP.
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes a recursos externos.
   */
  constructor(private http: HttpClient) {
    // Constructor
  }

  /**
   * @method obtenerTabla
   * @description Obtiene los datos de la tabla de permisos desde un archivo JSON.
   * @returns {Observable<PermisoModel[]>} Observable que emite una lista de modelos de permisos.
   */
  obtenerTabla(): Observable<PermisoModel[]> {
    return this.http.get<PermisoModel[]>('assets/json/130302/petroleo.json');
  }

  /**
   * @method getSolicitante
   * @description Obtiene los datos del solicitante desde un archivo JSON.
   * @returns {Observable<AvisoValor>} Observable que emite los valores asociados al aviso.
   */
  getSolicitante(): Observable<AvisoValor> {
    return this.http.get<AvisoValor>('assets/json/130302/permiso.json');
  }
}