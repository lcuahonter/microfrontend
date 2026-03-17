/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Este servicio maneja las operaciones relacionadas con el transporte.
 */

import { HttpCoreService } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Este servicio maneja las operaciones relacionadas con el transporte.
 */

@Injectable({
  providedIn: 'root'
})
export class TransporteService {

  /**
   * Constructor del servicio.
   * @param {HttpCoreService} http - Servicio HTTP para realizar peticiones.
   */
  constructor(private http: HttpCoreService) {
    // Lógica del constructor puede ser añadida aquí si es necesario
  }

  /**
   * Obtiene las opciones de medio de transporte desde un archivo JSON.
   * @returns {Observable<any>} - Un observable que emite los datos del medio de transporte.
   */
  getMedioDeTransporte(): Observable<any> {
    return this.http.get('assets/json/110209/transporte.json');
  }
}