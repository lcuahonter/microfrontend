import { API_POST_SOLICITUD, BUSCAR_PRODUCTOR, PROC_110223 } from '../servers/api-route';
import { Catalogo, CatalogoLista, DisponiblesTabla, HistoricoColumnas, MercanciaTabla, MercanciasHistorico, MercanciasHistoricos, SeleccionadasTabla } from '../models/certificado-origen.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpCoreService, JSONResponse, JsonResponseCatalogo, RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Tramite110223Store, TramiteState } from '../estados/Tramite110223.store';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { GuadarSolicitudResponse } from '../models/response/guardar-solicitud-response.model';
import { Injectable } from '@angular/core';
import { ProductorExportador } from '../models/certificado-origen.model';
import { Tramite110223Query } from '../query/tramite110223.query';
import { Mercancia } from '../../../shared/models/modificacion.enum';

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
export class CertificadosOrigenService {
    url: string = '../../../../../assets/json/110223/';

    /**
   * La URL base del servidor al que se realizarán las solicitudes.
   * Esta propiedad es de solo lectura y se utiliza para construir las rutas de los servicios.
   */
  private readonly servidor!: string;

  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes a los archivos JSON.
   */
  constructor(private http: HttpClient,
    private store: Tramite110223Store, 
    public httpService: HttpCoreService,
    private tramite110223Query: Tramite110223Query
  ) { }

  /**
   * Obtiene la lista de idiomas disponibles.
   * 
   * Este método realiza una solicitud HTTP para obtener los datos de idiomas desde un archivo JSON.
   * 
   * @returns {Observable<CatalogoLista>} Un observable que emite la lista de idiomas.
   */
  obtenerIdioma(): Observable<CatalogoLista> {
    return this.http
      .get<CatalogoLista>('assets/json/110223/idioma.json');
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
      .get<CatalogoLista>('assets/json/110223/entidad-federativa.json');
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
      .get<CatalogoLista>('assets/json/110223/representacion-federal.json');
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
   * @method obtenerProductorNuevo
   * @description
   * Agrega un nuevo productor/exportador al sistema.
   * @param body - Objeto que contiene el RFC del solicitante
   * @returns {Observable<unknown>} Un observable que emite la respuesta del servidor
   */
  obtenerProductorNuevo(body: { rfc_solicitante: string }): Observable<unknown> {
    return this.httpService.post<unknown>(PROC_110223.AGREGAR_PRODUCTOR, {
      body: body,
    });
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
      .get<DisponiblesTabla[]>('assets/json/110223/mercancia-disponsible.json');
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
      .get<SeleccionadasTabla[]>('assets/json/110223/mercancias-seleccionadas.json');
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
      .get<CatalogoLista>('assets/json/110223/pais.json');
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
      .get<CatalogoLista>('assets/json/110223/pais.json');
  }
    /**
   * Obtiene los datos para la consulta del trámite.
   * @returns {Observable<RespuestaConsulta>} Observable con los datos de consulta.
   */
  getDatosConsulta(): Observable<TramiteState> {
    return this.http.get<TramiteState>('assets/json/110223/consulta_110223.json');
  }

  /**
   * @description Actualiza el estado completo del formulario en el store de acuicultura.
   * @param DATOS Objeto de tipo Acuicultura con los datos a actualizar.
   */
  public actualizarEstadoFormulario(DATOS: TramiteState): void {
    this.store.update(DATOS);
  }
  
      /**
       * Obtiene la lista de mercancías desde un archivo JSON local.
       * @method obtenerMercancia
       * @returns {Observable<Mercancia[]>} Observable con la lista de mercancías.
       */
       /**
        * @method obtenerMercancia
        * @descripcion
        * Obtiene el historial de mercancías seleccionadas desde un archivo JSON local.
        * @returns {Observable<MercanciasHistorico>} Un observable que emite los datos del historial de mercancías.
        */
       obtenerMercancia(): Observable<MercanciasHistorico> {
         return this.http
           .get<MercanciasHistorico>('assets/json/110223/mercancias-seleccionadas.json');
       }
          obtenerMercancias(): Observable<MercanciasHistoricos> {
              return this.http
                .get<MercanciasHistoricos>('assets/json/110221/mercancias-seleccionadas.json');
            }
         
            /**
             * Obtiene el catálogo de unidades de medida comercial (UMC).
             * @returns Observable con la respuesta del catálogo de UMC.
             */
            getUMC(): Observable<RespuestaCatalogos> {
              return this.http.get<RespuestaCatalogos>('assets/json/110223/umc.json');
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
   * Obtiene el catálogo de estados desde el servidor.
   *
   * Realiza una petición HTTP GET al endpoint `/api/catalogo/estados` y retorna la respuesta
   * como un observable de tipo `JsonResponseCatalogo`.
   *
   * @returns Observable que emite la respuesta del catálogo de estados.
   */
  getTipoFactura(): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      PROC_110223.TIPO_FACTURA,
      {},
      false
    );
  }

  /** Obtiene los datos de una solicitud específica mediante su ID. */
  getMostrarSolicitud(id: string): Observable<JSONResponse> {
    return this.httpService.get<JSONResponse>(PROC_110223.MOSTRAR(id));
  }

  /** Mapea los datos del formulario del certificado desde el objeto recibido. */
  reverseMapFormCertificado(data: Record<string, unknown>): Record<string, unknown> {
    const CERTIFICADO = data?.['certificado'] as Record<string, unknown> ?? {};
    const TERCER_OPERADOR = (CERTIFICADO?.['realizo_tercer_operador'] as Record<string, unknown>) ?? {};
    const DOMICILIO_TERCER = (CERTIFICADO?.['domicilio_tercer_operador'] as Record<string, unknown>) ?? {};

    return {
      entidadFederativa: CERTIFICADO['tratado_acuerdo'] ?? '',
      bloque: CERTIFICADO['pais_bloque'] ?? '',
      fraccionArancelariaForm: CERTIFICADO['fraccion_arancelaria'] ?? '',
      nombreComercialForm: CERTIFICADO['nombre_comercial'] ?? '',
      registroProductoForm: CERTIFICADO['registro_producto'] ?? '',
      fechaInicio: CERTIFICADO['fecha_inicio'] ?? '',
      fechaFin: CERTIFICADO['fecha_fin'] ?? '',
      si: TERCER_OPERADOR['tercer_operador'] ?? false,
      nombres: TERCER_OPERADOR['nombre'] ?? '',
      primerApellido: TERCER_OPERADOR['primer_apellido'] ?? '',
      segundoApellido: TERCER_OPERADOR['segundo_apellido'] ?? '',
      numeroDeRegistroFiscal: TERCER_OPERADOR['numero_registro_fiscal'] ?? '',
      razonSocial: TERCER_OPERADOR['razon_social'] ?? '',
      pais: DOMICILIO_TERCER['pais'] ?? '',
      ciudad: DOMICILIO_TERCER['ciudad'] ?? '',
      calle: DOMICILIO_TERCER['calle'] ?? '',
      numeroLetra: DOMICILIO_TERCER['numero_letra'] ?? '',
      telefono: DOMICILIO_TERCER['telefono'] ?? '',
      correo: DOMICILIO_TERCER['correo_electronico'] ?? ''
    };
  }

  /** Mapea los datos del formulario de los datos del certificado desde el objeto recibido. */
  reverseMapFormDatosCertificado(data: Record<string, unknown>): Record<string, unknown> {
    const DATOS_CERTIFICADO = data?.['datos_del_certificado'] as Record<string, unknown> ?? {};
    const REPRESENTACION_FEDERAL = (DATOS_CERTIFICADO?.['representacion_federal'] as Record<string, unknown>) ?? {};

    return {
      observacionesDates: DATOS_CERTIFICADO?.['observaciones'] ?? '',
      EntidadFederativaDates: REPRESENTACION_FEDERAL?.['entidad_federativa'] ?? '',
      representacionFederalDates: REPRESENTACION_FEDERAL?.['representacion_federal'] ?? ''
    };
  }
  /** Mapea los datos de la tabla de mercancías desde el objeto recibido. */
  reverseMapMercanciaTabla(data: Record<string, unknown>): Mercancia[] {
    const CERTIFICADO = (data?.['certificado'] as { mercancias_seleccionadas?: unknown[] }) ?? {};
    const MERCANCIA_SELECCIONADAS = CERTIFICADO.mercancias_seleccionadas ?? [];

    return MERCANCIA_SELECCIONADAS.map((m: unknown) => {
      const MERCANCIA = m as {
        id?: number | string;
        fraccion_arancelaria?: string;
        cantidad?: string | number;
        unidad_medida?: string;
        valor_mercancia?: string | number;
        tipo_factura?: string;
        num_factura?: string;
        complemento_descripcion?: string;
        fecha_factura?: string;
        umc?: string;
        nombre_tecnico?: string;
        nombre_comercial?: string;
        fecha_expedicion?: string;
        fecha_vencimiento?: string;
      };

      return {
        id: typeof MERCANCIA.id === 'string' ? Number(MERCANCIA.id) : MERCANCIA.id ?? undefined,
        fraccionArancelaria: MERCANCIA.fraccion_arancelaria ?? '',
        cantidad: MERCANCIA.cantidad !== undefined ? String(MERCANCIA.cantidad) : undefined,
        umc: MERCANCIA.umc ?? '',
        unidadMedida: MERCANCIA.unidad_medida ?? '',
        valorMercancia: MERCANCIA.valor_mercancia !== undefined ? String(MERCANCIA.valor_mercancia) : undefined,
        tipoFactura: MERCANCIA.tipo_factura ?? '',
        numeroFactura: MERCANCIA.num_factura ?? '',
        complementoDescripcion: MERCANCIA.complemento_descripcion ?? '',
        fechaFactura: MERCANCIA.fecha_factura ?? '',
        fechaExpedicion: MERCANCIA.fecha_expedicion ?? '',
        fechaVencimiento: MERCANCIA.fecha_vencimiento ?? '',
        nombreTecnico: MERCANCIA.nombre_tecnico ?? '',
        nombreComercial: MERCANCIA.nombre_comercial ?? ''
      };
    });
  }

  /** Mapea los datos del formulario del destinatario desde el objeto recibido. */
  reverseMapFormDatosDelDestinatario(data: Record<string, unknown>): Record<string, unknown> {
    const DESTINATARIO = (data?.['destinatario'] ?? {}) as Record<string, unknown>;
    
    return {
      nombre: DESTINATARIO['nombre'] ?? '',
      primerApellido: DESTINATARIO['primer_apellido'] ?? '',
      segundoApellido: DESTINATARIO['segundo_apellido'] ?? '',
      numeroRegistroFiscal: DESTINATARIO['numero_registro_fiscal'] ?? '',
      razonSocial: DESTINATARIO['razon_social'] ?? ''
    };
  }

  /** Mapea los datos del formulario de domicilio del destinatario desde el objeto recibido. */
  reverseMapFormDestinatario(data: Record<string, unknown>): Record<string, unknown> {
    const DESTINATARIO = (data?.['destinatario'] ?? {}) as { domicilio?: Record<string, unknown> };
    const DOMICILIO = DESTINATARIO.domicilio ?? {};

    return {
      ciudad: DOMICILIO['ciudad_poblacion_estado_provincia'] ?? '',
      calle: DOMICILIO['calle'] ?? '',
      numeroLetra: DOMICILIO['numero_letra'] ?? '',
      telefono: DOMICILIO['telefono'] ?? '',
      fax: DOMICILIO['fax'] ?? '',
      correoElectronico: DOMICILIO['correo_electronico'] ?? '',
      paisDestino: DOMICILIO['pais_destino'] ?? ''
    };
  }

  /** Mapea los datos del formulario de domicilio desde el objeto recibido. */
  reverseMapDomicilioForm(data: Record<string, unknown>): Record<string, unknown> {
    const DESTINATARIO = (data?.['destinatario'] ?? {}) as { domicilio?: Record<string, unknown> };
    const DOMICILIO = DESTINATARIO.domicilio ?? {};

    return {
      calle: DOMICILIO['calle'] ?? '',
      numeroLetra: DOMICILIO['numero_letra'] ?? '',
      paisDestino: DOMICILIO['pais_destino'] ?? '',
      ciudad: DOMICILIO['ciudad_poblacion_estado_provincia'] ?? '',
      correoElectronico: DOMICILIO['correo_electronico'] ?? '',
      telefono: DOMICILIO['telefono'] ?? '',
      fax: DOMICILIO['fax'] ?? ''
    };
  }
  /** Mapea los datos del formulario de representante legal desde el objeto recibido. */
  reverseMapRepresentanteLegalForm(data: Record<string, unknown>): Record<string, unknown> {
    const DESTINATARIO = (data?.['destinatario'] ?? {}) as { generalesRepresentanteLegal?: Record<string, unknown> };
    const REPRESENTANTE = DESTINATARIO.generalesRepresentanteLegal ?? {};

    return {
      lugar: REPRESENTANTE['lugarRegistro'] ?? '',
      nombreRepresentante: REPRESENTANTE['nombre'] ?? '',
      empresa: REPRESENTANTE['razonSocial'] ?? '',
      cargo: REPRESENTANTE['puesto'] ?? '',
      telefono: REPRESENTANTE['telefono'] ?? '',
      correoElectronico: REPRESENTANTE['correoElectronico'] ?? ''
    };
  }

  /** Reconstruye el estado completo de la solicitud del trámite 110223 a partir del objeto recibido. */
  reverseBuildSolicitud110223(built: Record<string, unknown>): Record<string, unknown> {
    return {
      formCertificado: this.reverseMapFormCertificado(built),
      formDatosCertificado: this.reverseMapFormDatosCertificado(built),
      mercanciaTabla: this.reverseMapMercanciaTabla(built),
      formDatosDelDestinatario: this.reverseMapFormDatosDelDestinatario(built),
      formDestinatario: this.reverseMapFormDestinatario(built),
      destinatarioForm: this.reverseMapFormDatosDelDestinatario(built),
      domicilioForm: this.reverseMapDomicilioForm(built),
      representanteLegalForm: this.reverseMapRepresentanteLegalForm(built)
    };
  }

  /**
   * Busca mercancías para el certificado de origen.
   * @param body Objeto que contiene los parámetros de búsqueda.
   * @returns Observable con la respuesta de la búsqueda de mercancías.
   */
  buscarMercanciasCert(body: { [key: string]: unknown }): Observable<{ [key: string]: unknown }> {
    return this.httpService.post<{ [key: string]: unknown }>(PROC_110223.BUSCAR, { body: body });
  }
  
  /**
   * Guarda los datos del certificado de origen.
   * @param body Objeto que contiene los datos a guardar.
   * @returns Observable con la respuesta del guardado.
   */
  guardarDatosPost(
    body: Record<string, unknown>
  ): Observable<Record<string, unknown>> {
    return this.httpService.post<Record<string, unknown>>(PROC_110223.GUARDAR, {
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
   * Obtiene todos los datos del estado almacenado en el store.
   * @returns {Observable<TramiteState>} Observable con todos los datos del estado.
   */
  getAllState(): Observable<TramiteState> {
    return this.tramite110223Query.selectPexim$;
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
  buildCertificado(data: TramiteState): unknown {
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
  buildDatosDelCertificado(data: TramiteState): unknown {
    return {
      observaciones: data.formDatosCertificado['observacionesDates'],
      representacion_federal: {
        entidad_federativa: data.formDatosCertificado['EntidadFederativaDates'],
        representacion_federal: data.formDatosCertificado['representacionFederalDates'],
      },
    };
  }
    /** Construye el objeto destinatario a partir del estado del trámite 110223. */
  buildDestinatario(data: TramiteState): unknown {
    const FORM_DESTINATARIO = data.formDestinatario || {};
    const REPRESENTANTE_LEGAL = data.representanteLegalForm || {};

    return {
      "nombre": FORM_DESTINATARIO['nombre'] || '',
      "primer_apellido": FORM_DESTINATARIO['primerApellido'] || '',
      "segundo_apellido": FORM_DESTINATARIO['segundoApellido'] || '',
      "numero_registro_fiscal": FORM_DESTINATARIO['numeroRegistroFiscal'] || '',
      "razon_social": FORM_DESTINATARIO['razonSocial'] || '',
      "domicilio": {
          "ciudad_poblacion_estado_provincia": FORM_DESTINATARIO['ciudad'] || '',
          "calle": FORM_DESTINATARIO['calle'] || '',
          "numero_letra": FORM_DESTINATARIO['numeroLetra'] || '',
          "telefono": FORM_DESTINATARIO['telefono'] || '',
          "fax": FORM_DESTINATARIO['fax'] || '',
          "correo_electronico": FORM_DESTINATARIO['correoElectronico'] || '',
          "pais_destino": FORM_DESTINATARIO['paisDestino'] || ''
      },
      "generalesRepresentanteLegal": {
          "lugarRegistro": REPRESENTANTE_LEGAL['lugar'] || '',
          "nombre": REPRESENTANTE_LEGAL['nombreRepresentante'] || '',
          "razonSocial": REPRESENTANTE_LEGAL['empresa'] || '',
          "puesto": REPRESENTANTE_LEGAL['cargo'] || '',
          "telefono": REPRESENTANTE_LEGAL['telefono'] || '',
          "correoElectronico": REPRESENTANTE_LEGAL['correoElectronico'] || ''
        }
    }
  }

}