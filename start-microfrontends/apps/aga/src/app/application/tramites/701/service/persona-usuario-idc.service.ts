import { API_GET_USUARIO_IDC_POR_RFC } from "../server/api-router";
import { BaseResponse } from "@libs/shared/data-access-user/src/core/models/shared/base-response.model";
import { ENVIRONMENT } from "@libs/shared/data-access-user/src";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PersonaUsuarioIDCResponse } from "../models/response/persona-usuario-idc-response.model";

@Injectable({
  providedIn: 'root'
})

export class PersonaUsuarioIdcService {

    /**
     * URL base del servidor al que se realizarán las solicitudes relacionadas con el tramite 701.
     * Esta variable almacena la dirección del host para los servicios tratados en el tramite 701.
     * Es de solo lectura y se inicializa en el constructor del servicio.
     */
    private readonly host: string;

    /**
     * Constructor del servicio que inicializa la URL base del host.
     * @param http Instancia de HttpClient para realizar solicitudes HTTP.
     */
    constructor(private http: HttpClient) {
        this.host = `${ENVIRONMENT.API_HOST}/api/`;
    }

    /**
     * Consulta la información de la persona usuario IDC por RFC.
     * @param rfcSolicitante - RFC del solicitante.
     * @param rfcDocumento - RFC del documento.
     * @returns Observable con la respuesta del servidor que contiene la información de la persona usuario IDC.
     */
    getPersonaUsuarioIDC(rfcSolicitante: string, rfcDocumento: string): Observable<BaseResponse<PersonaUsuarioIDCResponse>> {
        const ENDPOINT = `${this.host}${API_GET_USUARIO_IDC_POR_RFC(rfcSolicitante, rfcDocumento)}`;
        return this.http.get<BaseResponse<PersonaUsuarioIDCResponse>>(ENDPOINT);
    }
}
