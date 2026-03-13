import { ConsultaObservacionesTabla } from '../models/dictamen.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DictamenObservacionesService {

  /**
   * URL base para obtener los datos simulados desde archivos JSON.
   * @private
   * @type {string}
   */
  private dictamenUrl = '/assets/json/funcionario/';

  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient) {
    // No se necesita lógica de inicialización adicional.
  }

  /**
   * Obtiene los datos simulados para el formulario de cambio de modalidad.
   * 
   * @returns {Observable<dictamenUrl>} Observable que emite los datos del formulario.
   */
  getObservaciones(): Observable<ConsultaObservacionesTabla[]> {
    return this.http.get<ConsultaObservacionesTabla[]>(`${this.dictamenUrl}observaciones-dictamen.json`);
  }

}