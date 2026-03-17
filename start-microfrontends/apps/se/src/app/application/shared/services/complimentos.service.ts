import { AbrirRazonSocialResponse,Catalogo,HttpCoreService,JSONResponse,JsonResponseCatalogo,parseToString,} from '@ng-mf/data-access-user';
import {AnexoDosEncabezado,AnexoUnoEncabezado,} from '../models/nuevo-programa-industrial.model';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { BuscarPayload, PlantasSubfabricante } from '../models/empresas-subfabricanta.model';
import { API_ROUTES } from '../servers/api-route';
import { DisponsibleFiscal } from '../models/empresas.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlantasDisponibles } from '../models/federatarios-y-plantas.model';
import { RazonSocialResponse } from '../models/complimentos.model';

import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { DocumentoResponse } from '@libs/shared/data-access-user/src/core/models/shared/documentos-request.model';
export interface CapacidadPlanta {
  claveServicio: string | null;
  idPlanta: string;
  idFraccion: string;
  turnos: string;
  horasTurno: string;
  cantidadEmpleados: string;
  cantidadMaquinaria: string;
  descripcionMaquinaria: string;
  capacidadMensual: string;
  capacidadAnual: string;
  capacidadEfectiva: string;
  cadenaError: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ComplimentosService {
  /**
   * Subject que mantiene la fila seleccionada del Anexo Uno.
   * Permite emitir y reaccionar a cambios en la selección de filas de forma reactiva.
   */
  private _anexoUnoFilaSeleccionada$ =
    new BehaviorSubject<AnexoUnoEncabezado | null>(null);
  /**
   * Observable que expone la fila seleccionada del Anexo Uno.
   * Permite a otros componentes suscribirse a los cambios sin modificar directamente el estado.
   */
  public anexoUnoFilaSeleccionada$ =
    this._anexoUnoFilaSeleccionada$.asObservable();
  /**
   * Subject que almacena la fila seleccionada del Anexo Dos.
   * Facilita la comunicación reactiva cuando cambia la selección de filas en el Anexo Dos.
   */
  private _anexoDosFilaSeleccionada$ =
    new BehaviorSubject<AnexoDosEncabezado | null>(null);

  /**
   * Almacena el nombre o identificador del procedimiento actual.
   *
   * @private
   */
  private _procedure: string = '';

    /**
   * Almacena el nombre o identificador del procedimiento actual.
   *
   * @private
   */
  public federatariosEncabezado: any;

  public plantaID:string='';
  /**
   * Almacena el nombre o identificador del procedimiento actual.
   *
   * @private
   */
  private _procedureNo: string = '';

  /**
   * Observable que expone la fila seleccionada del Anexo Dos.
   * Permite a otros componentes reaccionar a los cambios en la selección de filas sin modificar el estado directamente.
   */
  public anexoDosFilaSeleccionada$ =
    this._anexoDosFilaSeleccionada$.asObservable();

  constructor(
    private readonly http: HttpClient,
    public httpService: HttpCoreService
  ) {
    // No se necesita lógica de inicialización adicional.
  }

  /**
   * Obtiene la lista de estados.
   * @method obtenerListaEstado
   * @returns {Observable<RespuestaCatalogos>} Observable con la lista de estados.
   */
  obtenerListaEstado(): Observable<Catalogo[]> {
    return (
      this.http
        .get<Catalogo[]>('assets/json/funcionario/estado.json')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .pipe(map((res: any) => res.data))
    );
  }

  
  /**
   * Obtiene la lista de selección de ingreso desde un archivo JSON.
   * @returns {Observable<any>} - Observable con los datos obtenidos.
   */
  obtenerTipoList(): Observable<JsonResponseCatalogo> {
    return (
      this.http
        .get<JsonResponseCatalogo>('assets/json/80101/estado.json')
    );
  }

  /**
   * Obtiene las rutas de la API específicas para el procedimiento actual.
   *
   * @returns Un objeto con las rutas de la API generadas por la función `API_ROUTES` usando el procedimiento actual.
   */
  private get apiRoutes(): ReturnType<typeof API_ROUTES> {
    return API_ROUTES(this._procedure, this._procedureNo);
  }

  /**
   * @method getDatos
   * Método para obtener datos desde un archivo JSON.
   * @returns {Observable<unknown>} Un Observable que emite los datos obtenidos o un error.
   */
  getDatos(): Observable<unknown> {
    return this.http
      .get('assets/json/80102/pagoderechos.json') // Realiza una solicitud GET al archivo JSON.
      .pipe(
        catchError((error: unknown) => {
          // Maneja errores en la solicitud.
          return throwError(() => error); // Lanza el error para que pueda ser manejado por el suscriptor.
        })
      );
  }

  /**
   * Recupera una lista de países desde el API de catálogo.
   *
   * @returns Un Observable que emite la respuesta con un arreglo de países.
   */
  getPais(): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      this.apiRoutes.PAIS,
      {},
      false
    );
  }

  /**
   * Obtiene el catálogo de estados desde el servidor.
   *
   * Realiza una petición HTTP GET al endpoint `/api/catalogo/estados` y retorna la respuesta
   * como un observable de tipo `JsonResponseCatalogo`.
   *
   * @returns Observable que emite la respuesta del catálogo de estados.
   */
  getEstado(): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      this.apiRoutes.ESTADO,
      {},
      false
    );
  }
 /**
   * Obtiene el catálogo de países y bloques desde el servidor.
   * Realiza una petición HTTP GET al endpoint `/api/catalogo/fracciones producto terminado` y retorna la respuesta
   * como un observable de tipo `JsonResponseCatalogo`.
   *
   * @returns Observable que emite la respuesta del catálogo fracciones producto terminado.
   */

   getdatosProducto(fraccion:string): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      this.apiRoutes.datosProdocto(fraccion),
      {},
      false
    ).pipe(
      map((response) => {
       
return response;
      })
    );
  }
  /**
   * Obtiene el catálogo de países y bloques desde el servidor.
   * Realiza una petición HTTP GET al endpoint `/api/catalogo/paises/bloques` y retorna la respuesta
   * como un observable de tipo `JsonResponseCatalogo`.
   *
   * @returns Observable que emite la respuesta del catálogo de países y bloques.
   */
  getPaisBloque(): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      this.apiRoutes.paisesBloques,
      {},
      false
    );
  }

  /**
   * Obtiene el catálogo de tratados y acuerdos desde el servidor.
   * Realiza una petición HTTP GET al endpoint `/api/TITRAC.TA/tratados-acuerdos` y retorna la respuesta
   * como un observable de tipo `JsonResponseCatalogo`.
   *
   * @returns Observable que emite la respuesta del catálogo de tratados y acuerdos.
   */
  getTratadoAcuerdo(countryCode: string): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      this.apiRoutes.tratadosAcuerdos(countryCode),
      {},
      false
    );
  }

  /**
   * Obtiene el catálogo de estados desde el servidor.
   *
   * Realiza una petición HTTP GET al endpoint `/api/catalogo/estados` y retorna la respuesta
   * como un observable de tipo `JsonResponseCatalogo`.
   *
   * @returns Observable que emite la respuesta del catálogo de estados.
   */
  getActividadProductiva(): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      this.apiRoutes.ActividadProductiva,
      {},
      false
    );
  }

    getCatalogoEnumAPI(param:string): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      `${this.apiRoutes.CatalogoEnumAPI}/${param}`,
      {},
      false
    );
  }

  /**
   * Obtiene el layout de un archivo específico según su identificador.
   *
   * @param layoutId - El identificador único del layout del archivo a consultar.
   * @returns Un observable que emite la respuesta JSON con los datos del archivo.
   */
  getLayoutArchivo(layoutId: number): Observable<BaseResponse<DocumentoResponse>> {
    return this.http.get<BaseResponse<DocumentoResponse>>(`${this.apiRoutes.layoutArchivo(layoutId)}`)
  }


uploadCapacidad(FILE: File):Observable<BaseResponse<CapacidadPlanta>> {
  const FORM_DATA = new FormData();

  FORM_DATA.append('file', FILE);
  FORM_DATA.append(
    'request',
    new Blob(
      [JSON.stringify({
        tipo_servicio: 'TISIMMEX.IT',
        es_servicio: false
      })],
      { type: 'application/json' }
    )
  );

  return this.http.post<BaseResponse<CapacidadPlanta>>(`${this.apiRoutes.uploadCapacidad}`, FORM_DATA, {
    headers: {
      Accept: 'application/json'
    }
  });
}

  /**
   * Obtiene el catálogo de estados desde el servidor.
   *
   * Realiza una petición HTTP GET al endpoint `/api/catalogo/estados` y retorna la respuesta
   * como un observable de tipo `JsonResponseCatalogo`.
   *
   * @returns Observable que emite la respuesta del catálogo de estados.
   */
  getRepresentacion(id: string): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      `${this.apiRoutes.RepresentacionFederal}/${id}`,
      {},
      false
    );
  }

  /**
   * Obtiene la información de un tipo de documento específico según su identificador.
   *
   * @param id - El identificador único del tipo de documento a consultar.
   * @returns Un observable que emite la respuesta JSON con los datos del catálogo del tipo de documento.
   */
  getTipoDocumento(id: number): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      `${this.apiRoutes.TipoDocumento}/${id}`,
      {},
      false
    );
  }
/**
 * Obtiene el catálogo de tipos de documentos IMMEX desde el servidor.
 * @returns 
 */
  TipoDocImmex(): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      this.apiRoutes.TipoDocImmex,
      {},
      false
    );
  }

  /**
   * Obtiene el catálogo de municipios de México correspondientes a una entidad específica.
   *
   * @param cveEntidad - Clave numérica de la entidad federativa para la cual se desean obtener los municipios.
   * @returns Un observable que emite la respuesta en formato `JsonResponseCatalogo` con el listado de municipios.
   */
  getmunicipio(cveEntidad: string): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      `${this.apiRoutes.municipiosMax}/${cveEntidad}`,
      {},
      false
    );
  }
  /**
   * Obtiene la razón social asociada a un RFC específico.
   *https://api-v30.cloud-ultrasist.net/api/sat-t80101/solicitud/complementos/representante?rfc=AAL0409235E6
   * @param rfc - El RFC para el cual se desea obtener la razón social.
   * @returns Un observable que emite la respuesta en formato `RazonSocialResponse` con la razón social correspondiente.
   */
  getRazonSocial(rfc: string): Observable<RazonSocialResponse> {
    return this.httpService.get<RazonSocialResponse>(
      `${this.apiRoutes.razonsocial(rfc)}`,
      {},
      false
    );
  }

  /**
   * Obtiene el estado IMEX correspondiente a la clave de entidad proporcionada.
   *
   * @param cveEntidad - Clave de la entidad para la cual se solicita el estado IMEX.
   * @returns Un observable que emite la respuesta en formato JsonResponseCatalogo.
   */
  getEstadoImex(cveEntidad: string): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      `${this.apiRoutes.estadoImex}/${cveEntidad}`,
      {},
      false
    );
  }


  /**
   * Obtiene la información de una categoría de tipo según el valor de la clave enumerada proporcionada.
   *
   * @param cveEnum - Clave enumerada que identifica el tipo de categoría a consultar.
   * @returns Un observable que emite la respuesta JSON del catálogo correspondiente.
   */
  getTipCategoria(cveEnum: string): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      `${this.apiRoutes.tipoCategoria}/${cveEnum}`,
      {},
      false
    );
  }

  /**
   * Obtiene información del servicio IMMEX desde el catálogo correspondiente.
   *
   * Realiza una solicitud HTTP GET al endpoint definido en `apiRoutes.servicoImex`
   * y retorna la respuesta como un observable de tipo `JsonResponseCatalogo`.
   *
   * @returns Observable que emite la respuesta del catálogo IMMEX.
   */
  getServicoImmex(): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      this.apiRoutes.servicoImex,
      {},
      false
    );
  }


  /**
   * Valida fracción arancelaria de exportación vía API externa.
   * @param payload Debe tener: { fraccion: string, descFraccion: string, servicio?: any, servicio_padre?: any }
   * @returns Observable con la respuesta de la API
   */
  /**
   * Llama la API de fracción arancelaria exportación usando la ruta configurada en api-route.ts
   * @param payload { fraccion: string, descFraccion: string, servicio?: any, servicio_padre?: any }
   * @returns Observable con la respuesta de la API
   */
  getfraccionArancelariaExportacion(payload:any): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(this.apiRoutes.fraccionArancelariaExportacion, payload);
  }

  /**
   * Llama la API de fracción arancelaria importación usando la ruta configurada en api-route.ts
   */
  getfraccionArancelariaImportacion(payload:any): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(this.apiRoutes.fraccionArancelariaImportacion, payload);
  }
  /**
   * Establece la fila seleccionada del Anexo Uno.
   * Emite el nuevo valor a todos los suscriptores del observable correspondiente.
   */
  setAnexoUnoFilaSeleccionada(row: AnexoUnoEncabezado | null): void {
    this._anexoUnoFilaSeleccionada$.next(row);
  }

  /**
   * Establece la fila seleccionada del Anexo Dos.
   * Emite el nuevo valor a todos los suscriptores del observable correspondiente.
   */
  setAnexoDosFilaSeleccionada(row: AnexoDosEncabezado | null): void {
    this._anexoDosFilaSeleccionada$.next(row);
  }

  /**
   * Establece el procedimiento actual.
   *
   * @param procedure - El nombre del procedimiento a asignar.
   */
  setProcedure(procedure: string): void {
    this._procedure = procedure;
  }

   /**
   * Establece el procedimiento actual.
   * @param procedureNo - El nombre del procedimiento a asignar.
   */
  setProcedureNo(procedureNo: string): void {
    this._procedureNo = procedureNo;
  }

  /**
   * Obtiene información del tipo inversion desde el catálogo correspondiente.
   *
   * Realiza una solicitud HTTP GET al endpoint definido en `apiRoutes.tipoInversion`
   * y retorna la respuesta como un observable de tipo `JsonResponseCatalogo`.
   *
   * @returns Observable que emite la respuesta del catálogo de tipo inversión.
   */
  getTipoInversion(tipo: string): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      `${this.apiRoutes.tipoInversion}/${tipo}`,
      {},
      false
    );
  }

  /**
   * Obtiene información del tipo categoria desde el catálogo correspondiente.
   *
   * Realiza una solicitud HTTP GET al endpoint definido en `apiRoutes.tipoCategoria`
   * y retorna la respuesta como un observable de tipo `JsonResponseCatalogo`.
   *
   * @returns Observable que emite la respuesta del catálogo de tipo categoría.
   */
  getTipoCategoria(tipo: string): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      `${this.apiRoutes.tipoCategoria}/${tipo}`,
      {},
      false
    );
  }

    /**
     * Obtiene la lista de subfabricantes disponibles.
     * @method getSubfabricantesDisponibles
     * @returns {Observable<TableData>} Observable con la lista de subfabricantes disponibles.
     */
    getSubfabricantesDisponibles(body: BuscarPayload): Observable<JSONResponse> {
      return this.http.post<JSONResponse>(API_ROUTES().buscarPlantas, body).pipe(
        map((response) => response)
      );
    }

    /**
     * Realiza una solicitud POST para obtener la lista de plantas controladas disponibles.
     * 
     * @param body - Objeto de tipo `BuscarPayload` que contiene los parámetros de búsqueda.
     * @returns Un observable que emite la respuesta en formato `JSONResponse`.
     * @throws Error si ocurre un problema al obtener la lista de subfabricantes.
     */
    getControladasDisponibles(body: BuscarPayload): Observable<JSONResponse> {
      return this.http.post<JSONResponse>(API_ROUTES('/sat-t80104').buscarControldasPlantas, body).pipe(
        map((response) => response),
        catchError(() => {
          const ERROR = new Error(`Error al obtener la lista de subfabricantes en ${API_ROUTES('/sat-t80104').buscarControldasPlantas}`);
          return throwError(() => ERROR);
        })
      );
    }


      /**
       * Obtiene la lista de subfabricantes disponibles según los criterios de búsqueda proporcionados.
       *
       * @param body - Objeto que contiene los parámetros de búsqueda para filtrar las subfabricantes.
       * @returns Un observable que emite la respuesta JSON con la lista de subfabricantes disponibles.
       * @throws Error si ocurre un problema al obtener la lista de subfabricantes desde la API.
       */
      getTerciarizadasDisponibles(body: BuscarPayload): Observable<JSONResponse> {
      return this.http.post<JSONResponse>(API_ROUTES('/sat-t80105').buscarTerciarizadasPlantas, body).pipe(
        map((response) => response)
      );
    }

    
    /**
     * Obtiene la lista de plantas disponibles.
     * @method getPlantasDisponibles
     * @returns {Observable<TableData>} Observable con la lista de plantas disponibles.
     */
    getPlantasDisponibles(body: BuscarPayload): Observable<JSONResponse> {
      return this.http.post<JSONResponse>(API_ROUTES().buscarPlantasImmex, body).pipe(
        map((response) => response),
        catchError(() => {
          const ERROR = new Error(`Error al obtener la lista de plantas en ${API_ROUTES().buscarPlantasImmex}`);
          return throwError(() => ERROR);
        })
      );
    }

    /**
     * Obtiene la razón social de una empresa según su RFC.
     * @method abrirRazonSocial
     * @param rfc - RFC de la empresa.
     * @returns {Observable<AbrirRazonSocialResponse>} Observable con la razón social de la empresa.
     */
    obtenerRazonSocial(rfc:string): Observable<AbrirRazonSocialResponse> {
      return this.http.get<AbrirRazonSocialResponse>(`${API_ROUTES().abrirRazonSocial(rfc)}`).pipe(
        map((response) => response),
        catchError(() => {
          const ERROR = new Error(`Error al obtener la razón social en ${API_ROUTES().abrirRazonSocial(rfc)}`);
          return throwError(() => ERROR);
        })
      );
    }

    /**
 * Construye el domicilio fiscal completo a partir de los datos de domicilio
 * @param domicilio - Objeto domicilioDto
 * @param empresaDomicilio - Objeto domicilioSolicitud de empresaDto
 * @returns String con el domicilio fiscal completo
 */
// eslint-disable-next-line class-methods-use-this
private buildDomicilioFiscal(domicilio: any, empresaDomicilio: any = {}): string {
  const CALLE = domicilio.calle || empresaDomicilio.calle || '';
  const NUM_EXTERIOR = domicilio.numExterior || empresaDomicilio.numExterior || '';
  const NUM_INTERIOR = domicilio.numInterior || empresaDomicilio.numInterior || '';
  const COLONIA = domicilio.colonia || empresaDomicilio.colonia || '';
  const MUNICIPIO = domicilio.municipio || empresaDomicilio.municipio || domicilio.delegacionMunicipio || '';
  const ENTIDAD = domicilio.entidadFederativa?.nombre || empresaDomicilio.entidadFederativa?.nombre || '';
  const CODIGO_POSTAL = domicilio.codigoPostal || empresaDomicilio.codigoPostal || '';

  const PARTS = [CALLE, NUM_EXTERIOR, NUM_INTERIOR, COLONIA, MUNICIPIO, ENTIDAD, CODIGO_POSTAL]
    .filter(part => part && part.toString().trim() !== '')
    .map(part => part.toString().trim());

  return PARTS.join(', ');
}

/**
 * Mapea la respuesta de la API a un arreglo de objetos PlantasSubfabricante.
 * @param apiResponse - Respuesta de la API que contiene los datos de las plantas subfabricantes.
 * @returns Arreglo de objetos PlantasSubfabricante mapeados.
 */
  // eslint-disable-next-line class-methods-use-this
  mapApiResponseToPlantasSubfabricante(apiResponse: any[]): PlantasSubfabricante[] {
    // eslint-disable-next-line complexity
    return apiResponse.map(item => {
      const DOMICILIO = item.domicilioDto || {};
      const EMPRESA = item.empresaDto || {};
      const EMPRESA_DOMICILIO = EMPRESA.domicilioSolicitud || {};

      return {
        calle: DOMICILIO.calle || EMPRESA_DOMICILIO.calle || item.calle || '',
        numExterior: parseInt(DOMICILIO.numExterior || EMPRESA_DOMICILIO.numExterior || item.numeroExterior, 10) || 0,
        numInterior: parseInt(DOMICILIO.numInterior || EMPRESA_DOMICILIO.numInterior || item.numeroInterior, 10) || 0,
        codigoPostal: parseInt(DOMICILIO.codigoPostal || EMPRESA_DOMICILIO.codigoPostal || item.codigoPostal, 10) || 0,
        colonia: DOMICILIO.colonia || EMPRESA_DOMICILIO.colonia || item.colonia || '',
        municipio: DOMICILIO.municipio || EMPRESA_DOMICILIO.municipio || DOMICILIO.delegacionMunicipio || item.delegacionMunicipio || '',
        entidadFederativa: DOMICILIO.entidadFederativa?.nombre || EMPRESA_DOMICILIO.entidadFederativa?.nombre || item.entidadFederativa || '',
        pais: DOMICILIO.pais?.nombre || EMPRESA_DOMICILIO.pais?.nombre || item.pais || '',
        rfc: EMPRESA.rfc || item.rfc || '',
        domicilioFiscal: this.buildDomicilioFiscal(DOMICILIO, EMPRESA_DOMICILIO),
        razonSocial: EMPRESA.razonSocial || item.razonSocial || ''
      };
    });
  }


/**
 * Transforma un objeto fuente en una instancia de `DisponsibleFiscal`.
 * 
 * Extrae y mapea los datos fiscales y de domicilio desde diferentes estructuras posibles del objeto fuente,
 * asegurando valores predeterminados en caso de ausencia. Los campos incluyen información de domicilio,
 * entidad federativa, país, RFC, razón social y otros datos relevantes para el contexto fiscal.
 * 
 * @param source El objeto fuente que contiene la información fiscal y de domicilio.
 * @returns Un objeto `DisponsibleFiscal` con los datos mapeados y normalizados.
 */
toDisponsibleFiscal(source: any[]): DisponsibleFiscal[] {
  if (!Array.isArray(source)) {
    return [];
  }
  return source.map(item => {
    const DOMICILIO = item?.domicilioDto || item?.empresaDto?.domicilioSolicitud || {};
    const ENTIDAD = DOMICILIO?.entidadFederativa || item?.domicilioDto?.entidadFederativa;
    const PAIS = DOMICILIO?.pais || item?.domicilioDto?.pais;

    return {
      calle: DOMICILIO?.calle ?? '',
      numeroExterior: DOMICILIO?.numExterior ?? '',
      numeroInterior: DOMICILIO?.numInterior ?? '',
      codigoPostal: DOMICILIO?.codigoPostal ?? '',
      colonia: DOMICILIO?.colonia ?? '',
      municipioDelegacion: DOMICILIO?.municipio ?? DOMICILIO?.delegacionMunicipio ?? '',
      entidadFederativa: ENTIDAD?.nombre ?? '',
      pais: PAIS?.nombre ?? 'MÉXICO',
      registroFederalContribuyentes: item?.empresaDto?.rfc ?? item?.rfc ?? '',
      domicilioFiscalSolicitante: DOMICILIO?.descUbicacion ?? DOMICILIO?.colonia ?? '',
      razonSocial: item?.empresaDto?.razonSocial ?? item?.razonSocial ?? ''
    };
  });
}

    /**
   * Mapea la respuesta de la API a un arreglo de objetos PlantasSubfabricante.
   * @param apiResponse - Respuesta de la API que contiene los datos de las plantas subfabricantes.
   * @returns Arreglo de objetos PlantasSubfabricante mapeados.
   */
  // eslint-disable-next-line class-methods-use-this
  mapApiResponseToPlantasDisponibles(apiResponse: any[]): PlantasDisponibles[] {
    // eslint-disable-next-line complexity
    if (!Array.isArray(apiResponse) || apiResponse.length === 0) {
      return [];
    }

    // eslint-disable-next-line complexity
    return apiResponse.map((item) => {
      // Extract nested objects safely
      const DOMICILIO = item.domicilioDto || {};
      const EMPRESA = item.empresaDto || {};
      const EMPRESA_DOMICILIO = EMPRESA.domicilioSolicitud || {};
      const ENTIDAD_FEDERATIVA =
        DOMICILIO.entidadFederativa ||
        EMPRESA_DOMICILIO.entidadFederativa ||
        {};
      const PAIS = DOMICILIO.pais || EMPRESA_DOMICILIO.pais || {};

      const MAPPED_PLANTA: PlantasDisponibles = {
        calle:
          DOMICILIO.calle ||
          EMPRESA_DOMICILIO.calle ||
          '',

        numeroExterior: parseToString(
          DOMICILIO.numExterior ||
            EMPRESA_DOMICILIO.numExterior || ''
        ),

        numeroInterior: parseToString(
          DOMICILIO.numInterior ||
            EMPRESA_DOMICILIO.numInterior || ''
        ),

        codigoPostal: parseToString(
          DOMICILIO.codigoPostal ||
            EMPRESA_DOMICILIO.codigoPostal || ''
        ),

        localidad: parseToString(
          DOMICILIO.cveLocalidad ||
            DOMICILIO.localidad ||
            EMPRESA_DOMICILIO.localidad ||
            ''
        ),

        colonia:
          DOMICILIO.colonia ||
          DOMICILIO.descUbicacion ||
          EMPRESA_DOMICILIO.colonia ||
          '',

        municipioODelegacion:
          DOMICILIO.municipio ||
          DOMICILIO.delegacionMunicipio ||
          EMPRESA_DOMICILIO.municipio ||
          EMPRESA_DOMICILIO.delegacionMunicipio ||
          '',

        entidadFederativa:
          ENTIDAD_FEDERATIVA.nombre ||
          DOMICILIO.cveEntidad ||
          EMPRESA_DOMICILIO.cveEntidad ||
          '',

        pais:
          PAIS.nombre ||
          item.empresaPais || '',

        registroFederalDeContribuyentes:
          EMPRESA.rfc || '',

        domicilioFiscalDelSolicitante: this.buildDomicilioFiscal(
          DOMICILIO,
          EMPRESA_DOMICILIO
        ),

        razonSocial:
          EMPRESA.razonSocial ||
          '',
      };

      return MAPPED_PLANTA;
    });
  }
}
