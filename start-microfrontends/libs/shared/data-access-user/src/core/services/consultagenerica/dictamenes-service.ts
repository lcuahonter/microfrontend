import { BodyTablaDictamenes } from '../../models/shared/consulta-generica.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DictamenesService {
  /**
   * URL base para obtener los datos simulados desde archivos JSON.
   * @private
   * @type {string}
   */
  private datossUrl = '/assets/json/consultagenerica/dictamenes.json';

  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene los datos simulados de dictamenes desde un archivo JSON.
   * 
   * @returns {Observable<BodyTablaDictamenes[]>} Observable que emite los datos de las dictamenes.
   */
  getDictamenes(): Observable<BodyTablaDictamenes[]> {
    return this.http.get<BodyTablaDictamenes[]>(this.datossUrl);
  }
}