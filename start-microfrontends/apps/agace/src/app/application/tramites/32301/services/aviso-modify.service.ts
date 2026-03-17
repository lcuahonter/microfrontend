import { Observable, catchError, of } from 'rxjs';
import { CatalogoResponse } from '@ng-mf/data-access-user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponseguardar, ApiResponseInmueble, ApiResponseMiembroEmpresa, MiembroEmpresaResponse, PersonaFusionEscisionDTO } from '../models/avisomodify.model';
import { TableDataNgTable } from '../models/avisomodify.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';

@Injectable({
  providedIn: 'any', // El servicio está disponible en toda la aplicación.
})
export class AvisoModifyService {
  constructor(private http: HttpClient) {
    // Constructor para la inyección de dependencias (HttpClient)
  }

  // URLs para los archivos JSON
  private jsonUrl = 'assets/json/32301';
  private jsonLkURl = 'assets/json/31601';
  private fileName = 'tipoDeAviso.json';
  private personaFusionEscision = 'personaFusionEscision.json';
  private selectRangoDias = 'selectRangoDias.json';
  private adicianFraccionOption = 'adicianFraccionOption.json';
  private adicianFraccionNicoModOptions = 'adicianFraccionNicoModOptions.json';
  private adicianFraccionUnidadMedidaModOption =
    'adicianFraccionUnidadMedidaModOption.json';
  private adicianFraccionActivRelProcModOption =
    'adicianFraccionActivRelProcModOption.json';
  private capacidadAlmacenamiento = 'fusionOEscision.json';
  private entidadFederativa = 'entidadFederative.json';
  private gridDomiciliosModificados = 'gridDomiciliosModificados.json';
  private gridMostrarGridModificado = 'gridMostrarGridModificado.json';
  private enSuCaracterDe = 'enSuCaracterDe.json';
  private nacionalidad = 'nacionalidad.json';
  private preOperativo = 'preOperativo.json';
  private gridMiembrosEmpresas = 'gridMiembrosEmpresas.json';
  private seccionMiembrosRevocados = 'seccionMiembrosRevocados.json';
  private adicianFraccioncveFraccionCorrelacionModOption =
    'adicianFraccioncveFraccionCorrelacionModOption.json';
  private subFusionOescision = 'subFusionOescision.json';


  urlServer = ENVIRONMENT.API_HOST;

  /**
   * Método para obtener el tipo de aviso desde un archivo JSON.
   * Se realiza una solicitud HTTP y se maneja cualquier error que pueda ocurrir.
   *
   * @returns Un `Observable` que contiene los datos del aviso en formato `CatalogoResponse`.
   */
  getAvisoModify(): Observable<CatalogoResponse> {
    /**
     * Realiza una solicitud HTTP para obtener los datos del tipo de aviso desde el archivo JSON.
     */
    return this.http
      .get<CatalogoResponse>(`${this.jsonUrl}/${this.fileName}`)
      .pipe(
        /**
         * Captura errores que puedan ocurrir durante la solicitud HTTP y los maneja.
         */
        catchError((error) => {
          /**
           * Registra el error en la consola para su análisis.
           */
          console.error('Error fetching data from:', this.jsonUrl, error);

          /**
           * Retorna un objeto por defecto en caso de error para evitar que la aplicación falle.
           */
          return of({
            id: 0,
            descripcion: '',
            code: 0,
            data: [],
            message: 'Respuesta por defecto debido a un error',
          } as unknown as CatalogoResponse);
        })
      );
  }

  /**
   * Método para cargar datos de una persona involucrada en un proceso de fusión o escisión.
   * Se realiza una solicitud HTTP al archivo JSON correspondiente y se maneja cualquier posible error.
   *
   * @returns Un `Observable` con los datos de la persona en formato `PersonaFusionEscisionDTO`.
   */
  cargarDatosPersonaFusion(): Observable<PersonaFusionEscisionDTO> {
    /**
     * Realiza una solicitud HTTP para obtener los datos desde el archivo JSON.
     */
    return this.http
      .get<PersonaFusionEscisionDTO>(
        `${this.jsonUrl}/${this.personaFusionEscision}`
      )
      .pipe(
        /**
         * Captura errores que puedan ocurrir durante la solicitud HTTP y los maneja.
         */
        catchError((error) => {
          /**
           * Registra el error en la consola para facilitar su análisis y depuración.
           */
          console.error('Error fetching data from:', this.jsonUrl, error);

          /**
           * Retorna un objeto por defecto en caso de error, evitando fallos en la aplicación.
           */
          return of({
            id: 0,
            descripcion: '',
            code: 0,
            data: [],
            message: 'Respuesta por defecto debido a un error',
          } as unknown as PersonaFusionEscisionDTO);
        })
      );
  }

  /**
   * Método para obtener los datos de la tabla de subfusión o escisión.
   * Realiza una solicitud HTTP para recuperar la información desde un archivo JSON.
   *
   * @returns Un `Observable` que contiene los datos de la tabla en formato `TableDataNgTable`.
   */
  gridsubFusionOescision(): Observable<TableDataNgTable> {
    /**
     * Realiza una solicitud HTTP para obtener los datos desde el archivo JSON correspondiente.
     */
    return this.http.get<TableDataNgTable>(
      `${this.jsonUrl}/${this.subFusionOescision}`
    );
  }

  /**
   * Método para obtener el rango de días desde un archivo JSON.
   * Se realiza una solicitud HTTP para recuperar la información almacenada.
   *
   * @returns Un `Observable` con un array de cadenas que representan los rangos de días disponibles.
   */
  getSelectRangoDias(): Observable<string[]> {
    return this.http.get<string[]>(`${this.jsonUrl}/${this.selectRangoDias}`);
  }

  /**
   * Método para obtener las opciones de fracción adicional desde un archivo JSON.
   * Se consulta un recurso externo y se devuelve la información en formato de arreglo de cadenas.
   *
   * @returns Un `Observable` con un array de cadenas que contienen las opciones de fracción adicional.
   */
  getAdicianFraccionOption(): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.jsonUrl}/${this.adicianFraccionOption}`
    );
  }



  /**
   * Método para obtener las opciones de modificación de actividad relacionada con el proceso desde un archivo JSON.
   * Se consulta la información almacenada y se retorna un `Observable` con los datos disponibles.
   *
   * @returns Un `Observable` con un array de cadenas que contienen las opciones de modificación de actividad relacionada con el proceso.
   */
  getAdicianFraccionActivRelProcModOption(): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.jsonUrl}/${this.adicianFraccionActivRelProcModOption}`
    );
  }
  /**
   * Método para obtener las opciones de modificación de la clave de fracción de correlación desde un archivo JSON.
   * Realiza una solicitud HTTP y retorna un `Observable` con un array de cadenas que contienen las opciones disponibles.
   *
   * @returns Un `Observable` con los datos de las opciones de modificación de la clave de fracción de correlación.
   */
  getAdicianFraccioncveFraccionCorrelacionModOption(): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.jsonUrl}/${this.adicianFraccioncveFraccionCorrelacionModOption}`
    );
  }

  /**
   * Método para obtener la capacidad de almacenamiento desde un archivo JSON.
   * Se consulta la información disponible y se retorna un `Observable` con los datos en formato de arreglo de cadenas.
   *
   * @returns Un `Observable` con los datos de capacidad de almacenamiento.
   */
  getCapacidadAlmacenamiento(): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.jsonUrl}/${this.capacidadAlmacenamiento}`
    );
  }

  /**
   * Método para obtener la tabla de domicilios modificados desde un archivo JSON.
   * Realiza una solicitud HTTP para recuperar la información de domicilios previamente modificados.
   *
   * @returns Un `Observable` que contiene los datos de la tabla en formato `TableDataNgTable`.
   */
  getGridDomiciliosModificados(): Observable<TableDataNgTable> {
    return this.http.get<TableDataNgTable>(
      `${this.jsonUrl}/${this.gridDomiciliosModificados}`
    );
  }

  /**
   * Método para obtener la tabla de grid de elementos modificados desde un archivo JSON.
   * Recupera información sobre modificaciones realizadas en distintos registros del sistema.
   *
   * @returns Un `Observable` que contiene los datos de los elementos modificados en formato `TableDataNgTable`.
   */
  getGridMostrarGridModificado(): Observable<TableDataNgTable> {
    return this.http.get<TableDataNgTable>(
      `${this.jsonUrl}/${this.gridMostrarGridModificado}`
    );
  }

  /**
   * Método para obtener las opciones disponibles para el carácter de una persona dentro de un proceso.
   * Consulta la información desde un recurso JSON y retorna los datos en un formato de arreglo de cadenas.
   *
   * @returns Un `Observable` con un array de cadenas que representan las opciones de carácter.
   */
  getEnSuCaracterDe(): Observable<string[]> {
    return this.http.get<string[]>(`${this.jsonLkURl}/${this.enSuCaracterDe}`);
  }


  /**
   * Método para obtener las opciones pre-operativas desde un archivo JSON.
   * Consulta los datos almacenados y retorna un `Observable` con las opciones disponibles.
   *
   * @returns Un `Observable` con un array de cadenas que representan las opciones pre-operativas.
   */
  getPreOperativo(): Observable<string[]> {
    return this.http.get<string[]>(`${this.jsonLkURl}/${this.preOperativo}`);
  }

  /**
   * Método para obtener la tabla de miembros revocados desde un archivo JSON.
   * Recupera información sobre aquellos miembros que han sido revocados dentro del sistema.
   *
   * @returns Un `Observable` que contiene los datos de los miembros revocados en formato `TableDataNgTable`.
   */
  getSeccionMiembrosRevocados(): Observable<TableDataNgTable> {
    return this.http.get<TableDataNgTable>(
      `${this.jsonUrl}/${this.seccionMiembrosRevocados}`
    );
  }

  
  /**
   * Retrieves a template for foreign or national providers.
   * 
   * @param type - The type of provider template to retrieve. 
   *               Use 'extranjero' for foreign providers (PROVEEDORES_EXTRANJEROS),
   *               or any other value for national providers (PROVEEDORES_NACIONALES_A).
   * @returns An Observable containing the template data for the specified provider type.
   */
  getPlantillaProveedoresExtranjeros(type: string): Observable<any> {
    return this.http.get<any>(
      `${this.urlServer}/api/sat-t32301/solicitud/aviso-modificacion/plantilla`,
      { params: { plantilla: (type === 'extranjero' ? 'PROVEEDORES_EXTRANJEROS' : 'PROVEEDORES_NACIONALES_A') } }
    );
  }

/**
 * Uploads a provider file for foreign or domestic providers.
 * @param file - The file to be uploaded
 * @param type - The provider type ('extranjero' for foreign or any other value for domestic)
 * @returns An Observable containing the server response
 */
 cargarArchivoProveedoresExtranjeros(file: File,type: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('archivo', file, file.name);
    const urlType = type === 'extranjero' ? 'extranjeros' : 'nacionales';
    return this.http.post<any>(
      `${this.urlServer}/api/sat-t32301/solicitud/aviso-modificacion/proveedores-${urlType}/cargar`,
      formData
    );
  }


/**
 * Retrieves a list of revoked members for a specific SAT T32301 notice modification.
 * 
 * @returns {Observable<any>} An observable containing the grid data for revoked members of enterprises.
 * 
 * @remarks
 * This method makes an HTTP GET request to the SAT T32301 API endpoint.
 * The request includes a hardcoded original folio number in the query parameters.
 * 
 * @example
 * ```typescript
 * this.avisoModifyService.getGridMiembrosEmpresas().subscribe(
 *   (data) => console.log('Revoked members:', data),
 *   (error) => console.error('Error fetching members:', error)
 * );
 * ```
 */
 getGridMiembrosEmpresas(request:string): Observable<MiembroEmpresaResponse> {
    return this.http.get<MiembroEmpresaResponse>(
      `${this.urlServer}/api/sat-t32301/solicitud/aviso-modificacion/miembros-revocados?numFolioOriginal=${request}`,
    );
  }

  /**
   * Retrieves a list of members that can be modified for an aviso modification request.
   * 
   * @returns {Observable<any>} An observable containing the grid data of members available for modification.
   * 
   * @example
   * this.avisoModifyService.getGridMiembrosModificar().subscribe(
   *   (data) => console.log(data),
   *   (error) => console.error(error)
   * );
   */
  getGridMiembrosModificar(request:string): Observable<ApiResponseMiembroEmpresa> {
    return this.http.get<ApiResponseMiembroEmpresa>(
      `${this.urlServer}/api/sat-t32301/solicitud/aviso-modificacion/miembros-modificar?numFolioOriginal=${request}`,
    );
  }

  /**
   * Retrieves the list of new properties (inmuebles) for a modification notice.
   * @returns {Observable<any>} An observable containing the array of new properties for the solicitud with ID 202768213.
   */
  getGridInmueblesNuevo(request:string): Observable<ApiResponseInmueble> {
    return this.http.get<ApiResponseInmueble>(
      `${this.urlServer}/api/sat-t32301/solicitud/aviso-modificacion/inmuebles-nuevo?idSolicitud=${request}`,
    );
  }

  /**
   * Retrieves a list of Mexican federal entities (estados).
   * @returns {Observable<any>} An observable containing the array of federal entities from the SAT catalog.
   */
  getEntidadFederativa(): Observable<any> {
    return this.http.get<any>(
      `${this.urlServer}/api/sat-t32301/catalogo/entidades-federativas`,
    );
  }

  /**
   * Retrieves the tariff fractions catalog from the SAT API.
   * Fetches a list of fracciones arancelarias (tariff classifications) from the server.
   * 
   * @returns {void}
   */
  getFraccionArancelaria(): void {
    this.http.get<any>(
      `${this.urlServer}/api/sat-t32301/catalogo/fracciones-arancelarias`,
    );
  }

  /**
   * Retrieves the municipalities and delegations for a given federal entity.
   * @param cveEntidad - The code of the federal entity (entidad federativa)
   * @returns An Observable containing the list of municipalities and delegations
   */
  getMunicipiosDelegaciones(cveEntidad: string): Observable<any> {
    return this.http.get<any>(
      `${this.urlServer}/api/sat-t32301/catalogo/entidad-federativa/${cveEntidad}/municipios-delegaciones`,
    );
  }
  /**
   * Retrieves the catalog of document types (DOCUGO) from the SAT API.
   * @returns {Observable<any>} An observable containing the document type catalog data
   */
  getCveTipoDoc(): Observable<any> {
    return this.http.get<any>(
      `${this.urlServer}/api/sat-t32301/catalogo/catalogos/DOCUGO`,
    );
  }
  /**
   * Retrieves RFC (Registro Federal de Contribuyentes) details for a given RFC number.
   * @param rfc - The RFC identifier to fetch details for
   * @returns An Observable containing the RFC details response
   */
  getRFCDetails(rfc: string): Observable<any> {
    return this.http.get<any>(
      `${this.urlServer}/api/sat-t32301/solicitud/aviso-modificacion/${rfc}`,
    );
  }

  /**
   * Validates a property (inmueble) for a modification notice (aviso de modificación).
   * @param payload - The payload object containing the property data to validate
   * @returns An Observable that emits the validation response from the server
   */
  validarInmueble(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.urlServer}/api/sat-t32301/solicitud/aviso-modificacion/inmueble/validar`,
      payload
    );
  }

  /**
   * Retrieves the list of properties (inmuebles) that can be modified for a modification notice (aviso).
   * @returns {Observable<any>} An observable containing the array of modifiable properties
   */
  getInmueblesModificar(request:string): Observable<any> {
    return this.http.get<any>(
      `${this.urlServer}/api/sat-t32301/solicitud/aviso-modificacion/inmuebles-modificar?idSolicitud=${request}`,
    );
  }

  /**
   * Retrieves the details of a company based on its RFC (Registro Federal de Contribuyentes).
   *
   * @param rfc - The RFC identifier of the company to fetch details for.
   * @returns An Observable emitting the company details as returned by the server.
   */
  getEmpresaDetails(rfc: string): Observable<any> {
    return this.http.get<any>(
      `${this.urlServer}/api/sat-t32301/solicitud/aviso-modificacion/empresa/${rfc}`,
    );
  }

  /**
   * Sends a POST request to save a solicitud (request) using the provided payload.
   *
   * @param payload - The data to be sent in the request body.
   * @returns An Observable emitting the server response.
   */
  guardarSolicitud(payload: any): Observable<ApiResponseguardar> {
    return this.http.post<ApiResponseguardar>(
      `${this.urlServer}/api/sat-t32301/solicitud/guardar`,
      payload
    );
  } 
  /**
   * Retrieves a template (plantilla) from the server based on the provided plantilla identifier.
   *
   * @param plantilla - The identifier or name of the template to fetch.
   * @returns An Observable emitting the template data from the server.
   */
  getPlantilla(plantilla: string): Observable<any> {
    return this.http.get<any>(
      `${this.urlServer}/api/sat-t32301/solicitud/aviso-modificacion/plantilla?plantilla=${plantilla}`
    );
  }

  /**
   * Uploads a file containing tariff fraction information to the server.
   *
   * @param file - The file to be uploaded.
   * @returns An Observable emitting the server response.
   */
  cargarArchivoFraccionArancelaria(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('archivo', file, file.name);
    return this.http.post<any>(
      `${this.urlServer}/api/sat-t32301/solicitud/aviso-modificacion/fraccion/cargar`,
      formData
    );
  }

  /**
   * Sends a POST request to validate a tariff fraction (fracción arancelaria) for a modification notice.
   *
   * @param payload - The data to be sent in the request body for validation.
   * @returns An Observable emitting the server's response to the validation request.
   */
  validarFraccionArancelaria(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.urlServer}/api/sat-t32301/solicitud/aviso-modificacion/fraccion/validar`,
      payload
    );  
  }

  /**
   * Retrieves the list of "fracciones arancelarias" (tariff fractions) from the server.
   *
   * Sends an HTTP GET request to the corresponding API endpoint and returns an observable
   * containing the response data.
   *
   * @returns An `Observable<any>` that emits the list of tariff fractions.
   */
  getFraccionesArancelarias(): Observable<any> {
    return this.http.get<any>(
      `${this.urlServer}/api/sat-t32301/catalogo/fracciones-arancelarias`
    );
  }

    /**
   * Método para obtener las opciones de modificación de unidad de medida desde un archivo JSON.
   * Se consulta la información almacenada y se retorna un `Observable` con los datos disponibles.
   *
   * @returns Un `Observable` con un array de cadenas que contienen las opciones de modificación de unidad de medida.
   */
  getAdicianFraccionUnidadMedidaModOption(cveFraccion: string): Observable<any> {
    return this.http.get<any>(
      `${this.urlServer}/api/sat-t32301/catalogo/fraccion-arancelaria/${cveFraccion}/unidades-medidas-tarifarias`
    );
  }

  /**
   * Retrieves the list of NICO modification options for a given fraction code.
   *
   * @param cveFraccion - The code of the fraction to fetch NICO modification options for.
   * @returns An Observable emitting the response containing NICO modification options.
   */
  getAdicianFraccionNicoModOptions(cveFraccion: string): Observable<any> {
    return this.http.get<any>(
      `${this.urlServer}/api/sat-t32301/catalogo/nicos/${cveFraccion}`
    );
  }

  /**
   * Uploads a file to the server as part of the modification notice process.
   *
   * @param file - The file to be uploaded.
   * @returns An Observable emitting the server response after uploading the file.
   */
  cargarArchivoProceso(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('archivo', file, file.name);
    return this.http.post<any>(
      `${this.urlServer}/api/sat-t32301/solicitud/aviso-modificacion/proceso/cargar`,
      formData
    );
  } 

  /**
   * Retrieves the list of "tipo tramite" (procedure types) for declarations from the server.
   *
   * @returns An Observable emitting the response containing the available procedure types for declarations.
   */
  getTipoTramiteDeclaraciones(): Observable<any> {
    return this.http.get<any>(
      `${this.urlServer}/api/sat-t32301/catalogo/tipo-tramite/declaraciones`
    );
  }


  /**
   * Retrieves the list of nationalities (countries) from the server.
   *
   * Sends a GET request to the `/api/sat-t32301/catalogo/paises` endpoint.
   *
   * @returns An `Observable` emitting the response containing the list of countries.
   */
  getNacionalidad(): Observable<any> {
    return this.http.get<any>(
      `${this.urlServer}/api/sat-t32301/catalogo/paises`
    ); 
  } 
  /**
   * Validates a company member by sending the provided payload to the server.
   *
   * @param payload - The data representing the member to be validated.
   * @returns An Observable emitting the server's response.
   */
  validarMiembroEmpresa(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.urlServer}/api/sat-t32301/solicitud/aviso-modificacion/miembro/validar`,
      payload
    );
  } 


  /**
   * Retrieves the list of "Caracter Miembro Empresa" from the server.
   *
   * Sends an HTTP GET request to the specified endpoint to fetch the catalog
   * of company member characteristics.
   *
   * @returns An `Observable` emitting the response data from the API.
   */
  getCaracterMiembroEmpresa(): Observable<any> {
    return this.http.get<any>(
      `${this.urlServer}/api/sat-t32301/catalogo/enumD/ENU_CARACTER_MIEMBRO_EMPRESA`
    );  
  }






   

   



}
