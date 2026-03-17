import { BodyTablaAcuses } from '../../models/shared/consulta-generica.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AcusesService {
  /**
   * URL base para obtener los datos simulados desde archivos JSON.
   * @private
   * @type {string}
   */
  private datossUrl = '/assets/json/consultagenerica/acuses.json';

  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene los datos simulados de acuses desde un archivo JSON.
   * 
   * @returns {Observable<BodyTablaAcuses[]>} Observable que emite los datos de los acuses.
   */
  getAcuses(): Observable<BodyTablaAcuses[]> {
    return this.http.get<BodyTablaAcuses[]>(this.datossUrl);
  }
}