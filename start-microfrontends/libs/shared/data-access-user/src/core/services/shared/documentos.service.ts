import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  API_POST_ACUSE_DOCUMENTO,
  API_POST_ACUSE_RESOLUCIONES,
  API_POST_GUARDAR_ACUSE,
  API_POST_VISTA_PREVIA,
  COMUN_URL,
} from '../../servers/api-router';
import { Observable, catchError, throwError } from 'rxjs';
import { AcuseGuardarResponse } from '../../models/shared/catalogos.model';
import { BaseResponse } from '../../models/shared/base-response.model';
import { DocumentoResponse } from '../../models/shared/documentos-request.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentosService {
  /**
   * URL base del servicio
   */
  private host: string;

  /**
   * Constructor del servicio DocumentosService
   * @param http HttpClient para realizar peticiones HTTP
   */
  constructor(private http: HttpClient) {
    this.host = `${COMUN_URL.BASE_URL}`;
  }

  /**
   * Guarda el acuse de la solicitud
   * @param idSolicitud Identificador de la solicitud
   * @returns Observable con la respuesta del servidor
   */
  guardarAcuse(
    idSolicitud: string,
    procedure: number
  ): Observable<BaseResponse<null>> {
    const ENDPOINT =
      `${this.host}` + API_POST_GUARDAR_ACUSE(idSolicitud, procedure);

    return this.http.post<BaseResponse<null>>(ENDPOINT, null).pipe(
      catchError(() => {
        const ERROR = new Error(
          `Error al obtener la cadena original en ${ENDPOINT}`
        );
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Obtiene la vista previa del documento asociado a la solicitud
   * @param idSolicitud Identificador de la solicitud
   * @returns Observable con la respuesta del servidor que contiene el documento
   */
  vistaPrevia(
    idSolicitud: string,
    procedure: number
  ): Observable<BaseResponse<DocumentoResponse>> {
    const ENDPOINT =

      `${this.host}` + API_POST_VISTA_PREVIA(idSolicitud, procedure);

    return this.http.post<BaseResponse<DocumentoResponse>>(ENDPOINT, null).pipe(
      catchError(() => {
        const ERROR = new Error(
          `Error al obtener la cadena original en ${ENDPOINT}`
        );
        return throwError(() => ERROR);
      })
    );
  }
  /**
   * Obtiene los acuses de resoluciones asociados a un trámite específico.
   * @param numFolioTramite Número de folio del trámite.
   * @param procedure Identificador del procedimiento.
   * @returns Observable con la respuesta del servidor para los acuses de resoluciones.
   */
  acusesResoluciones(
    numFolioTramite: string,
    procedure: number
  ): Observable<BaseResponse<null>> {
    const ENDPOINT =
      `${this.host}` + API_POST_ACUSE_RESOLUCIONES(numFolioTramite, procedure);

    return this.http.get<BaseResponse<null>>(ENDPOINT).pipe(
      catchError(() => {
        const ERROR = new Error(
          `Error al obtener la cadena original en ${ENDPOINT}`
        );
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Obtiene el documento de acuse a partir de su identificador en MinIO.
   * @param documento_minio Identificador del documento en MinIO.
   * @returns Observable con la respuesta del servidor para el documento de acuse.
   */
  acusesDocumento(
    documento_minio: string,
  ): Observable<BaseResponse<null>> {
    const ENDPOINT =
      `${this.host}` + API_POST_ACUSE_DOCUMENTO(documento_minio);

    return this.http.get<BaseResponse<null>>(ENDPOINT).pipe(
      catchError(() => {
        const ERROR = new Error(
          `Error al obtener la cadena original en ${ENDPOINT}`
        );
        return throwError(() => ERROR);
      })
    );
  }
  /**
   * Genera y guarda un documento de acuse asociado a una solicitud y procedimiento específicos.
   * @param idSolicitud Identificador de la solicitud.
   * @param procedure Identificador del procedimiento.
   * @param body Objeto con los datos del documento a guardar (AcuseGuardarResponse).
   * @returns Observable con la respuesta del servidor tras guardar el documento.
   */
  generarDocumento(
    idSolicitud: string,
    procedure: number,
    body: AcuseGuardarResponse | null
  ): Observable<BaseResponse<null>> {
    const ENDPOINT =
      `${this.host}` + API_POST_GUARDAR_ACUSE(idSolicitud, procedure);

    return this.http.post<BaseResponse<null>>(ENDPOINT, body).pipe(
      catchError(() => {
        const ERROR = new Error(
          `Error al obtener la cadena original en ${ENDPOINT}`
        );
        return throwError(() => ERROR);
      })
    );
  }
  /**
   * Obtiene el documento asociado a una solicitud y procedimiento específicos.
   * @param idSolicitud Identificador de la solicitud.
   * @param procedure Identificador del procedimiento.
   * @param body Objeto con los datos necesarios para obtener el documento (AcuseGuardarResponse).
   * @returns Observable con la respuesta del servidor que contiene el documento solicitado.
   */
  conseguirDocumento(
    idSolicitud: string,
    procedure: number,
    body: AcuseGuardarResponse | null
  ): Observable<BaseResponse<DocumentoResponse>> {
    const ENDPOINT =
      `${this.host}` + API_POST_VISTA_PREVIA(idSolicitud, procedure);

    return this.http.post<BaseResponse<DocumentoResponse>>(ENDPOINT, body).pipe(
      catchError(() => {
        const ERROR = new Error(
          `Error al obtener la cadena original en ${ENDPOINT}`
        );
        return throwError(() => ERROR);
      })
    );
  }
}
