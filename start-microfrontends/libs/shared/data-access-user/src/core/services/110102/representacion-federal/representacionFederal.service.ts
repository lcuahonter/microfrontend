/**
 *  Este servicio proporciona métodos para obtener datos relacionados con la representación federal.
 */

import { HttpCoreService } from '../../shared/http/http.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Catalogo } from '../../../models/shared/catalogos.model';

@Injectable({
  providedIn: 'root'
})
export class RepresentacionfederalService {

  /**
   * @constructor
   * {HttpCoreService} http - Servicio HTTP para realizar solicitudes.
   */
  constructor(private http: HttpCoreService) {
     // Lógica de inicialización si es necesario
   }
  
  /**
   * @method getEntidadFederativa
   *  Obtiene los datos de la entidad federativa desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite los datos obtenidos.
   */
  getEntidadFederativa(): Observable<Catalogo[]> {
    return this.http.get('./assets/json/110102/entidadfederativa.json');
  }

  /**
   * @method getRepresentacionfederal
   *  Obtiene los datos de la representación federal desde un archivo JSON.
   * @param {string} _entidadFederativa - La entidad federativa para la cual se obtienen los datos.
   * @returns {Observable<Catalogo[]>} Un observable que emite los datos obtenidos.
   */
  getRepresentacionfederal(_entidadFederativa: string): Observable<Catalogo[]> {
    return this.http.get('./assets/json/110102/representacionfederal.json');
  }
}