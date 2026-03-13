import { AcusesYResolucionesResponse, body_post_acuses_y_resoluciones } from "../models/acuses-y-resoluciones-folio-tramite.model";
import { Observable, catchError, throwError } from "rxjs";
import { ENVIRONMENT } from "@libs/shared/data-access-user/src";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

/**
 * Servicio responsable de consultar los acuses y resoluciones
 * asociados a un folio de trámite.
 *
 * Este servicio realiza una solicitud POST a la API del backend.
 */
@Injectable({
    providedIn: 'root'
})
export class AcusesYResolucionesService {
    /**
     * URL base del servidor configurado en los environments.
     * Se utiliza como prefijo para todas las peticiones del módulo.
     */
    private readonly host: string;

    constructor(private http: HttpClient) {
        this.host = `${ENVIRONMENT.API_HOST}/api`;
    }

    /**
     * Obtiene los acuses y resoluciones relacionados al folio de un trámite.
     * 
     * @param {body_post_acuses_y_resoluciones} body - Objeto con los datos requeridos
     * para la consulta:
     *    - `rfc_solicitante`: RFC del solicitante que realiza la consulta.
     *    - `cve_usuario`: Clave del usuario autenticado.
     *    - `rol_actual`: Rol activo del usuario en el sistema.
     *    - `num_folio_tramite`: Número de folio del trámite a consultar.
     *    - `fecha_inicio`: Fecha inicial del rango de búsqueda (formato YYYY-MM-DD).
     *    - `fecha_fin`: Fecha final del rango de búsqueda (formato YYYY-MM-DD).
     *    - `certificado`: Valor null (reservado para usos futuros o datos no aplicables).
     * 
     * @returns {Observable<AcusesYResolucionesResponse>} Observable que emite
     * la respuesta del backend en caso exitoso.
     * 
     * @throws {ApiError} En caso de error, emite un objeto con:
     *    - `status`: Código HTTP retornado por la API.
     *    - `message`: Mensaje de error legible.
     *    - `raw`: Error original devuelto por HttpClient.
     *
     * @example
     * this.acusesService.getAcusesYResoluciones({
     *    rfc_solicitante: 'ABC123456789',
     *    cve_usuario: 'jgarcia',
     *    rol_actual: 'ANALISTA',
     *    num_folio_tramite: '123456789',
     *    fecha_inicio: '2025-01-01',
     *    fecha_fin: '2025-01-31',
     *    certificado: null
     * }).subscribe({
     *    next: (resp) => console.log('Datos:', resp),
     *    error: (err) => console.error('Error:', err.message)
     * });
     */
    getAcusesYResoluciones(body: body_post_acuses_y_resoluciones)
        : Observable<AcusesYResolucionesResponse> {
        const URL = `${this.host}/bandeja-tarea/consulta/acuses-resoluciones`;

        return this.http.post<AcusesYResolucionesResponse>(URL, body).pipe(
            catchError(error => {
                const ERROR = {
                    status: error.status,
                    message: error.error?.message || error.message || 'Error desconocido',
                    raw: error
                };
                return throwError(() => ERROR);
            })
        );
    }

}