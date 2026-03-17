import { BodyConsultaTramite, ConsultaTramiteresponse } from "../models/consulta-tramite-model";
import { Observable, catchError, throwError } from "rxjs";
import { ENVIRONMENT } from "@libs/shared/data-access-user/src";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ConsultaTramiteService {
    /**
         * URL base del servidor configurado en los environments.
         * Se utiliza como prefijo para todas las peticiones del módulo.
         */
    private readonly host: string;

    constructor(private http: HttpClient) {
        this.host = `${ENVIRONMENT.API_HOST}/api`;
    }

    /**
     * @method getDetallesDelTramite
     * @description
     * Realiza una consulta al servicio para obtener la información detallada de un trámite
     * específico.  
     * Envía en el cuerpo de la petición los datos del usuario y sus roles, y utiliza el
     * folio incluido en el body para construir la URL del endpoint.
     *
     * @param {BodyConsultaTramite} body - Objeto que contiene los datos del usuario que realiza la consulta,
     * incluyendo sus roles y el folio del trámite a consultar.
     *
     * @returns {Observable<ConsultaTramiteresponse>}  
     * Retorna un observable con la respuesta del servicio, que incluye código, mensaje y
     * los datos del trámite consultado.
     *
     * @throws  
     * En caso de error, se captura la excepción y se retorna un observable con un objeto
     * estructurado que contiene:
     *  - `status`: Código HTTP del error.
     *  - `message`: Mensaje del error devuelto por el backend o mensaje genérico.
     *  - `raw`: Error completo devuelto por HttpClient.
     *
     * @example
     * this.miServicio.getDetallesDelTramite({
     *   roles_usuario: ['ADMIN'],
     *   user_name: 'usuario',
     *   folio: 'ABC123'
     * }).subscribe({
     *   next: (res) => console.log(res),
     *   error: (err) => console.error(err)
     * });
     */
    getDetallesDelTramite(body: BodyConsultaTramite): Observable<ConsultaTramiteresponse> {
        const URL = `${this.host}/bandeja-tarea/tramite/${body.folio}/consulta`;
        return this.http.post<ConsultaTramiteresponse>(URL, body).pipe(
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