import { API_FABRICANTE_INSUMO_EMPAQUE, API_GET_FRACCION_ARANCELARIA_PARTIDA, API_GET_UNIDAD_MEDIDA_COMERCIAL, API_POST_ARCHIVO_SEGUNDA_PARTE, API_POST_EMPAQUES_ARCHIVOS, API_POST_FRACCION_ARANCELARIA_VALIDAR, API_POST_INSUMO_ARCHIVOS, API_POST_VALIDAR_EMPAQUE, API_POST_VALIDAR_INSUMO } from "../server/api-router";
import { Catalogo, ENVIRONMENT } from "@libs/shared/data-access-user/src";
import { BaseResponse } from "@libs/shared/data-access-user/src/core/models/shared/base-response.model";
import { DatosFraccionArancelariaResponse } from "../models/response/datos-fraccion-arancelaria-response.model";
import { FabricanteResponse } from "../models/response/fabricante-rfc-response.model";
import { FraccionValidarRequest } from "../models/request/validar-fraccion-request.model";
import { FraccionValidarResponse } from "../models/response/validar-fraccion-response.model";

import { ArchivoMercanciaResponse } from "../models/response/archivo-mercancia-response.model";
import { ElementosProcesadosRequest } from "../models/request/carga-archivos-validacion-request.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { InsumoTratadosRequest } from "../models/request/validar-insumo-request.model";
import { Observable } from "rxjs";
import { TratadoArchivo } from "../models/request/tratado-criterio-request.model";

@Injectable({
    providedIn: 'root'
})

export class DatosMercanciaService {  
    /**
       * URL base del servidor al que se realizarán las solicitudes relacionadas con el tramite 110101.
       * Esta variable almacena la dirección del host para los servicios tratados solicitud.
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
     * Consulta la fracción arancelaria o partida arancelaria
     * @param cveFraccion - Identificador de la clave de la fracción o partida arancelaria.
     * @returns Observable con la respuesta del servidor que contiene los datos de la fracción o partida arancelaria
    */
    getFraccionArancelariaPartida(cveFraccion: string): Observable<BaseResponse<DatosFraccionArancelariaResponse>> {
        const ENDPOINT = `${this.host}${API_GET_FRACCION_ARANCELARIA_PARTIDA(cveFraccion)}`;
        return this.http.get<BaseResponse<DatosFraccionArancelariaResponse>>(ENDPOINT);
    }
    
    /**
     * Valida la fracción arancelaria mediante petición POST
     * @param PAYLOAD - Datos requeridos para la validación de la fracción arancelaria
     * @returns Observable con la respuesta del servidor que contiene el resultado de la validación
     */
    postFracccionArancelariaValidar(PAYLOAD: FraccionValidarRequest): Observable<BaseResponse<FraccionValidarResponse>> {
        const ENDPOINT = `${this.host}${API_POST_FRACCION_ARANCELARIA_VALIDAR}`;
        return this.http.post<BaseResponse<FraccionValidarResponse>>(ENDPOINT, PAYLOAD);
    }

    /**
     * Valida un insumo
     * @param PAYLOAD - Datos del insumo a validar
     * @returns Observable con la respuesta del servidor que indica si el insumo es válido
     */
    postValidarInsumo(PAYLOAD: InsumoTratadosRequest): Observable<BaseResponse<boolean>> {
        const ENDPOINT = `${this.host}${API_POST_VALIDAR_INSUMO}`;
        return this.http.post<BaseResponse<boolean>>(ENDPOINT, PAYLOAD);
    }

    /**
     * Valida un empaque
     * @param PAYLOAD - Datos del empaque a validar
     * @returns Observable con la respuesta del servidor que indica si el empaque es válido
     */
    postValidarEmpaque(PAYLOAD: InsumoTratadosRequest): Observable<BaseResponse<boolean>> {
        const ENDPOINT = `${this.host}${API_POST_VALIDAR_EMPAQUE}`;
        return this.http.post<BaseResponse<boolean>>(ENDPOINT, PAYLOAD);
    }

    /**
     * Consulta la unidad de medida comercial
     * @returns Observable con la respuesta del servidor que contiene los datos de la unidad de medida comercial
     */
    getUnidadMedidaComercial(): Observable<BaseResponse<Catalogo[]>> {
        const ENDPOINT = `${this.host}${API_GET_UNIDAD_MEDIDA_COMERCIAL}`;
        return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

/**
  * Envía un archivo CSV al servidor para registrar información de insumos o empaques.
  *
  * - Determina dinámicamente el endpoint según el tipo de archivo (`INSUMOS` o `EMPAQUES`).
  * - Agrega los parámetros `tratadosSeleccionados` y `tipoArchivo` a la solicitud.
  * - Envía el archivo dentro de un objeto `FormData` bajo la clave `archivoCsv`.
  *
  * @param tratadosSeleccionados Identificador del tratado seleccionado.
  * @param tipoArchivo Tipo de archivo a cargar (`INSUMOS` o `EMPAQUES`).
  * @param archivo Archivo CSV que se enviará al servidor.
  * @returns Observable con la respuesta del servidor tras procesar la carga.
  */
    postArchivoMercancia(tratadosSeleccionados: TratadoArchivo[], tipoArchivo: string, archivo: File): Observable<BaseResponse<ArchivoMercanciaResponse>> {
        let ENDPOINT!: string;
        if (tipoArchivo === 'INSUMOS') {
            ENDPOINT = `${this.host}${API_POST_INSUMO_ARCHIVOS}`;

        } else if (tipoArchivo === 'EMPAQUES') {
            ENDPOINT = `${this.host}${API_POST_EMPAQUES_ARCHIVOS}`;
        }
        const FORMDATA = new FormData();
        FORMDATA.append('archivo_csv', archivo, archivo.name);
        FORMDATA.append('tipo_archivo', tipoArchivo);
        FORMDATA.append('tratados_seleccionados', new Blob(
        [JSON.stringify(tratadosSeleccionados)], 
        { type: 'application/json' }
        ));
        return this.http.post<BaseResponse<ArchivoMercanciaResponse>>(ENDPOINT, FORMDATA);
    }

    /**
     * Validación de la segunda parte del archivo de mercancía que realiza internamente el sistema.
     * @param PAYLOAD - datos de los elementos procesados para la validación.
     * @returns Observable con la respuesta del servidor es válido
     */
    postArchivoMercanciaSegundaParte(PAYLOAD: ElementosProcesadosRequest):Observable<BaseResponse<ArchivoMercanciaResponse>> {
        const ENDPOINT = `${this.host}${API_POST_ARCHIVO_SEGUNDA_PARTE}`;
        return this.http.post<BaseResponse<ArchivoMercanciaResponse>>(ENDPOINT, PAYLOAD);
    }

    /**
     * Valida el fabricante del insumo o empaque.
     * @param rfcFabricanteProductor - RFC del fabricante o productor a validar.
     * @returns Observable con la respuesta del servidor que indica si el fabricante es válido
     */
    getFabricanteInsumoEmpaque(rfcFabricanteProductor: string): Observable<BaseResponse<FabricanteResponse>> {
        const ENDPOINT = `${this.host}${API_FABRICANTE_INSUMO_EMPAQUE(rfcFabricanteProductor)}`;
        return this.http.get<BaseResponse<FabricanteResponse>>(ENDPOINT);
    }
}