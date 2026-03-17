import { ENVIRONMENT } from "../../enviroments/enviroment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RespuestaBandejaAcusesResoluciones } from "../models/botonDeAccion";

@Injectable({
    providedIn: 'root'
})
export class SolicitudesSubsecuentesService {
    /**
    * URL del servidor donde se encuentra la API.
    */
    private readonly host: string;

    /**
     * Constructor del servicio IniciarService.
     * @param http - Cliente HTTP para realizar solicitudes al servidor.
     */
    constructor(private http: HttpClient) {
        this.host = `${ENVIRONMENT.API_HOST}/api`;
    }

    getDetalleDeSolicitud(idSolicitud: string, cve_usuario : string, rol_actual : string): Observable<RespuestaBandejaAcusesResoluciones> {
        const ENDPOINT = `${this.host}/bandeja-tarea/solicitud/${idSolicitud}/acuses-resoluciones/subsecuentes`;
        return this.http.post<RespuestaBandejaAcusesResoluciones>(ENDPOINT, {
            cve_usuario,
            rol_actual
        })
    }

}