import { Observable, catchError, throwError } from "rxjs";
import { DocumentosResponse } from "../models/agregar-fraccion/response/documentos-response";
import { FraccionesResponse } from "../models/agregar-fraccion/response/agregar-fraccion";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AgregarFraccionService {
    constructor(private http: HttpClient) { }
    /**
     * Obtiene la lista de fracciones desde el archivo de configuración local.
     *
     * @method getFracciones
     * 
     * @returns {Observable<FraccionesResponse[]>}  
     * Observable que emite un arreglo de objetos `FraccionesResponse` con el
     * identificador y título de cada fracción disponible.
     *
     * @description
     * Realiza una petición HTTP GET para leer el archivo JSON ubicado en la ruta
     * `/assets/json/configuracion/inmex/registrar/fracciones.json`.  
     * En caso de error durante la lectura del archivo, se propaga la excepción mediante `throwError`.
    */
    getFracciones(): Observable<FraccionesResponse[]> {
        return this.http.get<FraccionesResponse[]>(`/assets/json/configuracion/inmex/registrar/fracciones.json`).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }
    getDocumentos(): Observable<DocumentosResponse[]> {
        return this.http.get<DocumentosResponse[]>(`/assets/json/configuracion/inmex/registrar/documentos.json`).pipe(
            catchError((error) => {
                return throwError(() => error);
            })
        )
    }
}
