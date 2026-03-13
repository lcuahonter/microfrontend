import { 
    API_GET_CAT_DECLARACION_DATOS,
    API_GET_CAT_ENTIDADES_FEDERATIVAS,
    API_GET_CAT_REPRESENTACION_FEDERAL,
} from "../server/api-router";
import { BaseResponse } from "@libs/shared/data-access-user/src/core/models/shared/base-response.model";
import { Catalogo } from "@libs/shared/data-access-user/src";
import { DeclaracionDatosResponse } from "../models/response/declaracion-datos-response.model";
import { ENVIRONMENT } from "@libs/shared/data-access-user/src";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class CatalogosTramiteService {

  
  /**
     * URL base del servidor al que se realizarán las solicitudes relacionadas con el tramite 110102.
     * Esta variable almacena la dirección del host para los servicios compartidos de catálogos.
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
   * Consulta el catálogo de entidades federativas.
   * @returns Observable con la respuesta del servidor que contiene el catálogo
   */
  getCatEntidadesFederativas(): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CAT_ENTIDADES_FEDERATIVAS}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Consulta el catálogo de representación federal.
   * @param cveEntidad - Identificador de la clave de la entidad federativa.
   * @returns Observable con la respuesta del servidor que contiene el catálogo
   */
  getCatRepresentacionFederal(cveEntidad: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CAT_REPRESENTACION_FEDERAL(cveEntidad)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Consulta el catálogo de declaración de datos.
   * @param tramite - numero del tramite
   * @returns Observable con la respuesta del servidor que contiene el catálogo
   */
  getCatDeclaracionDatos(tramite: string): Observable<BaseResponse<DeclaracionDatosResponse[]>> {
    const ENDPOINT = `${this.host}${API_GET_CAT_DECLARACION_DATOS(tramite)}`;
    return this.http.get<BaseResponse<DeclaracionDatosResponse[]>>(ENDPOINT);
  }
  
}