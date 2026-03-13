import { HttpCoreService, JSONResponse } from '@libs/shared/data-access-user/src';
import { Solicituds110201State, Tramites110201Store } from '../state/tramites110201.store';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mercancia } from '../../../shared/models/modificacion.enum';
import { Observable } from 'rxjs';
import { PROC_110201 } from '../servers/api-route';
import { Tramites110201Query } from '../state/tramites110201.query';

/**
 * Servicio encargado de manejar la lógica relacionada con la solicitud del trámite 110201.
 * Se encarga de actualizar el estado de la solicitud en el store y de obtener datos precargados desde archivos JSON.
 */
@Injectable({
  providedIn: 'root',
})
export class Solocitud110201Service {
  /**
   * URL base del servidor principal.
   */
  urlServer = ENVIRONMENT.URL_SERVER;

  /**
   * URL base del servidor que contiene los catálogos auxiliares en formato JSON.
   */
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar solicitudes a servicios o archivos locales.
   * @param tramite110201Store Store personalizado para el manejo del estado del trámite 110201.
   */
  constructor(
    private http: HttpClient,
    private tramite110201Store: Tramites110201Store,
    private query: Tramites110201Query,
    private httpService: HttpCoreService,
  ) {
    // Lógica de inicialización si es necesario
  }

  /**
   * Actualiza el estado del formulario de la solicitud en el store con la información proporcionada.
   * Cada propiedad del objeto recibido es asignada al store correspondiente.
   * 
   * @param DATOS Objeto con la estructura completa del estado del formulario del trámite 110201.
   */
  actualizarEstadoFormulario(DATOS: Solicituds110201State): void {
    this.tramite110201Store.update(DATOS);
  }

  /**
   * Obtiene los datos precargados desde un archivo JSON relacionado con el registro de toma de muestras de mercancías.
   * Este archivo contiene información que se puede utilizar para precargar el estado del formulario.
   * 
   * @returns Observable con la estructura del estado de la solicitud.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicituds110201State> {
    return this.http.get<Solicituds110201State>('assets/json/110201/registro_toma_muestras_mercancias.json');
  }

  /**
* Obtiene todos los datos del estado almacenado en el store.
* @returns {Observable<Tramite110201State>} Observable con todos los datos del estado.
*/
  getAllState(): Observable<Solicituds110201State> {
    return this.query.selectSolicitud$;
  }

  /**
   * 
   * @param body - Objeto que contiene los datos para buscar mercancías.
   * @returns 
   */
  buscarMercanciasCert(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.httpService.post<JSONResponse>(PROC_110201.BUSCAR, { body: body });
  }

  /**
   * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
   * 
   * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  guardarDatosPost(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.httpService.post<JSONResponse>(PROC_110201.GUARDAR, { body: body });
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
        cantidad: ITEM.cantidad,
        unidad_medida: ITEM.unidadMedidaMasaBruta,
        valor_mercancia: ITEM.valorMercancia,
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
  buildDatosCertificado(data: Solicituds110201State): unknown {
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
  buildCertificado(item: Solicituds110201State): unknown {
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
  buildDestinatario(data: Solicituds110201State): unknown {
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
      medio_transporte: data.medioDeTransporteSeleccion?.clave || data.formTransporte?.['medioDeTransporte'] || ''
    }
  }

  /** Obtiene los datos de una solicitud específica mediante su ID. */
  getMostrarSolicitud(id: string): Observable<JSONResponse> {
    return this.httpService.get<JSONResponse>(PROC_110201.MOSTRAR(id));
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
  reverseBuildSolicitud110201(built: Record<string, unknown>): Record<string, unknown> {
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