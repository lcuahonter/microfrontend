import { Observable, catchError, throwError } from "rxjs";
import { ConfiguracionDelProgramaResponse } from "../models/agregar-fraccion/response/configuracion-programa-response";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RegistrosResponse } from "../models/agregar-fraccion/response/registros-response";

@Injectable({ providedIn: 'root' })
export class ConsultaInmexService {
    constructor(private http: HttpClient) { }
    obtenerRegistros(): Observable<RegistrosResponse[]> {
        return this.http.get<RegistrosResponse[]>(`/assets/json/configuracion/inmex/consultar/registros.json`).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }
    obtenerConfiguracionDelPrograma(): Observable<ConfiguracionDelProgramaResponse> {
        return this.http.get<ConfiguracionDelProgramaResponse>(`/assets/json/configuracion/inmex/consultar/configuracionPrograma.json`).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }
}