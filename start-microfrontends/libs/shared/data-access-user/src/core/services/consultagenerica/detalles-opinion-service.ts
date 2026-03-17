import { BodyTablaOpinion, OpinionDetalleOpinion, SolicitudDetalleOpinion } from '../../models/shared/consulta-generica.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DetallesOpinionService {
  /**
   * URL base para obtener los datos simulados desde archivos JSON.
   * @private
   * @type {string}
   */
  private documentosOpinionUrl = '/assets/json/consultagenerica/documentos-detalle-opiniones.json';
  private infoSolicitudOpinionUrl = '/assets/json/consultagenerica/solicitud-detalle-opinion.json';
  private infoOpinionUrl = '/assets/json/consultagenerica/detalle-opinion.json';
  
  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene los datos simulados de los documentos de la opinion desde un archivo JSON.
   * 
   * @returns {Observable<BodyTablaOpinion[]>} Observable que emite los datos de las opiniones.
   */
  getDocumentosDetalleOpinion(): Observable<BodyTablaOpinion[]> {
    return this.http.get<BodyTablaOpinion[]>(this.documentosOpinionUrl);
  }
  /**
   * Obtiene los datos simulados de la seccion de solicitud de una opinion desde un archivo JSON.
   * 
   * @returns {Observable<SolicitudDetalleOpiniones[]>} Observable que emite los datos de la solicitud.
   */
  getSolicitudDetalleOpinion(): Observable<SolicitudDetalleOpinion> {
    return this.http.get<SolicitudDetalleOpinion>(this.infoSolicitudOpinionUrl);
  }
  /**
   * Obtiene los datos simulados de la seccion opinion desde un archivo JSON.
   * 
   * @returns {Observable<OpinionDetalleOpiniones[]>} Observable que emite los datos de las opiniones.
   */
  getOpinionDetalleOpinion(): Observable<OpinionDetalleOpinion> {
    return this.http.get<OpinionDetalleOpinion>(this.infoOpinionUrl);
  }
}