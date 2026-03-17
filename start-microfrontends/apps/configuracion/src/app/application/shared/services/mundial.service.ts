import { ENVIRONMENT } from "@libs/shared/data-access-user/src";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Producto } from "../models/productos.model";

@Injectable({
    providedIn: 'root'
})
export class MundiaService {
    /**
     * URL base del servidor configurado en los environments.
     * Se utiliza como prefijo para todas las peticiones del módulo.
     */
    private readonly host: string;
    /**
     * Constructor del servicio.
     *
     * @param http - Servicio HttpClient utilizado para realizar
     * peticiones HTTP.
     */
    constructor(private http: HttpClient) {
        this.host = `${ENVIRONMENT.API_HOST}/api`;
    }
    public obtenerProductos():Observable<Producto[]>{
        return this.http.get<Producto[]>('/assets/json/configuracion/config/cupos/mundial/productos.json')
    }
}