import {
  API_GET_SOLICITUDES_FRACCION_ARANCELARIA_DESCRIPCION,
  API_GET_SOLICITUDES_NICO_DESCRIPCION,
  API_GET_SOLICITUDES_RECENTES,
  API_GET_SOLICITUDES_UNIDAD_MEDIDA,
} from '../../../../../core/server/api-router';
import {
  API_POST_SOLICITUD_GUARDAR,
  API_POST_SOLICITUD_GUARDAR_PARCIAL,
  Catalogo,
  ENVIRONMENT,
  formatFechaCreacion,
} from '@libs/shared/data-access-user/src';
import {
  GuardarSolicitud,
  RespuestaGuardarSolicitud,
} from '../../../models/220203/guardar-solicitud.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { FraccionArancelariaDecripcionModel } from '../../../../220201/models/220201/capturar-solicitud.model';
import { Injectable } from '@angular/core';
import { ResponseParcial } from '../../../models/220203/response-guardado-parcial.model';
import { SolicitudData } from '../../../models/220203/importacion-de-acuicultura.module';

@Injectable({
  providedIn: 'root',
})
export class RegistroSolicitudService {
  /**
   * URL base del servidor al que se realizarán las solicitudes relacionadas con aduanas.
   * Esta variable almacena la dirección del host para los servicios compartidos de catálogos.
   * Es de solo lectura y se inicializa en el constructor del servicio.
   */
  host: string;

  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Obtiene la descripción de la fracción arancelaria para un trámite y clave de fracción dados.
   *
   * @param tramite - El identificador numérico del trámite.
   * @param cveFraccion - La clave de la fracción arancelaria.
   * @returns Un observable con la respuesta base que contiene un arreglo de catálogos.
   */
  obtieneFraccionArancelariaDescripcion(
    tramite: number,
    cveFraccion: string
  ): Observable<BaseResponse<FraccionArancelariaDecripcionModel>> {
    const ENDPOINT = `${
      this.host
    }${API_GET_SOLICITUDES_FRACCION_ARANCELARIA_DESCRIPCION(
      tramite.toString(),
      cveFraccion
    )}`;
    return this.http.get<BaseResponse<FraccionArancelariaDecripcionModel>>(
      ENDPOINT
    );
  }

  /**
   * Obtiene la descripción del NICO (Número de Identificación Comercial) para un trámite y clave de fracción dados.
   *
   * @param tramite - El identificador numérico del trámite.
   * @param cveFraccion - La clave de la fracción arancelaria.
   * @returns Un observable con la respuesta base que contiene la descripción del NICO.
   */
  obtieneNicoDescripcion(
    tramite: number,
    cveFraccion: string,
    cveNico: string
  ): Observable<BaseResponse<Catalogo>> {
    const ENDPOINT = `${this.host}${API_GET_SOLICITUDES_NICO_DESCRIPCION(
      tramite.toString(),
      cveFraccion,
      cveNico
    )}`;
    return this.http.get<BaseResponse<Catalogo>>(ENDPOINT);
  }

  /**
   * Obtiene la unidad de medida asociada a un trámite y fracción específica.
   *
   * @param tramite - El identificador numérico del trámite.
   * @param cveFraccion - La clave de la fracción para la cual se solicita la unidad de medida.
   * @returns Un observable que emite la respuesta base con el catálogo de unidades de medida.
   */
  obtieneUnidadMedida(
    tramite: number,
    cveFraccion: string
  ): Observable<BaseResponse<Catalogo>> {
    const ENDPOINT = `${this.host}${API_GET_SOLICITUDES_UNIDAD_MEDIDA(
      tramite.toString(),
      cveFraccion
    )}`;
    return this.http.get<BaseResponse<Catalogo>>(ENDPOINT).pipe(
      map((response) => {
        // Transformar el dato para que cumpla con la interfaz Catalogo
        const NUEVOCATALOGO: Catalogo = {
          clave: response.datos?.cve_unidad_medida ?? '',
          descripcion: response.datos?.descripcion ?? '',
          id: 0,
        };

        // Retornar la misma estructura de BaseResponse pero con Catalogo mapeado
        return {
          ...response,
          datos: NUEVOCATALOGO,
        } as BaseResponse<Catalogo>;
      })
    );
  }

  /**
   * Obtiene los datos de la solicitud para un tramite especifico
   *
   * @param tramite - El identificador numérico del trámite.
   * @param rfc - RFC de asociado de la solicitud.
   * @returns Un observable que emite la respuesta solicitudes recientes.
   */
  obtieneDatosSolicitud(
    tramite: number,
    rfc: string
  ): Observable<BaseResponse<SolicitudData[]>> {
    const ENDPOINT = `${this.host}${API_GET_SOLICITUDES_RECENTES(
      tramite.toString(),
      rfc
    )}`;
    return this.http.get<BaseResponse<SolicitudData[]>>(ENDPOINT).pipe(
      map((response) => {
        if (response.datos) {
          response.datos = response.datos.map((item: SolicitudData) => ({
            ...item,
            fecha_creacion: item.fecha_creacion
              ? formatFechaCreacion(item.fecha_creacion)
              : item.fecha_creacion,
          }));
        }
        return response;
      })
    );
  }

  /**
   * Guarda los datos de todas las pestañas de la solicitud.
   *
   * @param tramite - El identificador numérico del trámite.
   * * @param solicitud - El identificador de la solicitud.
   * @returns Un observable que emite la respuesta de solicitudes recientes.
   */
  guardarSolicitud(
    tramite: number,
    solicitud: GuardarSolicitud
  ): Observable<BaseResponse<RespuestaGuardarSolicitud>> {
    const ENDPOINT =
      `${this.host}` + API_POST_SOLICITUD_GUARDAR(tramite.toString());
    return this.http.post<BaseResponse<RespuestaGuardarSolicitud>>(ENDPOINT, solicitud).pipe(
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
          `Ocurrió un error al guardar la información ${ENDPOINT} `
        );
        return throwError(() => ERROR);
      })
    );
  }
  guardarParcialSolicitud(
    tramite: number,
    solicitud: GuardarSolicitud
  ): Observable<BaseResponse<ResponseParcial>> {
    const ENDPOINT =
      `${this.host}` + API_POST_SOLICITUD_GUARDAR_PARCIAL(tramite.toString());
    return this.http
      .post<BaseResponse<ResponseParcial>>(ENDPOINT, solicitud)
      .pipe(
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
            `Ocurrió un error al guardar la información ${ENDPOINT} `
          );
          return throwError(() => ERROR);
        })
      );
  }
}
