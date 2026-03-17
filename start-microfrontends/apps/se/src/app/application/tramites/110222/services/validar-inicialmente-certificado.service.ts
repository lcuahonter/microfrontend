/* eslint-disable @typescript-eslint/no-explicit-any */
import { Catalogo, HttpCoreService, JSONResponse, JsonResponseCatalogo } from '@libs/shared/data-access-user/src';
import { Observable, catchError, map, throwError } from 'rxjs';
import { PROC_110222, PRODUCTORS_EXPORTADOR } from '../servers/api-route';
import { Tramite110222State, Tramite110222Store } from '../estados/tramite110222.store';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { CadenaOriginalRequest } from '../../130118/model/request/cadena-original-request.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tramite110222Query } from '../estados/tramite110222.query';
import { Mercancia } from '../../../shared/models/modificacion.enum';


/**
 * @descripcion
 * Servicio encargado de validar y obtener datos iniciales para el trámite de certificado.
 * Proporciona métodos para consultar catálogos, tablas de datos, productores/exportadores y actualizar el estado del formulario.
 */
@Injectable({
  providedIn: 'root'
})
export class ValidarInicialmenteCertificadoService {
  url: string = '../../../../../assets/json/110222/';

  /**
   * @constructor
   * @descripcion
   * Inyecta el cliente HTTP y el store del trámite para manipular el estado y realizar peticiones.
   * @param http Cliente HTTP para realizar solicitudes.
   * @param tramite110222Store Store para manipular el estado del trámite.
   */
  constructor(
    private readonly http: HttpClient,
    public tramite110222Store: Tramite110222Store,
    public httpService: HttpCoreService,
    private tramite110222Query: Tramite110222Query
  ) { }

  /**
   * @method getRegistroTomaMuestrasMercanciasData
   * @descripcion
   * Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
   * @returns Observable con los datos del estado de la solicitud `Tramite110222State`,
   *          cargados desde el archivo JSON especificado en la ruta de `assets`.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Tramite110222State> {
    return this.http.get<Tramite110222State>('assets/json/110222/datos-prefill.json');
  }

  /**
   * @method actualizarEstadoFormulario
   * @descripcion
   * Actualiza el estado del formulario con los datos proporcionados.
   * @param DATOS - Estado de la solicitud `Tramite110222State` con la información 
   *                del tipo de solicitud a actualizar en el store.
   */
  actualizarEstadoFormulario(DATOS: Tramite110222State): void {
    this.tramite110222Store.update((state) => ({
      ...state,
      ...DATOS
    }))
  }

  /**
   * Obtiene el catálogo de estados desde el servidor.
   *
   * Realiza una petición HTTP GET al endpoint `/api/catalogo/estados` y retorna la respuesta
   * como un observable de tipo `JsonResponseCatalogo`.
   *
   * @returns Observable que emite la respuesta del catálogo de estados.
   */
  getTipoFactura(): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      PROC_110222.TIPO_FACTURA,
      {},
      false
    );
  }

  /**
   * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
   * 
   * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */

  guardarDatosPost(body: Record<string, unknown>): Observable<Record<string, unknown>> {
    return this.httpService.post<Record<string, unknown>>(PROC_110222.GUARDAR, { body: body });
  }

  /**
   * Obtiene todos los datos del estado almacenado en el store.
   * @returns {Observable<Tramite110222State>} Observable con todos los datos del estado.
   */
  getAllState(): Observable<Tramite110222State> {
    return this.tramite110222Query.selectTramite$;
  }

  /**
   * Busca mercancías para el certificado utilizando los parámetros proporcionados.
   * @param body - Objeto que contiene los parámetros de búsqueda.
   * @returns Observable con la respuesta de la búsqueda de mercancías.
   */
  buscarMercanciasCert(body: any): Observable<any> {
    return this.httpService.post<any>(PROC_110222.BUSCAR, { body: body });
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

  /** Agrega un nuevo productor al sistema. */
  agregarProductores(body: { rfc_solicitante: string }): Observable<unknown> {
    return this.httpService.post<unknown>(PROC_110222.AGREGAR_PRODUCTOR, { body: body });
  }
  /** Obtiene la información del productor asociado a un exportador específico. */
  obtenerProductorPorExportador(rfc: string): Observable<Record<string, unknown>> {
    return this.http.get<Record<string, unknown>>(PRODUCTORS_EXPORTADOR(rfc));
  }

  /** Construye el objeto certificado a partir del estado del trámite TramiteState. */
  buildCertificado(item: Tramite110222State): unknown {
    return {
      tratado_acuerdo: item.formCertificado?.['entidadFederativa'] || '',
      pais_bloque: item.formCertificado?.['bloque'] || '',
      fraccion_arancelaria: item.formCertificado?.['fraccionArancelaria'] || '',
      nombre_comercial: item.formCertificado?.['nombreComercial'] || '',
      fecha_inicio: item.formCertificado?.['fechaInicio'] || '',
      fecha_fin: item.formCertificado?.['fechaFin'] || '',
      registro_producto: item.formCertificado?.['registroProducto'] || '',
      realizo_tercer_operador: {
        tercer_operador: item.formCertificado?.['si'] || false,
        nombre: item.formCertificado?.['nombres'] || '',
        primer_apellido: item.formCertificado?.['primerApellido'] || '',
        segundo_apellido: item.formCertificado?.['segundoApellido'] || '',
        numero_registro_fiscal: item.formCertificado?.['numeroDeRegistroFiscal'] || '',
        razon_social: item.formCertificado?.['razonSocial'] || '',
      },
      domicilio_tercer_operador: {
        pais: item.formCertificado?.['pais'] || '',
        calle: item.formCertificado?.['calle'] || '',
        Ciudad: item.formCertificado?.['ciudad'] || '',
        numero_letra: item.formCertificado?.['numeroLetra'] || '',
        lada: item.formCertificado?.['lada'] || '',
        telefono: item.formCertificado?.['telefono'] || '',
        correo_electronico: item.formCertificado?.['correo'],
        fax: item.formCertificado?.['fax']
      },
      mercancias_seleccionadas: this.buildMercanciaSeleccionadas(item.mercanciaTabla ?? []),
    };
  }

  /** Construye el objeto datos del certificado a partir del estado del trámite TramiteState. */
  buildDatosCertificado(data: Tramite110222State): unknown {
    return {
      "observaciones": data.formDatosCertificado?.['observacionesDates'] ?? '',
      "idioma": data.formDatosCertificado?.['idiomaDates'] ?? 0,
      "representacion_federal": {
        "entidad_federativa": data.formDatosCertificado?.['EntidadFederativaDates'] ?? 0,
        "representacion_federal": data.formDatosCertificado?.['representacionFederalDates'] ?? 0
      }
    }
  }

  /**
     * Obtiene la cadena original del trámite 130118.
     * @param body Objeto que contiene los datos necesarios para generar la cadena original.
     * @returns Un observable que emite la respuesta del servidor con la cadena original.
     */
  obtenerCadenaOriginal<T>(
    idSolicitud: string,
    body: CadenaOriginalRequest
  ): Observable<BaseResponse<T>> {
    return this.http
      .post<BaseResponse<T>>(
        PROC_110222.API_POST_CADENA_ORIGINAL(idSolicitud),
        body
      )
      .pipe(
        map((response) => response),
        catchError(() => {
          const ERROR = new Error(
            `Error al obtener la cadena original en ${PROC_110222.API_POST_CADENA_ORIGINAL(
              idSolicitud
            )}`
          );
          return throwError(() => ERROR);
        })
      );
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
      numeroLetra: DOMICILIO['numero_exterior'] ?? '',
      lada: DOMICILIO['lada'] ?? '',
      telefono: DOMICILIO['telefono'] ?? '',
      fax: DOMICILIO['fax'] ?? '',
      correoElectronico: (data?.['solicitante'] as Record<string, unknown>)?.['correo_electronico'] ?? '',
      paisDestin: DOMICILIO['paisDestin'] ?? '',
      lugar: DOMICILIO['lugar'] ?? '',

    };
  }

  /** Mapea los datos del medio de transporte desde el objeto recibido. */
  reverseMapMedioDeTransporte(data: Record<string, unknown>): Catalogo {
    const DESTINATARIO = (data?.['destinatario'] ?? {}) as Record<string, unknown>;

    return {
      clave: typeof DESTINATARIO['medio_transporte'] === 'string' ? DESTINATARIO['medio_transporte'] : '',
      id: 0,
      descripcion: ''
    };
  }

  /** Mapea los datos del formulario de representante legal desde el objeto recibido. */
  reverseMapRepresentanteLegalForm(data: Record<string, unknown>): Record<string, unknown> {
    const DESTINATARIO = (data?.['destinatario'] ?? {}) as { generalesRepresentanteLegal?: Record<string, unknown> };
    const REPRESENTANTE = DESTINATARIO.generalesRepresentanteLegal ?? {};

    return {
      lugar: REPRESENTANTE['lugar'] ?? '',
      nombre: REPRESENTANTE['nombre'] ?? '',
      razonSocial: REPRESENTANTE['razonSocial'] ?? '',
      empresa: REPRESENTANTE['empresa'] ?? '',
      cargo: REPRESENTANTE['puesto'] ?? '',
      registroFiscal: REPRESENTANTE['registroFiscal'] ?? '',
      telefono: REPRESENTANTE['telefono'] ?? '',
      correoElectronico: REPRESENTANTE['correoElectronico'] ?? '',
      fax: REPRESENTANTE['fax'] ?? '',

    };
  }

  /** Obtiene los datos de una solicitud específica mediante su ID. */
  getMostrarSolicitud(id: string): Observable<JSONResponse> {
    return this.httpService.get<JSONResponse>(PROC_110222.MOSTRAR(id));
  }

  /** Reconstruye el estado completo de la solicitud del trámite 110222 a partir del objeto recibido. */
  reverseBuildSolicitud110222(built: Record<string, unknown>): Record<string, unknown> {
    return {
      formDatosCertificado: this.reverseMapFormDatosCertificado(built),
      formCertificado: this.reverseMapFormCertificado(built),
      mercanciaTabla: this.reverseMapMercanciaTabla(built),
      formDatosDelDestinatario: this.reverseMapFormDatosDelDestinatario(built),
      formDestinatario: this.reverseMapFormDestinatario(built),
      representanteLegalForm: this.reverseMapRepresentanteLegalForm(built)
    };
  }
}