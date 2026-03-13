import { Observable, catchError, throwError } from "rxjs";
import { ConsultaTramiteAgriculturaResponse } from "../../models/certificados/agricultura/response/consulta-tramite";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
@Injectable({
    providedIn: 'root'
})
export class AgriculturaService {
    /**
     * Constructor del servicio.
     *
     * @param http - Servicio HttpClient utilizado para realizar
     * peticiones HTTP.
     */
    constructor(private http: HttpClient) { }

    /**
     * Obtiene la lista de trámites de agricultura.
     *
     * Realiza una petición HTTP GET para consultar un archivo JSON
     * local que contiene la información de los trámites.
     *
     * @returns {Observable<ConsultaTramiteAgriclturaResponse>}
     * Observable que emite un arreglo de trámites de agricultura.
     *
     * @throws Propaga el error HTTP en caso de fallo durante la petición.
     */
    obtenerTramites(): Observable<ConsultaTramiteAgriculturaResponse> {
        return this.http
            .get<ConsultaTramiteAgriculturaResponse>(
                `/assets/json/tareas/certificados/agricultura/consultaTramiteLista.json`
            )
            .pipe(
                catchError((error) => {
                    return throwError(() => error);
                })
            );
    }
}
