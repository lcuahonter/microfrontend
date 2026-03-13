import { BodyTablaEnvioDigital } from '../../models/shared/consulta-generica.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EnviosDigitalesService {
  /**
   * URL base para obtener los datos simulados desde archivos JSON.
   * @private
   * @type {string}
   */
  private datosEstadoEnvioUrl = '/assets/json/consultagenerica/envios-digitales_envio.json';
  private datosEstadoRevisionUrl = '/assets/json/consultagenerica/envios-digitales_revision.json';

  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene los datos simulados de envio digital con estado de ENVIO desde un archivo JSON.
   * 
   * @returns {Observable<BodyTablaEnvioDigital[]>} Observable que emite los datos de envio digital.
   */
  getEnvioDigital(): Observable<BodyTablaEnvioDigital[]> {
    return this.http.get<BodyTablaEnvioDigital[]>(this.datosEstadoEnvioUrl);
  }
  /**
   * Obtiene los datos simulados de envio digital con estado de REVISION desde un archivo JSON.
   * 
   * @returns {Observable<BodyTablaEnvioDigital[]>} Observable que emite los datos de envio digital.
   */
  getRevisionDigital(): Observable<BodyTablaEnvioDigital[]> {
    return this.http.get<BodyTablaEnvioDigital[]>(this.datosEstadoRevisionUrl);
  }
}