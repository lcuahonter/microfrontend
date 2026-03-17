/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Servicio para manejar las operaciones relacionadas con las mercancías.
 */

import { HttpCoreService } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
/**
 * Servicio para manejar las operaciones relacionadas con las mercancías.
 */
@Injectable({
  providedIn: 'root'
})
export class MercanciasService {

  /**
   * Constructor del servicio.
   * @param {HttpCoreService} http - Servicio HTTP para realizar peticiones.
   */
  constructor(private http: HttpCoreService) {
    // Lógica del constructor puede ser añadida aquí si es necesario
  }

  /**
   * Obtiene las mercancías desde un archivo JSON.
   * @returns {Observable<any>} - Un observable que emite los datos de las mercancías.
   */
  getMercancias(): Observable<any> {
    return this.http.get('assets/json/110209/mercancias.json');
  }

  /**
   * Obtiene los tipos de factura desde un archivo JSON.
   * @returns {Observable<any>} - Un observable que emite los datos de los tipos de factura.
   */
  getTipoDeFactura(): Observable<any> {
    return this.http.get('assets/json/110209/tipo-de-factura.json');
  }

  /**
   * Obtiene las unidades de medida desde un archivo JSON.
   * @returns {Observable<any>} - Un observable que emite los datos de las unidades de medida.
   */
  getUnidad(): Observable<any> {
    return this.http.get('assets/json/110209/unidad.json');
  }
}