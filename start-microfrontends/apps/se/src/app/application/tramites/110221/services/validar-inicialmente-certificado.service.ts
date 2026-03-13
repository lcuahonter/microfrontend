import { Catalogo, HttpCoreService, JSONResponse, JsonResponseCatalogo, RespuestaCatalogos } from '@ng-mf/data-access-user';
import { ColumnasTabla, SeleccionadasTabla } from '../models/registro.model';
import { HistoricoColumnas, MercanciaTabla, MercanciasHistorico, ProductorExportador } from '../models/peru-certificado.model';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Tramite110221State, Tramite110221Store } from '../estados/tramite110221.store';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mercancia } from '../../../shared/models/modificacion.enum';

import { Mercancias } from '../models/plantas-consulta.model';

import { PROC_110221 } from '../servers/api-route';
import { Tramite110221Query } from '../estados/tramite110221.query';

import { CadenaOriginalRequest } from '@libs/shared/data-access-user/src/core/models/shared/cadena-original-request.model';

import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';

/**
 * @descripcion
 * Servicio encargado de validar y obtener datos iniciales para el trámite de certificado.
 * Proporciona métodos para consultar catálogos, tablas de datos, productores/exportadores y actualizar el estado del formulario.
 */
@Injectable({
  providedIn: 'root'
})
export class ValidarInicialmenteCertificadoService {
  url: string = '../../../../../assets/json/110221/';
  /**
   * Almacena el valor seleccionado del catálogo de entidad federativa.
   * Se utiliza para comparar el estado seleccionado con el estado registrado en la planta o domicilio fiscal.
   */
  public catalogos: any;
  private readonly servidor: string | undefined;
  /**
   * @constructor
   * @descripcion
   * Inyecta el cliente HTTP y el store del trámite para manipular el estado y realizar peticiones.
   * @param http Cliente HTTP para realizar solicitudes.
   * @param tramite110221Store Store para manipular el estado del trámite.
   */
  constructor(private readonly http: HttpClient, public tramite110221Store: Tramite110221Store, public httpService: HttpCoreService,
        public query: Tramite110221Query
) { }

    private get apiRoutes(): typeof PROC_110221 {
    return PROC_110221;
  }

  /**
   * @method obtenerMenuDesplegable
   * @descripcion
   * Obtiene un arreglo de objetos `Catalogo` desde un archivo JSON ubicado en la URL especificada.
   * @param fileName El nombre del archivo JSON desde el cual se obtendrán los datos.
   * @returns Un `Observable` que emite un arreglo de objetos `Catalogo`.
   * @usageNotes
   * Este método construye la URL completa al agregar el `fileName` a la URL base (`this.url`) 
   * y realiza una solicitud HTTP GET para recuperar los datos.
   */
  obtenerMenuDesplegable(fileName: string): Observable<Catalogo[]> {
    const BASE_URL = this.url + fileName;
    return this.http.get<RespuestaCatalogos>(BASE_URL).pipe(
      map(response => response.data)
    );
  }

  /**
   * @method obtenerTablaDatos
   * @descripcion
   * Obtiene un arreglo de objetos `Mercancia` desde un archivo JSON ubicado en la URL especificada.
   * @param fileName El nombre del archivo JSON desde el cual se obtendrán los datos.
   * @returns Un `Observable` que emite un arreglo de objetos `Mercancia`.
   * @usageNotes
   * Este método construye la URL completa al agregar el `fileName` a la URL base (`this.url`) 
   * y realiza una solicitud HTTP GET para recuperar los datos.
   */
  obtenerTablaDatos(fileName: string): Observable<Mercancia[]> {
    const JSON_URL = this.url + fileName;
    return this.http.get<Mercancia[]>(JSON_URL);
  }

  // /**
  //  * @method obtenerProductorPorExportador
  //  * @descripcion
  //  * Obtiene la lista de productores/exportadores disponibles desde un archivo JSON.
  //  * @returns {Observable<ProductorExportador>} Un observable que emite la lista de productores/exportadores.
  //  */
  // obtenerProductorPorExportador(): Observable<ProductorExportador> {
  //   return this.http
  //     .get<ProductorExportador>('assets/json/110221/productor-exportador.json');
  // }

  /**
   * @method obtenerMercancia
   * @descripcion
   * Obtiene el historial de mercancías seleccionadas desde un archivo JSON local.
   * @returns {Observable<MercanciasHistorico>} Un observable que emite los datos del historial de mercancías.
   */
  /**
   * Obtiene la lista de mercancías desde un archivo JSON local.
   * @method obtenerMercancia
   * @returns {Observable<Mercancia[]>} Observable con la lista de mercancías.
   */
  obtenerMercancia(): Observable<Mercancias[]> {
    return this.http
      .get<{ data: Mercancias[] }>('assets/json/110221/mercancia.json') // Solicita los datos del archivo JSON
      .pipe(map((res) => res.data)); // Mapea los datos para extraer la propiedad 'data'
  }


  /**
   * Obtiene el catálogo de países de destino.
   * @returns {Observable<RespuestaCatalogos>} Observable con la respuesta del catálogo.
   */
  getPaisDestino(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/110221/pais.json');
  }

  /**
   * Obtiene el catálogo de transportes.
   * @returns {Observable<RespuestaCatalogos>} Observable con la respuesta del catálogo.
   */
  getTransporte(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/110221/pais.json');
  }
  /**
   * Obtiene el catálogo de tratados.
   * @returns {Observable<RespuestaCatalogos>} Observable con la respuesta del catálogo.
   */
  getTratado(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/110221/tratado.json');
  }
  
   /**
   * Obtiene el catálogo de tipos de factura.
   * @returns {Observable<RespuestaCatalogos>} Observable con la respuesta del catálogo.
   */
  getTipoFactura(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/110221/tipofactura.json'
    );
  }

  /**
   * Obtiene el catálogo de unidades de medida comercial (UMC).
   * @returns {Observable<RespuestaCatalogos>} Observable con la respuesta del catálogo.
   */
  getUMC(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/110221/umc.json');
  }

  /**
   * Obtiene el catálogo de unidades de medida.
   * @returns {Observable<RespuestaCatalogos>} Observable con la respuesta del catálogo.
   */
  getUnidadMedida(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/110221/umc.json');
  }

  /**
   * Recupera la lista de "Registro de Solicitudes" desde un archivo JSON.
   * @returns {Observable<ColumnasTabla[]>} Observable con array de objetos.
   * @throws {Error} Lanza error si la solicitud HTTP falla.
   */
  public getSolicitudesTabla(): Observable<ColumnasTabla[]> {
    return this.http.get<ColumnasTabla[]>('assets/json/110221/mercancia-disponsible.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

   /**
   * Recupera la lista de "Solicitudes Seleccionadas" desde un archivo JSON.
   * @returns {Observable<SeleccionadasTabla[]>} Observable con array de objetos.
   * @throws {Error} Lanza error si la solicitud HTTP falla.
   */
  public getSolicitudesDataTabla(): Observable<SeleccionadasTabla[]> {
    return this.http.get<SeleccionadasTabla[]>('assets/json/110221/mercancias-seleccionadas-certificado.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
  
  /**
   * @method getRegistroTomaMuestrasMercanciasData
   * @descripcion
   * Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
   * @returns Observable con los datos del estado de la solicitud `Tramite110221State`,
   *          cargados desde el archivo JSON especificado en la ruta de `assets`.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Tramite110221State> {
    return this.http.get<Tramite110221State>('assets/json/110221/datos-prefill.json');
  }

    /**
     * Obtiene la lista de estados desde un archivo JSON local.
     * @method obtenerListaEstado
     * @returns {Observable<Catalogo[]>} Observable con la lista de estados.
     */
    obtenerListaEstado(): Observable<Catalogo[]> {
      return this.http
        .get<{ data: Catalogo[] }>('./assets/json/110221/estado.json') // Solicita los datos del archivo JSON
        .pipe(map((res) => res.data)); // Mapea los datos para extraer la propiedad 'data'
    }
    /**
   * Obtiene la lista de países bloque desde un archivo JSON local.
   * @method obtenerPaisBloque
   * @returns {Observable<Catalogo[]>} Observable con la lista de países bloque.
   */


    obtenerMercancias(): Observable<MercanciasHistorico> {
    return this.http
      .get<MercanciasHistorico>('assets/json/110221/mercancias-seleccionadas.json');
  }
   /**
 * Obtiene la lista de facturas desde un archivo JSON local.
 * @method obtenerFacturas
 * @returns {Observable<Catalogo[]>} Observable con la lista de facturas.
 */
  obtenerFacturas(): Observable<Catalogo[]> {
    return this.http
      .get<{ data: Catalogo[] }>('assets/json/110204/factura.json') // Solicita los datos del archivo JSON
      .pipe(map((res) => res.data)); // Mapea los datos para extraer la propiedad 'data'
  }
   /**
     * Obtiene la lista de UMC desde un archivo JSON local.
     * @method obtenerUmc
     * @returns {Observable<Catalogo[]>} Observable con la lista de UMC.
     */
    obtenerUmc(): Observable<Catalogo[]> {
      return this.http
        .get<{ data: Catalogo[] }>('assets/json/110204/umc.json') // Solicita los datos del archivo JSON
        .pipe(map((res) => res.data)); // Mapea los datos para extraer la propiedad 'data'
    }
  

    /**
   * Obtiene el catálogo de estados desde el servidor.
   *
   * Realiza una petición HTTP GET al endpoint `/api/catalogo/estados` y retorna la respuesta
   * como un observable de tipo `JsonResponseCatalogo`.
   *
   * @returns Observable que emite la respuesta del catálogo de estados.
   */
  getTipoFacturaOpciones(): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      PROC_110221.TIPO_FACTURA,
      {},
      false
    );
  }

  /**
   * Obtiene la lista de países bloque desde un archivo JSON local.
   * @method obtenerPaisBloque
   * @returns {Observable<Catalogo[]>} Observable con la lista de países bloque.
   */
  obtenerPaisBloque(): Observable<Catalogo[]> {
    return this.http
      .get<{ data: Catalogo[] }>('assets/json/110221/país-bloque.json') // Solicita los datos del archivo JSON
      .pipe(map((res) => res.data)); // Mapea los datos para extraer la propiedad 'data'
  }

    /**
     * Obtiene la entidad federativa asociada a la solicitud.
     * @returns {Observable<JsonResponseCatalogo>} Observable con la entidad federativa.
     */
    obtenerEntidadFederativa(): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      PROC_110221.ENTIDAD_FEDERATIVA,
      {},
      false
    );
  }
  /**
 * @method obtenerRepresentacionFederal
 * @descripcion
 * Obtiene el catálogo de representaciones federales desde el servidor.
 * @returns {Observable<JsonResponseCatalogo>} Observable con la respuesta del catálogo de representaciones federales.
 */
obtenerRepresentacionFederal(): Observable<JsonResponseCatalogo> {
  return this.httpService.get<JsonResponseCatalogo>(
    PROC_110221.REPRESENTACION_FEDERAL, // Use the route defined in `api-route.ts`
    {},
    false
  );
}

 guardarDatosPost(
    body: Record<string, unknown>
  ): Observable<Record<string, unknown>> {
    return this.httpService.post<Record<string, unknown>>(PROC_110221.GUARDAR, {
      body: body,
    });
  }

  /**
   * Busca las mercancías asociadas a un certificado.
   * @param body Cuerpo de la solicitud con los parámetros de búsqueda.
   * @returns Observable con la respuesta de la API.
   */
buscarMercanciasCert(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.httpService.post<JSONResponse>(PROC_110221.BUSCAR, { body: body });
  }

  /** Construye el arreglo de mercancías seleccionadas para el certificado. */
buildMercanciaSeleccionadas(array: unknown[]): unknown[] {
    const RESULT: unknown[] = [];

    array.forEach((arr) => {
      const ITEM = arr as {
        id?: number | string;
        idMercancia?: string;
        fraccionArancelaria?: string;
        descripcionMercancia?: string | null;
        unidadMedida?: string | null;
        paisOrigen?: string | null;
        cumpleReglasOrigen?: boolean;
        criterioOrigen?: string | null;
        porcentajeContenidoRegional?: number | null;
        numeroRegistro?: boolean | string | null;
        requiereDocumentosAdicionales?: boolean;
        fraccionNaladi?: string;
        fraccionNaladiSa93?: string;
        fraccionNaladiSa96?: string;
        fraccionNALADISA02Clave?: string;
        fraccionNALADIClave?: string;
        fraccionNALADSA93Clave?: string;
        fraccionNALADISA96Clave?: string;
        nombreTecnico?: string | null;
        nombreComercial?: string | null;
        numeroDeRegistrodeProductos?: string;
        tipoFactura?: string;
        numFactura?: string;
        complementoDescripcion?: string;
        fechaExpedicion?: string | null;
        fechaVencimiento?: string | null;
        fechaFactura?: string;
        cantidad?: string;
        umc?: string;
        unidadMedidaMasaBruta?: string;
        valorMercancia?: string;
      };

      RESULT.push({
        id: ITEM.id || null,
        fraccion_arancelaria: ITEM.fraccionArancelaria || '',
        fraccion_naladi: ITEM.fraccionNALADIClave || '',
        fraccion_naladi_sa93: ITEM.fraccionNALADSA93Clave || '',
        fraccion_naladi_sa96: ITEM.fraccionNALADISA96Clave || '',
        fraccion_naladi_sa02: ITEM.fraccionNALADISA02Clave || '',
        nombre_tecnico: ITEM.nombreTecnico || '',
        nombre_comercial: ITEM.nombreComercial || '',
        registro_producto: ITEM.numeroDeRegistrodeProductos || '',
        fecha_expedicion: ITEM.fechaExpedicion || '',
        fecha_vencimiento: ITEM.fechaVencimiento || '',
        tipo_factura: ITEM.tipoFactura || '',
        num_factura: ITEM.numFactura || '',
        complemento_descripcion: ITEM.complementoDescripcion || '',
        fecha_factura: ITEM.fechaFactura || '',
        cantidad: ITEM.cantidad || '',
        umc: ITEM.umc || '',
        unidad_medida: ITEM.unidadMedidaMasaBruta || '',
        valor_mercancia: ITEM.valorMercancia || ''
      });
    });

    return RESULT;
  }

  /** Construye el objeto datos del certificado a partir del estado del trámite TramiteState. */
  buildDatosCertificado(data: Tramite110221State): unknown {
      return {
        "observaciones": data.formDatosCertificado['observacionesDates'] ?? '',
        "idioma": data.formDatosCertificado['idiomaDates'] ?? 0,
        "representacion_federal": {
            "entidad_federativa": data.formDatosCertificado['EntidadFederativaDates'] ?? 0,
            "representacion_federal": data.formDatosCertificado['representacionFederalDates'] ?? 0
        }
      }
    }

  /** Agrega un nuevo productor/exportador. */
    obtenerProductoruNevo(body: Record<string, unknown>): Observable<unknown> {
    return this.httpService.post<unknown>(PROC_110221.AGREGAR_PRODUCTOR, {
      body: body,
    });
  }

  /**
   * Obtiene el productor/exportador asociado a la solicitud.
   * @returns {Observable<ProductorExportador>} Observable con el productor/exportador.
   */
  obtenerProductorPorExportador(): Observable<ProductorExportador> {
    return this.httpService.get<ProductorExportador>(
      PROC_110221.BUSCAR_PRODUCTOR
    );
  }

  /**
   * Obtiene todos los datos del estado almacenado en el store.
   * @returns {Observable<TramiteState>} Observable con todos los datos del estado.
   */
  getAllState(): Observable<Tramite110221State> {
    return this.query.selectTramite$;
  }
/**
   * @method actualizarEstadoFormulario
   * @description
   * Actualiza el estado del formulario en el store con los datos proporcionados.
   * @param {Tramite110205State} DATOS - Objeto que contiene los nuevos datos para actualizar el estado.
   * @returns {void}
   */
  actualizarEstadoFormulario(DATOS: Tramite110221State): void {
    this.tramite110221Store.update(DATOS);
  }
  /**
   * Obtiene la cadena original del trámite.
   * @param {string} idSolicitud - ID de la solicitud.
   * @param {CadenaOriginalRequest} body - Cuerpo de la solicitud.
   * @returns {Observable<BaseResponse<T>>} Observable con la respuesta de la API.
   */
  obtenerCadenaOriginal<T>(
        idSolicitud: string,
        body: CadenaOriginalRequest
      ): Observable<BaseResponse<T>> {
        return this.http
          .post<BaseResponse<T>>(
            PROC_110221.API_POST_CADENA_ORIGINAL(idSolicitud),
            body
          )
          .pipe(
            map((response) => response),
            catchError(() => {
              const ERROR = new Error(
                `Error al obtener la cadena original en ${PROC_110221.API_POST_CADENA_ORIGINAL(
                  idSolicitud
                )}`
              );
              return throwError(() => ERROR);
            })
          );
      }
  /** Obtiene los datos de la solicitud para mostrar. */
       getMostrarSolicitud(id: string): Observable<JSONResponse> {
    return this.httpService.get<JSONResponse>(PROC_110221.MOSTRAR(id));
  }
  /**
   *  Obtiene los datos para mostrar en base al ID de la solicitud proporcionado.
   * @param idSolicitud  - El ID de la solicitud para la cual se desean obtener los datos.
   * @returns  Observable con la respuesta que contiene los datos a mostrar.
   */
  getMostrarDatos(idSolicitud: number): Observable<JSONResponse> {
    return this.http.get<JSONResponse>(PROC_110221.MOSTRAR + '?idSolicitud=' + idSolicitud);
  }

  /** Reverse mapea el formulario de certificado desde el objeto histórico. */
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
  /** Reverse mapea el formulario de datos del certificado desde el objeto histórico. */
  reverseMapFormDatosCertificado(data: Record<string, unknown>): Record<string, unknown> {
    const DATOS_CERTIFICADO = data?.['datos_del_certificado'] as Record<string, unknown> ??{};
    return {
      observacionesDates: DATOS_CERTIFICADO?.['observaciones'] ?? '',
      idiomaDates: DATOS_CERTIFICADO?.['idioma'] ?? '',
      precisaDates: DATOS_CERTIFICADO?.['precisa'] ?? '',
      presenta: DATOS_CERTIFICADO?.['presenta'] ?? '',
      EntidadFederativaDates: (DATOS_CERTIFICADO?.['representacion_federal'] as { entidad_federativa?: unknown })?.['entidad_federativa'] ?? 0,
      representacionFederalDates: (DATOS_CERTIFICADO?.['representacion_federal'] as { representacion_federal?: unknown })?.['representacion_federal'] ?? '',
    };
  }
  /** Reverse mapea las mercancías desde el objeto histórico. */
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
        numFactura: MERCANCIA.num_factura ?? '',
        complementoDescripcion: MERCANCIA.complemento_descripcion ?? '',
        fechaFactura: MERCANCIA.fecha_factura ?? '',
        cantidad: MERCANCIA.cantidad !== undefined ? String(MERCANCIA.cantidad) : undefined,
        umc: MERCANCIA.umc ?? '',
        unidadMedida: MERCANCIA.unidad_medida ?? '',
        valorMercancia: MERCANCIA.valor_mercancia !== undefined ? String(MERCANCIA.valor_mercancia) : undefined,
      };
    });
  }
  /** Reverse mapea los productores por exportador desde el objeto histórico. */
  reverseMapProductoresPorExportador(data: Record<string, unknown>): HistoricoColumnas[] {
    const HISTORICO = (data?.['historico'] ?? {}) as { productoresPorExportador?: unknown[] };
    const PRODUCTORES_EXPORTADOR = HISTORICO.productoresPorExportador ?? [];

    return PRODUCTORES_EXPORTADOR.map((item: unknown) => {
      const PRODUCTOR = item as {
        nombreCompleto?: string;
        rfc?: string;
        direccionCompleta?: string;
        correoElectronico?: string;
        telefono?: string;
        fax?: string;
      };
      return {
        nombreProductor: PRODUCTOR.nombreCompleto ?? '',
        numeroRegistroFiscal: PRODUCTOR.rfc ?? '',
        direccion: PRODUCTOR.direccionCompleta ?? '',
        correoElectronico: PRODUCTOR.correoElectronico ?? '',
        telefono: PRODUCTOR.telefono ?? '',
        fax: PRODUCTOR.fax ?? '',
      } as HistoricoColumnas;
    });
  }

  /** Reverse mapea los productores por exportador seleccionados desde el objeto histórico. */
  reverseMapProductoresPorExportadorSeleccionados(data: Record<string, unknown>): HistoricoColumnas[] {
    const HISTORICO = (data?.['historico'] ?? {}) as { ProductoresPorExportadorSeleccionados?: unknown[] };
    const PRODUCTORES_EXPORTADOR_SELECCIONADOS = HISTORICO.ProductoresPorExportadorSeleccionados ?? [];

    return PRODUCTORES_EXPORTADOR_SELECCIONADOS.map((item: unknown) => {
      const PRODUCTOR = item as {
        nombreCompleto?: string;
        rfc?: string;
        direccionCompleta?: string;
        correoElectronico?: string;
        telefono?: string;
        fax?: string;
      };
      return {
        nombreProductor: PRODUCTOR.nombreCompleto ?? '',
        numeroRegistroFiscal: PRODUCTOR.rfc ?? '',
        direccion: PRODUCTOR.direccionCompleta ?? '',
        correoElectronico: PRODUCTOR.correoElectronico ?? '',
        telefono: PRODUCTOR.telefono ?? '',
        fax: PRODUCTOR.fax ?? '',
      } as HistoricoColumnas;
    });
  }

  /** Reverse mapea los datos del destinatario desde el objeto histórico. */
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
  /** Reverse mapea el formulario del destinatario desde el objeto histórico. */
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
  /** Reverse mapea el medio de transporte desde el objeto histórico. */
  reverseMapMedioDeTransporte(data: Record<string, unknown>): Catalogo {
    const DESTINATARIO = (data?.['destinatario'] ?? {}) as Record<string, unknown>;
    return {
      clave: typeof DESTINATARIO['medio_transporte'] === 'string' ? DESTINATARIO['medio_transporte'] : '',
      id: 0,
      descripcion: ''
    };
  }
  
  /** Reverse mapea las mercancías del productor desde el objeto histórico. */
  reverseMapMercanciasProductor(data: Record<string, unknown>): MercanciaTabla[] {
    const HISTORICO = (data?.['historico'] ?? {}) as { mercanciasProductor?: unknown[] };
    const MERCANCIAS_PRODUCTOR = HISTORICO.mercanciasProductor ?? [];

    return MERCANCIAS_PRODUCTOR.map((item: unknown) => {
      const MERCANCIA = item as {
        fraccionArancelaria?: string;
        cantidadComercial?: string;
        descUnidadMedidaComercial?: string;
        valorTransaccional?: string;
        descFactura?: string;
        fechaFactura?: string;
        numeroFactura?: string;
        complementoDescripcion?: string;
        rfcProductor?: string;
      };
      return {
        fraccionArancelaria: MERCANCIA.fraccionArancelaria ?? '',
        cantidad: MERCANCIA.cantidadComercial ?? '',
        unidadMedida: MERCANCIA.descUnidadMedidaComercial ?? '',
        valorMercancia: MERCANCIA.valorTransaccional ?? '',
        fetchFactura: MERCANCIA.descFactura ?? '',
        fechaFactura: MERCANCIA.fechaFactura ?? '',
        numeroFactura: MERCANCIA.numeroFactura ?? '',
        complementoDescripcion: MERCANCIA.complementoDescripcion ?? '',
        rfcProductor1: MERCANCIA.rfcProductor ?? '',
      } as unknown as MercanciaTabla;
    });
  }
  
  /** Reverse mapea el representante legal desde el objeto histórico. */
  reverseRepresentanteLegal(data: Record<string, unknown>): Record<string, unknown> {
    const DESTINATARIO = (data?.['destinatario'] ?? {}) as { generalesRepresentanteLegal?: Record<string, unknown> };
    const GENERAL_REPRESENTANTE_LEGAL = DESTINATARIO.generalesRepresentanteLegal ?? {};

    return {
      lugar: GENERAL_REPRESENTANTE_LEGAL['lugarRegistro'] ?? '',
      exportador: GENERAL_REPRESENTANTE_LEGAL['nombre'] ?? '',
      nombres: GENERAL_REPRESENTANTE_LEGAL['razonSocial'] ?? '',
      puesto: GENERAL_REPRESENTANTE_LEGAL['puesto'] ?? '',
      telefono: GENERAL_REPRESENTANTE_LEGAL['telefono'] ?? '',
      correoElectronico: GENERAL_REPRESENTANTE_LEGAL['correoElectronico'] ?? '',
      
    };
  }

  /** Mapea los datos del formulario desde el objeto histórico recibido. */
  reverseMapFormulario(data: Record<string, unknown>): Record<string, unknown> {
    const HISTORICO = (data?.['historico'] ?? {}) as Record<string, unknown>;
    return {
      datosConfidencialesProductor: HISTORICO['datosConfidencialesProductor'] ?? '',
      productorMismoExportador: HISTORICO['productorMismoExportador'] ?? '',
    };
  }
  /** Reverse construye la solicitud 110221 desde el objeto histórico. */
reverseBuildSolicitud110221(built: Record<string, unknown>): Record<string, unknown> {
    return {
      formDatosCertificado: this.reverseMapFormDatosCertificado(built),
      formCertificado: this.reverseMapFormCertificado(built),
      mercanciaTabla: this.reverseMapMercanciaTabla(built),
      formDatosDelDestinatario: this.reverseMapFormDatosDelDestinatario(built),
      formDestinatario: this.reverseMapFormDestinatario(built),
      medioDeTransporteSeleccion: this.reverseMapMedioDeTransporte(built),
       formExportor: this.reverseRepresentanteLegal(built),
      formulario: this.reverseMapFormulario(built),
      productoresExportador: this.reverseMapProductoresPorExportador(built),
      agregarProductoresExportador: this.reverseMapProductoresPorExportadorSeleccionados(built),
      mercanciaProductores: this.reverseMapMercanciasProductor(built),
    };
  }
  /** Construye el objeto destinatario a partir del estado del trámite 110223. */
    buildMercanciasProductor(data: MercanciaTabla[]): unknown[] {
      return data.map(item => ({
        "fraccionArancelaria": item.fraccionArancelaria,
        "cantidadComercial": item.cantidad,
        "descUnidadMedidaComercial": item.unidadMedida,
        "valorTransaccional": item.valorMercancia,
        "descFactura": item.fetchFactura,
        "fechaFactura": item.fetchFactura,
        "numeroFactura": item.numeroFactura,
        "complementoDescripcion": item.complementoDescripcion,
        "rfcProductor": item.rfcProductor1
      }));
    }
  
    /** Construye el objeto destinatario a partir del estado del trámite 110223. */
    // eslint-disable-next-line class-methods-use-this
    buildProductoresPorExportador(data: HistoricoColumnas[]): unknown[] {
      return data.map(item => ({
        "nombreCompleto": item.nombreProductor,
        "rfc": item.numeroRegistroFiscal,
        "direccionCompleta": item.direccion,
        "correoElectronico": item.correoElectronico,
        "telefono": item.telefono,
        "fax": item.fax
      }));
    }
  
    /** Construye el objeto destinatario a partir del estado del trámite 110223. */
    buildCertificado(data: Tramite110221State): unknown {
      return {
        "tratado_acuerdo": data.formCertificado['entidadFederativa'] || 102,
        "pais_bloque": data.formCertificado['bloque'] || '',
        "fraccion_arancelaria": data.formCertificado['fraccionArancelariaForm'] || '',
        "nombre_comercial": data.formCertificado['nombreComercialForm'] || '',
        "registro_producto": data.formCertificado['registroProductoForm'] || '',
        "fecha_inicio": data.formCertificado['fechaInicio'] || '',
        "fecha_fin": data.formCertificado['fechaFin'] || '',
        "realizo_tercer_operador": { 
          "tercer_operador": data.formCertificado['si'] || false,
          "nombre": data.formCertificado['nombres'] || '',
          "primer_apellido": data.formCertificado['primerApellido'] || '',
          "segundo_apellido": data.formCertificado['segundoApellido'] || '',
          "numero_registro_fiscal": data.formCertificado['numeroDeRegistroFiscal'] || '',
          "razon_social": data.formCertificado['razonSocial'] || ''
        },
        "domicilio_tercer_operador": {
          "pais": data.formCertificado['pais'] || '',
          "ciudad": data.formCertificado['ciudad'] || '',
          "calle": data.formCertificado['calle'] || '',
          "numero_letra": data.formCertificado['numeroLetra'] || '',
          "telefono": data.formCertificado['telefono'] || '',
          "correo_electronico": data.formCertificado['correo'] || ''
        },
        "mercancias_seleccionadas": this.buildCertificadoMercancia(data.mercanciaTabla)
      }
    }
    
    /** Construye el objeto destinatario a partir del estado del trámite 110223. */
    buildCertificadoMercancia(data: unknown): unknown {
      if (!Array.isArray(data)) {
        return [];
      }
      return data.map((item: unknown) => {
        const mercancia = item as Record<string, unknown>;
        return {
          ...mercancia,
          id: mercancia['id'] ?? '',
          fraccion_arancelaria: mercancia['fraccionArancelaria'] ?? '',
          cantidad: mercancia['cantidad'] ?? '',
          unidad_medida: mercancia['umc'] ?? '',
          valor_mercancia: mercancia['valorMercancia'] ?? '',
          tipo_factura: mercancia['tipoFactura'] ?? '',
          num_factura: mercancia['numeroFactura'] ?? '',
          complemento_descripcion: mercancia['complementoDescripcion'] ?? '',
          fecha_factura: mercancia['fechaFactura'] ?? '',
        };
      });
    }
  
    /** Construye el objeto destinatario a partir del estado del trámite 110223. */
    buildDatosDelCertificado(data: Tramite110221State): unknown {
      return {
        observaciones: data.formDatosCertificado['observacionesDates'],
        representacion_federal: {
          entidad_federativa: data.formDatosCertificado['EntidadFederativaDates'],
          representacion_federal: data.formDatosCertificado['representacionFederalDates'],
        },
      };
    }
      /** Construye el objeto destinatario a partir del estado del trámite 110223. */
    buildDestinatario(data: Tramite110221State): unknown {
      const FORM_DESTINATARIO = data.formDestinatario || {};
      const REPRESENTANTE_LEGAL = data.representanteLegalForm || {};
  
      return {
        "nombre": "12345",
        "primer_apellido": FORM_DESTINATARIO['primerApellido'] || '',
        "segundo_apellido": FORM_DESTINATARIO['segundoApellido'] || '',
        "numero_registro_fiscal": FORM_DESTINATARIO['numeroRegistroFiscal'] || '',
        "razon_social": "hello",
        "domicilio": {
            "ciudad_poblacion_estado_provincia": FORM_DESTINATARIO['ciudad'] || '',
            "calle": FORM_DESTINATARIO['calle'] || '',
            "numero_letra": FORM_DESTINATARIO['numeroLetra'] || '',
            "telefono": FORM_DESTINATARIO['telefono'] || '',
            "fax": "998777",
            "correo_electronico": FORM_DESTINATARIO['correoElectronico'] || '',
            "pais_destino": FORM_DESTINATARIO['paisDestino'] || ''
        },
        "generalesRepresentanteLegal": {
            "lugarRegistro": "hi",
            "nombre": "12345",
            "razonSocial": "hello",
            "puesto": "se",
             "fax": "998777",
            "telefono": "9999888888",
            "correoElectronico": "sravanimeegada98@gmail.com"
          }
      }
    }
  

}