import { API_POST_SOLICITUD, BUSCAR_PRODUCTOR, PROC_110205 } from '../servers/api-route'; 
import { Catalogo, HttpCoreService, JSONResponse, JsonResponseCatalogo, RespuestaCatalogos } from '@ng-mf/data-access-user';
import { HistoricoColumnas, MercanciaTabla, MercanciasHistorico, ProductorExportador } from '../models/peru-certificado.module';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Tramite110205State, Tramite110205Store } from '../estados/tramite110205.store';
import { catchError, throwError } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { GuadarSolicitudResponse } from '../models/response/guardar-solicitud-response.model';
import { Injectable } from '@angular/core';
import { Mercancia } from '../../../shared/models/modificacion.enum';
import { Tramite110205Query } from '../estados/tramite110205.query';


/**
 * @service PeruCertificadoService
 * @description
 * Servicio para gestionar operaciones relacionadas con el certificado de Perú para el trámite 110205.
 * Proporciona métodos para obtener catálogos, datos de mercancías, productores/exportadores,
 * historial de mercancías y para actualizar el estado del formulario en el store correspondiente.
 *
 * @see Tramite110205Store
 * @see Catalogo
 * @see Mercancia
 * @see ProductorExportador
 * @see MercanciasHistorico
 * @see Tramite110205State
 *
 * @example
 * constructor(private peruCertificadoService: PeruCertificadoService) {}
 *
 * this.peruCertificadoService.obtenerMenuDesplegable('menu.json').subscribe(menu => {
 *   console.log(menu);
 * });
 */
@Injectable({
  providedIn: 'root',
})
export class PeruCertificadoService {
  /**
   * @property {string} url
   * @description Ruta base para acceder a los archivos JSON utilizados en el trámite 110205.
   */
  url: string = '../../../../../assets/json/110205/';

  /**
   * La URL base del servidor al que se realizarán las solicitudes.
   * Esta propiedad es de solo lectura y se utiliza para construir las rutas de los servicios.
   */
  private readonly servidor: string;

  /**
   * @constructor
   * @description
   * Inicializa el servicio con las dependencias necesarias.
   * @param {HttpClient} http - Servicio para realizar solicitudes HTTP.
   * @param {Tramite110205Store} tramite110205Store - Store para gestionar el estado del trámite 110205.
   */
  constructor(
    private readonly http: HttpClient,
    public httpService: HttpCoreService,
    public tramite110205Store: Tramite110205Store,
    public query: Tramite110205Query
  ) {
    this.servidor = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * @method obtenerMenuDesplegable
   * @description
   * Obtiene un array de objetos `Catalogo` desde un archivo JSON ubicado en la URL especificada.
   * @param {string} fileName El nombre del archivo JSON desde el cual se obtendrán los datos.
   * @returns {Observable<Catalogo[]>} Un observable que emite un array de objetos `Catalogo`.
   * @usageNotes
   * Este método construye la URL completa añadiendo el `fileName` a la URL base (`this.url`)
   * y realiza una solicitud HTTP GET para recuperar los datos.
   */
  obtenerMenuDesplegable(fileName: string): Observable<Catalogo[]> {
    const BASE_URL = this.url + fileName;
    return this.http
      .get<RespuestaCatalogos>(BASE_URL)
      .pipe(map((response) => response.data));
  }

  /**
   * @method obtenerTablaDatos
   * @description
   * Obtiene un array de objetos `Mercancia` desde un archivo JSON ubicado en la URL especificada.
   * @param {string} fileName El nombre del archivo JSON desde el cual se obtendrán los datos.
   * @returns {Observable<Mercancia[]>} Un observable que emite un array de objetos `Mercancia`.
   * @usageNotes
   * Este método construye la URL completa añadiendo el `fileName` a la URL base (`this.url`)
   * y realiza una solicitud HTTP GET para recuperar los datos.
   */
  obtenerTablaDatos(fileName: string): Observable<Mercancia[]> {
    const JSON_URL = this.url + fileName;
    return this.http.get<Mercancia[]>(JSON_URL);
  }

  /**
   * @method obtenerProductorPorExportador
   * @description
   * Obtiene la lista de productores/exportadores disponibles desde un archivo JSON local.
   * @returns {Observable<ProductorExportador>} Un observable que emite la lista de productores/exportadores.
   */
  obtenerProductorPorExportador(rfc: string): Observable<ProductorExportador> {
    return this.httpService.get<ProductorExportador>(BUSCAR_PRODUCTOR(rfc));
  }

  /**
   * @method obtenerProductorPorExportador
   * @description
   * Obtiene la lista de productores/exportadores disponibles desde un archivo JSON local.
   * @returns {Observable<ProductorExportador>} Un observable que emite la lista de productores/exportadores.
   */
  obtenerProductoruNevo(body: { rfc_solicitante: string }): Observable<unknown> {
    return this.httpService.post<unknown>(PROC_110205.AGREGAR_PRODUCTOR, {
      body: body,
    });
  }

  /**
   * @method obtenerMercancia
   * @description
   * Obtiene el historial de mercancías seleccionadas desde un archivo JSON local.
   * @returns {Observable<MercanciasHistorico>} Un observable que emite los datos del historial de mercancías.
   */
  obtenerMercancia(): Observable<MercanciasHistorico> {
    return this.http.get<MercanciasHistorico>(
      'assets/json/110205/mercancias-seleccionadas.json'
    );
  }

  /**
   * @method actualizarEstadoFormulario
   * @description
   * Actualiza el estado del formulario en el store con los datos proporcionados.
   * @param {Tramite110205State} DATOS - Objeto que contiene los nuevos datos para actualizar el estado.
   * @returns {void}
   */
  actualizarEstadoFormulario(DATOS: Tramite110205State): void {
    this.tramite110205Store.update(DATOS);
  }

  /**
   * @method getRegistroTomaMuestrasMercanciasData
   * @description
   * Obtiene los datos de prellenado para el formulario desde un archivo JSON local.
   * @returns {Observable<Tramite110205State>} Observable que emite los datos de prellenado.
   */
  /**
   * @method getMostrarSolicitud
   * @description
   * Obtiene los datos completos de una solicitud específica del trámite 110205 mediante su identificador único.
   * Este método consulta al servidor para recuperar toda la información asociada a una solicitud.
   * @param {string} id - Identificador único de la solicitud a consultar
   * @returns {Observable<JSONResponse>} Observable que emite la respuesta del servidor con los datos de la solicitud
   */
  getMostrarSolicitud(id: string): Observable<JSONResponse> {
    return this.httpService.get<JSONResponse>(PROC_110205.MOSTRAR(id));
  }

  /**
   * @method getTipoFactura
   * @description
   * Obtiene el catálogo de tipos de factura disponibles para el trámite 110205.
   * Realiza una petición HTTP GET al endpoint correspondiente y retorna la respuesta
   * como un observable que contiene los diferentes tipos de factura permitidos.
   * @returns {Observable<JsonResponseCatalogo>} Observable que emite la respuesta del catálogo de tipos de factura
   */
  getTipoFactura(): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      PROC_110205.TIPO_FACTURA,
      {},
      false
    );
  }

  /**
   * @method getAllState
   * @description
   * Obtiene todos los datos del estado actual del trámite 110205 almacenados en el store.
   * Este método proporciona acceso completo al estado reactivo del formulario.
   * @returns {Observable<Tramite110205State>} Observable que emite el estado completo del trámite 110205
   */
  getAllState(): Observable<Tramite110205State> {
    return this.query.selectPeru$;
  }
  /**
   * @method guardarDatosPost
   * @description
   * Envía los datos del formulario al servidor para ser guardados mediante una petición POST.
   * Este método procesa y almacena la información del trámite 110205 en el sistema.
   * @param {Record<string, unknown>} body - Objeto que contiene todos los datos del formulario a guardar
   * @returns {Observable<Record<string, unknown>>} Observable que emite la respuesta del servidor tras el guardado
   */
  guardarDatosPost(
    body: Record<string, unknown>
  ): Observable<Record<string, unknown>> {
    return this.httpService.post<Record<string, unknown>>(PROC_110205.GUARDAR, {
      body: body,
    });
  }

  /**
   * Guarda la solicitud del trámite 80208.
   * @param solicitud Objeto que contiene los datos de la solicitud a guardar.
   * @returns Observable con la respuesta del servidor.
   */
  postSolicitud(
    solicitud: unknown
  ): Observable<BaseResponse<GuadarSolicitudResponse>> {
    const ENDPOINT = `${this.servidor}` + API_POST_SOLICITUD;
    return this.http
      .post<BaseResponse<GuadarSolicitudResponse>>(ENDPOINT, solicitud)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((httpError) => {
          if (httpError instanceof HttpErrorResponse) {
            return throwError(() => ({
              success: false,
              error: httpError.error,
            }));
          }
          const ERROR = new Error(
            `Ocurrió un error al guardar la información ${ENDPOINT} `
          );
          return throwError(() => ERROR);
        })
      );
  }

  /**
   * @method buscarMercanciasCert
   * @description
   * Realiza una búsqueda de mercancías certificadas basada en los criterios proporcionados.
   * Este método permite localizar mercancías específicas dentro del sistema de certificación.
   * @param {Object} body - Objeto que contiene los criterios de búsqueda para las mercancías
   * @returns {Observable<Object>} Observable que emite los resultados de la búsqueda de mercancías
   */
  buscarMercanciasCert(body: { [key: string]: unknown }): Observable<{ [key: string]: unknown }> {
    return this.httpService.post<{ [key: string]: unknown }>(PROC_110205.BUSCAR, { body: body });
  }

  /**
   * @method buildProductoresPorExportador
   * @description
   * Construye un array de objetos que representan los datos de productores asociados a un exportador.
   * Transforma los datos del formato interno al formato requerido por el servidor.
   * @param {HistoricoColumnas[]} data - Array de datos históricos de productores
   * @returns {unknown[]} Array de objetos con la información de productores formateada para el envío
   */
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

  /**
   * @method buildMercanciasProductor
   * @description
   * Construye un array de objetos que representan las mercancías asociadas a un productor.
   * Transforma los datos de la tabla de mercancías al formato requerido para el envío al servidor.
   * @param {MercanciaTabla[]} data - Array de datos de mercancías de la tabla
   * @returns {unknown[]} Array de objetos con la información de mercancías formateada para el envío
   */
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

  /**
   * @method reverseMapFormDatosCertificado
   * @description
   * Mapea y extrae los datos del certificado desde la respuesta del servidor hacia el formato del formulario.
   * Procesa la información de observaciones, idioma y representación federal.
   * @param {Record<string, unknown>} data - Objeto de respuesta del servidor
   * @returns {Record<string, unknown>} Objeto con los datos mapeados para el formulario de certificado
   */
  reverseMapFormDatosCertificado(data: Record<string, unknown>): Record<string, unknown> {
   const DATOS_CERTIFICADO = data?.['datos_del_certificado'] as Record<string, unknown> ??{};
   const REPRESENTACION_FEDERAL = (DATOS_CERTIFICADO?.['representacion_federal'] as Record<string, unknown>) ?? {};
   return {
     observacionesDates: DATOS_CERTIFICADO?.['observaciones'] ?? '',
     idiomaDates: DATOS_CERTIFICADO?.['idioma'] ?? '',
     EntidadFederativaDates: REPRESENTACION_FEDERAL['entidad_federativa'] ?? '',
     representacionFederalDates: REPRESENTACION_FEDERAL['representacion_federal'] ?? '',
   };
 }

  /**
   * @method reverseMapFormCertificado
   * @description
   * Mapea los datos completos del certificado desde la respuesta del servidor hacia el formato del formulario.
   * Combina información del tercer operador, domicilio y datos generales del certificado.
   * @param {Record<string, unknown>} data - Objeto de respuesta del servidor
   * @returns {Record<string, unknown>} Objeto con todos los datos del certificado mapeados para el formulario
   */
  reverseMapFormCertificado(data: Record<string, unknown>): Record<string, unknown> {
    const CERTIFICADO = this.extractCertificado(data);
    const TERCER_OPERADOR = this.extractTercerOperador(CERTIFICADO);
    const DOMICILIO_TERCER_OPERADOR = this.extractDomicilioTercerOperador(CERTIFICADO);

    return {
      ...this.mapTercerOperadorData(TERCER_OPERADOR),
      ...this.mapDomicilioData(DOMICILIO_TERCER_OPERADOR),
      ...this.mapCertificadoData(CERTIFICADO),
    };
  }

  /**
   * @method extractCertificado
   * @description
   * Extrae los datos del certificado del objeto de respuesta del servidor.
   * Método privado utilizado para obtener la sección específica del certificado.
   * @private
   * @param {Record<string, unknown>} data - Objeto de respuesta del servidor
   * @returns {Record<string, unknown>} Objeto que contiene únicamente los datos del certificado
   */
  private extractCertificado(data: Record<string, unknown>): Record<string, unknown> {
    return data?.['certificado'] as Record<string, unknown> ?? {};
  }

  /**
   * @method extractTercerOperador
   * @description
   * Extrae los datos del tercer operador desde el objeto del certificado.
   * Método privado utilizado para obtener información específica del tercer operador.
   * @private
   * @param {Record<string, unknown>} certificado - Objeto que contiene los datos del certificado
   * @returns {Record<string, unknown>} Objeto que contiene los datos del tercer operador
   */
  private extractTercerOperador(certificado: Record<string, unknown>): Record<string, unknown> {
    return certificado?.['realizo_tercer_operador'] as Record<string, unknown> ?? {};
  }

  /**
   * @method extractDomicilioTercerOperador
   * @description
   * Extrae los datos del domicilio del tercer operador desde el objeto del certificado.
   * Método privado utilizado para obtener la información de ubicación del tercer operador.
   * @private
   * @param {Record<string, unknown>} certificado - Objeto que contiene los datos del certificado
   * @returns {Record<string, unknown>} Objeto que contiene los datos del domicilio del tercer operador
   */
  private extractDomicilioTercerOperador(certificado: Record<string, unknown>): Record<string, unknown> {
    return certificado?.['domicilio_tercer_operador'] as Record<string, unknown> ?? {};
  }

  /**
   * @method mapTercerOperadorData
   * @description
   * Mapea los datos del tercer operador al formato requerido por el formulario.
   * Transforma los campos del servidor a los nombres esperados en el frontend.
   * @private
   * @param {Record<string, unknown>} tercerOperador - Objeto con los datos del tercer operador del servidor
   * @returns {Record<string, unknown>} Objeto con los datos del tercer operador mapeados para el formulario
   */
  private mapTercerOperadorData(tercerOperador: Record<string, unknown>): Record<string, unknown> {
    return {
      si: tercerOperador['tercer_operador'] ?? '',
      nombres: tercerOperador['nombre'] ?? '',
      primerApellido: tercerOperador['primer_apellido'] ?? '',
      segundoApellido: tercerOperador['segundo_apellido'] ?? '',
      numeroDeRegistroFiscal: tercerOperador['numero_registro_fiscal'] ?? '',
      razonSocial: tercerOperador['razon_social'] ?? '',
    };
  }

  /**
   * @method mapDomicilioData
   * @description
   * Mapea los datos del domicilio al formato requerido por el formulario.
   * Transforma la información de ubicación del servidor al formato del frontend.
   * @private
   * @param {Record<string, unknown>} domicilio - Objeto con los datos del domicilio del servidor
   * @returns {Record<string, unknown>} Objeto con los datos del domicilio mapeados para el formulario
   */
  private mapDomicilioData(domicilio: Record<string, unknown>): Record<string, unknown> {
    return {
      pais: domicilio['pais'] ?? '',
      ciudad: domicilio['ciudad'] ?? '',
      calle: domicilio['calle'] ?? '',
      numeroLetra: domicilio['numero_letra'] ?? '',
      telefono: domicilio['telefono'] ?? '',
      correo: domicilio['correo_electronico'] ?? '',
    };
  }

  /**
   * @method mapCertificadoData
   * @description
   * Mapea los datos generales del certificado al formato requerido por el formulario.
   * Incluye información de entidad federativa, bloque, fracción arancelaria y fechas.
   * @private
   * @param {Record<string, unknown>} certificado - Objeto con los datos del certificado del servidor
   * @returns {Record<string, unknown>} Objeto con los datos del certificado mapeados para el formulario
   */
  private mapCertificadoData(certificado: Record<string, unknown>): Record<string, unknown> {
    return {
      entidadFederativa: certificado['tratado_acuerdo'] ?? '',
      bloque: certificado['pais_bloque'] ?? '',
      fraccionArancelariaForm: certificado['fraccion_arancelaria'] ?? '',
      nombreComercialForm: certificado['nombre_comercial'] ?? '',
      numeroDeRegistroProductoForm: certificado['registro_producto'] ?? '',
      fechaInicioInput: certificado['fecha_inicio'] ?? '',
      fechaFinalInput: certificado['fecha_fin'] ?? '',
    };
  }

  /**
   * @method reverseMapMercanciaTabla
   * @description
   * Mapea los datos de la tabla de mercancías desde la respuesta del servidor hacia el formato del formulario.
   * Procesa el array de mercancías seleccionadas y las transforma al modelo esperado por el frontend.
   * @param {Record<string, unknown>} data - Objeto de respuesta del servidor
   * @returns {Mercancia[]} Array de mercancías mapeadas para la tabla del formulario
   */
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

  /**
   * @method reverseMapFormDatosDelDestinatario
   * @description
   * Mapea los datos generales del destinatario desde la respuesta del servidor hacia el formato del formulario.
   * Extrae información personal y de identificación del destinatario.
   * @param {Record<string, unknown>} data - Objeto de respuesta del servidor
   * @returns {Record<string, unknown>} Objeto con los datos del destinatario mapeados para el formulario
   */
  reverseMapFormDatosDelDestinatario(data: Record<string, unknown>): Record<string, unknown> {
    const DESTINATARIO = (data?.['destinatario'] ?? {}) as Record<string, unknown>;
    return {
      nombres: DESTINATARIO['nombre'] ?? '',
      primerApellido: DESTINATARIO['primer_apellido'] ?? '',
      segundoApellido: DESTINATARIO['segundo_apellido'] ?? '',
      numeroDeRegistroFiscal: DESTINATARIO['numero_registro_fiscal'] ?? '',
      razonSocial: DESTINATARIO['razon_social'] ?? '',
      medioTransporte: DESTINATARIO['medio_transporte'] ?? '',
    };
  }

  /**
   * @method reverseMapFormDestinatario
   * @description
   * Mapea los datos del domicilio del destinatario desde la respuesta del servidor hacia el formato del formulario.
   * Extrae información de ubicación y contacto del destinatario.
   * @param {Record<string, unknown>} data - Objeto de respuesta del servidor
   * @returns {Record<string, unknown>} Objeto con los datos del domicilio del destinatario mapeados para el formulario
   */
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
      correoElectronico: DOMICILIO['correo_electronico'] ?? '',
      paisDestino: DOMICILIO['pais_destino'] ?? '',
    };
  }

  /**
   * @method reverseRepresentanteLegal
   * @description
   * Mapea los datos del representante legal desde la respuesta del servidor hacia el formato del formulario.
   * Extrae información del representante legal del destinatario incluyendo datos de contacto y puesto.
   * @param {Record<string, unknown>} data - Objeto de respuesta del servidor
   * @returns {Record<string, unknown>} Objeto con los datos del representante legal mapeados para el formulario
   */
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

  /**
   * @method reverseMapFormulario
   * @description
   * Mapea los datos generales del formulario desde el objeto histórico de la respuesta del servidor.
   * Extrae configuraciones específicas como datos confidenciales del productor y relación productor-exportador.
   * @param {Record<string, unknown>} data - Objeto de respuesta del servidor
   * @returns {Record<string, unknown>} Objeto con los datos generales del formulario mapeados
   */
  reverseMapFormulario(data: Record<string, unknown>): Record<string, unknown> {
    const HISTORICO = (data?.['historico'] ?? {}) as Record<string, unknown>;
    return {
      datosConfidencialesProductor: HISTORICO['datosConfidencialesProductor'] ?? '',
      productorMismoExportador: HISTORICO['productorMismoExportador'] ?? '',
    };
  }

  /**
   * @method reverseMapProductoresPorExportador
   * @description
   * Mapea los productores asociados por exportador desde el objeto histórico de la respuesta del servidor.
   * Transforma el array de productores del formato del servidor al formato esperado por la tabla del frontend.
   * @param {Record<string, unknown>} data - Objeto de respuesta del servidor
   * @returns {HistoricoColumnas[]} Array de productores mapeados para la tabla histórica
   */
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

  /**
   * @method reverseMapProductoresPorExportadorSeleccionados
   * @description
   * Mapea los productores seleccionados por exportador desde el objeto histórico de la respuesta del servidor.
   * Transforma el array de productores seleccionados del formato del servidor al formato de la tabla.
   * @param {Record<string, unknown>} data - Objeto de respuesta del servidor
   * @returns {HistoricoColumnas[]} Array de productores seleccionados mapeados para la tabla
   */
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

  /**
   * @method reverseMapMercanciasProductor
   * @description
   * Mapea las mercancías del productor desde el objeto histórico de la respuesta del servidor.
   * Transforma el array de mercancías del productor del formato del servidor al formato de la tabla.
   * @param {Record<string, unknown>} data - Objeto de respuesta del servidor
   * @returns {MercanciaTabla[]} Array de mercancías del productor mapeadas para la tabla
   */
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

  
  /**
   * @method reverseBuildSolicitud110201
   * @description
   * Reconstruye el estado completo de la solicitud del trámite 110205 a partir del objeto recibido del servidor.
   * Combina todos los mapeos individuales para crear el estado completo del formulario.
   * @param {Record<string, unknown>} built - Objeto completo de respuesta del servidor
   * @returns {Record<string, unknown>} Estado completo de la solicitud mapeado para el frontend
   */
  reverseBuildSolicitud110201(built: Record<string, unknown>): Record<string, unknown> {
    return {
      formDatosCertificado: this.reverseMapFormDatosCertificado(built),
      formCertificado: this.reverseMapFormCertificado(built),
      mercanciaTabla: this.reverseMapMercanciaTabla(built),
      formDatosDelDestinatario: this.reverseMapFormDatosDelDestinatario(built),
      formDestinatario: this.reverseMapFormDestinatario(built),
      formExportor: this.reverseRepresentanteLegal(built),
      formulario: this.reverseMapFormulario(built),
      productoresExportador: this.reverseMapProductoresPorExportador(built),
      agregarProductoresExportador: this.reverseMapProductoresPorExportadorSeleccionados(built),
      mercanciaProductores: this.reverseMapMercanciasProductor(built),
    };
  }
}
