import { HttpCoreService, JSONResponse } from '@libs/shared/data-access-user/src';
import { Tramite110204Store, TramiteState } from '../estados/tramite110204.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mercancia } from '../../../shared/models/modificacion.enum';
import { Observable } from 'rxjs';
import { PROC_110204 } from '../servers/api-route';
import { Tramite110204Query } from '../estados/tramite110204.query';

@Injectable({
  providedIn: 'root'
})
export class CertificadosOrigenGridService {
  /**
   * Almacena el valor seleccionado del catálogo de entidad federativa.
   * Se utiliza para comparar el estado seleccionado con el estado registrado en la planta o domicilio fiscal.
   */
  public catalogo: any;
  constructor(private http: HttpClient, private httpService: HttpCoreService, private store: Tramite110204Store, private query: Tramite110204Query) { }

  /**
   * @description Obtiene los datos del formulario de certificados de origen desde un archivo JSON local.
   * @returns {Observable<TramiteState>} Observable con el estado del trámite.
   */
  public getAcuiculturaData(): Observable<TramiteState> {
    return this.http.get<TramiteState>('assets/json/110204/certificadosOrigenForm.json');
  }

  /**
   * @description Actualiza el estado completo del formulario en el store de acuicultura.
   * @param DATOS Objeto de tipo Acuicultura con los datos a actualizar.
   */
  public actualizarEstadoFormulario(DATOS: TramiteState): void {
    this.store.update(DATOS);
  }
  /**
   * Obtiene todos los datos del estado almacenado en el store.
   * @returns {Observable<TramiteState>} Observable con todos los datos del estado.
   */
  getAllState(): Observable<TramiteState> {
    return this.query.selectState$;
  }
  /**
   * Envía una solicitud HTTP POST para buscar mercancías utilizando los datos proporcionados.
   * @param body - Objeto que contiene los datos para la búsqueda de mercancías.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  buscarMercanciasCert(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.httpService.post<JSONResponse>(PROC_110204.BUSCAR, { body: body });
  }

  /**
   * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
   *
   * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  guardarDatosPost(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.httpService.post<JSONResponse>(PROC_110204.GUARDAR, { body: body });
  }

  /** Obtiene los datos de una solicitud específica mediante su ID. */
  getMostrarSolicitud(id: string): Observable<JSONResponse> {
    return this.httpService.get<JSONResponse>(PROC_110204.MOSTRAR(id));
  }

  /** Mapea los datos del formulario del certificado desde el objeto recibido. */
  reverseMapFormCertificado(data: Record<string, unknown>): Record<string, unknown> {
    const CERTIFICADO = data?.['certificado'] as Record<string, unknown> ?? {};
    const TERCER = CERTIFICADO['realizo_tercer_operador'] as Record<string, unknown> | undefined;
    const DOMI = CERTIFICADO['domicilio_tercer_operador'] as Record<string, unknown> | undefined;

    return {
      entidadFederativa: CERTIFICADO['tratado_acuerdo'] ?? '',
      bloque: CERTIFICADO['pais_bloque'] ?? '',
      fraccionArancelaria: CERTIFICADO['fraccion_arancelaria'] ?? '',
      nombreComercial: CERTIFICADO['nombre_comercial'] ?? '',
      nombreComercialForm: CERTIFICADO['nombre_comercial'] ?? '',
      registroProductoForm: CERTIFICADO['registro_producto'] ?? '',
      nombres: TERCER?.['nombre'] ?? '',
      primerApellido: TERCER?.['primer_apellido'] ?? '',
      segundoApellido: TERCER?.['segundo_apellido'] ?? '',
      numeroDeRegistroFiscal: TERCER?.['numero_registro_fiscal'] ?? '',
      razonSocial: TERCER?.['razon_social'] ?? '',
      pais: DOMI?.['pais'] ?? '',
      ciudad: DOMI?.['Ciudad'] ?? '',
      telefono: DOMI?.['telefono'] ?? '',
      correo: DOMI?.['correo_electronico'] ?? '',
      numeroLetra: DOMI?.['numero_letra'] ?? '',
      calle: DOMI?.['calle'] ?? '',
      si: TERCER?.['tercer_operador'] ?? false,
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

  /** Reconstruye el estado completo de la solicitud del trámite 110204 a partir del objeto recibido. */
  reverseBuildSolicitud110204(built: Record<string, unknown>): Record<string, unknown> {
    return {
      formDatosCertificado: this.reverseMapFormDatosCertificado(built),
      formCertificado: this.reverseMapFormCertificado(built),
      mercanciaTabla: this.reverseMapMercanciaTabla(built),
      formDatosDelDestinatario: this.reverseMapFormDatosDelDestinatario(built),
    };
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

  /** Construye el objeto certificado a partir del estado del trámite TramiteState. */
  buildCertificado(item: TramiteState): unknown {
    return {
      tratado_acuerdo: item.formCertificado['entidadFederativa'] || '',
      pais_bloque: item.formCertificado['bloque'] || '',
      fraccion_arancelaria: item.formCertificado['fraccionArancelaria'] || '',
      nombre_comercial: item.formCertificado['nombreComercial'] || '',
      fecha_inicio: item.formCertificado['fechaInicio'] || '',
      fecha_fin: item.formCertificado['fechaFin'] || '',
      registro_producto: item.formCertificado['registroProducto'] || '',
      realizo_tercer_operador: {
        tercer_operador: item.formCertificado['si'] || false,
        nombre: item.formCertificado['nombres'] || '',
        primer_apellido: item.formCertificado['primerApellido'] || '',
        segundo_apellido: item.formCertificado['segundoApellido'] || '',
        numero_registro_fiscal: item.formCertificado['numeroDeRegistroFiscal'] || '',
        razon_social: item.formCertificado['razonSocial'] || '',
      },
      domicilio_tercer_operador: {
        pais: item.formCertificado['pais'] || '',
        calle: item.formCertificado['calle'] || '',
        Ciudad: item.formCertificado['ciudad'] || '',
        numero_letra: item.formCertificado['numeroLetra'] || '',
        lada: item.formCertificado['lada'] || '',
        telefono: item.formCertificado['telefono'] || '',
        correo_electronico: item.formCertificado['correo'],
        fax: item.formCertificado['fax']
      },
      mercancias_seleccionadas: this.buildMercanciaSeleccionadas(item.mercanciaTabla),
    };
  }

  /** Construye el objeto datos del certificado a partir del estado del trámite TramiteState. */
  buildDatosCertificado(data: TramiteState): unknown {
    return {
      "observaciones": data.formDatosCertificado['observacionesDates'] ?? '',
      "idioma": data.formDatosCertificado['idiomaDates'] ?? 0,
      "representacion_federal": {
        "entidad_federativa": data.formDatosCertificado['EntidadFederativaDates'] ?? 0,
        "representacion_federal": data.formDatosCertificado['representacionFederalDates'] ?? 0
      }
    }
  }
}