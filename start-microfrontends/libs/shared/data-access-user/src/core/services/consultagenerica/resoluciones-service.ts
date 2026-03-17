import { BodyTablaResolucion } from '../../models/shared/consulta-generica.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResolucionesService {
  /**
   * URL base para obtener los datos simulados desde archivos JSON.
   * @private
   * @type {string}
   */
  private datossUrl = '/assets/json/consultagenerica/resoluciones.json';

  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene los datos simulados de resoluciones desde un archivo JSON.
   * 
   * @returns {Observable<BodyTablaResolucion[]>} Observable que emite los datos de las resoluciones.
   */
  getResoluciones(): Observable<BodyTablaResolucion[]> {
    return this.http.get<BodyTablaResolucion[]>(this.datossUrl);
  }
}