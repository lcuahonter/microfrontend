import { RespuestaCatalog, RespuestaConsulta } from "../models/datos-tramite.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RespuestaCatalogos,ENVIRONMENT } from "@libs/shared/data-access-user/src";
import { RespuestaContenedor } from "../models/datos-tramite.model";

/**
 * Servicio Injectable para gestionar las operaciones relacionadas con los datos del trámite.
 */
@Injectable({
  providedIn: 'any',
})
export class DatosTramiteService {
  /**
   * Constructor del servicio DatosTramiteService.
   * 
   * @param {HttpClient} http - Cliente HTTP para realizar peticiones a APIs o archivos JSON.
   */
  
  urlServer = ENVIRONMENT.API_HOST;

  constructor(
    private http: HttpClient
    // eslint-disable-next-line no-empty-function
  ) {}


 

  


  /**
   * Obtiene los datos para mostrar en la tabla.
   * @returns Un observable con la respuesta de los catálogos de datos de la tabla.
   */
  getDatosTableData(): Observable<RespuestaCatalog[]> {
    return this.http.get<RespuestaCatalog[]>(`assets/json/11204/datosTabla.json`);
  }

  /**
   * @method getDatosConsulta
   * @description Obtiene los datos de consulta desde un archivo JSON local.
   * 
   * Este método realiza una solicitud HTTP GET para obtener los datos de consulta simulados desde el archivo `consultaDatos.json`.
   * 
   * @returns {Observable<RespuestaConsulta>} Un observable que emite la respuesta de los datos de consulta.
   */
  getDatosConsulta(): Observable<RespuestaConsulta> {
    return this.http.get<RespuestaConsulta>(`assets/json/11204/consultaDatos.json`);
  }

  /**
   * Retrieves the list of customs offices (aduanas) from the server.
   *
   * Sends a GET request to the `/api/sat-t11201/catalogo/aduanas` endpoint.
   *
   * @returns An `Observable` emitting the response containing the customs catalog data.
   */
  getAduanaLista(): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t11204/catalogo/aduanas` ;
    return this.http.get(ENDPOINT);
  }

  
  /**
   * Obtiene la lista de contenedores.
   * @returns Un observable con la respuesta de los catálogos de contenedores.
   */
  getContenedores(): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t11204/catalogo/tipo-contenedor` ;
    return this.http.get(ENDPOINT);
  }


  /**
   * Sends a POST request to add a new solicitud (request) with the provided payload and solicitud ID.
   *
   * @param PAYLOAD - The data to be sent in the body of the POST request.
   * @param idSolicitud - The identifier of the solicitud to be validated and added.
   * @returns An Observable emitting the response from the server.
   */
  agregarSolicitud(PAYLOAD:any): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t11204/solicitud/constancia-tc/validar`
    return this.http.post(ENDPOINT, PAYLOAD);
  }

   /**
   * Uploads a file and validates its CSV content for a specific solicitud (request).
   *
   * @param PAYLOAD - The payload containing the file data to be uploaded.
   * @param idSolicitud - The identifier of the solicitud for which the file is being uploaded.
   * @returns An Observable emitting the server response after file upload and validation.
   */
  fileUpload(PAYLOAD:any): Observable<any> {
      const ENDPOINT = `${this.urlServer}/api/sat-t11204/solicitud/constancia-tc/validar-csv` ;
      return this.http.post(ENDPOINT,PAYLOAD);
  }

  solicitudGuardar(PAYLOAD:any): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t11204/solicitud/guardar`
    return this.http.post(ENDPOINT, PAYLOAD);
  }

}
