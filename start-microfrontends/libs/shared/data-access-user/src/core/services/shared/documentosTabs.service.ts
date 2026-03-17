import { API_GET_DESCARGAR_DOCUMENTOS, COMUN_URL, DOCUMENTOMINIO } from '../../servers/api-router';
import { API_GET_DOCUMENTOS_ESPECIFICOS } from '../../enums/solicitud-documentos.enum';
import { BaseResponse } from '../../models/shared/base-response.model';
import { DocumentosEspecificosResponse } from '../../models/shared/documentos-especificos.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TabDocumentosDescarga } from '../../models/shared/documentos-request.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentosTabsService {

  /**
   * URL base del servicio
   */
  private readonly host: string;



  /**
   * Constructor del servicio AcuseDetalleService
   * @param http HttpClient para realizar peticiones HTTP
   */
  constructor(private http: HttpClient) {
    this.host = `${COMUN_URL.BASE_URL}`;
  }

  /**
   * Indica si la pestaña de documentos cumple con los criterios de validación.
   * Se utiliza para habilitar o deshabilitar funcionalidades relacionadas con la pestaña de documentos.
   */
  public documentosTabValida: boolean = false;

  /**
   * Consulta para base64 de descarga de documentos en pestañas
   * @param documentoMinio  Valor de descarga
   * @returns Observable con la respuesta del servidor
 */
  getDescargarDoc(documentoMinio: string): Observable<BaseResponse<TabDocumentosDescarga>> {
    const ENDPOINT = `${this.host}${API_GET_DESCARGAR_DOCUMENTOS.replace(DOCUMENTOMINIO, documentoMinio)}`;
    return this.http.get<BaseResponse<TabDocumentosDescarga>>(ENDPOINT);
  }

  getDocumentosEspecificos(tramite: string, idSolicitud: string): Observable<BaseResponse<DocumentosEspecificosResponse>> {
    const ENDPOINT = `${this.host}${API_GET_DOCUMENTOS_ESPECIFICOS(tramite)}?esSolicitud=true&idSolicitud=${idSolicitud}&idRequerimiento=0`;
    return this.http.get<BaseResponse<DocumentosEspecificosResponse>>(ENDPOINT);
  }

  /**
   * Verifica si la pestaña de documentos es válida.
   * @returns {boolean} Retorna true si la pestaña de documentos cumple con los criterios de validación, false en caso contrario.
   */
  isDocumentosTabValid(): boolean {
    return this.documentosTabValida;
  }
}
