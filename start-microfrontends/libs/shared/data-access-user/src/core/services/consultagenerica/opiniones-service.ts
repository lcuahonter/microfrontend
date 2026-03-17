import { BodyTablaOpiniones } from '../../models/shared/consulta-generica.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpinionesService {
  /**
   * URL base para obtener los datos simulados desde archivos JSON.
   * @private
   * @type {string}
   */
  private datossUrl = '/assets/json/consultagenerica/opiniones.json';

  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene los datos simulados de opiniones desde un archivo JSON.
   * 
   * @returns {Observable<BodyTablaOpiniones[]>} Observable que emite los datos de las opiniones.
   */
  getOpiniones(): Observable<BodyTablaOpiniones[]> {
    return this.http.get<BodyTablaOpiniones[]>(this.datossUrl);
  }
}