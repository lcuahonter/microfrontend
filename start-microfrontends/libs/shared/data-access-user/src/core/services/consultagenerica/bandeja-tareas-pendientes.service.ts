import { API_GET_BANDEJATAREA, API_POST_TAREA_ACTIVAR, COMUN_URL } from "../../servers/api-router";
import { ActivarTareaRequest } from "../../models/shared/bandeja-tarea-activar.model";
import { BaseResponse } from "../../models/shared/base-response.model";

import { BandejaDeTareasPendientes, BandejaTareasPendientesBody, ResponseTable, RespuestaDatos } from "../../models/shared/bandeja-de-tareas-pendientes.model";
import { Observable, catchError, map, retry, take, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class BandejaDeSolicitudeService {
    /**
     * URL base del servidor al que se realizarán las solicitudes para la consulta de la bandeja de tareas pendientes.
     * Esta variable almacena la dirección del host que será utilizada por los métodos del servicio para interactuar con la API correspondiente.
     */
    private readonly host: string;

    constructor(private http: HttpClient) { 
        this.host = `${COMUN_URL.BASE_URL}`;
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
    public postBandejaTareas(body: BandejaTareasPendientesBody): Observable<BandejaDeTareasPendientes[]> {
    const ENDPOINT = `${this.host}` + API_GET_BANDEJATAREA;
        return this.http.post<ResponseTable>(ENDPOINT, body).pipe(
            retry(2),
            take(1),
            map((x: ResponseTable) => x.datos as unknown as RespuestaDatos[]),
            map((datos: RespuestaDatos[]) => {
                return datos.map((dato: RespuestaDatos) => ({  
                    folioTramite: dato.folio_tramite,
                    tipoDeTramite: dato.descripcion_tipo_tramite,
                    nombreDeLaTarea: dato.action_name,
                    fechaDeAsignacion: dato.fecha_inicio_tarea,
                    estadoDeTramite: dato.estado_tramite,
                    departamento: BandejaDeSolicitudeService.obtenerAppPorIdDependencia(Number(String(dato.folio_tramite).substring(0, 2))),
                    numeroDeProcedimiento: dato.tipo_tramite,
                    origin: dato.action_name,
                    fechaInicioTramite: dato.fecha_inicio_tramite,
                    diasHabilesTranscurridos: dato.dias_trascurridos,
                    action_id: dato.action_id,
                    current_user: dato.current_user,
                    id_solicitud: dato.id_solicitud,
                    nombre_pagina: dato.nombre_pagina,
                    tareas_usuario: dato.tareas_usuario,
                    id_tarea: dato.id_tarea,
                    rol_actual: dato.rol_tarea
                } as BandejaDeTareasPendientes))
            }),
            catchError(() => {
                const ERROR = new Error(`Ocurrió un error al devolver la información ${ENDPOINT} `);
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

    /**
     * Activa una tarea enviando una solicitud POST al endpoint correspondiente.
     *
     * @param PAYLOAD - Objeto de tipo `ActivarTareaRequest` que contiene los datos necesarios para activar la tarea.
     * @returns Observable que emite un objeto `BaseResponse<boolean>` indicando el resultado de la operación.
     */
    postActivarTarea(PAYLOAD: ActivarTareaRequest): Observable<BaseResponse<boolean>> {
        const ENDPOINT = `${this.host}${API_POST_TAREA_ACTIVAR}`;
        return this.http.post<BaseResponse<boolean>>(ENDPOINT, PAYLOAD);
    }
}