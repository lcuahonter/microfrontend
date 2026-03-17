import { BaseReponseCustomArray } from "../../../models/ejemplo/response/ejemplo-response.model";
import { ENVIRONMENT } from "@libs/shared/data-access-user/src";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Proveedores } from "../../../models/informacion/agace-acna/proveedores/response/proveedores-response";


@Injectable({
    providedIn: 'root'
})
export class ProveedoresService {
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

    obtenerDatosProveedores(): Observable<BaseReponseCustomArray<Proveedores>>{
        return this.http.get<BaseReponseCustomArray<Proveedores>>('/assets/json/consultas/informacion/agace-acna/proveedores/proveedores-response.json')
    }
}