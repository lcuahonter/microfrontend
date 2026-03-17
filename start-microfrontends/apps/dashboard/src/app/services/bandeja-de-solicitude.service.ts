
import { API_GET_BANDEJATAREA, API_GET_BANDEJA_SOLICITUDES, ENVIRONMENT, JSONResponse } from '@libs/shared/data-access-user/src';
import { BandejaDeTareasPendientes, BandejaTareasPendientesBody, ResponseTable, RespuestaDatos } from '@libs/shared/data-access-user/src/core/models/shared/bandeja-de-tareas-pendientes.model';
import { Observable, catchError, map, retry, take, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SolicitudesPendientesRequest } from '@libs/shared/data-access-user/src/core/models/shared/lib-bandeja.model';
@Injectable({
  providedIn: 'root',
})
export class BandejaDeSolicitudeService {

  /**
   * URL base para las peticiones a la API
   */
  private readonly host: string;

  /**
   * Constructor de la clase BandejaDeSolicitudeService
   * @param http - Instancia de HttpClient para realizar peticiones HTTP
   */
  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }
  /**
   * Recupera los datos del estado desde un archivo JSON local.
   * @returns Un `Observable` de tipo `JSONResponse` que contiene los datos del estado.
   *          Si ocurre un error durante la solicitud HTTP, propagará el error.
   */
  public getSolicitudeTablaDatos(bodyRQ: SolicitudesPendientesRequest): Observable<JSONResponse> {
    const ENDPOINT = `${this.host}${API_GET_BANDEJA_SOLICITUDES}`;
    return this.http
      .post<JSONResponse>(ENDPOINT, bodyRQ)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  /**
   * Recupera la información del departamento desde un archivo JSON local.
   */
  public getTareasPendientesTablaDatos(): Observable<JSONResponse> {
    return this.http
      .get<JSONResponse>(
        'assets/json/bandeja-de-tareas-pendientes/de-tareas-pendientes-tabla.json'
      )
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  /**
   * Recupera la información del departamento desde un archivo JSON local.
   */
  public getDepartamento(): Observable<JSONResponse> {
    return this.http
      .get<JSONResponse>(
        'assets/json/bandeja-de-tareas-pendientes/nombre-del-departamento.json'
      )
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  /**
   * Recupera la información de los tramites
   */
  public getConsultaTramiteTablaDatos(): Observable<JSONResponse> {
    return this.http
      .get<JSONResponse>(
        'assets/json/consulta-tramite/consulta-tramite-tabla.json'
      )
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  /**
   * Recupera la información del catalogo de tipo trámite desde un archivo JSON local.
   */
  public getSolicitudesTablaDatos(): Observable<JSONResponse> {
    return this.http
      .get<JSONResponse>(
        'assets/json/bandeja-de-tareas-pendientes/tipo-Solicitud-catalogo-datos.json'
      )
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  /**
   * Envía una solicitud POST al endpoint de bandeja de tareas pendientes con el cuerpo proporcionado
   * y retorna un observable con la lista de tareas pendientes transformadas.
   *
   * @param body Objeto de tipo `BandejaTareasPendientesBody` que contiene los parámetros de la consulta.
   * @returns Observable que emite un arreglo de objetos `BandejaDeTareasPendientes` con la información de las tareas pendientes.
   *
   * @remarks
   * - Realiza hasta 2 reintentos en caso de error en la petición HTTP.
   * - Solo toma la primera respuesta exitosa.
   * - Transforma la respuesta del backend al formato requerido por la aplicación.
   * - En caso de error, emite un error personalizado con información del endpoint.
   */
  public postBandejaTareas(
    body: BandejaTareasPendientesBody
  ): Observable<BandejaDeTareasPendientes[]> {
    const ENDPOINT = `${this.host}` + API_GET_BANDEJATAREA;
    return this.http.post<ResponseTable>(ENDPOINT, body).pipe(
      retry(2),
      take(1),
      map((x: ResponseTable) => x.datos as unknown as RespuestaDatos[]),
      map((datos: RespuestaDatos[]) => {
        return datos.map(
          (dato: RespuestaDatos) =>
            ({
              folioTramite: dato.folio_tramite,
              tipoDeTramite: dato.descripcion_tipo_tramite,
              nombreDeLaTarea: dato.action_name,
              fechaDeAsignacion: dato.fecha_inicio_tarea,
              estadoDeTramite: dato.estado_tramite,
              departamento:
                BandejaDeSolicitudeService.obtenerAppPorIdDependencia(
                  Number(String(dato.folio_tramite).substring(0, 2))
                ),
              numeroDeProcedimiento: dato.tipo_tramite,
              origin: dato.action_name,
              fechaInicioTramite: dato.fecha_inicio_tramite,
              diasHabilesTranscurridos: dato.dias_trascurridos,
              action_id: dato.action_id,
              current_user: dato.current_user,
              id_solicitud: dato.id_solicitud,
              nombre_pagina: dato.nombre_pagina,
              informacion_adicional: dato.informacion_adicional,
              requerimiento: dato.estado_req_informacion,
              observacion: dato.estado_observacion,
              opinion: dato.estado_opinion,
            } as BandejaDeTareasPendientes)
        );
      }),
      catchError(() => {
        const ERROR = new Error(
          `Ocurrió un error al devolver la información ${ENDPOINT} `
        );
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Retorna el nombre del app según el id_dependencia proporcionado.
   * @param idDependencia - El id de la dependencia.
   * @returns El nombre del app correspondiente, o undefined si no existe.
   */
  public static obtenerAppPorIdDependencia(idDependencia: number): string | undefined {
        const DEPENDENCIA_APP_MAP: Record<number, string> = {
            1: 'aga',
            2: 'se',
            4: 'cofepris',
            5: 'semarnat',
            6: 'sedena',
            8: 'profepa',
            9: 'inah',
            10: 'inbal',
            11: 'amecafe',
            12: 'crt',
            15: 'agricultur',
            17: 'sener',
            25: 'agace',
            27: 'stps'
        };
        return DEPENDENCIA_APP_MAP[idDependencia];
    }
}
