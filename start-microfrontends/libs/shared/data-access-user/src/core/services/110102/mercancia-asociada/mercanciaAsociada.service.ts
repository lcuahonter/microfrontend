/**
 *  Este servicio proporciona métodos para obtener datos relacionados con la mercancía asociada.
 */

import { HttpCoreService } from '../../shared/http/http.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MercanciaasociadaService {

  /**
   * {HttpCoreService} http - Servicio HTTP para realizar solicitudes.
   */
  constructor(private http: HttpCoreService) {
    // Lógica de inicialización si es necesario
   }
  
  /**
   * @method getMercanciaAsociada
   *  Obtiene los datos de la mercancía asociada desde un archivo JSON.
   * @returns {Observable<unknown>} Un observable que emite los datos obtenidos.
   */
  getMercanciaAsociada(): Observable<unknown> {
    return this.http.get('./assets/json/110102/mercanciaasociada.json');
  }
}