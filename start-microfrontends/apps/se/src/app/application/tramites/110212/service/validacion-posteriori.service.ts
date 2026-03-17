import { CatalogoLista, DisponiblesTabla, RespuestaConsulta, SeleccionadasTabla } from '../models/validacion-posteriori.model';
import { HttpCoreService, JSONResponse } from '@libs/shared/data-access-user/src';
import { Tramite110212State, Tramite110212Store } from '../../../estados/tramites/tramite110212.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mercancia } from '../../../shared/models/modificacion.enum';
import { Observable } from 'rxjs';
import { PROC_110212 } from '../servers/api-route';
import { ProductorExportador } from '../models/validacion-posteriori.model'
import { Tramite110212Query } from '../../../estados/queries/tramite110212.query';

/**
 * Servicio para gestionar las operaciones relacionadas con el certificado de origen.
 * 
 * Este servicio proporciona métodos para obtener datos como idiomas, entidades federativas,
 * representaciones federales, productores/exportadores, mercancías disponibles y seleccionadas,
 * tratados y países desde archivos JSON.
 */
@Injectable({
  providedIn: 'root'
})
export class ValidacionPosterioriService {
  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes a los archivos JSON.
   */
  constructor(private http: HttpClient, private httpService: HttpCoreService, private store: Tramite110212Store, private query: Tramite110212Query, public tramite110212Store: Tramite110212Store) { }


  /**
   * Obtiene la lista de idiomas disponibles.
   * 
   * Este método realiza una solicitud HTTP para obtener los datos de idiomas desde un archivo JSON.
   * 
   * @returns {Observable<CatalogoLista>} Un observable que emite la lista de idiomas.
   */
  obtenerIdioma(): Observable<CatalogoLista> {
    return this.http
      .get<CatalogoLista>('assets/json/110212/idioma.json');
  }

  /**
   * Obtiene la lista de entidades federativas disponibles.
   * 
   * Este método realiza una solicitud HTTP para obtener los datos de entidades federativas desde un archivo JSON.
   * 
   * @returns {Observable<CatalogoLista>} Un observable que emite la lista de entidades federativas.
   */
  obtenerEntidadFederativa(): Observable<CatalogoLista> {
    return this.http
      .get<CatalogoLista>('assets/json/110212/entidad-federativa.json');
  }

  /**
   * Obtiene la lista de representaciones federales disponibles.
   * 
   * Este método realiza una solicitud HTTP para obtener los datos de representaciones federales desde un archivo JSON.
   * 
   * @returns {Observable<CatalogoLista>} Un observable que emite la lista de representaciones federales.
   */
  obtenerRepresentacionFederal(): Observable<CatalogoLista> {
    return this.http
      .get<CatalogoLista>('assets/json/110212/representacion-federal.json');
  }

  /**
   * Obtiene la lista de productores/exportadores disponibles.
   * 
   * Este método realiza una solicitud HTTP para obtener los datos de productores/exportadores desde un archivo JSON.
   * 
   * @returns {Observable<ProductorExportador>} Un observable que emite la lista de productores/exportadores.
   */
  obtenerProductorPorExportador(): Observable<ProductorExportador> {
    return this.http
      .get<ProductorExportador>('assets/json/110212/productor-exportador.json');
  }

  /**
   * Obtiene la lista de mercancías disponibles.
   * 
   * Este método realiza una solicitud HTTP para obtener los datos de mercancías disponibles desde un archivo JSON.
   * 
   * @returns {Observable<DisponiblesTabla[]>} Un observable que emite la lista de mercancías disponibles.
   */
  obtenerMercanciasDisponibles(): Observable<DisponiblesTabla[]> {
    return this.http
      .get<DisponiblesTabla[]>('assets/json/110212/mercancia-disponsible.json');
  }

  /**
   * Obtiene la lista de mercancías seleccionadas.
   * 
   * Este método realiza una solicitud HTTP para obtener los datos de mercancías seleccionadas desde un archivo JSON.
   * 
   * @returns {Observable<SeleccionadasTabla[]>} Un observable que emite la lista de mercancías seleccionadas.
   */
  obtenerMercanciasSeleccionadas(): Observable<SeleccionadasTabla[]> {
    return this.http
      .get<SeleccionadasTabla[]>('assets/json/110212/mercancias-seleccionadas.json');
  }

  /**
   * Obtiene la lista de tratados disponibles.
   * 
   * Este método realiza una solicitud HTTP para obtener los datos de tratados desde un archivo JSON.
   * 
   * @returns {Observable<CatalogoLista>} Un observable que emite la lista de tratados.
   */
  obtenerTratado(): Observable<CatalogoLista> {
    return this.http
      .get<CatalogoLista>('assets/json/110212/pais.json');
  }

  /**
   * Obtiene la lista de países disponibles.
   * 
   * Este método realiza una solicitud HTTP para obtener los datos de países desde un archivo JSON.
   * 
   * @returns {Observable<CatalogoLista>} Un observable que emite la lista de países.
   */
  obtenerPais(): Observable<CatalogoLista> {
    return this.http
      .get<CatalogoLista>('assets/json/110212/pais.json');
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
    return this.http.get<RespuestaConsulta>(`assets/json/110212/consulta-110212.json`);
  }

  /**
 * Obtiene todos los datos del estado almacenado en el store.
 * @returns {Observable<Tramite110212State>} Observable con todos los datos del estado.
 */
  getAllState(): Observable<Tramite110212State> {
    return this.query.selectSolicitud$;
  }

  /**
   * 
   * @param body - Objeto que contiene los datos para buscar mercancías.
   * @returns 
   */
  buscarMercanciasCert(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.httpService.post<JSONResponse>(PROC_110212.BUSCAR, { body: body });
  }

  /**
   * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
   * 
   * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  guardarDatosPost(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.httpService.post<JSONResponse>(PROC_110212.GUARDAR, { body: body });
  }

  /** Obtiene los datos de una solicitud específica mediante su ID. */
  getMostrarSolicitud(id: string): Observable<JSONResponse> {
    return this.httpService.get<JSONResponse>(PROC_110212.MOSTRAR(id));
  }

  /**
   * Actualiza el estado del formulario de la solicitud en el store con la información proporcionada.
   * Cada propiedad del objeto recibido es asignada al store correspondiente.
   * 
   * @param DATOS Objeto con la estructura completa del estado del formulario del trámite 110201.
   */
  actualizarEstadoFormulario(DATOS: Tramite110212State): void {
    this.tramite110212Store.update(DATOS);
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
        numFactura?: string;
        complementoDescripcion?: string;
        fechaFactura?: string;
        cantidad?: string;
        umc?: string;
        unidadMedida?: string;
        valorMercancia?: string;
      };

      RESULT.push({
        id: ITEM.id,
        fraccion_arancelaria: ITEM.fraccionArancelaria,
        cantidad: ITEM.cantidad,
        unidad_medida: ITEM.unidadMedida,
        valor_mercancia: ITEM.valorMercancia,
        nombreTecnico: ITEM.nombreTecnico,
        nombre_comercial: ITEM.nombreComercial,
        registro_producto: ITEM.numeroDeRegistrodeProductos,
        fechaExpedicion: ITEM.fechaExpedicion,
        fechaVencimiento: ITEM.fechaVencimiento,
        tipo_factura: ITEM.tipoFactura,
        num_factura: ITEM.numFactura,
        complemento_descripcion: ITEM.complementoDescripcion,
        fecha_factura: ITEM.fechaFactura,
        umc: ITEM.umc,
      });
    });

    return RESULT;
  }

  /** Construye el objeto datos del certificado a partir del estado del trámite TramiteState. */
  buildDatosCertificado(data: Tramite110212State): unknown {
    return {
      "observaciones": data.formDatosCertificado['observacionesDates'] ?? '',
      "idioma": data.formDatosCertificado['idiomaDates'] ?? 0,
      "presenta": data.formDatosCertificado['presentaDates'] ?? 'precisaDates',
      "precisa": data.formDatosCertificado['precisaDates'] ?? 'precisaDates',
      "representacion_federal": {
        "entidad_federativa": data.formDatosCertificado['EntidadFederativaDates'] ?? 0,
        "representacion_federal": data.formDatosCertificado['representacionFederalDates'] ?? 0
      }
    }
  }
  /** Construye el objeto certificado a partir del estado del trámite TramiteState. */
  buildCertificado(item: Tramite110212State): unknown {
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
      mercancias_seleccionadas: this.buildMercanciaSeleccionadas(item.mercanciaSeleccionadasTablaDatos),
    };
  }
  /** Construye el objeto destinatario a partir del estado del trámite TramiteState. */
  buildDestinatario(data: Tramite110212State): unknown {
    return {
      nombre: data.formDatosDelDestinatario['nombres'],
      primer_apellido: data.formDatosDelDestinatario['primerApellido'],
      segundo_apellido: data.formDatosDelDestinatario['segundoApellido'],
      numero_registro_fiscal: data.formDatosDelDestinatario['numeroDeRegistroFiscal'],
      razon_social: data.formDatosDelDestinatario['razonSocial'],
      domicilio: {
        ciudad_poblacion_estado_provincia: data.formDestinatario['ciudad'],
        calle: data.formDestinatario['calle'],
        numero_letra: data.formDestinatario['numeroLetra'],
        lada: data.formDestinatario['lada'],
        telefono: data.formDestinatario['telefono'],
        fax: data.formDestinatario['fax'],
        correo_electronico: data.formDestinatario['correoElectronico'],
      },
      generales_representante_legal: {
        lugar: data.grupoRepresentativo['lugar'],
        nombre_del_representante: data.grupoRepresentativo['nombreExportador'],
        empresa: data.grupoRepresentativo['empresa'],
        lada: data.grupoRepresentativo['cargo'],
        cargo: data.grupoRepresentativo['cargo'],
        fax: data.grupoRepresentativo['fax'],
        telefono: data.grupoRepresentativo['telefono'],
        correo_electronico: data.grupoRepresentativo['correoElectronico']
      },
    }
  }
  /** Mapea los datos del formulario del certificado desde el objeto recibido. */
  reverseMapFormCertificado(data: Record<string, unknown>): Record<string, unknown> {
    const CERTIFICADO = data?.['certificado'] as Record<string, unknown> ?? {};
    const TERCER = CERTIFICADO['realizo_tercer_operado'] as Record<string, unknown> | undefined;
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

  /** Mapea los datos del grupo representativo desde el objeto recibido. */
  reverseMapGrupoRepresentativo(data: Record<string, unknown>): Record<string, unknown> {
    const DESTINATARIO = (data?.['destinatario'] ?? {}) as Record<string, unknown>;
    const GRUPO = DESTINATARIO['generales_representante_legal'] as Record<string, unknown> ?? {};
    return {
        lugar: GRUPO['lugar'] ?? '',
        nombreExportador: GRUPO['nombre_del_representante'] ?? '',
        empresa: GRUPO['empresa'] ?? '',
        cargo: GRUPO['cargo'] ?? '',
        lada: GRUPO['lada'] ?? '',
        telefono: GRUPO['telefono'] ?? '',
        fax: GRUPO['fax'] ?? '',
        correoElectronico: GRUPO['correoElectronico'] ?? GRUPO['correo_electronico'] ?? '',
      }
    }

  /** Mapea los datos del formulario del destinatario desde el objeto recibido. */
  reverseMapFormDestinatario(data: Record<string, unknown>): Record<string, unknown> {
    const DESTINATARIO = (data?.['destinatario'] ?? {}) as Record<string, unknown>;
    const DOMICILIO = DESTINATARIO['domicilio'] as Record<string, unknown> ?? {};
    return {
      ciudad: DOMICILIO['ciudad_poblacion_estado_provincia'] ?? '',
      calle: DOMICILIO['calle'] ?? '',
      numeroLetra: DOMICILIO['numero_letra'] ?? '',
      lada: DOMICILIO['lada'] ?? '',
      telefono: DOMICILIO['telefono'] ?? '',
      fax: DOMICILIO['fax'] ?? '',
      correoElectronico: DOMICILIO['correoElectronico'] ?? DOMICILIO['correo_electronico'] ?? '',
      paisDestin: DOMICILIO['pais_destino'] ?? '',
    };
  }



  /** Reconstruye el estado completo de la solicitud del trámite 110212 a partir del objeto recibido. */
  reverseBuildSolicitud110212(built: Record<string, unknown>): Record<string, unknown> {
    return {
      formDatosCertificado: this.reverseMapFormDatosCertificado(built),
      formCertificado: this.reverseMapFormCertificado(built),
      mercanciaSeleccionadasTablaDatos: this.reverseMapMercanciaTabla(built),
      formDatosDelDestinatario: this.reverseMapFormDatosDelDestinatario(built),
      formDestinatario: this.reverseMapFormDestinatario(built),
      grupoRepresentativo  :this.reverseMapGrupoRepresentativo(built)
    };
  }
}