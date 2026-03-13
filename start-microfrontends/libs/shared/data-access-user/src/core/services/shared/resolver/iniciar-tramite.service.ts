import { Injectable } from '@angular/core';

import { BaseResponse } from '../../../models/5701/base-response.model';
import { CONSTRUIR_ENDPOINT_INICIAR } from '../../../servers/api-router';

import { IniciarConfig, IniciarRequest } from '../../../constants/iniciar-tramite.constants';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpCoreService } from '../http/http.service';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Servicio compartido para inicializar trámites
 */
@Injectable({
  providedIn: 'root'
})
export class IniciarTramiteService {
  /**
   * Datos del trámite almacenados
   * @type {object | undefined}
   */
  private tramiteData?: {
    /**
     * Folio del programa autorizado
     * @type {string | undefined}
     */
    folio_programa?: string;
    /**
     * ID del programa autorizado
     * @type {string | undefined}
     */
    id_programa_autorizado?: string;
  };

  /**
   * Constructor del servicio IniciarTramiteService.
   * @param http - Cliente HTTP para realizar solicitudes al servidor.
   */
  constructor(private http: HttpCoreService) {
  }

  /**
   * Inicia un trámite genérico.
   * @param payload Payload con RFC y rol del solicitante.
   * @param config Configuración del trámite (ID del procedimiento).
   * @returns Observable con la respuesta del servidor.
   */
  postIniciar(payload: IniciarRequest, config?: IniciarConfig): Observable<BaseResponse<null>> {
    // Construir el endpoint dinámicamente usando la función helper
    const ENDPOINT = CONSTRUIR_ENDPOINT_INICIAR(config?.procedureId || '');
    return this.http.post<BaseResponse<null>>(ENDPOINT, { body: payload }).pipe(
      map((response) => {
        return response;
      }),
      catchError((httpError) => {
        if (httpError instanceof HttpErrorResponse) {
          return throwError(() => ({
            success: false,
            error: httpError.error,
          }));
        }
        const ERROR = new Error(
          `Ocurrió un error al inicializar el trámite ${ENDPOINT}`
        );
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Establece los datos del trámite.
   * @param data Datos del trámite a establecer.
   */
  setTramiteDatos(data: {
    folio_programa?: string;
    id_programa_autorizado?: string;
  }): void {
    this.tramiteData = data;
  }

  /**
   * Obtiene los datos del trámite almacenados.
   * @returns Datos del trámite o undefined si no existen.
   */
  getTramiteDatos(): {
    folio_programa?: string;
    id_programa_autorizado?: string;
  } | undefined {
    return this.tramiteData;
  }

  /**
   * Limpia los datos del trámite almacenados.
   * @returns void
   */
  clearTramiteDatos(): void {
    this.tramiteData = undefined;
  }
}
