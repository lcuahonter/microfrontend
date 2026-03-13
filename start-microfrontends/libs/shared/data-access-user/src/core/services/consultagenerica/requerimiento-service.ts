import { BodyTablaRequerimiento } from '../../models/shared/consulta-generica.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequerimientosService {
  /**
   * URL base para obtener los datos simulados desde archivos JSON.
   * @private
   * @type {string}
   */
  private datossUrl = '/assets/json/consultagenerica/requerimientos.json';

  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene los datos simulados de requerimientos desde un archivo JSON.
   * 
   * @returns {Observable<BodyTablaRequerimiento[]>} Observable que emite los datos de las requerimientos.
   */
  getRequerimientos(): Observable<BodyTablaRequerimiento[]> {
    return this.http.get<BodyTablaRequerimiento[]>(this.datossUrl);
  }
}