import { Catalogo, HttpCoreService, JSONResponse } from '@libs/shared/data-access-user/src';
import { DetalledelaLicitacion, DistribucionSaldo, LicitacionesDisponibles } from '../../../shared/models/expedicion-certificado.model';
import { Expedicion120204State, Expedicion120204Store } from '../estados/tramites/expedicion120204.store';
import { ApiLicitacionesResponse } from '../models/expedicion-certificados-asignacion.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { Expedicion120204Query } from '../estados/queries/expedicion120204.query';
import { FormGroup } from '@angular/forms';
import { PROC_120204 } from '../servers/api-route';

/**
 * Servicio para la gestión de datos relacionados con la expedición de certificados.
 * Proporciona métodos para obtener información desde archivos JSON locales.
 */
@Injectable({
  providedIn: 'root'
})
export class ExpedicionCertificadoService {

   /**
 * @property forms
 * @description
 * Mapa privado que almacena los formularios dinámicos registrados en el servicio. 
 * La clave es un `string` que representa el nombre del formulario, y el valor es una instancia de `FormGroup`.
 * @type {Map<string, FormGroup>}
 */
  private forms = new Map<string, FormGroup>();

  /**
   * Constructor del servicio.
   * @param http Cliente HTTP utilizado para realizar solicitudes a los archivos JSON.
   */
  constructor(
    private http: HttpClient,
    private tramiteStore: Expedicion120204Store,
    private query: Expedicion120204Query,
    private httpService: HttpCoreService
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Establece los datos del formulario en el store del trámite.
   *
   * @param datos - Objeto de tipo `Expedicion120204State` que contiene la información a establecer en el store, incluyendo:
   *   - entidadFederativa: La entidad federativa seleccionada.
   *   - representacionFederal: La representación federal correspondiente.
   *   - montoAExpedir: El monto que se va a expedir.
   *   - montoAExpedirCheck: Indicador de validación del monto a expedir.
   *   - montoDisponible: El monto disponible para expedir.
   *   - totalAExpedir: El total a expedir.
   *   - numeraDelicitacion: El número de la licitación.
   *   - fechaDelEventoDelicitacion: La fecha del evento de licitación.
   *   - descripcionDelProducto: Descripción del producto relacionado.
   *
   * Esta función actualiza el estado del store con los valores proporcionados en el objeto `datos`.
   */
  setDatosFormulario(datos: Expedicion120204State): void {
   this.tramiteStore.setEntidadFederativa(datos.entidadFederativa);
   this.tramiteStore.setRepresentacionFederal(datos.representacionFederal);
    this.tramiteStore.setMontoExpedir(datos.montoAExpedir);
    this.tramiteStore.setMontoExpedirCheck(datos.montoAExpedirCheck);
    this.tramiteStore.setMontoDisponsible(datos.montoDisponible);
    this.tramiteStore.setTotalExpedir(datos.totalAExpedir);
    this.tramiteStore.setNumeraDelicitacion(datos.numeraDelicitacion);
    this.tramiteStore.setFechaDelEventoDelicitacion(datos.fechaDelEventoDelicitacion);
    this.tramiteStore.setDescripcionDelProducto(datos.descripcionDelProducto);
  }

  /**
 * @method isFormValid
 * @description
 * Verifica la validez de un formulario dinámico registrado en el servicio.
 * @param {string} name - El nombre único del formulario.
 * @returns {boolean | undefined} - `true` si el formulario es válido, `false` si no lo es, o `undefined` si no se encuentra.
 */
  isFormValid(name: string): boolean | undefined {
    const FORMA = this.getForm(name);
    return FORMA?.valid;
  }

  /**
   * @method getForm
   * @description
   * Recupera un formulario dinámico registrado en el servicio utilizando su nombre único.
   * @param {string} name - El nombre único del formulario.
   * @returns {FormGroup | undefined} - La instancia del formulario o `undefined` si no se encuentra.
   */
    getForm(name: string): FormGroup | undefined {
      return this.forms.get(name);
  }

  /**
   * Obtiene todos los datos del estado almacenado en el store de expedición.
   * 
   * Este método proporciona acceso completo al estado reactivo del trámite 120204,
   * permitiendo suscribirse a los cambios en tiempo real de todos los datos
   * del formulario de expedición de certificados.
   * 
   * @returns {Observable<Expedicion120204State>} Observable que emite el estado completo
   *                                             del trámite con todos los datos del formulario.
   */
  getAllState(): Observable<Expedicion120204State> {
    return this.query.selectSolicitud$;
  }

  /**
   * Guarda los datos de la solicitud de expedición en el servidor.
   * 
   * Este método envía los datos de la solicitud de expedición de certificados
   * al servidor mediante una petición POST. Los datos incluyen toda la información
   * necesaria para procesar la solicitud como solicitante, licitación, montos, etc.
   * 
   * @param body - Objeto que contiene todos los datos de la solicitud a enviar al servidor.
   * @returns {Observable<Record<string, unknown>>} Observable que emite la respuesta del servidor
   *                                               con el resultado de la operación de guardado.
   */
  guardarDatosPost(
    body: Record<string, unknown>
  ): Observable<Record<string, unknown>> {
    return this.httpService.post<Record<string, unknown>>(PROC_120204.GUARDAR, {
      body: body,
    });
  }

  /**
   * @method getObtenerLicitacion
   * @description
   * Obtiene la lista de licitaciones disponibles desde la API.
   * @returns {Observable<ApiLicitacionesResponse>} Un observable que emite la respuesta con las licitaciones.
   */
  getObtenerLicitaciones(rfc: string): Observable<ApiLicitacionesResponse> {
    return this.httpService.get<ApiLicitacionesResponse>(PROC_120204.OBTENER_LICITACIONES(rfc));
  }

  /**
   * Obtiene datos adicionales de una licitación específica mediante consulta POST.
   * 
   * Este método realiza una consulta al servidor para obtener información detallada
   * de una licitación específica, incluyendo datos que no están disponibles en
   * la consulta general de licitaciones.
   * 
   * @param body - Objeto que contiene los parámetros de búsqueda, generalmente
   *               incluyendo el ID de asignación y RFC del usuario.
   * @returns {Observable<any>} Observable que emite los datos detallados de la licitación.
   */
  licitacionDatosPost(body: any): Observable<any> {
    return this.httpService.post<any>(
      PROC_120204.BUSCAR_LICITACION,
      { body: body }
    );
  }

  /**
   * Obtiene los certificados disponibles para una solicitud específica.
   * 
   * Este método consulta la API para obtener la lista de certificados
   * asociados a una solicitud particular, incluyendo información sobre
   * montos, estados y detalles de expedición.
   * 
   * @param idSolicitud - Identificador único de la solicitud cuyos certificados se desean obtener.
   * @returns {Observable<ApiLicitacionesResponse>} Observable que emite la respuesta
   *                                               con la lista de certificados disponibles.
   */
  obtenerCertificado(idSolicitud: string ): Observable<ApiLicitacionesResponse> {
    const URL = PROC_120204.OBTENER_CERTIFICADOS(idSolicitud);
    return this.httpService.get<ApiLicitacionesResponse>(URL);
  }

  /**
   * @method getRegistroTomaMuestrasMercanciasData
   * @description
   * Obtiene los datos de prellenado para el formulario desde un archivo JSON local.
   * @returns {Observable<Tramite110205State>} Observable que emite los datos de prellenado.
   */
  /**
   * Obtiene los datos completos de una solicitud de expedición específica.
   * 
   * Este método recupera toda la información almacenada de una solicitud
   * de expedición de certificados, incluyendo datos del solicitante,
   * licitación, montos y estado actual del trámite.
   * 
   * @param id - Identificador único de la solicitud a consultar.
   * @returns {Observable<JSONResponse>} Observable que emite la respuesta con
   *                                    todos los datos de la solicitud.
   */
  getMostrarSolicitud(id: string): Observable<JSONResponse> {
    return this.httpService.get<JSONResponse>(PROC_120204.MOSTRAR(id));
  }

  /**
   * Actualiza el estado completo del formulario en el store.
   * 
   * Este método actualiza todos los datos del estado del trámite 120204
   * con la información proporcionada, reemplazando el estado actual
   * con los nuevos datos. Es utilizado principalmente para prellenar
   * formularios con datos existentes.
   * 
   * @param DATOS - Estado completo del trámite con todos los datos a actualizar.
   * @returns {void} No retorna ningún valor.
   */
  actualizarEstadoFormulario(DATOS: Expedicion120204State): void {
    this.tramiteStore.update(DATOS);
  }

  /**
   * Reconstruye el estado completo de la solicitud del trámite 110201 desde datos del servidor.
   * 
   * Este método transforma los datos recibidos del servidor en el formato
   * esperado por la aplicación, mapeando la estructura de respuesta
   * a los objetos de estado utilizados en el frontend.
   * 
   * @param built - Objeto con los datos en formato servidor que necesitan ser transformados.
   * @returns {Record<string, unknown>} Objeto con los datos transformados al formato del frontend.
   */
  reverseBuildSolicitud110201(built: Record<string, unknown>): Record<string, unknown> {
    return {
      validacionForm: this.reverseMapFormValidacion(built),
    };
  }

  /**
   * Mapea y transforma los datos del formulario de expedición desde el formato del servidor.
   * 
   * Este método extrae y transforma los datos de expedición, licitación,
   * entidad federativa y representación federal desde la estructura
   * de respuesta del servidor al formato utilizado por los formularios.
   * 
   * @param data - Objeto con los datos en formato servidor que contienen la información de expedición.
   * @returns {Record<string, unknown>} Objeto con los datos mapeados para los formularios de la aplicación.
   */
  reverseMapFormValidacion(data: Record<string, unknown>): Record<string, unknown> {
    const DATOS_EXPEDICION = data?.['expedicion'] as Record<string, unknown> ?? {};
    const LICITACION = DATOS_EXPEDICION?.['licitacion'] as Record<string, unknown> ?? {};
    const ENTIDAD_FEDERATIVA = DATOS_EXPEDICION?.['entidadFederativa'] as Record<string, unknown> ?? {};
    const REPRESENTACION_FEDERAL = DATOS_EXPEDICION?.['representacionFederal'] as Record<string, unknown> ?? {};
    
    return {
      idSolicitud: DATOS_EXPEDICION?.['idSolicitud'] ?? null,
      entidadFederativa: ENTIDAD_FEDERATIVA?.['descripcion'] ?? '',
      representacionFederal: REPRESENTACION_FEDERAL?.['descripcion'] ?? '',
      numeraDelicitacion: LICITACION?.['numeroLicitacion'] ?? '',
      fechaDelEventoDelicitacion: LICITACION?.['fechaEvento'] ?? '',
      descripcionDelProducto: LICITACION?.['descripcionProducto'] ?? '',
      unidadMedidaTarifaria: LICITACION?.['unidadMedidaTarifaria'] ?? '',
      montoAdjudicado: LICITACION?.['montoAdjudicado'] ?? '',
      regimenAduanero: LICITACION?.['regimenAduanero'] ?? '',
      fraccionArancelaria: LICITACION?.['fraccionArancelaria'] ?? '',
      fechaInicioVigenciaCupo: LICITACION?.['fechaInicioVigencia'] ?? '',
      fechaFinVigenciaCupo: LICITACION?.['fechaFinVigencia'] ?? '',
      observaciones: LICITACION?.['observaciones'] ?? '',
      bloqueComercial: LICITACION?.['bloqueComercial'] ?? '',
      paises: LICITACION?.['paises'] ?? '',
    };
  }

  /**
   * Mapea y transforma los datos de distribución de saldo desde el formato del servidor.
   * 
   * Este método extrae los datos relacionados con la distribución de saldo,
   * incluyendo montos disponibles, montos a expedir y totales, transformándolos
   * desde el formato de respuesta del servidor al formato requerido por el frontend.
   * 
   * @param data - Objeto con los datos en formato servidor que contienen la información de distribución de saldo.
   * @returns {Record<string, unknown>} Objeto con los datos de distribución de saldo mapeados para la aplicación.
   */
  reverseMapDistribucionSaldo(data: Record<string, unknown>): Record<string, unknown> {
    const DISTRIBUCION_SALDO = data?.['distribucionSaldo'] as Record<string, unknown> ?? {};
    
    return {
      montoDisponible: DISTRIBUCION_SALDO?.['montoDisponible'] ?? '',
      montoAExpedir: DISTRIBUCION_SALDO?.['montoAExpedir'] ?? '',
      montoAExpedirCheck: DISTRIBUCION_SALDO?.['montoAExpedirCheck'] ?? false,
      totalAExpedir: DISTRIBUCION_SALDO?.['totalAExpedir'] ?? '',
    };
  }

  /**
   * Mapea y transforma la tabla de montos a expedir desde el formato del servidor.
   * 
   * Este método procesa un arreglo de montos a expedir, transformándolos
   * desde la estructura de respuesta del servidor al formato requerido
   * por la tabla de montos en el frontend.
   * 
   * @param data - Objeto con los datos en formato servidor que contienen los montos a expedir.
   * @returns {Array<Record<string, unknown>>} Arreglo con los montos a expedir mapeados para la tabla.
   */
  reverseMapMontosExpedir(data: Record<string, unknown>): Array<Record<string, unknown>> {
    const MONTOS_EXPEDIR = data?.['montosExpedir'] as unknown[] ?? [];
    
    return MONTOS_EXPEDIR.map((item: unknown) => {
      const MONTO = item as Record<string, unknown>;
      return {
        montoExpedir: MONTO['montoExpedir'] ?? 0,
      };
    });
  }

  /**
   * Reconstruye el estado completo de la solicitud del trámite 120204 desde datos del servidor.
   * 
   * Este método coordina la transformación completa de los datos de una solicitud
   * de expedición de certificados, incluyendo formularios de validación,
   * distribución de saldo y montos a expedir, desde el formato del servidor
   * al formato utilizado por la aplicación.
   * 
   * @param built - Objeto con todos los datos en formato servidor que necesitan ser transformados.
   * @returns {Record<string, unknown>} Objeto completo con todos los datos transformados
   *                                   listos para ser utilizados por el frontend.
   */
  reverseBuildSolicitud120204(built: Record<string, unknown>): Record<string, unknown> {
    return {
      formularioValidacion: this.reverseMapFormValidacion(built),
      distribucionSaldo: this.reverseMapDistribucionSaldo(built),
      montosExpedir: this.reverseMapMontosExpedir(built),
    };
  }
  
}
