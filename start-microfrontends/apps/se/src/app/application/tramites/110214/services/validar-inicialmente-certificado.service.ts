import { API_POST_PARCHE_PRELLENADAS, COMUN_URL, Catalogo, HttpCoreService, JsonResponseCatalogo, formatearFechaYyyyMmDd } from '@libs/shared/data-access-user/src';
import { CatalogoLista, HistoricoColumnas, MercanciaTabla, RespuestaConsulta, SeleccionadasTabla } from '../models/validar-inicialmente-certificado.model';
import { Observable, map } from 'rxjs';
import { PROC_110214, PRODUCTORS_EXPORTADOR } from '../servers/api-route';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mercancia } from '../../../shared/models/modificacion.enum';
import { Tramite110214Query } from '../../../estados/queries/tramite110214.query';
import { Tramite110214State } from '../../../estados/tramites/tramite110214.store';
/**
 * Servicio para validar inicialmente los datos del certificado en el trámite 110214.
 * 
 * Este servicio proporciona métodos para obtener información necesaria para el trámite,
 * como idiomas, entidades federativas, representaciones federales, mercancías disponibles,
 * mercancías seleccionadas, productores por exportador, tratados y países.
 */
@Injectable({
  providedIn: 'root'
})
export class ValidarInicialmenteCertificadoService {

  host: string;

  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes a los recursos.
   */
  constructor(
    private http: HttpClient,
    public httpService: HttpCoreService,
    private tramite110214Query: Tramite110214Query
  ) {
    this.host = `${COMUN_URL.BASE_URL}`;
   }

  /**
   * Obtiene la lista de idiomas disponibles.
   * 
   * @returns {Observable<CatalogoLista>} Un observable con la lista de idiomas.
   */
  obtenerIdioma(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>('assets/json/110214/idioma.json');
  }

  /**
   * Obtiene la lista de entidades federativas.
   * 
   * @returns {Observable<CatalogoLista>} Un observable con la lista de entidades federativas.
   */
  obtenerEntidadFederativa(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>('assets/json/110214/entidad-federativa.json');
  }

  /**
   * Obtiene la lista de representaciones federales.
   * 
   * @returns {Observable<CatalogoLista>} Un observable con la lista de representaciones federales.
   */
  obtenerRepresentacionFederal(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>('assets/json/110214/representacion-federal.json');
  }

  /**
   * Obtiene la información del productor por exportador.
   * 
   * @returns {Observable<Record<string, unknown>>} Un observable con los datos del productor por exportador.
   */
  obtenerProductorPorExportador(rfc: string): Observable<Record<string, unknown>> {
    return this.http.get<Record<string, unknown>>(PRODUCTORS_EXPORTADOR(rfc));
  }

  /**
   * Obtiene la lista de mercancías disponibles.
   * 
   * @returns {Observable<DisponiblesTabla[]>} Un observable con la lista de mercancías disponibles.
   */
  obtenerMercanciasDisponibles(body: Record<string, unknown>): Observable<unknown> {
    return this.httpService.post<unknown>(PROC_110214.BUSCAR_MERCANCIAS, { body: body });
  }

  /**
   * Obtiene la lista de mercancías seleccionadas.
   * 
   * @returns {Observable<SeleccionadasTabla[]>} Un observable con la lista de mercancías seleccionadas.
   */
  obtenerMercanciasSeleccionadas(): Observable<SeleccionadasTabla[]> {
    return this.http.get<SeleccionadasTabla[]>('assets/json/110214/mercancias-seleccionadas.json');
  }

  /**
   * Obtiene la lista de mercancías seleccionadas.
   * 
   * @returns {Observable<SeleccionadasTabla[]>} Un observable con la lista de mercancías seleccionadas.
   */
  getMercanciasSeleccionadas(): Observable<MercanciaTabla[]> {
    return this.http.get<MercanciaTabla[]>('assets/json/110214/mercancias-seleccionadas.json');
  }

  /**
   * Obtiene la lista de tratados disponibles.
   * 
   * @returns {Observable<CatalogoLista>} Un observable con la lista de tratados.
   */
  obtenerTratado(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>('assets/json/110214/pais.json');
  }

  /**
   * Obtiene la lista de países disponibles.
   * 
   * @returns {Observable<CatalogoLista>} Un observable con la lista de países.
   */
  obtenerPais(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>('assets/json/110214/pais.json');
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
    return this.http.get<RespuestaConsulta>(`assets/json/110214/consulta-110214.json`);
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
      PROC_110214.TIPO_FACTURA,
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
    return this.httpService.post<Record<string, unknown>>(PROC_110214.GUARDAR, { body: body });
  }

  /**
   * Obtiene todos los datos del estado almacenado en el store.
   * @returns {Observable<Tramite80101State>} Observable con todos los datos del estado.
   */
  getAllState(): Observable<Tramite110214State> {
    return this.tramite110214Query.allStoreData$;
  }

    /** Construye el objeto destinatario a partir del estado del trámite 110214. */
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

  /** Construye el objeto destinatario a partir del estado del trámite 110214. */
  // eslint-disable-next-line class-methods-use-this
  buildMercanciasProductor(data: Mercancia[]): unknown[] {
    return data.map(item => ({
      "fraccionArancelaria": item.fraccionArancelaria,
      "cantidadComercial": item.cantidad,
      "descUnidadMedidaComercial": item.unidadMedidaMasaBruta,
      "valorTransaccional": item.valorMercancia,
      "fechaFactura": item.fechaFactura,
      "numeroFactura": item.numeroFactura,
      "complementoDescripcion": item.complementoDescripcion,
      "rfcProductor": item.rfcProductor1
    }));
  }

  /** Construye el objeto destinatario a partir del estado del trámite 110214. */
  buildCertificado(data: Tramite110214State): unknown {
    return {
      "tratado_acuerdo": data.formCertificado['entidadFederativa'] || 102,
      "pais_bloque": data.formCertificado['bloque'],
      "fraccion_arancelaria": data.formCertificado['fraccionArancelariaForm'],
      "nombre_comercial": data.formCertificado['nombreComercialForm'],
      "registro_producto": data.formCertificado['registroProductoForm'],
      "fecha_inicio": formatearFechaYyyyMmDd(data.formCertificado['fechaInicioInput'] as string),
      "fecha_fin": formatearFechaYyyyMmDd(data.formCertificado['fechaFinalInput'] as string),
      "realizo_tercer_operador": {
        "tercer_operador": data.formCertificado['si'] as boolean,
        "nombre": data.formCertificado['nombres'] as string,
        "primer_apellido": data.formCertificado['primerApellido'] as string,
        "segundo_apellido": data.formCertificado['segundoApellido'] as string,
        "numero_registro_fiscal": data.formCertificado['numeroDeRegistroFiscal'] as string,
        "razon_social": data.formCertificado['razonSocial'] as string
      },
      "domicilio_tercer_operador": {
        "pais": data.formCertificado['pais'] as string,
        "ciudad": data.formCertificado['ciudad'] as string,
        "calle": data.formCertificado['calle'] as string,
        "numero_letra": data.formCertificado['numeroLetra'] as string,
        "telefono": data.formCertificado['telefono'] as string,
        "correo_electronico": data.formCertificado['correo'] as string,
        "lada": data.formCertificado['lada'] as string,
        "fax": data.formCertificado['fax'] as string
      },
      "mercancias_seleccionadas": this.buildCertificadoMercancia(data.mercanciaTabla)
    }
  }

  /** Construye el objeto destinatario a partir del estado del trámite 110214. */
  buildCertificadoMercancia(data: Mercancia[]): unknown {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((item) => ({
      id: 0,
      fraccion_arancelaria: item.fraccionArancelaria ?? '',
      cantidad: item.cantidad ?? '',
      unidad_medida: item.umc ?? '',
      valor_mercancia: item.valorMercancia ?? '',
      tipo_factura: item.tipoFactura ?? '',
      num_factura: item.numeroFactura ?? '',
      complemento_descripcion: item.complementoDescripcion ?? '',
      fecha_factura: item.fechaFactura ?? '',
    }));
  }

  /** Construye el objeto destinatario a partir del estado del trámite 110214. */
  buildDestinatario(data: Tramite110214State): unknown {
    return {
      "nombre": data.grupoReceptor.nombre,
      "primer_apellido": data.grupoReceptor.apellidoPrimer,
      "segundo_apellido": data.grupoReceptor.apellidoSegundo,
      "numero_registro_fiscal": data.grupoReceptor.numeroFiscal,
      "razon_social": data.grupoReceptor.razonSocial,
      "domicilio": {
          "ciudad_poblacion_estado_provincia": data.grupoDeDirecciones.ciudad,
          "calle": data.grupoDeDirecciones.calle,
          "numero_letra": data.grupoDeDirecciones.numeroLetra,
          "lada": "HG",
          "telefono": data.grupoDeDirecciones.telefono,
          "fax": 4444444,
          "correo_electronico": data.grupoDeDirecciones.correoElectronico,
          "pais_destino": "IND"
      },
      "generalesRepresentanteLegal": {
          "lugarRegistro": data.grupoRepresentativo.lugar,
          "nombre": data.grupoRepresentativo.nombreExportador,
          "razonSocial": data.grupoRepresentativo.empresa,
          "puesto": data.grupoRepresentativo.cargo,
          "telefono": data.grupoRepresentativo.telefono,
          "correoElectronico": data.grupoRepresentativo.correoElectronico
        },
      "medio_transporte": "MEDTR.01"
    }
  }

  /** Construye el objeto de datos para el certificado a partir del estado del trámite 110214. */
  buildDatosCertificado(data: Tramite110214State): unknown {
    return {
      "observaciones": data.formDatosCertificado['observacionesDates'],
      "idioma": data.formDatosCertificado['idiomaDates'],
      "representacion_federal": {
          "entidad_federativa": data.formDatosCertificado['EntidadFederativaDates'],
          "representacion_federal": data.formDatosCertificado['representacionFederalDates']
      }
    }
  }

  /**
   * Obtiene la lista de países bloque desde un archivo JSON local.
   * @method obtenerPaisBloque
   * @returns {Observable<Catalogo[]>} Observable con la lista de países bloque.
   */
  obtenerPaisBloque(): Observable<Catalogo[]> {
    return this.http
      .get<{ data: Catalogo[] }>('assets/json/110204/país-bloque.json')
      .pipe(map((res) => res.data));
  }
  
  /**
   * Obtiene el catálogo de estados desde el servidor.
   *
   * Realiza una petición HTTP GET al endpoint `/api/catalogo/PAIS_BLOQU` y retorna la respuesta
   * como un observable de tipo `JsonResponseCatalogo`.
   *
   * @returns Observable que emite la respuesta del catálogo de estados.
   */
  getPaisBloqu(): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      PROC_110214.PAIS_BLOQU,
      {},
      false
    );
  }

  /**
 * Realiza una solicitud POST para agregar productores exportador utilizando el RFC del solicitante.
 * @param body Objeto con el RFC del solicitante.
 * @returns Observable con la respuesta de la solicitud.
 */
  agregarProductores(body: {rfc_solicitante: string}): Observable<unknown> {
    return this.httpService.post<unknown>(PROC_110214.AGREGAR_PRODUCTOR, { body: body });
  }

  /**
   * @method fetchMostrarApi
   * @description Obtiene los datos de consulta desde un archivo JSON local.
   * Este método realiza una solicitud HTTP GET para obtener los datos de consulta simulados desde el archivo `consulta_11201.json`.
   * 
   * @returns {Observable<BaseResponse<T>>} Un observable que emite la respuesta de los datos de consulta.
   */
  fetchMostrarApi<T>(tramite: number, idSolicitud: number): Observable<BaseResponse<T>> {
    const ENDPOINT = `${this.host}${API_POST_PARCHE_PRELLENADAS(tramite, idSolicitud)}`;
    return this.http.get<BaseResponse<T>>(ENDPOINT);
  }
}