import { API_POST_PARCHE_PRELLENADAS, COMUN_URL, HttpCoreService, formatearFechaYyyyMmDd } from '@libs/shared/data-access-user/src';
import { CatalogoLista, DisponiblesTabla, HistoricoColumnas, MercanciaTabla, SeleccionadasTabla } from '../models/certificado-origen.model';
import { PROC_110216, PRODUCTORS_EXPORTADOR } from '../servers/api-route';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mercancia } from '../../../shared/models/modificacion.enum';
import { Observable } from 'rxjs';
import { Tramite110216Query } from '../../../estados/queries/tramite110216.query';
import { Tramite110216State } from '../../../estados/tramites/tramite110216.store';

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

  host: string;

  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes a los archivos JSON.
   */
  constructor(
    private http: HttpClient,
    private httpService: HttpCoreService,
    private tramite110216Query: Tramite110216Query
  ) {
    this.host = `${COMUN_URL.BASE_URL}`;
   }

  /**
   * Obtiene la lista de idiomas disponibles.
   * 
   * Este método realiza una solicitud HTTP para obtener los datos de idiomas desde un archivo JSON.
   * 
   * @returns {Observable<CatalogoLista>} Un observable que emite la lista de idiomas.
   */
  obtenerIdioma(): Observable<CatalogoLista> {
    return this.http
      .get<CatalogoLista>('assets/json/110216/idioma.json');
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
      .get<CatalogoLista>('assets/json/110216/entidad-federativa.json');
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
      .get<CatalogoLista>('assets/json/110216/representacion-federal.json');
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
   * Este método realiza una solicitud HTTP para obtener los datos de mercancías disponibles desde un archivo JSON.
   * 
   * @returns {Observable<DisponiblesTabla[]>} Un observable que emite la lista de mercancías disponibles.
   */
  obtenerMercanciasDisponibles(): Observable<DisponiblesTabla[]> {
    return this.http
      .get<DisponiblesTabla[]>('assets/json/110216/mercancia-disponsible.json');
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
      .get<SeleccionadasTabla[]>('assets/json/110216/mercancias-seleccionadas.json');
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
      .get<CatalogoLista>('assets/json/110216/pais.json');
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
      .get<CatalogoLista>('assets/json/110216/pais.json');
  }

  /**
   * @method getDatosConsulta
   * @description Obtiene los datos de consulta desde un archivo JSON local.
   * 
   * Este método realiza una solicitud HTTP GET para obtener los datos de consulta simulados desde el archivo `consulta_11201.json`.
   * 
   * @returns {Observable<RespuestaConsulta>} Un observable que emite la respuesta de los datos de consulta.
   */
  getDatosConsulta(): Observable<Record<string, unknown>> {
    return this.http.get<Record<string, unknown>>(`assets/json/110216/consulta-110216.json`);
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

  /**
     * Obtiene todos los datos del estado almacenado en el store.
     * @returns {Observable<Tramite80101State>} Observable con todos los datos del estado.
    */
  getAllState(): Observable<Tramite110216State> {
    return this.tramite110216Query.allStoreData$;
  }

  /**
   * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
   *
   * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  guardarDatosPost(body: Record<string, unknown>): Observable<Record<string, unknown>> {
    return this.httpService.post<Record<string, unknown>>(PROC_110216.GUARDAR, { body: body });
  }

  /**
 * Realiza una solicitud POST para agregar productores exportador utilizando el RFC del solicitante.
 * @param body Objeto con el RFC del solicitante.
 * @returns Observable con la respuesta de la solicitud.
 */
  agregarProductores(body: {rfc_solicitante: string}): Observable<unknown> {
    return this.httpService.post<unknown>(PROC_110216.AGREGAR_PRODUCTOR, { body: body });
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

  /** Construye el objeto destinatario a partir del estado del trámite 110214. */
  buildCertificado(data: Tramite110216State): unknown {
    return {
      "tratado_acuerdo": data.formCertificado?.['entidadFederativa'] || 102,
      "pais_bloque": data.formCertificado?.['bloque'],
      "fraccion_arancelaria": data.formCertificado?.['fraccionArancelariaForm'],
      "nombre_comercial": data.formCertificado?.['nombreComercialForm'],
      "registro_producto": data.formCertificado?.['registroProductoForm'],
      "fecha_inicio": formatearFechaYyyyMmDd(data.formCertificado?.['fechaInicioInput'] as string),
      "fecha_fin": formatearFechaYyyyMmDd(data.formCertificado?.['fechaFinalInput'] as string),
      "realizo_tercer_operador": {
        "tercer_operador": data.formCertificado?.['si'] as boolean,
        "nombre": data.formCertificado?.['nombres'] as string,
        "primer_apellido": data.formCertificado?.['primerApellido'] as string,
        "segundo_apellido": data.formCertificado?.['segundoApellido'] as string,
        "numero_registro_fiscal": data.formCertificado?.['numeroDeRegistroFiscal'] as string,
        "razon_social": data.formCertificado?.['razonSocial'] as string
      },
      "domicilio_tercer_operador": {
        "pais": data.formCertificado?.['pais'] as string,
        "ciudad": data.formCertificado?.['ciudad'] as string,
        "calle": data.formCertificado?.['calle'] as string,
        "numero_letra": data.formCertificado?.['numeroLetra'] as string,
        "telefono": data.formCertificado?.['telefono'] as string,
        "correo_electronico": data.formCertificado?.['correo'] as string
      },
      "mercancias_seleccionadas": this.buildCertificadoMercancia(data.mercanciaTabla)
    }
  }

  /** Construye el objeto destinatario a partir del estado del trámite 110216. */
  buildCertificadoMercancia(data: Mercancia[]): unknown {
    if (!Array.isArray(data)) {
      return [];
    }
    return data.map((item) => ({
      ...item,
      id: 0,
      fraccion_arancelaria: item.fraccionArancelaria ?? '',
      cantidad: item.cantidad ?? '',
      unidad_medida: item.unidadMedidaMasaBruta ?? '',
      valor_mercancia: item.valorMercancia ?? '',
      tipo_factura: item.tipoFactura ?? '',
      num_factura: item.numeroFactura ?? '',
      complemento_descripcion: item.complementoDescripcion ?? '',
      fecha_factura: item.fechaFinalInput ?? '',
    }));
  }

  /** Construye el objeto destinatario a partir del estado del trámite 110214. */
  buildDestinatario(data: Tramite110216State): unknown {
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
          "correoElectronico": data.grupoRepresentativo.correoElectronico,
          "lada": data.grupoRepresentativo.lada,
          "fax": data.grupoRepresentativo.fax
        },
      "medio_transporte": "MEDTR.01"
    }
  }

  /** Construye el objeto de datos para el certificado a partir del estado del trámite 110214. */
  buildDatosCertificado(data: Tramite110216State): unknown {
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
   * Construye el objeto con los detalles de transporte del destinatario a partir del estado del trámite 110216.
   * @param data Estado actual del trámite 110216.
   * @returns Objeto con los datos de transporte para el destinatario.
   */
  buildDestinatarioTransporteDetalles(data: Tramite110216State): unknown {
    return {
      "medioTransporte": "",
      "rutaCompleta": "",
      "puertoEmbarque": data.grupoDeTransporte.puertoEmbarque,
      "puertoDesembarque": data.grupoDeTransporte.puertoDesembarque,
      "fecEmbarque": "",
      "lugarEmbarque": "",
      "puertoTransito": data.grupoDeTransporte.puertoTransito,
      "nombreEmbarcacion": data.grupoDeTransporte.nombreEmbarcacion,
      "numeroVuelo": data.grupoDeTransporte.numeroVuelo
    }
  }

}