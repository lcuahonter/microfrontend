import { Observable, catchError, throwError } from "rxjs";
import { DatosGanadoresResponse } from "../../../../models/instrumentos/cupos/ganadores/response/lista-ganadores";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ListaLicitaciones } from "../../../../models/instrumentos/cupos/ganadores/response/lista-licitaciones";

@Injectable({
    providedIn: 'root'
})
export class ConsultarGanadoresService {
    /**
     * Constructor del servicio.
     *
     * @param http Servicio HttpClient utilizado para realizar
     * peticiones HTTP.
     */
    constructor(private http: HttpClient) { }
    /**
    * Obtiene la lista de licitaciones disponibles.
    *
    * Realiza una petición HTTP GET a un archivo JSON local que
    * contiene la información de las licitaciones configuradas.
    *
    * @returns Observable que emite un arreglo de objetos
    * `ListaLicitaciones`.
    *
    * @throws Propaga el error en caso de que la petición HTTP falle.
    */
    obtenerListaLicitaciones(): Observable<ListaLicitaciones[]> {
        return this.http.get<ListaLicitaciones[]>(`/assets/json/configuracion/instrumentos/cupos/consultar/lista-licitaciones.json`).pipe(
            catchError((error) => {
                return throwError(() => error)
            })
        )
    }
    /**
     * Obtiene la lista de ganadores.
     *
     * Realiza una petición HTTP GET a un archivo JSON local que
     * contiene la información de los ganadores asociados a las
     * licitaciones.
     *
     * @returns Observable que emite un objeto `DatosGanadoresResponse`
     * con la información de los ganadores.
     *
     * @throws Propaga el error en caso de que la petición HTTP falle.
     */

    obtenerListaGanadores(): Observable<DatosGanadoresResponse> {
        return this.http.get<DatosGanadoresResponse>(`/assets/json/configuracion/instrumentos/cupos/consultar/lista-ganadores.json`).pipe(
            catchError((error) => {
                return throwError(() => error)
            })
        )
    }
}