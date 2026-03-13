import { DatosModificacion } from '../../../shared/models/modificacion.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModificacionDatos } from '../models/modificacion-programa-immex-baja-submanufacturera.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { Tramite80303Store } from '../estados/tramite80303Store.store';

import { Tramite80303Query } from '../estados/tramite80303Query.query';
import { Tramite80303State } from '../estados/tramite80303Store.store';

import { AnexoExportacion, AnexoImportacion, JSONRespuesta, ServiciosImmex } from '../models/complementaria.model';

import { ProgramaLista } from '../models/modificacion-programa-immex-baja-submanufacturera.model'; 

import { ExportacionImportacionPayload, ImportacionExportacionFracciones } from '../models/modificacion-programa-immex-baja-submanufacturera.model'; 

import { JSONResponse} from '@libs/shared/data-access-user/src';
import { PROC_80303 } from '../servers/api-route';

import{DatosModificacionRespuesta} from '../models/modificacion-programa-immex-baja-submanufacturera.model';
/**
 * Decorador que marca una clase como un servicio que puede ser inyectado en otros componentes o servicios.
 * 
 * Este servicio está registrado en el nivel raíz de la aplicación, lo que significa que su instancia será única
 * y compartida en toda la aplicación. Esto permite que los datos y métodos del servicio sean accesibles desde
 * cualquier parte de la aplicación sin necesidad de crear múltiples instancias.
 * 
 * @remarks
 * Utilizar el decorador `@Injectable` con el proveedor `providedIn: 'root'` asegura que el servicio sea singleton
 * y esté disponible globalmente en la aplicación Angular.
 */
@Injectable({
  providedIn: 'root',
})
export class ModificacionProgramaImmexBajaSubmanufactureraService {
 
  /**
   * Constructor de la clase ModificacionProgramaImmexBajaSubmanufactureraService.
   *
   * @param httpServicios - Servicio HttpClient para realizar solicitudes HTTP.
   * @param tramite80303Store - Almacén de estado para gestionar los datos relacionados con el trámite 80303.
   */
  constructor(
    public httpServicios: HttpClient,
    public tramite80303Store: Tramite80303Store,
    private tramite80303Query: Tramite80303Query,
        private store: Tramite80303Store,

  ) {}

  /**
   * Obtiene una respuesta desde una URL y asigna los datos a una variable.
   *
   * @param {string} variable - El nombre de la variable donde se almacenarán los datos de la respuesta.
   * @param {string} url - La URL desde la cual se obtendrá la respuesta.
   * @returns {void}
   * @author Muneez
   * @remarks
   * Si la variable y la URL son válidas, se realiza una solicitud HTTP GET a la URL especificada.
   * Si la respuesta tiene un código 200 y contiene datos, estos se asignan a la variable especificada.
   * Si la variable o la URL no son válidas, se asigna un arreglo vacío a la variable.
   */
  obtenerRespuestaPorUrl(variable: string, url: string): void {
    if (self && variable && url) {
      this.httpServicios
        .get<RespuestaCatalogos>(`assets/json${url}`)
        .subscribe((resp): void => {
          const VALOR = resp?.code === 200 && resp.data ? resp.data : [];
          this.tramite80303Store.update((state) => ({
            ...state,
            [variable]: VALOR,
          }));
        });
    }
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

    return this.httpServicios.post<JSONRespuesta<{ buscaIdSolicitud: string }>>(
      PROC_80303.BUSCAR_ID_SOLICITUD,
      payload,
      
    );
  }
  /**
   * Obtiene los datos de modificación del programa IMMEX baja submanufacturera.
   * Realiza una solicitud HTTP GET a un archivo JSON y actualiza el estado del trámite con los datos obtenidos.
   *
   * @returns {void}
   */
  obtenerModicicacionDatos(): void {
    this.httpServicios
      .get<ModificacionDatos>(
        'assets/json/80303/modificacionProgramaImmexBajaSubmanufacturera.json'
      )
      .subscribe((resp): void => {
        this.tramite80303Store.update((state) => ({
          ...state,
          modificacionDatos: resp,
        }));
      });
  }
   
  /**
   * Consulta las mercancías de importación para una solicitud específica.
   * @param idSolicitud - Identificador de la solicitud.
   * @returns Observable con la respuesta de la consulta.
   */
 
 consultarMercanciasImportacion(
    idSolicitud: string[]
  ): Observable<JSONRespuesta<AnexoImportacion[]>> {

    const PARAM = idSolicitud.join(',');
    const URL = PROC_80303.CONSULTA_MERCANCIAS_IMPORTACION(PARAM);
    return this.httpServicios.get<JSONRespuesta<AnexoImportacion[]>>(URL);
  }
     
  /**
   * Consulta los productos de exportación para una solicitud específica.
   * @param idSolicitud - Identificador de la solicitud.
   * @returns Observable con la respuesta de la consulta.
   */
  consultarProductosExportacion(idSolicitud: string): Observable<any> {
    const URL = PROC_80303.CONSULTA_PRODUCTOS_EXPORTACION(idSolicitud);
    return this.httpServicios.get<any>(URL);
  }

  /**
   * Consulta las fracciones sensibles para una solicitud específica.
   * @param idSolicitud - Identificador de la solicitud.
   * @returns Observable con la respuesta de la consulta.
   */
  consultarFraccionesSensibles(idSolicitud: string): Observable<any> {
    const URL = PROC_80303.CONSULTA_FRACCIONES_SENSIBLES(idSolicitud);
    return this.httpServicios.get<any>(URL);
  }
  /**   * Consulta la bitácora IMMEX para un programa específico.
   * @param idPrograma - Identificador del programa.
   * @returns Observable con la respuesta de la consulta.
   */
  consultarBitacoraImmex(idPrograma: string): Observable<any> {
  const URL = PROC_80303.CONSULTAR_BITACORA_IMMEX(idPrograma);
  return this.httpServicios.get<any>(URL);
}
  /**   * Consulta las plantas submanufactureras para una solicitud específica.
   * @param idSolicitud - Identificador de la solicitud.
   * @returns Observable con la respuesta de la consulta.
   */
  consultarPlantasSubmanufactureras(idSolicitud: string): Observable<any> {
    const URL = PROC_80303.CONSULTAR_PLANTAS_SUBMANUFACTURERAS(idSolicitud);
    return this.httpServicios.get<any>(URL);
  }
  /**
   * Busca una empresa submanufacturera para una solicitud específica.
   * @param idSolicitud - Identificador de la solicitud.
   * @returns Observable con la respuesta de la consulta.
   */
   buscarEmpresaSubmanufacturera(idSolicitud: string): Observable<any> {
    const URL = PROC_80303.BUSCAR_EMPRESA_SUBMANUFACTURERA(idSolicitud);
    return this.httpServicios.get<any>(URL);
  }
  /**   * Consulta los servicios IMMEX.
   * @param body - Cuerpo de la solicitud.
   * @returns Observable con la respuesta de la consulta.
   */
  consultarServiciosImmex(body: unknown): Observable<JSONRespuesta<ServiciosImmex[]>> {
  const URL = PROC_80303.CONSULTAR_SERVICIOS;
  return this.httpServicios.post<JSONRespuesta<ServiciosImmex[]>>(URL, body);
}
  /**   * Busca un socio accionista.
   * @param body - Cuerpo de la solicitud.
   * @returns Observable con la respuesta de la consulta.
   */
   buscarSocioAccionista(body: any): Observable<any> {
  const URL = PROC_80303.BUSCAR_SOCIO_ACCIONISTA;
  return this.httpServicios.post<any>(URL, body);
}

  /**   * Busca notarios para consulta.
   * @param body - Cuerpo de la solicitud.
   * @returns Observable con la respuesta de la consulta.
   */
 buscarNotariosConsulta(body: any): Observable<any> {
    const URL = PROC_80303.BUSCAR_NOTARIOS_CONSULTA;
    return this.httpServicios.post<any>(URL, body);
  }
  /**   * Consulta las plantas.
   * @param body - Cuerpo de la solicitud.
   * @returns Observable con la respuesta de la consulta.
   */
  consultarPlantas(body: unknown): Observable<any> {
    const URL = PROC_80303.CONSULTA_PLANTAS;
    return this.httpServicios.post<any>(URL, body);
  }
  /**   * Busca empresas.
   * @param body - Cuerpo de la solicitud.
   * @returns Observable con la respuesta de la consulta.
   */
buscarEmpresas(body: any): Observable<any> {
  const URL = PROC_80303.BUSCAR_EMPRESAS;
  return this.httpServicios.post<any>(URL, body);
}

  /**   * Busca datos de certificación SAT.
   * @param rfc - RFC para la consulta.
   * @returns Observable con la respuesta de la consulta.
   */
buscarDatosCertificacionSAT(rfc: string): Observable<any> {
    const URL = `${PROC_80303.BUSCAR_DATOS_CERTIFICACION_SAT}?rfc=${rfc}`;
    return this.httpServicios.get<any>(URL);
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

    return this.httpServicios.get<JSONRespuesta<ProgramaLista[]>>(
      PROC_80303.LISTA_PROGRAMAS + `${rfc}&tipoPrograma=${tipoPrograma}`
    );
    
  }
  
  /**
   * Obtiene todos los datos del estado almacenado en el store.
   * @returns {Observable<Solicitud80303State>} Observable con todos los datos del estado.
   */
  getAllState(): Observable<Tramite80303State> {
    return this.tramite80303Query.selectSolicitud$;
  }
  /**
   * Obtiene los datos de una solicitud específica desde el servidor.
   * @param id ID de la solicitud a obtener.
   * @returns {Observable<JSONResponse>} Observable con la respuesta que contiene los datos de la solicitud.
   */
  getMostrarSolicitud(id: string): Observable<JSONResponse> {
    return this.httpServicios.get<JSONResponse>(PROC_80303.MOSTRAR(id));
  }
  /**
   * Guarda los datos del formulario de modificación en el servidor.
   * @param body Objeto que contiene los datos a guardar.
   * @returns {Observable<JSONResponse>} Observable con la respuesta del guardado.
   */
  postGuardarDatos(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.httpServicios.post<JSONResponse>(PROC_80303.GUARDAR, body);
  }
  /**
   * Obtiene los datos de exportación para la tabla dinámica.
   *
   * @returns {Observable<JSONRespuesta<ImportacionExportacionFracciones[]>>} Observable con los datos de exportación.
   */
  getDatosExportacionTableData(
    payload: ExportacionImportacionPayload
  ): Observable<JSONRespuesta<ImportacionExportacionFracciones[]>> {
    return this.httpServicios.post<
      JSONRespuesta<ImportacionExportacionFracciones[]>
    >(PROC_80303.FRACCIONES_EXPORTACION, {
      body: payload,
    });
  }
  /**
   * Actualiza el estado del formulario 80301 en el store, usando los datos de modificación actuales.
   *
   * @param DATOS - Objeto con los valores actualizados del formulario de modificación.
   */
  actualizarEstadoFormulario(DATOS: Tramite80303State): void {
    this.tramite80303Store.update(DATOS);
  
  }
   /**
   * Obtiene los datos de modificación desde un archivo JSON local.
   *
   * @returns {Observable<JSONRespuesta<DatosModificacion>>} Observable con los datos de modificación.
   */
  getDatosModificacion(): Observable<JSONRespuesta<DatosModificacion>> {
    return this.httpServicios
      .get<JSONRespuesta<DatosModificacionRespuesta>>(
        PROC_80303.DATOS_MODIFICACION
      )
      .pipe(
        map((response) => ({
          ...response,
          datos: {
            rfc: response.datos?.rfc_original ?? '',
            representacionFederal: '',
            tipo: response.datos?.identificacion?.tipo_sociedad ?? '',
            programa: response.datos?.identificacion?.email ?? '',
          },
        }))
      );
  }
  
/*  Método que invierte el proceso de construcción de la solicitud 80303.
    Toma un objeto construido y lo transforma de vuelta a su forma original.
    @param built - Objeto construido que contiene los datos de la solicitud.
    @returns Objeto con los datos revertidos a su forma original.
 */
  reverseBuildSolicitud80303(built: Record<string, unknown>): Record<string, unknown> {
    return {
      datosModificacion: this.reverseMapFormDatosModificacion(built),
      sociosAccionistas: this.reverseMapFormSociosAccionistas(built),
      notarios: this.reverseMapNotariosTabla(built),
      planta: this.reverseMapPlantaTabla(built),
      empresas: this.reverseMapEmpresasTabla(built),
      plantasIMMEX: this.reverseMapPlantasIMMEXTabla(built),
      plantasSubmanufactureras: this.reverseMapPlantasSubmanufacturerasTabla(built),
      fraccionesExportacion: this.reverseMapFraccionesExportacionTabla(built),
      fraccionesImportacion: this.reverseMapFraccionesImportacionTabla(built),
      fraccionesSensibles: this.reverseMapFraccionesSensiblesTabla(built),
      servicios: this.reverseMapServiciosTabla(built),
    };
  }

/*  Método que invierte el mapeo de las fracciones de exportación desde el formulario.
    @param data - Objeto que contiene los datos del formulario.
    @returns Objeto con las fracciones de exportación revertidas.

  */
  reverseMapFormDatosModificacion(data: Record<string, unknown>): Record<string, unknown> {
    const DATOS_MODIFICACION = data?.['datosModificacion'] as Record<string, unknown> ?? {};
    return {
      rfc: DATOS_MODIFICACION['rfc'] ?? '',
      tipo: DATOS_MODIFICACION['tipoModalidad'] ?? '',
      programa: DATOS_MODIFICACION['descripcionModalidad'] ?? '',
      representacionFederal: DATOS_MODIFICACION['unidadAdministrativaRepresentacionFederal?.clave'] ?? ''
    };
  }
  
  /*  Método que invierte el mapeo de los socios accionistas desde el formulario.
      @param data - Objeto que contiene los datos del formulario.
      @returns Objeto con los socios accionistas revertidos.
  */
  reverseMapFormSociosAccionistas(data: Record<string, unknown>): unknown {
    const SOCIOS_ACCIONISTAS = data?.['sociosAccionistas'] as Record<string, unknown>[] ?? [];
    return SOCIOS_ACCIONISTAS.map((socio) => ({
      rfc: socio['rfc'] ?? '',
      nombre: socio['nombre'] ?? '',
      apellidoMaterno: socio['apellidoMaterno'] ?? '',
      apellidoPaterno: socio['apellidoPaterno'] ?? ''
    }));
  }
  
  /*  Método que invierte el mapeo de los notarios desde el formulario.
      @param data - Objeto que contiene los datos del formulario.
      @returns Objeto con los notarios revertidos.
  */
  reverseMapNotariosTabla(data: Record<string, unknown>): unknown {
  const NOTARIOS = data?.['notarios'] as Record<string, unknown>[] ?? [];
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
    rfc: fed['rfc'] ?? ''
  }));
}

/*  Método que invierte el mapeo de las plantas desde el formulario.
    @param data - Objeto que contiene los datos del formulario.
    @returns Objeto con las plantas revertidas.
*/
reverseMapPlantaTabla(data: Record<string, unknown>): unknown {
  const PLANTA = data?.['planta'] as Record<string, unknown>[] ?? [];
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
    telefono: planta['telefono'] ?? ''
  }));
}

/*  Método que invierte el mapeo de las empresas desde el formulario.
    @param data - Objeto que contiene los datos del formulario.
    @returns Objeto con las empresas revertidas.
*/
reverseMapEmpresasTabla(data: Record<string, unknown>): unknown {
  const EMPRESAS = data?.['empresas'] as Record<string, unknown>[] ?? [];
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
    telefono: empresa['telefono'] ?? ''
  }));
}

/*  Método que invierte el mapeo de las plantas IMMEX desde el formulario.
    @param data - Objeto que contiene los datos del formulario.
    @returns Objeto con las plantas IMMEX revertidas.
*/
reverseMapPlantasIMMEXTabla(data: Record<string, unknown>): unknown {
  const IMMEX = data?.['plantasIMMEX'] as Record<string, unknown>[] ?? [];
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
    fecha32D: planta['fecha32D'] ?? '',
    claveEntidadFederativa: planta['claveEntidadFederativa'] ?? '',
    claveDelegacionMunicipio: planta['claveDelegacionMunicipio'] ?? ''
  }));
}

/*  Método que invierte el mapeo de las plantas submanufactureras desde el formulario.
    @param data - Objeto que contiene los datos del formulario.
    @returns Objeto con las plantas submanufactureras revertidas.
*/
reverseMapPlantasSubmanufacturerasTabla(data: Record<string, unknown>): unknown {
  const SUBMAN = data?.['plantasSubmanufactureras'] as Record<string, unknown>[] ?? [];
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
    telefono: planta['telefono'] ?? ''
  }));
}

/*  Método que invierte el mapeo de las fracciones de exportación desde el formulario.
    @param data - Objeto que contiene los datos del formulario.
    @returns Objeto con las fracciones de exportación revertidas.
*/
reverseMapFraccionesExportacionTabla(data: Record<string, unknown>): unknown {
  const FRACC_EXP = data?.['fraccionesExportacion'] as Record<string, unknown>[] ?? [];
  return FRACC_EXP.map((f) => ({
    tipoFraccion: f['tipoFraccion'] ?? '',
    fraccionPadre: f['fraccionPadre'] ?? '',
    idProductoExp: f['idProductoExp'] ?? '',
    descripcionTestado: f['descripcionTestado'] ?? '',
    fraccionCompuesta: f['fraccionCompuesta'] ?? '',
    idSectorProsecSol: f['idSectorProsecSol'] ?? 0,
    fraccionArancelaria: f['fraccionArancelaria'] ?? null
  }));
}

/*  Método que invierte el mapeo de las fracciones de importación desde el formulario.
    @param data - Objeto que contiene los datos del formulario.
    @returns Objeto con las fracciones de importación revertidas.
*/
reverseMapFraccionesImportacionTabla(data: Record<string, unknown>): unknown {
  const FRACC_IMP = data?.['fraccionesImportacion'] as Record<string, unknown>[] ?? [];
  return FRACC_IMP.map((f) => ({
    tipoFraccion: f['tipoFraccion'] ?? '',
    fraccionPadre: f['fraccionPadre'] ?? '',
    idProductoExp: f['idProductoExp'] ?? '',
    fraccionCompuesta: f['fraccionCompuesta'] ?? '',
    idSectorProsecSol: f['idSectorProsecSol'] ?? 0,
    descripcionTestado: f['descripcionTestado'] ?? '',
    fraccionArancelaria: f['fraccionArancelaria'] ?? null
  }));
}

/*  Método que invierte el mapeo de las fracciones sensibles desde el formulario.
    @param data - Objeto que contiene los datos del formulario.
    @returns Objeto con las fracciones sensibles revertidas.
*/
reverseMapFraccionesSensiblesTabla(data: Record<string, unknown>): unknown {
  const SENSIBLES = data?.['fraccionesSensibles'] as Record<string, unknown>[] ?? [];
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
    cveFraccion: fs['cveFraccion'] ?? ''
  }));
}
/*  Método que invierte el mapeo de los servicios desde el formulario.
    @param data - Objeto que contiene los datos del formulario.
    @returns Objeto con los servicios revertidos.
*/
reverseMapServiciosTabla(data: Record<string, unknown>): unknown {
  const SERVICIOS = data?.['servicios'] as Record<string, unknown>[] ?? [];
  return SERVICIOS.map((svc) => ({
    idServicio: svc['idServicio'] ?? 0,
    tipoServicio: svc['tipoServicio'] ?? '',
    testado: svc['testado'] ?? false,
    descripcion: svc['descripcion'] ?? '',
    descripcionTipo: svc['descripcionTipo'] ?? '',
    estatus: svc['estatus'] ?? false
  }));
}


 
}
