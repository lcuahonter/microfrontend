import { BodyTablaTareasTramite } from '../../models/shared/consulta-generica.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TareasTramiteService {
  /**
   * URL base para obtener los datos simulados desde archivos JSON.
   * @private
   * @type {string}
   */
  private datossUrl = '/assets/json/consultagenerica/tareas-tramite.json';

  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene los datos simulados de las tareas desde un archivo JSON.
   * 
   * @returns {Observable<BodyTablaTareasTramite[]>} Observable que emite los datos de las tareas.
   */
  getTareasTramite(): Observable<BodyTablaTareasTramite[]> {
    return this.http.get<BodyTablaTareasTramite[]>(this.datossUrl);
  }
}