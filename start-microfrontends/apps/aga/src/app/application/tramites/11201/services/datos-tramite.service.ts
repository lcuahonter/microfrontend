import { RespuestaAduanas, RespuestaConsulta } from "@libs/shared/data-access-user/src/core/models/11201/datos-tramite.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RespuestaApi } from "@libs/shared/data-access-user/src/core/models/11201/datos-tramite.model";
import { RespuestaCatalogos } from "@libs/shared/data-access-user/src";
import { RespuestaContenedor } from "@libs/shared/data-access-user/src/core/models/11201/datos-tramite.model";
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';

/**
 * Servicio para gestionar los datos del trámite 11201.
 * 
 * Este servicio proporciona métodos para obtener diferentes tipos de datos
 * relacionados con el trámite de contenedores temporales, incluyendo:
 * - Contenedores
 * - Catálogos de transporte y aduanas
 * - Datos de tablas y solicitantes
 * - Simulación de carga de archivos y envío de formularios
 * 
 * @injectable
 */
@Injectable({
  providedIn: 'root',
})
export class DatosTramiteService {

  /**
   * Constructor del servicio DatosTramiteService.
   * 
   * @param {HttpClient} http - Cliente HTTP para realizar peticiones a APIs o archivos JSON.
   */
  
  urlServer = ENVIRONMENT.API_HOST;

  constructor(private http: HttpClient) {}

  /**
   * Obtener una lista de Contenedores
   * 
   * @returns {Observable<RespuestaContenedores>} Un observable con la respuesta de contenedores.
   */
  getContenedores(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`assets/json/11201/tipoLista.json`);
  }

  /**
   * Simular la carga de archivos
   * 
   * @returns {Observable<RespuestaApi>} Un observable con la respuesta de la simulación de carga de archivos.
   */
  uploadArchivo(): Observable<RespuestaApi> {
    return this.http.get<RespuestaApi>(`assets/json/11201/contenedorLista.json`);
  }

  /**
   * Simular un envío exitoso de formulario
   * 
   * @returns {Observable<RespuestaAduanas>} Un observable con la respuesta de la simulación de envío de formulario.
   */
  submitSolicitud(): Observable<RespuestaAduanas> {
    return this.http.get<RespuestaAduanas>(`assets/json/11201/aduanaList.json`);
  }
  /**
   * Obtener una lista de Transporte
   * 
   * @param {string} catalogo - El nombre del catálogo a obtener.
   * @returns {Observable<RespuestaCatalogos>} Un observable con la respuesta del catálogo de transporte.
   */
  getTransporteList(catalogo: string): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`assets/json/11201/${catalogo}.json`);
  }

  /**
   * Obtener una lista de Aduanas
   * 
   * @param {string} catalogo - El nombre del catálogo a obtener.
   * @returns {Observable<RespuestaAduanas>} Un observable con la respuesta del catálogo de aduanas.
   */
  getAduanaList(catalogo: string): Observable<RespuestaAduanas> {
    return this.http.get<RespuestaAduanas>(`assets/json/11201/${catalogo}.json`);
  }

  /**
   * Obtener datos de la tabla
   * 
   * @returns {Observable<RespuestaCatalogos[]>} Un observable con la respuesta de los datos de la tabla.
   */
  getDatosTableData(): Observable<RespuestaCatalogos[]> {
    return this.http.get<RespuestaCatalogos[]>(`assets/json/11201/datosTabla.json`);
  }

  /**
   * Obtener datos del solicitante
   * 
   * @returns {Observable<RespuestaCatalogos[]>} Un observable con la respuesta de los datos del solicitante.
   */
  getDatosSolicitante(): Observable<RespuestaCatalogos[]> {
    return this.http.get<RespuestaCatalogos[]>(`assets/json/11201/datosSolicitante.json`);
  }
  /**
   * @method getDatosConsulta
   * @description Obtiene los datos de consulta desde un archivo JSON local.
   * 
   * Este método realiza una solicitud HTTP GET para obtener los datos de consulta simulados desde el archivo `consulta_11201.json`.
   * 
   * @returns {Observable<RespuestaConsulta>} Un observable que emite la respuesta de los datos de consulta.
   */
  getDatosConsulta(): Observable<RespuestaConsulta> {
    return this.http.get<RespuestaConsulta>(`assets/json/11201/consulta_11201.json`);
  }


  /**
   * Sends a POST request to add a new solicitud (request) with the provided payload and solicitud ID.
   *
   * @param PAYLOAD - The data to be sent in the body of the POST request.
   * @param idSolicitud - The identifier of the solicitud to be validated and added.
   * @returns An Observable emitting the response from the server.
   */
  agregarSolicitud(PAYLOAD:any): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t11201/solicitud/constancia-itc/validar`
    return this.http.post(ENDPOINT, PAYLOAD);
  }
  /**
   * Retrieves data by manifest number for a specific request and transport type.
   *
   * @param RFC - The RFC (Registro Federal de Contribuyentes) identifier.
   * @param typeOfTransPort - The type of transport (e.g., 'maritime', 'land', etc.).
   * @param idSolicitud - The unique identifier of the request (solicitud).
   * @param maniFestNumber - The manifest number to validate.
   * @returns An Observable emitting the response data from the API.
   */
  getByManifestNumber(RFC:String,typeOfTransPort:String,maniFestNumber:String): Observable<any> {
      const ENDPOINT = `${this.urlServer}/api/sat-t11201/solicitud/constancia-itc/validar-${typeOfTransPort}?rfc=${RFC}&numeroManifiesto=${maniFestNumber}` ;
      return this.http.get(ENDPOINT);
  }
  /**
   * Uploads a file and validates its CSV content for a specific solicitud (request).
   *
   * @param PAYLOAD - The payload containing the file data to be uploaded.
   * @param idSolicitud - The identifier of the solicitud for which the file is being uploaded.
   * @returns An Observable emitting the server response after file upload and validation.
   */
  fileUpload(PAYLOAD:any): Observable<any> {
      const ENDPOINT = `${this.urlServer}/api/sat-t11201/solicitud/constancia-itc/validar-csv` ;
      return this.http.post(ENDPOINT,PAYLOAD);
  }
  /**
   * Validates the payment for a specific solicitud (request) by sending a POST request to the backend API.
   *
   * @param PAYLOAD - The payload containing payment information to be validated.
   * @param idSolicitud - The unique identifier of the solicitud for which the payment is being validated.
   * @returns An Observable emitting the response from the API after validating the payment.
   */
  validarPago(PAYLOAD:any): Observable<any> {
      const ENDPOINT = `${this.urlServer}/api/sat-t11201/solicitud/constancia-itc/validar-pago` ;
      return this.http.post(ENDPOINT,PAYLOAD);
  }

  /**
   * Retrieves the list of customs offices (aduanas) from the server.
   *
   * Sends a GET request to the `/api/sat-t11201/catalogo/aduanas` endpoint.
   *
   * @returns An `Observable` emitting the response containing the customs catalog data.
   */
  getAduanaCatalogList(): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t11201/catalogo/aduanas` ;
    return this.http.get(ENDPOINT);
  }

  /**
   * Retrieves the list of container types from the server.
   *
   * Sends a GET request to the `/api/sat-t11201/catalogo/tipo-contenedor` endpoint
   * and returns an observable containing the response data.
   *
   * @returns An `Observable<any>` that emits the list of container types.
   */
  getContenedoresList(): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t11201/catalogo/tipo-contenedor` ;
    return this.http.get(ENDPOINT);
  }
  

  solicitudGuardar(PAYLOAD:any): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t11201/solicitud/guardar`
    return this.http.post(ENDPOINT, PAYLOAD);
  }

  /**
   * Retrieves the "monto" (amount) for the ITC constancia.
   *
   * Performs an HTTP GET request to the backend endpoint:
   * /api/sat-t11201/solicitud/constancia-itc/monto (prefixed by this.urlServer).
   *
   * @returns Observable<any> An observable that emits the server response containing the amount.
   * The precise shape of the response is not specified here — replace `any` with a proper interface when known.
   *
   * @remarks
   * - Uses the service's HttpClient to perform a GET request.
   * - The observable will error if the HTTP request fails.
   *
   */
  getMontoConstanciaITC(): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t11201/solicitud/constancia-itc/monto`;
    return this.http.get(ENDPOINT);
  }


  /**
   * Persists payment information for a specific solicitud (request) on the server.
   *
   * Performs an HTTP POST to:
   *  `${this.urlServer}/api/sat-t11201/solicitud/${idSolicitud}/constancia-itc/guardar-pagos`
   *
   * @param PAYLOAD - The payment payload to be saved. The exact shape is defined by the backend contract (currently typed as `any`).
   * @param idSolicitud - The identifier of the solicitud whose payments are being stored.
   * @returns An Observable that emits the server response. HTTP or transport errors are emitted as observable errors.
   */
  guardarPagosSolicitud(PAYLOAD:any,idSolicitud:any): Observable<any> {
    const ENDPOINT = `${this.urlServer}/api/sat-t11201/solicitud/${idSolicitud}/constancia-itc/guardar-pagos`
    return this.http.post(ENDPOINT, PAYLOAD);
  } 


}