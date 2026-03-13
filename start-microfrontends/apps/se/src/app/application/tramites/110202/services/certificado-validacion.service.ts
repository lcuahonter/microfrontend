import { Catalogo, ENVIRONMENT, HttpCoreService, JSONResponse, JsonResponseCatalogo } from '@libs/shared/data-access-user/src';
import { ColumnasTabla, SeleccionadasTabla } from '../constantes/modificacion.enum';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Tramite110202Store, TramiteState } from '../estados/tramite110202.store';
import { API_ROUTES } from '../servers/api-route';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mercancia } from '../../../shared/models/modificacion.enum';
import { Tramite110202Query } from '../estados/tramite110202.query';

@Injectable({
  providedIn: 'root'
})
export class CertificadoValidacionService {
  /**
   * URL base del servidor principal.
   */
  urlServer = ENVIRONMENT.URL_SERVER;

  /**
   * URL base del servidor de catálogos auxiliares.
   */
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
   * Almacena el nombre o identificador del procedimiento actual.
   *
   * @private
   */
  private _procedure: string = 'sat-t110202';

  /**
   * Almacena el nombre o identificador del procedimiento actual.
   *
   * @private
   */
  private _procedureNo: string = '';

  /** Constructor del servicio CertificadoValidacionService */
  constructor(
    private http: HttpClient,
    public tramite110202Store: Tramite110202Store,
    public Tramite110202Query: Tramite110202Query,
    public httpService: HttpCoreService) {
    // No se necesita lógica de inicialización adicional.
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
   * Obtiene la lista de TratadoAcuerdo desde un archivo JSON local.
   * @method obtenerListaTratadoAcuerdo
   * @returns {Observable<Catalogo[]>} Observable con la lista de TratadoAcuerdo.
   */
  obtenerListaTratadoAcuerdo(): Observable<Catalogo[]> {
    return this.http
      .get<{ data: Catalogo[] }>('./assets/json/110202/tratado-acuerdo.json') // Solicita los datos del archivo JSON
      .pipe(map((res) => res.data)); // Mapea los datos para extraer la propiedad 'data'
  }

  /**
   * Obtiene la lista de países bloque desde un archivo JSON local.
   * @method obtenerPaisBloque
   * @returns {Observable<Catalogo[]>} Observable con la lista de países bloque.
   */
  obtenerPaisBloque(): Observable<Catalogo[]> {
    return this.http
      .get<{ data: Catalogo[] }>('assets/json/110202/pais-bloque.json') // Solicita los datos del archivo JSON
      .pipe(map((res) => res.data)); // Mapea los datos para extraer la propiedad 'data'
  }

  /**
   * Obtiene la lista de mercancías desde un archivo JSON local.
   * @method obtenerMercancia
   * @returns {Observable<Mercancia[]>} Observable con la lista de mercancías.
   */
  obtenerMercancia(): Observable<Mercancia[]> {
    return this.http
      .get<{ data: Mercancia[] }>('assets/json/110202/mercancia.json') // Solicita los datos del archivo JSON
      .pipe(map((res) => res.data)); // Mapea los datos para extraer la propiedad 'data'
  }

  /**
   * Obtiene la lista de idiomas desde un archivo JSON local.
   * @method obtenerIdioma
   * @returns {Observable<Catalogo[]>} Observable con la lista de idiomas.
   */
  obtenerIdioma(): Observable<Catalogo[]> {
    return this.httpService.get<Catalogo[]>(
      this.apiRoutes.IDIOMA,
      {},
      false
    );
  }

  /**
   * Obtiene la lista de entidades federativas desde un archivo JSON local.
   * @method obtenerEntidadFederativa
   * @returns {Observable<Catalogo[]>} Observable con la lista de entidades federativas.
   */
  obtenerEntidadFederativa(): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      this.apiRoutes.ENTIDAD_FEDERATIVA,
      {},
      false
    );
  }

  /**
   * Obtiene la lista de representaciones federales desde un archivo JSON local.
   * @method obtenerRepresentacionFederal
   * @returns {Observable<Catalogo[]>} Observable con la lista de representaciones federales.
   */
  obtenerRepresentacionFederal(): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      this.apiRoutes.REPRESENTACION_FEDERAL,
      {},
      false
    );
  }

  /**
 * Obtiene la lista de facturas desde un archivo JSON local.
 * @method obtenerFacturas
 * @returns {Observable<Catalogo[]>} Observable con la lista de facturas.
 */
  obtenerFacturas(): Observable<Catalogo[]> {
    return this.http
      .get<{ data: Catalogo[] }>('assets/json/110202/factura.json') // Solicita los datos del archivo JSON
      .pipe(map((res) => res.data)); // Mapea los datos para extraer la propiedad 'data'
  }

  /**
   * Obtiene la lista de UMC desde un archivo JSON local.
   * @method obtenerUmc
   * @returns {Observable<Catalogo[]>} Observable con la lista de UMC.
   */
  obtenerUmc(): Observable<Catalogo[]> {
    return this.http
      .get<{ data: Catalogo[] }>('assets/json/110202/umc.json') // Solicita los datos del archivo JSON
      .pipe(map((res) => res.data)); // Mapea los datos para extraer la propiedad 'data'
  }

  /**
   * Obtiene una lista de países destino desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un Observable que emite un arreglo de objetos Catalogo con la información de los países destino.
   */
  obtenerPaisDestino(): Observable<Catalogo[]> {
    return this.http
      .get<{ data: Catalogo[] }>(`assets/json/110202/pais-destinatario.json`)
      .pipe(map((res) => res.data));
  }

  /**
  * Obtiene una lista de medios de transporte desde un archivo JSON.
  * @returns {Observable<Catalogo[]>} Un Observable que emite un arreglo de objetos Catalogo con la información de los medios de transporte.
  */
  obtenerMedioDeTransporte(): Observable<Catalogo[]> {
    return this.http
      .get<{ data: Catalogo[] }>(`assets/json/110202/medio-de-transporte.json`)
      .pipe(map((res) => res.data));
  }
  /**
 * Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
 * 
 * @returns Observable con los datos del estado de la solicitud `TramiteState`,
 *          cargados desde el archivo JSON especificado en la ruta de `assets`.
 */
  getRegistroTomaMuestrasMercanciasData(): Observable<TramiteState> {
    return this.http.get<TramiteState>('assets/json/110202/datos-previos.json');
  }


  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   * 
   * @param DATOS - Estado de la solicitud `TramiteState` con la información 
   *                del tipo de solicitud a actualizar en el store.
   */
  actualizarEstadoFormulario(DATOS: TramiteState): void {
    this.tramite110202Store.update(DATOS);

  }
  /**
   * Obtiene el catálogo de tratados.
   * @returns Observable con la respuesta del catálogo de tratados.
   */
  getTratado(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/110201/tratado.json');
  }

  /**
   * Obtiene el catálogo de países.
   * @returns Observable con la respuesta del catálogo de países.
   */
  getPais(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/110201/pais.json');
  }

  /**
   * Obtiene todos los datos del estado almacenado en el store.
   * @returns {Observable<Solicitud110201State>} Observable con todos los datos del estado.
   */
  getAllState(): Observable<TramiteState> {
    return this.Tramite110202Query.selectSolicitud$;
  }

  /**
   * Obtiene el catálogo de idiomas.
   * @returns Observable con la respuesta del catálogo de idiomas.
   */
  getIdioma(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/110201/idioma.json');
  }

  /**
   * Obtiene el catálogo de países de destino.
   * @returns Observable con la respuesta del catálogo de países de destino.
   */
  getPaisDestino(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/110201/pais-destino.json');
  }

  /**
   * Obtiene el catálogo de transportes.
   * @returns Observable con la respuesta del catálogo de transportes.
   */
  getTransporte(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/110201/transporte.json');
  }
  obtenerDatosAno(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/120403/ano.json');
  }

  /**
   * Obtiene el catálogo de entidades.
   * @returns Observable con la respuesta del catálogo de entidades.
   */
  getEntidad(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/110201/entidad.json');
  }

  /**
   * Obtiene el catálogo de representaciones.
   * @returns Observable con la respuesta del catálogo de representaciones.
   */
  getRepresentacion(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/110201/representacion.json');
  }

  /**
   * Obtiene el catálogo de tipos de factura.
   * @returns Observable con la respuesta del catálogo de tipos de factura.
   */
  getTipoFactura(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/110201/tipofactura.json');
  }

  /**
   * Obtiene el catálogo de unidades de medida comercial (UMC).
   * @returns Observable con la respuesta del catálogo de UMC.
   */
  getUMC(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/110201/umc.json');
  }

  /**
   * Obtiene el catálogo de unidades de medida.
   * @returns Observable con la respuesta del catálogo de unidades de medida.
   */
  getUnidadMedida(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/110201/umc.json');
  }

  /**
   * Obtiene un catálogo específico por su identificador.
   * @param id Identificador del catálogo.
   * @returns Observable con la respuesta del catálogo solicitado.
   */
  getCatalogoById(id: number): Observable<JSONResponse> {
    return this.http.get<JSONResponse>(`${this.urlServerCatalogos}/${id}`);
  }

  /**
    * Recupera la lista de "Registro de Solicitudes" desde un archivo JSON.
    *
    * @returns {Observable<ColumnasTabla[]>} Un observable que contiene un array de objetos RegistroDeSolicitudesTabla.
    *
    * @throws Lanzará un error si la solicitud HTTP falla.
    */
  public getSolicitudesTabla(): Observable<ColumnasTabla[]> {
    return this.http.get<ColumnasTabla[]>('assets/json/110201/mercancia-disponsible.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
    * Recupera la lista de "Mercancías Seleccionadas" desde un archivo JSON.
    * @returns {Observable<SeleccionadasTabla[]>} Un observable que contiene un array de objetos SeleccionadasTabla.
    * @throws Lanzará un error si la solicitud HTTP falla.
    */
  public getSolicitudesDataTabla(): Observable<SeleccionadasTabla[]> {
    return this.http.get<SeleccionadasTabla[]>('assets/json/110201/mercancia-seleccionadas.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * 
   * @param body - Objeto que contiene los datos para buscar mercancías.
   * @returns 
   */
  buscarMercanciasCert(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.httpService.post<JSONResponse>(this.apiRoutes.BUSCAR, { body: body });
  }

  /**
   * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
   * 
   * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  guardarDatosPost(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.httpService.post<JSONResponse>(this.apiRoutes.GUARDAR, { body: body });
  }


  /**
  * Construye un arreglo de mercancías seleccionadas a partir de los datos proporcionados.
  * @param arr Arreglo de objetos con los datos de las mercancías seleccionadas.
  * @returns Arreglo de objetos con la estructura requerida para las mercancías seleccionadas.
  * */
  buildMercanciaSeleccionadas(array: unknown[]): unknown[] {
    const RESULT: unknown[] = [];

    array.forEach((arr) => {
      const ITEM = arr as {
        id?: number;
        fraccionArancelaria?: string;
        nombreTecnico?: string;
        nombreComercial?: string;
        numeroDeRegistrodeProductos?: string;
        fechaExpedicion?: string;
        fechaVencimiento?: string;
        tipoFactura?: string;
        numeroFactura?: string;
        complementoDescripcion?: string;
        fechaFactura?: string;
        cantidad?: string;
        umc?: string;
        unidadMedidaMasaBruta?: string;
        valorMercancia?: string;
        marcaBruta?: string;
      };

      RESULT.push({
        id: ITEM.id,
        fraccion_arancelaria: ITEM.fraccionArancelaria,
        cantidad: ITEM.cantidad ? Math.floor(Number(ITEM.cantidad)) : 0,
        unidad_medida: ITEM.unidadMedidaMasaBruta,
        valor_mercancia: ITEM.valorMercancia ? Math.floor(Number(ITEM.valorMercancia)) : 0,
        nombreTecnico: ITEM.nombreTecnico,
        nombre_comercial: ITEM.nombreComercial,
        registro_producto: ITEM.numeroDeRegistrodeProductos,
        fechaExpedicion: ITEM.fechaExpedicion,
        fechaVencimiento: ITEM.fechaVencimiento,
        tipo_factura: ITEM.tipoFactura,
        num_factura: ITEM.numeroFactura,
        complemento_descripcion: ITEM.complementoDescripcion,
        fecha_factura: ITEM.fechaFactura,
        umc: ITEM.umc,
        marca_bruta: ITEM.marcaBruta,
      });
    });

    return RESULT;
  }

  /** Construye el objeto datos del certificado a partir del estado del trámite TramiteState. */
  buildDatosCertificado(data: TramiteState): unknown {
    return {
      observaciones: data.formDatosCertificado?.['observacionesDates'] ?? '',
      idioma: data.formDatosCertificado?.['idiomaDates'] ?? 0,

      precisa: data.formDatosCertificado?.['precisaDates'] ?? '',
      presenta: data.formDatosCertificado?.['presenta'] ?? '',
      representacion_federal: {
        entidad_federativa: data.formDatosCertificado?.['EntidadFederativaDates'] ?? 0,
        representacion_federal: data.formDatosCertificado?.['representacionFederalDates'] ?? 0
      },

    }
  }
  /** Construye el objeto certificado a partir del estado del trámite TramiteState. */
  buildCertificado(item: TramiteState): unknown {
    return {
      tratado_acuerdo: item.formCertificado?.['entidadFederativa'] || '',
      pais_bloque: item.formCertificado?.['bloque'] || '',
      fraccion_arancelaria: item.formCertificado?.['fraccionArancelaria'] || '',
      nombre_comercial: item.formCertificado?.['nombreComercial'] || '',
      fecha_inicio: item.formCertificado?.['fechaInicio'] || '',
      fecha_fin: item.formCertificado?.['fechaFin'] || '',
      registro_producto: item.formCertificado?.['registroProducto'] || '',
      mercancias_seleccionadas: this.buildMercanciaSeleccionadas(item.mercanciaTabla ?? []),
    };
  }

  /** Construye el objeto destinatario a partir del estado del trámite TramiteState. */
  buildDestinatario(data: TramiteState): unknown {
    return {
      nombre: data.formDatosDelDestinatario?.['nombres'],
      primer_apellido: data.formDatosDelDestinatario?.['primerApellido'],
      segundo_apellido: data.formDatosDelDestinatario?.['segundoApellido'],
      numero_registro_fiscal: data.formDatosDelDestinatario?.['numeroDeRegistroFiscal'],
      razon_social: data.formDatosDelDestinatario?.['razonSocial'],
      domicilio: {
        ciudad_poblacion_estado_provincia: data.formDestinatario?.['ciudad'],
        calle: data.formDestinatario?.['calle'],
        numero_letra: data.formDestinatario?.['numeroLetra'],
        lada: data.formDestinatario?.['lada'],
        telefono: data.formDestinatario?.['telefono'],
        fax: data.formDestinatario?.['fax'],
        correo_electronico: data.formDestinatario?.['correoElectronico'],
        pais_destino: data.formDestinatario?.['paisDestin']
      },
      medio_transporte: data.medioDeTransporteSeleccion?.clave || data.formTransporte?.['medioDeTransporte'] || '',
    }
  }
  /** Obtiene los datos de una solicitud específica mediante su ID. */
  getMostrarSolicitud(id: string): Observable<JSONResponse> {
    return this.httpService.get<JSONResponse>(API_ROUTES().MOSTRAR(id));
  }

  /** Mapea los datos del formulario del certificado desde el objeto recibido. */
  reverseMapFormCertificado(data: Record<string, unknown>): Record<string, unknown> {
    const CERTIFICADO = data?.['certificado'] as Record<string, unknown> ?? {};
    return {
      entidadFederativa: CERTIFICADO['tratado_acuerdo'] ?? '',
      bloque: CERTIFICADO['pais_bloque'] ?? '',
      fraccionArancelaria: CERTIFICADO['fraccion_arancelaria'] ?? '',
      nombreComercial: CERTIFICADO['nombre_comercial'] ?? '',
      fechaInicio: CERTIFICADO['fecha_inicio'] ?? '',
      fechaFin: CERTIFICADO['fecha_fin'] ?? '',
      registroProducto: CERTIFICADO['registro_producto'] ?? '',
    };
  }

  /** Mapea los datos del formulario de los datos del certificado desde el objeto recibido. */
  reverseMapFormDatosCertificado(data: Record<string, unknown>): Record<string, unknown> {
    const DATOS_CERTIFICADO = data?.['datos_del_certificado'] as Record<string, unknown> ?? {};
    return {
      observacionesDates: DATOS_CERTIFICADO?.['observaciones'] ?? '',
      idiomaDates: DATOS_CERTIFICADO?.['idioma'] ?? '',
      precisaDates: DATOS_CERTIFICADO?.['precisa'] ?? '',
      presenta: DATOS_CERTIFICADO?.['presenta'] ?? '',
      EntidadFederativaDates: (DATOS_CERTIFICADO?.['representacion_federal'] as { entidad_federativa?: unknown })?.['entidad_federativa'] ?? 0,
      representacionFederalDates: (DATOS_CERTIFICADO?.['representacion_federal'] as { representacion_federal?: unknown })?.['representacion_federal'] ?? '',
    };
  }

  /** Mapea los datos de la tabla de mercancías desde el objeto recibido. */
  reverseMapMercanciaTabla(data: Record<string, unknown>): Mercancia[] {
    const CERTIFICADO = (data?.['certificado'] as { mercancias_seleccionadas?: unknown[] }) ?? {};
    const MERCANCIA_SELECCIONADAS = CERTIFICADO.mercancias_seleccionadas ?? [];

    return MERCANCIA_SELECCIONADAS.map((m: unknown) => {
      const MERCANCIA = m as {
        id?: number;
        fraccion_arancelaria?: string;
        nombre_Technico?: string;
        nombre_comercial?: string;
        registro_producto?: string;
        fechaExpedicion?: string;
        fechaVencimiento?: string;
        tipo_factura?: string;
        num_factura?: string;
        complemento_descripcion?: string;
        fecha_factura?: string;
        cantidad?: string;
        umc?: string;
        unidad_medida?: string;
        valor_mercancia?: string;
      };
      return {
        id: MERCANCIA.id ?? undefined,
        fraccionArancelaria: MERCANCIA.fraccion_arancelaria ?? '',
        fechaExpedicion: MERCANCIA.fechaExpedicion ?? '',
        fechaVencimiento: MERCANCIA.fechaVencimiento ?? '',
        nombreTecnico: MERCANCIA.nombre_Technico ?? '',
        nombreComercial: MERCANCIA.nombre_comercial ?? '',
        numeroDeRegistrodeProductos: MERCANCIA.registro_producto ?? '',
        tipoFactura: MERCANCIA.tipo_factura ?? '',
        numeroFactura: MERCANCIA.num_factura ?? '',
        complementoDescripcion: MERCANCIA.complemento_descripcion ?? '',
        fechaFactura: MERCANCIA.fecha_factura ?? '',
        cantidad: MERCANCIA.cantidad !== undefined ? String(MERCANCIA.cantidad) : undefined,
        umc: MERCANCIA.umc ?? '',
        unidadMedida: MERCANCIA.unidad_medida ?? '',
        valorMercancia: MERCANCIA.valor_mercancia !== undefined ? String(MERCANCIA.valor_mercancia) : undefined,
      };
    });
  }

  /** Mapea los datos del formulario del destinatario desde el objeto recibido. */
  reverseMapFormDatosDelDestinatario(data: Record<string, unknown>): Record<string, unknown> {
    const DESTINATARIO = (data?.['destinatario'] ?? {}) as Record<string, unknown>;
    return {
      nombres: DESTINATARIO['nombre'] ?? '',
      primerApellido: DESTINATARIO['primer_apellido'] ?? '',
      segundoApellido: DESTINATARIO['segundo_apellido'] ?? '',
      numeroDeRegistroFiscal: DESTINATARIO['numero_registro_fiscal'] ?? '',
      razonSocial: DESTINATARIO['razon_social'] ?? '',
    };
  }

  /** Mapea los datos del formulario del destinatario desde el objeto recibido. */
  reverseMapFormDestinatario(data: Record<string, unknown>): Record<string, unknown> {
    const DESTINATARIO = (data?.['destinatario'] ?? {}) as { domicilio?: Record<string, unknown> };
    const DOMICILIO = DESTINATARIO.domicilio ?? {};

    return {
      ciudad: DOMICILIO['ciudad_poblacion_estado_provincia'] ?? '',
      calle: DOMICILIO['calle'] ?? '',
      numeroLetra: DOMICILIO['numero_letra'] ?? '',
      lada: DOMICILIO['lada'] ?? '',
      telefono: DOMICILIO['telefono'] ?? '',
      fax: DOMICILIO['fax'] ?? '',
      correoElectronico: (data?.['solicitante'] as Record<string, unknown>)?.['correo_electronico'] ?? '',
      paisDestin: DOMICILIO['pais_destino'] ?? '',
    };
  }

  /** Mapea los datos del medio de transporte desde el objeto recibido. */
  reverseMapMedioDeTransporte(data: Record<string, unknown>): Record<string, unknown> {
    const MEDIO =
      (data?.['destinatario'] as Record<string, unknown>)?.['medio_transporte'] ??
      data?.['medio_transporte'] ??
      '';
    let medioClave = '';

    if (MEDIO && typeof MEDIO === 'object' && 'clave' in MEDIO) {
      medioClave = (MEDIO as { clave: string }).clave;
    }
    else if (typeof MEDIO === 'string') {
      medioClave = MEDIO;
    }

    return {
      medioDeTransporte: medioClave
    };
  }

  /** Reconstruye el estado completo de la solicitud del trámite 110201 a partir del objeto recibido. */
  reverseBuildSolicitud110202(built: Record<string, unknown>): Record<string, unknown> {
    return {
      formDatosCertificado: this.reverseMapFormDatosCertificado(built),
      formCertificado: this.reverseMapFormCertificado(built),
      mercanciaTabla: this.reverseMapMercanciaTabla(built),
      formDatosDelDestinatario: this.reverseMapFormDatosDelDestinatario(built),
      formDestinatario: this.reverseMapFormDestinatario(built),
      formTransporte: this.reverseMapMedioDeTransporte(built)
    };
  }

}
