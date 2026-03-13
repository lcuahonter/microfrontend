import {
  Anexo,
  DatosModificacionRespuesta,
  EmpresasSubmanufactureras,
  ExportacionImportacionPayload,
  Federetarios,
  Operacions,
  Plantas,
  ProgramaLista,
} from '../models/plantas-consulta.model';
import {
  Complimentaria,
  ServiciosImmex,
} from '../../../shared/models/complementaria.model';
import {
  HttpCoreService,
  JSONResponse,
  RespuestaCatalogos,
} from '@libs/shared/data-access-user/src';
import {
  ImportacionExportacionFracciones,
  JSONRespuesta,
} from '../models/datos-tramite.model';
import { Observable, map } from 'rxjs';
import {
  Solicitud80301State,
  Solicitud80301StateObj,
  Tramite80301Store,
} from '../estados/tramite80301.store';
import { Bitacora } from '../../../shared/models/bitacora.model';
import { DatosModificacion } from '../../../shared/models/modificacion.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_80301 } from '../servers/api-route';
import { Tramite80301Query } from '../estados/tramite80301.query';

/**
 * Servicio que gestiona la obtención y actualización de datos relacionados con
 * el trámite IMMEX 80301, incluyendo modificación de domicilio, anexos, operaciones,
 * fedatarios, bitácora, etc.
 */
@Injectable({
  providedIn: 'root',
})

/**
 * Servicio que maneja la obtención y actualización de datos relacionados con el trámite IMMEX 80301.
 * Proporciona métodos para interactuar con los endpoints de la API y gestionar el estado del trámite.
 * @class SolicitudService
 */
export class SolicitudService {
  /**
   * Constructor del servicio SolicitudService.
   * @param http Cliente HTTP para realizar solicitudes a la API.
   * @param store Store para gestionar el estado del trámite 80301.
   * @param httpService Servicio HTTP core para realizar solicitudes genéricas.
   * @param tramite80301Query Query para obtener datos del estado del trámite 80301.
   */
  constructor(
    private http: HttpClient,
    private store: Tramite80301Store,
    private httpService: HttpCoreService,
    private tramite80301Query: Tramite80301Query
  ) {}

  /**
   * Obtiene los datos del solicitante desde un archivo JSON local.
   *
   * @returns {Observable<RespuestaCatalogos[]>} Observable con la lista de datos del solicitante.
   */
  getDatosDelSolicitante(): Observable<RespuestaCatalogos[]> {
    return this.http
      .get<{ data: RespuestaCatalogos[] }>(
        'assets/json/80301/datosSolicitante.json'
      )
      .pipe(map((response) => response.data));
  }

  /**
   * Obtiene los datos de exportación para la tabla dinámica.
   *
   * @returns {Observable<JSONRespuesta<ImportacionExportacionFracciones[]>>} Observable con los datos de exportación.
   */
  getDatosExportacionTableData(
    payload: ExportacionImportacionPayload
  ): Observable<JSONRespuesta<ImportacionExportacionFracciones[]>> {
    return this.httpService.post<
      JSONRespuesta<ImportacionExportacionFracciones[]>
    >(PROC_80301.FRACCIONES_EXPORTACION, {
      body: payload,
    });
  }

  /**
   * Obtiene los datos de importación para la tabla dinámica.
   *
   * @returns {Observable<JSONRespuesta<ImportacionExportacionFracciones[]>>} Observable con los datos de importación.
   */
  getImportacionTablaDatos(
    payload: ExportacionImportacionPayload
  ): Observable<JSONRespuesta<ImportacionExportacionFracciones[]>> {
    return this.httpService.post<
      JSONRespuesta<ImportacionExportacionFracciones[]>
    >(PROC_80301.FRACCIONES_IMPORTACION, {
      body: payload,
    });
  }

  /**
   * Busca el ID de la solicitud basado en el payload proporcionado.
   *
   * @param payload Datos necesarios para buscar el ID de la solicitud.
   * @returns {Observable<JSONRespuesta<{ buscaIdSolicitud: string }>>} Observable con el ID de la solicitud.
   */
  buscarIdSolicitud(payload: {
    idPrograma: string;
    tipoPrograma: string;
  }): Observable<JSONRespuesta<{ buscaIdSolicitud: string }>> {
    return this.httpService.post<JSONRespuesta<{ buscaIdSolicitud: string }>>(
      PROC_80301.BUSCAR_ID_SOLICITUD,
      {
        body: payload,
      }
    );
  }

  /**
   * Obtiene los datos de certificación SAT para un RFC dado.
   *
   * @param rfc El RFC para el cual se obtendrán los datos de certificación SAT.
   * @returns {Observable<JSONRespuesta<{ certificacionSAT: string }>>} Observable con los datos de certificación SAT.
   */
  obtenerDatosCertificacionSAT(
    rfc: string
  ): Observable<JSONRespuesta<{ certificacionSAT: string }>> {
    return this.httpService.get<JSONRespuesta<{ certificacionSAT: string }>>(
      PROC_80301.CERTIFICACION_SAT + rfc
    );
  }

  /**
   * Obtiene una lista de accionistas o representantes complementarios.
   *
   * @returns {Observable<Complimentaria[]>} Observable con la lista de objetos `Complimentaria`.
   */
  obtenerComplimentaria(
    idSolicitud: string[]
  ): Observable<JSONRespuesta<Complimentaria[]>> {
    return this.httpService.post<JSONRespuesta<Complimentaria[]>>(
      PROC_80301.COMPLIMENTARIA,
      {
        body: { idSolicitud },
      }
    );
  }

  /**
   * Obtiene la lista de fedatarios públicos que participan en el trámite.
   *
   * @returns {Observable<Federetarios[]>} Observable con los objetos `Federetarios`.
   */
  obtenerFederetarios(
    idSolicitud: string[]
  ): Observable<JSONRespuesta<Federetarios[]>> {
    return this.httpService.post<JSONRespuesta<Federetarios[]>>(
      PROC_80301.FEDERETARIOS,
      {
        body: { idSolicitud },
      }
    );
  }

  /**
   * Obtiene las operaciones registradas en el contexto del trámite.
   *
   * @returns {Observable<Operacions[]>} Observable con los objetos `Operacions`.
   */
  obtenerOperacion(
    idSolicitud: string[]
  ): Observable<JSONRespuesta<Operacions[]>> {
    return this.httpService.post<JSONRespuesta<Operacions[]>>(
      PROC_80301.PLANTAS,
      {
        body: { idSolicitud },
      }
    );
  }

  /**
   * Obtiene los servicios IMMEX asociados al trámite.
   *
   * @returns {Observable<ServiciosImmex[]>} Observable con los objetos `ServiciosImmex`.
   */
  obtenerServiciosImmex(
    idSolicitud: string[]
  ): Observable<JSONRespuesta<ServiciosImmex[]>> {
    return this.httpService.post<JSONRespuesta<ServiciosImmex[]>>(
      PROC_80301.SERVICIOS_IMMEX,
      {
        body: { idSolicitud },
      }
    );
  }

  /**
   * Obtiene las empresas relacionadas con el trámite.
   * @param idSolicitud Arreglo de IDs de solicitud para las cuales se obtendrán las empresas.
   * @returns {Observable<JSONRespuesta<EmpresasSubmanufactureras[]>>} Observable con las empresas relacionadas.
   */
  obtenerEmpresas(
    idSolicitud: string[]
  ): Observable<JSONRespuesta<EmpresasSubmanufactureras[]>> {
    return this.httpService.get<JSONRespuesta<EmpresasSubmanufactureras[]>>(
      PROC_80301.EMPRESAS + idSolicitud
    );
  }

  /**
   * Obtiene las plantas relacionadas con el trámite.
   * @param idSolicitud Arreglo de IDs de solicitud para las cuales se obtendrán las plantas.
   * @returns {Observable<JSONRespuesta<Plantas[]>>} Observable con las plantas relacionadas.
   */
  obtenerPlantasManufactureras(
    idSolicitud: string[]
  ): Observable<JSONRespuesta<Plantas[]>> {
    return this.httpService.get<JSONRespuesta<Plantas[]>>(
      `${PROC_80301.PLANTAS_MANUFACTURERAS}${idSolicitud}`
    );
  }

  /**
   * Obtiene las fracciones arancelarias de exportación asociadas a la solicitud.
   *
   * @param idSolicitud Arreglo de IDs de solicitud para las cuales se obtendrán las fracciones.
   * @returns {Observable<JSONRespuesta<Anexo[]>>} Observable con las fracciones de exportación.
   */
  obtenerFraccionesExportacion(
    idSolicitud: string[]
  ): Observable<JSONRespuesta<Anexo[]>> {
    const PARAM = idSolicitud.join(',');
    return this.httpService.get<JSONRespuesta<Anexo[]>>(
      PROC_80301.ANEXO_FRACCIONES_EXPORTACION + PARAM
    );
  }

  /**
   * Obtiene las fracciones arancelarias de importación asociadas a la solicitud.
   *
   * @param idSolicitud Arreglo de IDs de solicitud para las cuales se obtendrán las fracciones.
   * @returns {Observable<JSONRespuesta<Anexo[]>>} Observable con las fracciones de importación.
   */
  obtenerFraccionesImportacion(
    idSolicitud: string[]
  ): Observable<JSONRespuesta<Anexo[]>> {
    const PARAM = idSolicitud.join(',');
    return this.httpService.get<JSONRespuesta<Anexo[]>>(
      PROC_80301.ANEXO_FRACCIONES_IMPORTACION + PARAM
    );
  }

  /**
   * Obtiene los registros históricos de modificaciones en una bitácora.
   *
   * @returns {Observable<JSONRespuesta<Bitacora[]>>} Observable con los registros de la bitácora.
   */
  obtenerBitacora(idPrograma: string): Observable<JSONRespuesta<Bitacora[]>> {
    return this.httpService.get<JSONRespuesta<Bitacora[]>>(
      PROC_80301.BITACORA + idPrograma
    );
  }

  /**
   * Obtiene la lista de programas asociados a un RFC y tipo de programa específico.
   *
   * @param rfc El RFC para el cual se obtendrán los programas.
   * @param tipoPrograma El tipo de programa para filtrar la lista.
   * @returns {Observable<JSONRespuesta<ProgramaLista[]>>} Observable con la lista de programas.
   */
  obtenerListaProgramas(
    rfc: string,
    tipoPrograma: string
  ): Observable<JSONRespuesta<ProgramaLista[]>> {
    return this.httpService.get<JSONRespuesta<ProgramaLista[]>>(
      PROC_80301.LISTA_PROGRAMAS + `${rfc}&tipoPrograma=${tipoPrograma}`
    );
  }

  /**
   * Actualiza el estado del formulario 80301 en el store, usando los datos de modificación actuales.
   *
   * @param DATOS - Objeto con los valores actualizados del formulario de modificación.
   */
  actualizarEstadoFormulario(DATOS: Solicitud80301State): void {
    this.store.update(DATOS);
  }

  /**
   * Obtiene todos los datos del estado almacenado en el store.
   * @returns {Observable<Solicitud80301State>} Observable con todos los datos del estado.
   */
  getAllState(): Observable<Solicitud80301State> {
    return this.tramite80301Query.selectSolicitud$;
  }

  /**
   * Guarda los datos del formulario de modificación en el servidor.
   * @param body Objeto que contiene los datos a guardar.
   * @returns {Observable<JSONResponse>} Observable con la respuesta del guardado.
   */
  postGuardarDatos(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.httpService.post<JSONResponse>(PROC_80301.GUARDAR, {
      body: body,
    });
  }

  /**
   * Carga el estado completo del trámite desde un archivo local en formato JSON.
   *
   * @returns {Observable<Solicitud80301Statej>} Observable con el objeto de estado completo.
   */
  obtenerTramiteDatos(): Observable<Solicitud80301StateObj> {
    return this.http.get<Solicitud80301StateObj>(
      'assets/json/80301/tramite_datos.json'
    );
  }

  /**
   * Obtiene los datos de una solicitud específica desde el servidor.
   * @param id ID de la solicitud a obtener.
   * @returns {Observable<JSONResponse>} Observable con la respuesta que contiene los datos de la solicitud.
   */
  getMostrarSolicitud(id: string): Observable<JSONResponse> {
    return this.httpService.get<JSONResponse>(PROC_80301.MOSTRAR(id));
  }

  /**
   * Construye el objeto de solicitud 80301 a partir del payload recibido.
   * @param built Payload recibido desde el servidor.
   * @returns {Record<string, unknown>} Objeto estructurado de la solicitud 80301.
   */
  reverseBuildSolicitud80301(
    built: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      datosModificacion: this.reverseMapFormDatosModificacion(built),
      sociosAccionistas: this.reverseMapFormSociosAccionistas(built),
      notarios: this.reverseMapNotariosTabla(built),
      planta: this.reverseMapPlantaTabla(built),
      empresas: this.reverseMapEmpresasTabla(built),
      plantasIMMEX: this.reverseMapPlantasIMMEXTabla(built),
      plantasSubmanufactureras:
        this.reverseMapPlantasSubmanufacturerasTabla(built),
      fraccionesExportacion: this.reverseMapFraccionesExportacionTabla(built),
      fraccionesImportacion: this.reverseMapFraccionesImportacionTabla(built),
      fraccionesSensibles: this.reverseMapFraccionesSensiblesTabla(built),
      servicios: this.reverseMapServiciosTabla(built),
    };
  }

  /**
   * Mapea los datos de modificación desde el payload recibido.
   * @param data Payload recibido desde el servidor.
   * @returns {Record<string, unknown>} Objeto con los datos de modificación mapeados.
   */
  reverseMapFormDatosModificacion(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    const DATOS_MODIFICACION =
      (data?.['datosModificacion'] as Record<string, unknown>) ?? {};
    return {
      rfc: DATOS_MODIFICACION['rfc'] ?? '',
      tipo: DATOS_MODIFICACION['tipoModalidad'] ?? '',
      programa: DATOS_MODIFICACION['descripcionModalidad'] ?? '',
      representacionFederal:
        DATOS_MODIFICACION[
          'unidadAdministrativaRepresentacionFederal?.clave'
        ] ?? '',
    };
  }

  /**
   * Mapea los socios y accionistas desde el payload recibido.
   * @param data Payload recibido desde el servidor.
   * @returns {unknown} Arreglo con los socios y accionistas mapeados.
   */
  reverseMapFormSociosAccionistas(data: Record<string, unknown>): unknown {
    const SOCIOS_ACCIONISTAS =
      (data?.['sociosAccionistas'] as Record<string, unknown>[]) ?? [];
    return SOCIOS_ACCIONISTAS.map((socio) => ({
      rfc: socio['rfc'] ?? '',
      nombre: socio['nombre'] ?? '',
      apellidoMaterno: socio['apellidoMaterno'] ?? '',
      apellidoPaterno: socio['apellidoPaterno'] ?? '',
    }));
  }

  /**
   * Mapea los notarios desde el payload recibido.
   * @param data Payload recibido desde el servidor.
   * @returns {unknown} Arreglo con los notarios mapeados.
   */
  reverseMapNotariosTabla(data: Record<string, unknown>): unknown {
    const NOTARIOS = (data?.['notarios'] as Record<string, unknown>[]) ?? [];
    return NOTARIOS.map((fed) => ({
      nombreNotario: fed['nombreNotario'] ?? '',
      apellidoMaterno: fed['apellidoMaterno'] ?? '',
      apellidoPaterno: fed['apellidoPaterno'] ?? '',
      numeroActa: fed['numeroActa'] ?? '',
      numeroNotaria: fed['numeroNotaria'] ?? '',
      numeroNotario: fed['numeroNotario'] ?? null,
      delegacionMunicipio: fed['delegacionMunicipio'] ?? '',
      entidadFederativa: fed['entidadFederativa'] ?? '',
      fechaActa: fed['fechaActa'] ?? '',
      rfc: fed['rfc'] ?? '',
    }));
  }

  /**
   * Mapea las plantas desde el payload recibido.
   * @param data Payload recibido desde el servidor.
   * @returns {unknown} Arreglo con las plantas mapeadas.
   */
  reverseMapPlantaTabla(data: Record<string, unknown>): unknown {
    const PLANTA = (data?.['planta'] as Record<string, unknown>[]) ?? [];
    return PLANTA.map((planta) => ({
      calle: planta['calle'] ?? '',
      numeroInterior: planta['numeroInterior'] ?? '',
      numeroExterior: planta['numeroExterior'] ?? '',
      codigoPostal: planta['codigoPostal'] ?? '',
      colonia: planta['colonia'] ?? '',
      delegacionMunicipio: planta['delegacionMunicipio'] ?? '',
      entidadFederativa: planta['entidadFederativa'] ?? '',
      pais: planta['pais'] ?? '',
      rfc: planta['rfc'] ?? '',
      estatus: planta['estatus'] ?? false,
      desEstatus: planta['desEstatus'] ?? '',
      localidad: planta['localidad'] ?? '',
      telefono: planta['telefono'] ?? '',
    }));
  }

  /**
   * Mapea las empresas desde el payload recibido.
   * @param data Payload recibido desde el servidor.
   * @returns {unknown} Arreglo con las empresas mapeadas.
   */
  reverseMapEmpresasTabla(data: Record<string, unknown>): unknown {
    const EMPRESAS = (data?.['empresas'] as Record<string, unknown>[]) ?? [];
    return EMPRESAS.map((empresa) => ({
      calle: empresa['calle'] ?? '',
      numeroInterior: empresa['numeroInterior'] ?? '',
      numeroExterior: empresa['numeroExterior'] ?? '',
      codigoPostal: empresa['codigoPostal'] ?? '',
      colonia: empresa['colonia'] ?? '',
      delegacionMunicipio: empresa['delegacionMunicipio'] ?? '',
      entidadFederativa: empresa['entidadFederativa'] ?? '',
      pais: empresa['pais'] ?? '',
      rfc: empresa['rfc'] ?? '',
      domicilioFiscal: empresa['domicilioFiscal'] ?? '',
      razonSocial: empresa['razonSocial'] ?? '',
      claveEntidadFederativa: empresa['claveEntidadFederativa'] ?? '',
      clavePlantaEmpresa: empresa['clavePlantaEmpresa'] ?? '',
      clavePais: empresa['clavePais'] ?? '',
      claveDelegacionMunicipio: empresa['claveDelegacionMunicipio'] ?? '',
      estatus: empresa['estatus'] ?? false,
      desEstatus: empresa['desEstatus'] ?? '',
      localidad: empresa['localidad'] ?? '',
      telefono: empresa['telefono'] ?? '',
    }));
  }

  /**
   * Mapea las plantas IMMEX desde el payload recibido.
   * @param data Payload recibido desde el servidor.
   * @returns {unknown} Arreglo con las plantas IMMEX mapeadas.
   */
  reverseMapPlantasIMMEXTabla(data: Record<string, unknown>): unknown {
    const IMMEX = (data?.['plantasIMMEX'] as Record<string, unknown>[]) ?? [];
    return IMMEX.map((planta) => ({
      calle: planta['calle'] ?? '',
      numeroInterior: planta['numeroInterior'] ?? '',
      numeroExterior: planta['numeroExterior'] ?? '',
      codigoPostal: planta['codigoPostal'] ?? '',
      colonia: planta['colonia'] ?? '',
      delegacionMunicipio: planta['delegacionMunicipio'] ?? '',
      entidadFederativa: planta['entidadFederativa'] ?? '',
      pais: planta['pais'] ?? '',
      rfc: planta['rfc'] ?? '',
      estatus: planta['estatus'] ?? false,
      desEstatus: planta['desEstatus'] ?? '',
      localidad: planta['localidad'] ?? '',
      telefono: planta['telefono'] ?? '',
      fax: planta['fax'] ?? '',
      claveEntidadFederativa: planta['claveEntidadFederativa'] ?? '',
      claveDelegacionMunicipio: planta['claveDelegacionMunicipio'] ?? '',
    }));
  }

  /**
   * Mapea las plantas submanufactureras desde el payload recibido.
   * @param data Payload recibido desde el servidor.
   * @returns {unknown} Arreglo con las plantas submanufactureras mapeadas.
   */
  reverseMapPlantasSubmanufacturerasTabla(
    data: Record<string, unknown>
  ): unknown {
    const SUBMAN =
      (data?.['plantasSubmanufactureras'] as Record<string, unknown>[]) ?? [];
    return SUBMAN.map((planta) => ({
      calle: planta['calle'] ?? '',
      numeroInterior: planta['numeroInterior'] ?? '',
      numeroExterior: planta['numeroExterior'] ?? '',
      codigoPostal: planta['codigoPostal'] ?? '',
      colonia: planta['colonia'] ?? '',
      delegacionMunicipio: planta['delegacionMunicipio'] ?? '',
      entidadFederativa: planta['entidadFederativa'] ?? '',
      pais: planta['pais'] ?? '',
      rfc: planta['rfc'] ?? '',
      domicilioFiscal: planta['domicilioFiscal'] ?? '',
      razonSocial: planta['razonSocial'] ?? '',
      claveEntidadFederativa: planta['claveEntidadFederativa'] ?? '',
      clavePlantaEmpresa: planta['clavePlantaEmpresa'] ?? '',
      clavePais: planta['clavePais'] ?? '',
      claveDelegacionMunicipio: planta['claveDelegacionMunicipio'] ?? '',
      estatus: planta['estatus'] ?? false,
      desEstatus: planta['desEstatus'] ?? '',
      localidad: planta['localidad'] ?? '',
      telefono: planta['telefono'] ?? '',
    }));
  }

  /**
   * Mapea las fracciones de exportación desde el payload recibido.
   * @param data Payload recibido desde el servidor.
   * @returns {unknown} Arreglo con las fracciones de exportación mapeadas.
   */
  reverseMapFraccionesExportacionTabla(data: Record<string, unknown>): unknown {
    const FRACC_EXP =
      (data?.['fraccionesExportacion'] as Record<string, unknown>[]) ?? [];
    return FRACC_EXP.map((f) => ({
      tipoFraccion: f['tipoFraccion'] ?? '',
      fraccionPadre: f['fraccionPadre'] ?? '',
      idProductoExp: f['idProductoExp'] ?? '',
      descripcionTestado: f['descripcionTestado'] ?? '',
      fraccionCompuesta: f['fraccionCompuesta'] ?? '',
      idSectorProsecSol: f['idSectorProsecSol'] ?? 0,
      fraccionArancelaria: f['fraccionArancelaria'] ?? null,
    }));
  }

  /**
   * Mapea las fracciones de importación desde el payload recibido.
   * @param data Payload recibido desde el servidor.
   * @returns {unknown} Arreglo con las fracciones de importación mapeadas.
   */
  reverseMapFraccionesImportacionTabla(data: Record<string, unknown>): unknown {
    const FRACC_IMP =
      (data?.['fraccionesImportacion'] as Record<string, unknown>[]) ?? [];
    return FRACC_IMP.map((f) => ({
      tipoFraccion: f['tipoFraccion'] ?? '',
      fraccionPadre: f['fraccionPadre'] ?? '',
      idProductoExp: f['idProductoExp'] ?? '',
      fraccionCompuesta: f['fraccionCompuesta'] ?? '',
      idSectorProsecSol: f['idSectorProsecSol'] ?? 0,
      descripcionTestado: f['descripcionTestado'] ?? '',
      fraccionArancelaria: f['fraccionArancelaria'] ?? null,
    }));
  }

  /**
   * Mapea las fracciones sensibles desde el payload recibido.
   * @param data Payload recibido desde el servidor.
   * @returns {unknown} Arreglo con las fracciones sensibles mapeadas.
   */
  reverseMapFraccionesSensiblesTabla(data: Record<string, unknown>): unknown {
    const SENSIBLES =
      (data?.['fraccionesSensibles'] as Record<string, unknown>[]) ?? [];
    return SENSIBLES.map((fs) => ({
      claveSencible: fs['claveSencible'] ?? 0,
      complemento: fs['complemento'] ?? '',
      unidadMedidaTarifaria: fs['unidadMedidaTarifaria'] ?? '',
      cantidad: fs['cantidad'] ?? '',
      valor: fs['valor'] ?? '',
      fraccionPadre: fs['fraccionPadre'] ?? '',
      descUnidadMedida: fs['descUnidadMedida'] ?? null,
      fechaInicioVigencia: fs['fechaInicioVigencia'] ?? '',
      fechaFinVigencia: fs['fechaFinVigencia'] ?? '',
      cveFraccion: fs['cveFraccion'] ?? '',
    }));
  }

  /**
   * Mapea los servicios desde el payload recibido.
   * @param data Payload recibido desde el servidor.
   * @returns {unknown} Arreglo con los servicios mapeados.
   */
  reverseMapServiciosTabla(data: Record<string, unknown>): unknown {
    const SERVICIOS = (data?.['servicios'] as Record<string, unknown>[]) ?? [];
    return SERVICIOS.map((svc) => ({
      idServicio: svc['idServicio'] ?? 0,
      tipoServicio: svc['tipoServicio'] ?? '',
      testado: svc['testado'] ?? false,
      descripcion: svc['descripcion'] ?? '',
      descripcionTipo: svc['descripcionTipo'] ?? '',
      estatus: svc['estatus'] ?? false,
    }));
  }

  /**
   * Actualiza la información de la tabla dinámica en el servidor.
   * @param body Objeto que contiene los datos a actualizar.
   * @returns {Observable<JSONResponse>} Observable con la respuesta de la actualización.
   */
  actualizarGrid(body: any) {
    return this.httpService.post<JSONResponse>(PROC_80301.ACTUALIZAR_GRID, {
      body: body,
    });
  }
}
