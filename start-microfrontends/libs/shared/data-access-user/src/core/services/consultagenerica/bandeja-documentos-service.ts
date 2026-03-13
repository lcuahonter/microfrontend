import { BodyTablaDocumentos } from '../../models/shared/consulta-generica.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentosService {
  /**
   * URL base para obtener los datos simulados desde archivos JSON.
   * @private
   * @type {string}
   */
  private documentosUrl = '/assets/json/consultagenerica/bandeja-documentos.json';

  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene los datos simulados de documentos desde un archivo JSON.
   * 
   * @returns {Observable<Documento[]>} Observable que emite los datos de los documentos.
   */
  getDocumentos(): Observable<BodyTablaDocumentos[]> {
    return this.http.get<BodyTablaDocumentos[]>(this.documentosUrl);
  }
}