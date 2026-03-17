import {
  CamState,
  camCertificadoStore,
} from '../estados/cam-certificado.store';
import {
  ENVIRONMENT,
  JSONResponse,
} from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mercancia } from '../../../shared/models/modificacion.enum';
import { Observable } from 'rxjs';
import { PROC_110211 } from '../servers/api-route';
import { camCertificadoQuery } from '../estados/cam-certificado.query';

/**
 * Servicio para la gestión de solicitudes del certificado zoosanitario.
 * Este servicio permite actualizar y obtener información relacionada con el proceso de captura
 * de la solicitud, incluyendo datos del solicitante, movilización, terceros relacionados, pagos y validaciones.
 *
 * @export
 * @class CamCertificadoService
 * @description Servicio para gestionar la obtención y actualización de datos relacionados con el certificado CAM.
 * Proporciona métodos para obtener menús desplegables, datos de tablas y el estado completo del certificado CAM desde archivos JSON,
 * así como para actualizar el estado del formulario en el store correspondiente.
 *
 * @author
 * @version 1.0
 * @date 2024-06-07
 * @export
 * @class CamCertificadoService
 * @see CamState
 * @see Catalogo
 * @see Mercancia
 * @see camCertificadoStore
 * @see RespuestaCatalogos
 * @see HttpClient
 * @see Observable
 * @see Injectable
 * @see map
 * @see obtenerMenuDesplegable
 * @see obtenerTablaDatos
 * @see actualizarEstadoFormulario
 * @compodoc
 */
@Injectable({
  providedIn: 'root',
})
export class CamCertificadoService {
  url: string = '../../../../../assets/json/110211/';

  /**
   * @description URL del servidor para obtener catálogos.
   * @type {string}
   * @memberof CamCertificadoService
   */
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  constructor(
    private readonly http: HttpClient,
    private tramite110211Store: camCertificadoStore,
    public camCertificadoQuery: camCertificadoQuery
  ) { }

  /**
   *
   * Actualiza el estado completo del formulario en el store correspondiente usando los datos recibidos.
   * @method actualizarEstadoFormulario
   * @description Actualiza el estado del formulario con los datos proporcionados.
   * @param {CamState} DATOS - Objeto que contiene el nuevo estado del formulario.
   * @returns {void}
   *
   * @memberof CamCertificadoService
   *
   */
  actualizarEstadoFormulario(DATOS: CamState): void {
    this.tramite110211Store.setEstadoCompleto(DATOS);
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
   * Obtiene todos los datos del estado almacenado en el store.
   * @returns {Observable<TramiteState>} Observable con todos los datos del estado.
   */
  getAllState(): Observable<CamState> {
    return this.camCertificadoQuery.selectCam$;
  }

  /**
   * Realiza una búsqueda de mercancías utilizando los criterios proporcionados en el cuerpo de la solicitud.
   * @param body Objeto que contiene los criterios de búsqueda.
   * @returns Observable con la respuesta de la búsqueda de mercancías.
   */
  buscarMercanciasCert(
    body: Record<string, unknown>
  ): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(PROC_110211.BUSCAR, body);
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
        fraccionArancelaria: string;
        cantidad?: number;
        valorMercancia?: number;
        nombreTecnico: string;
        nombreComercial: string;
        numeroDeRegistrodeProductos: string;
        umc?: string;
        fechaExpedicion: string;
        fechaVencimiento: string;
        tipoFactura?: string;
        numeroFactura?: string;
        complementoDescripcion?: string;
        fechaFactura?: string;
      };

      RESULT.push({
        "fraccionArancelaria": ITEM.fraccionArancelaria,
        "cantidad": Number(ITEM.cantidad),
        "unidadDeMedida": ITEM.umc,
        "valorMercancia": Number(ITEM.valorMercancia),
        "tipoDeFactura": ITEM.tipoFactura,
        "numeroFactura": ITEM.numeroFactura,
        "complementoDescripcion": ITEM.complementoDescripcion,
        "fechaFactura": ITEM.fechaFactura
      });
    });

    return RESULT;
  }

  /**
     * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
     *
     * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
     * @returns Observable con la respuesta de la solicitud POST.
     */
  guardarDatosPost(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(PROC_110211.GUARDAR, body);
  }

  /**
   *  Obtiene los datos para mostrar en base al ID de la solicitud proporcionado.
   * @param idSolicitud  - El ID de la solicitud para la cual se desean obtener los datos.
   * @returns  Observable con la respuesta que contiene los datos a mostrar.
   */
  getMostrarDatos(idSolicitud: number): Observable<JSONResponse> {
    return this.http.get<JSONResponse>(PROC_110211.MOSTRAR + '?idSolicitud=' + idSolicitud);
  }

  /**
   *  Actualiza el estado del store con los datos proporcionados.
   * @param datos  - Objeto que contiene los datos para actualizar el estado del store.
   */
  setMostrarDatos(datos: Record<string, unknown[]>):void{
    this.tramite110211Store.setMercanciaTabla(this.actualizarSeleccionMercaniaDatos(datos?.['listaMercanciasSeleccionadas']));
    this.tramite110211Store.setFormCertificado(this.actualizarformCertificado(datos));
    this.tramite110211Store.setFormDatosCertificado(this.actualizarDatosCertificado(datos));
    this.tramite110211Store.setFormDatosDelDestinatario(this.actualizarDatosDelDestinatario(datos));
    this.tramite110211Store.setFormDestinatario(this.actualizarDestinatario(datos));
    this.tramite110211Store.setGrupoRepresentativoNombreExportador(this.actualizarGrupoRepresentativo(datos));
  }

  /**
   *  Actualiza los datos del destinatario con la información proporcionada.
   * @param datos  - Objeto que contiene los datos del destinatario.
   * @returns  Objeto con los datos actualizados del destinatario.
   */
  actualizarDestinatario(datos: Record<string, unknown[]>):Record<string, unknown>{
    return {
      paisDestin: '',
      ciudad: ((datos?.['destinatario'] as unknown as Record<string,unknown[]>)?.['destinatarioDomicilio'] as unknown as Record<string,unknown[]>)?.['ciudad'],
      calle: ((datos?.['destinatario'] as unknown as Record<string,unknown[]>)?.['destinatarioDomicilio'] as unknown as Record<string,unknown[]>)?.['calle'],
      numeroLetra: ((datos?.['destinatario'] as unknown as Record<string,unknown[]>)?.['destinatarioDomicilio'] as unknown as Record<string,unknown[]>)?.['numExterior'],
      lada: ((datos?.['destinatario'] as unknown as Record<string,unknown[]>)?.['destinatarioDomicilio'] as unknown as Record<string,unknown[]>)?.['lada'],
      telefono: ((datos?.['destinatario'] as unknown as Record<string,unknown[]>)?.['destinatarioDomicilio'] as unknown as Record<string,unknown[]>)?.['telefono'],
      fax: ((datos?.['destinatario'] as unknown as Record<string,unknown[]>)?.['destinatarioDomicilio'] as unknown as Record<string,unknown[]>)?.['fax'],
      correoElectronico: ((datos?.['destinatario'] as unknown as Record<string,unknown[]>)?.['destinatarioDomicilio'] as unknown as Record<string,unknown[]>)?.['calle'],
    }
  }

  /**
   *  Actualiza los datos del grupo representativo con la información proporcionada.
   * @param datos  - Objeto que contiene los datos del grupo representativo.
   * @returns  Objeto con los datos actualizados del grupo representativo.
   */
  actualizarGrupoRepresentativo(datos: Record<string, unknown[]>):Record<string, unknown>{
    return {
      lugar: (datos?.['certificadoOrigen'] as unknown as Record<string,unknown[]>)?.['lugarRegistro'],
      nombreExportador: (datos?.['representanteLegal'] as unknown as Record<string,unknown[]>)?.['nombre'],
      empresa: (datos?.['representanteLegal'] as unknown as Record<string,unknown[]>)?.['razonSocial'],
      cargo: (datos?.['representanteLegal'] as unknown as Record<string,unknown[]>)?.['puesto'],
      lada: ((datos?.['representanteLegal'] as unknown as Record<string,unknown[]>)?.['representanteLegalDomicilio'] as unknown as Record<string,unknown[]>)?.['lada'],
      telefono: ((datos?.['representanteLegal'] as unknown as Record<string,unknown[]>)?.['representanteLegalDomicilio'] as unknown as Record<string,unknown[]>)?.['telefono'],
      fax: ((datos?.['representanteLegal'] as unknown as Record<string,unknown[]>)?.['representanteLegalDomicilio'] as unknown as Record<string,unknown[]>)?.['fax'],
      correoElectronico: (datos?.['representanteLegal'] as unknown as Record<string,unknown[]>)?.['correoElectronico'],
    }
  }

  /**
   * Actualiza los datos de la mercancía seleccionada con la información proporcionada.
   * @param datos  - Objeto que contiene los datos de la mercancía seleccionada.
   * @returns  Arreglo de objetos con los datos actualizados de la mercancía seleccionada.
   */
  actualizarSeleccionMercaniaDatos(datos: unknown[]): Mercancia[] {
      const DATOS = (datos || [])?.map((item: unknown) => {
      const MERCANCIA_ITEM = item as Record<string, unknown>;
      return {
        id:0,
        fraccionArancelaria:MERCANCIA_ITEM?.['fraccionArancelaria'] || '',
        cantidad: MERCANCIA_ITEM?.['cantidad'],
        complementoDescripcion: MERCANCIA_ITEM?.['complementoDescripcion'],
        fechaFinalInput: MERCANCIA_ITEM?.['fechaFactura'],
        numeroFactura: MERCANCIA_ITEM?.['numeroFactura'],
        tipoFactura: MERCANCIA_ITEM?.['tipoDeFactura'],
        umc: MERCANCIA_ITEM?.['unidadDeMedida'],
        valorMercancia: MERCANCIA_ITEM?.['valorMercancia']
      };
    });
    return DATOS as Mercancia[];
}

/**
 *  Actualiza los datos del destinatario con la información proporcionada.
 * @param data  - Objeto que contiene los datos del destinatario.
 * @returns  Objeto con los datos actualizados del destinatario.
 */
  actualizarDatosDelDestinatario(data: Record<string, unknown[]>):Record<string, unknown> {
    return {
      nombres: (data?.['destinatario'] as unknown as Record<string,unknown[]>)?.['nombre'],
      primerApellido: (data?.['destinatario'] as unknown as Record<string,unknown[]>)?.['apellidoMaterno'],
      segundoApellido: (data?.['destinatario'] as unknown as Record<string,unknown[]>)?.['apellidoPaterno'],
      numeroDeRegistroFiscal: (data?.['destinatario'] as unknown as Record<string,unknown[]>)?.['rfcExtranjero'],
      razonSocial: (data?.['destinatario'] as unknown as Record<string,unknown[]>)?.['razonSocial'],
    }
  }

  /**
   *  Actualiza los datos del formulario del certificado con la información proporcionada.
   * @param data  - Objeto que contiene los datos del formulario del certificado.
   * @returns  Objeto con los datos actualizados del formulario del certificado.
   */
  actualizarformCertificado(data: Record<string, unknown[]>):Record<string, unknown> {
    return {
      si: data?.['blnTercerOperador'],
      entidadFederativa: (data?.['tratadoAcuerdo'] as unknown as Record< string,unknown[]>)?.['idTratadoAcuerdoSeleccionado'],
      bloque: data?.['clavePaisSeleccionado'],
      fraccionArancelariaForm: (data?.['datosMercancia'] as unknown as Record< string,unknown[]>)?.['claveFraccionArancelaria'],
      registroProductoForm: (data?.['datosMercancia'] as unknown as Record< string,unknown[]>)?.['numeroRegistroProductos'],
      nombreComercialForm: (data?.['datosMercancia'] as unknown as Record< string,unknown[]>)?.['nombreComercial'],
      fechaInicioInput: (data?.['datosMercancia'] as unknown as Record< string,unknown[]>)?.['fechInicio'],
      fechaFinalInput: (data?.['datosMercancia'] as unknown as Record< string,unknown[]>)?.['fechFin'],
      nombres: (data?.['tercerOperador'] as unknown as Record< string,unknown[]>)?.['nombre'],
      primerApellido: (data?.['tercerOperador'] as unknown as Record< string,unknown[]>)?.['apellidoPaterno'],
      segundoApellido: (data?.['tercerOperador'] as unknown as Record< string,unknown[]>)?.['apellidoMaterno'],
      numeroDeRegistroFiscal: (data?.['tercerOperador'] as unknown as Record< string,unknown[]>)?.['rfcExtranjero'],
      razonSocial: (data?.['tercerOperador'] as unknown as Record< string,unknown[]>)?.['razonSocial'],
      pais: (data?.['tercerOperador'] as unknown as Record< string,unknown[]>)?.['cvePaisOrigen'],
      calle: ((data?.['tercerOperador'] as unknown as Record< string,unknown[]>)?.['tercerOperadorDomicilio'] as unknown as Record< string,unknown[]>)?.['calle'],
      numeroLetra: ((data?.['tercerOperador'] as unknown as Record< string,unknown[]>)?.['tercerOperadorDomicilio'] as unknown as Record< string,unknown[]>)?.['numExterior'],
      ciudad: ((data?.['tercerOperador'] as unknown as Record< string,unknown[]>)?.['tercerOperadorDomicilio'] as unknown as Record< string,unknown[]>)?.['ciudad'],
      lada: ((data?.['tercerOperador'] as unknown as Record< string,unknown[]>)?.['tercerOperadorDomicilio'] as unknown as Record< string,unknown[]>)?.['lada'],
      telefono: ((data?.['tercerOperador'] as unknown as Record< string,unknown[]>)?.['tercerOperadorDomicilio'] as unknown as Record< string,unknown[]>)?.['telefono'],
      fax: ((data?.['tercerOperador'] as unknown as Record< string,unknown[]>)?.['tercerOperadorDomicilio'] as unknown as Record< string,unknown[]>)?.['fax'],
      correo: (data?.['tercerOperador'] as unknown as Record< string,unknown[]>)?.['correoElectronico']
    }
  }

  /**
   * Actualiza los datos del certificado con la información proporcionada.
   * @param data  - Objeto que contiene los datos del certificado.
   * @returns  Objeto con los datos actualizados del certificado.
   */
  actualizarDatosCertificado(data: Record<string, unknown[]>):Record<string, unknown> {
    return {
      observacionesDates: (data?.['certificadoOrigen'] as unknown as Record<string, unknown>)?.['observaciones'] as unknown,
      idiomaDates: ((data?.['certificadoOrigen'] as unknown as Record<string, unknown>)?.['lenguaje'] as unknown as Record<string, unknown>)?.['clave'],
      precisaDates: '',
      EntidadFederativaDates: (data?.['entidadFederativa']?.[0] as Record<string, unknown>)?.['cveEntidad'],
      representacionFederalDates: (data?.['unidadAdministrativaRepresentacionFederal'] as unknown as Record<string, unknown>)?.['cveEntidad'] as string,
      presenta: '',
    }
  }
}
