import { Catalogo, CatalogoServices, HttpCoreService, RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { DatosDeSolicitud, RespuestaConsulta } from '../models/solicitud-datos.model';
import { MercanciasTabla, RespuestaTabla } from '../components/domicillo/domicillo.component';
import { Observable, map, throwError } from 'rxjs';
import { Sanitario260906Store, Solicitud260906State } from '../../../estados/tramites/sanitario260906.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_260906 } from '../servers/api-route';
import { Permiso260906Query } from '../../../estados/queries/permiso260906.query';
import { catchError } from 'rxjs/operators';

/**
 * @class SanitarioService
 * @description
 * Servicio principal para gestionar todas las funcionalidades relacionadas con el ámbito sanitario
 * del trámite 260906. Este servicio centraliza la comunicación con APIs, manejo de catálogos,
 * gestión de estado y transformación de datos para el proceso de solicitud de permisos sanitarios.
 * 
 * Funcionalidades principales:
 * - Obtención de catálogos y datos de referencia desde archivos JSON
 * - Comunicación con APIs del backend para operaciones CRUD
 * - Actualización del estado global del formulario
 * - Gestión de datos de terceros relacionados
 * - Manejo de información de pagos y derechos
 * 
 * @author Sistema COFEPRIS
 * @since 2024
 */
@Injectable({
  providedIn: 'root'
})
export class SanitarioService {
  /**
   * @constructor
   * @description
   * Constructor del servicio que inicializa todas las dependencias necesarias para
   * el manejo completo del trámite sanitario 260906.
   * 
   * @param {HttpClient} http - Cliente HTTP de Angular para realizar solicitudes a archivos locales y APIs
   * @param {CatalogoServices} catalogoService - Servicio para obtener catálogos del sistema VUCEM
   * @param {Permiso260906Query} query - Query service de Akita para acceder al estado del trámite
   * @param {HttpCoreService} httpService - Servicio HTTP core para comunicación con APIs del backend
   * @param {Sanitario260906Store} sanitarioStore - Store de Akita para gestión del estado del formulario
   */
  constructor(private http: HttpClient,private catalogoService: CatalogoServices, private query: Permiso260906Query, private httpService: HttpCoreService, private sanitarioStore: Sanitario260906Store) {}

  /**
   * @method getDatos
   * @description
   * Obtiene los datos relacionados con derechos y tasas del trámite 260906 desde un archivo JSON local.
   * Esta información incluye los costos, conceptos de pago y estructura de derechos aplicables
   * al proceso de solicitud de permisos sanitarios.
   * 
   * @returns {Observable<unknown>} Observable que emite los datos de derechos y tasas del trámite
   * @throws {Error} En caso de error al cargar el archivo JSON de derechos
   */
  getDatos(): Observable<unknown> {
    return this.http.get('assets/json/260906/derechos.json').pipe(
      catchError((error: unknown) => throwError(() => error))
    );
  }

  /**
   * @method getProveedordata
   * @description
   * Obtiene el catálogo de datos relacionados con proveedores desde un archivo JSON local.
   * Esta información contiene los proveedores autorizados, sus características y datos
   * necesarios para el proceso de validación de terceros en el trámite sanitario.
   * 
   * @returns {Observable<unknown>} Observable que emite el catálogo de proveedores disponibles
   * @throws {Error} En caso de error al cargar el archivo JSON de proveedores
   */
  getProveedordata(): Observable<unknown> {
    return this.http.get('assets/json/260906/proveedor.json').pipe(
      catchError((error: unknown) => throwError(() => error))
    );
  }

  /**
   * @method
   * @name getLocalidaddata
   * @description
   * Obtiene datos relacionados con localidades desde un archivo JSON.
   * 
   * @returns {Observable<unknown>} Observable que emite los datos obtenidos.
   */
  getLocalidaddata(): Observable<unknown> {
    return this.http.get('assets/json/260906/estadolocalidad.json').pipe(
      catchError((error: unknown) => throwError(() => error))
    );
  }

  /**
   * @method
   * @name getData
   * @description
   * Obtiene datos relacionados con terceros desde un archivo JSON.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite una lista de objetos `Catalogo`.
   */
  getData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/260906/terceros-relacionadoes.json');
  }

  /**
   * @method
   * @name obtenerFormaFarmaceuticaList
   * @description
   * Obtiene una lista de formas farmacéuticas desde un archivo JSON.
   * 
   * @returns {Observable<RespuestaCatalogos>} Observable con los datos de formas farmacéuticas.
   */
  obtenerFormaFarmaceuticaList(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/260906/seleccion.json');
  }

  /**
   * @method obtenerEstadoList
   * @description
   * Obtiene el catálogo completo de estados de la República Mexicana utilizando el servicio
   * de catálogos del sistema VUCEM. Este método es utilizado para poblar los selectores
   * de estado en los formularios de domicilio y ubicación.
   * 
   * @param {string} tramitesID - Identificador del trámite para obtener los estados específicos
   * @returns {Observable<Catalogo[]>} Observable que emite la lista de estados disponibles
   * @throws {Error} En caso de error al obtener el catálogo de estados
   */
  obtenerEstadoList(tramitesID: string): Observable<Catalogo[]> {
    return this.catalogoService.estadosCatalogo(tramitesID).pipe(
      map(res => res?.datos ?? [])
    );
  }

  /**
   * @method
   * @name obtenerTablaDatos
   * @description
   * Obtiene datos de una tabla desde un archivo JSON.
   * 
   * @returns {Observable<RespuestaTabla>} Observable con los datos de la tabla.
   */
  obtenerTablaDatos(): Observable<RespuestaTabla> {
    return this.http.get<RespuestaTabla>('assets/json/260906/tablaDatos.json');
  }

  /**
   * @method
   * @name obtenerMercanciasDatos
   * @description
   * Obtiene datos relacionados con mercancías desde un archivo JSON.
   * 
   * @returns {Observable<MercanciasTabla>} Observable con los datos de mercancías.
   */
  obtenerMercanciasDatos(): Observable<MercanciasTabla> {
    return this.http.get<MercanciasTabla>('assets/json/260906/mercanciasDatos.json');
  }

  /**
   * @method
   * @name obtenerDatosDeSolicitud
   * @description
   * Obtiene los datos generales de la solicitud desde un archivo JSON.
   * 
   * @returns {Observable<DatosDeSolicitud>} Observable con los datos de la solicitud.
   */
  obtenerDatosDeSolicitud(): Observable<DatosDeSolicitud> {
    return this.http.get<DatosDeSolicitud>('assets/json/260906/solicitud-datos.json');
  }

  /**
   * @method
   * @name getDatosConsulta
   * @description
   * Obtiene los datos para la consulta del trámite desde un archivo JSON.
   * 
   * @returns {Observable<RespuestaConsulta>} Observable con los datos de consulta.
   */
  getDatosConsulta(): Observable<RespuestaConsulta> {
    return this.http.get<RespuestaConsulta>('assets/json/260906/consulta-260906.json');
  }

  /**
   * @method getAllState
   * @description
   * Obtiene todo el estado completo del trámite 260906 desde el store de Akita.
   * Este método proporciona acceso reactivo a todos los datos del formulario,
   * incluyendo información del solicitante, terceros relacionados, pagos y documentos.
   * 
   * @returns {Observable<Solicitud260906State>} Observable con el estado completo del trámite
   */
  getAllState(): Observable<Solicitud260906State> {
    return this.query.selectSolicitud$;
  }

  /**
   * @method guardarDatosPost
   * @description
   * Envía una solicitud POST al backend para guardar los datos del trámite 260906.
   * Este método es utilizado para persistir la información del formulario en la
   * base de datos del sistema COFEPRIS.
   * 
   * @param {Record<string, unknown>} body - Objeto con los datos del trámite a guardar
   * @returns {Observable<Record<string, unknown>>} Observable con la respuesta del servidor
   * @throws {Error} En caso de error en la comunicación con el backend
   */
  guardarDatosPost(
    body: Record<string, unknown>
  ): Observable<Record<string, unknown>> {
    return this.httpService.post<Record<string, unknown>>(PROC_260906.GUARDAR, {
      body: body,
    });
  }

  /**
   * @method buscar
   * @description
   * Realiza una búsqueda en el sistema utilizando los criterios proporcionados.
   * Este método permite buscar trámites existentes, establecimiento o datos
   * relacionados con el proceso sanitario 260906.
   * 
   * @param {Record<string, unknown>} body - Objeto con los criterios de búsqueda
   * @returns {Observable<Record<string, unknown>>} Observable con los resultados de la búsqueda
   * @throws {Error} En caso de error en la búsqueda o comunicación con el backend
   */
  buscar(body: Record<string, unknown>): Observable<Record<string, unknown>> {
    return this.httpService.post<Record<string, unknown>>(PROC_260906.BUSCAR, {
      body: body,
    });
  }

  /**
   * @method getRegistroTomaMuestrasMercanciasData
   * @description
   * Obtiene los datos de configuración para el registro de toma de muestras de mercancías
   * en el ámbito de servicios extraordinarios del trámite 260906. Incluye información
   * sobre procedimientos, costos y requisitos para la toma de muestras.
   * 
   * @returns {Observable<any>} Observable con los datos de registro de toma de muestras
   * @throws {Error} En caso de error al cargar el archivo JSON de servicios extraordinarios
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<any> {
    return this.http.get<any>('assets/json/260906/serviciosExtraordinarios.json');
  }

  /**
   * @method getPagoDerechos
   * @description
   * Obtiene la información completa sobre el pago de derechos del trámite 260906.
   * Incluye datos sobre conceptos de pago, importes, referencias bancarias y
   * configuración necesaria para el proceso de pago de derechos.
   * 
   * @returns {Observable<any>} Observable con los datos de pago de derechos del trámite
   * @throws {Error} En caso de error al cargar el archivo JSON de pago de derechos
   */
  getPagoDerechos(): Observable<any> {
    return this.http.get<any>('assets/json/260906/pagoDerechos.json');
  }

  /**
   * @method actualizarEstadoFormulario
   * @description
   * Actualiza el estado del formulario principal con los datos proporcionados del establecimiento
   * y solicitante. Este método procesa de manera selectiva cada campo, actualizando únicamente
   * aquellos que contienen información válida en el objeto de datos recibido.
   * 
   * Campos actualizados:
   * - Datos del responsable sanitario (RFC)
   * - Información del establecimiento (denominación, correo)
   * - Domicilio completo (código postal, estado, municipio, localidad, colonia, calle)
   * - Datos de contacto (LADA, teléfono)
   * - Clasificación SCIAN (clave y descripción)
   * - Justificación del tipo de operación
   * 
   * @param {Record<string, unknown>} DATOS - Objeto que contiene los datos del establecimiento y solicitante
   * @returns {void}
   */
  actualizarEstadoFormulario(DATOS: Record<string, unknown>): void {
    // Actualizar datos del establecimiento usando métodos específicos
    this.updateFormField(DATOS, 'rfcResponsableSanitario', (value) => this.sanitarioStore.setRfcResponsableSanitario(value));
    this.updateFormField(DATOS, 'denominacion', (value) => this.sanitarioStore.setDenominacion(value));
    this.updateFormField(DATOS, 'correo', (value) => this.sanitarioStore.setCorreo(value));
    this.updateFormField(DATOS, 'tipoOperacionJustificacion', (value) => this.sanitarioStore.setTipoOperacionJustificacion(value));
    this.updateFormField(DATOS, 'codigoPostal', (value) => this.sanitarioStore.setCodigoPostal(value));
    this.updateFormField(DATOS, 'estado', (value) => this.sanitarioStore.setEstado(value));
    this.updateFormField(DATOS, 'muncipio', (value) => this.sanitarioStore.setMuncipio(value));
    this.updateFormField(DATOS, 'localidad', (value) => this.sanitarioStore.setLocalidad(value));
    this.updateFormField(DATOS, 'colonia', (value) => this.sanitarioStore.setColonia(value));
    this.updateFormField(DATOS, 'calle', (value) => this.sanitarioStore.setCalle(value));
    this.updateFormField(DATOS, 'lada', (value) => this.sanitarioStore.setLada(value));
    this.updateFormField(DATOS, 'telefono', (value) => this.sanitarioStore.setTelefono(value));
    this.updateFormField(DATOS, 'claveScianModal', (value) => this.sanitarioStore.setClaveScianModal(value));
    this.updateFormField(DATOS, 'claveDescripcionModal', (value) => this.sanitarioStore.setClaveDescripcionModal(value));
  }

  /**
   * @private
   * @method updateFormField
   * @description
   * Método auxiliar privado que actualiza condicionalmente los campos del formulario.
   * Verifica si existe el campo en los datos y ejecuta la función de actualización
   * correspondiente en el store, evitando actualizaciones innecesarias.
   * 
   * @param {Record<string, unknown>} data - Objeto que contiene los datos del formulario
   * @param {string} key - Clave del campo que se desea actualizar
   * @param {function} updateFn - Función que ejecuta la actualización en el store
   * @returns {void}
   */
  private updateFormField(data: Record<string, unknown>, key: string, updateFn: (value: string) => void): void {
    if (data[key]) {
      updateFn(data[key] as string);
    }
  }

  /**
   * @method actualizarPagoDerechosFormulario
   * @description
   * Actualiza los campos del formulario relacionados con el pago de derechos del trámite.
   * Este método procesa la información financiera y bancaria necesaria para completar
   * el proceso de pago de derechos sanitarios.
   * 
   * Campos actualizados:
   * - Referencia de pago bancario
   * - Cadena de dependencia para validación
   * - Información del banco emisor
   * - Llave de seguridad del pago
   * - Tipo de operación financiera (fetch)
   * - Importe total a pagar
   * 
   * @param {Record<string, unknown>} DATOS - Objeto con los datos de pago de derechos a actualizar
   * @returns {void}
   */
  actualizarPagoDerechosFormulario(DATOS: Record<string, unknown>): void {
    this.updateFormField(DATOS, 'referencia', (value) => this.sanitarioStore.setreferencia(value));
    this.updateFormField(DATOS, 'cadenaDependencia', (value) => this.sanitarioStore.setcadenaDependencia(value));
    this.updateFormField(DATOS, 'banco', (value) => this.sanitarioStore.setbanco(value));
    this.updateFormField(DATOS, 'llave', (value) => this.sanitarioStore.setLlave(value));
    this.updateFormField(DATOS, 'tipoFetch', (value) => this.sanitarioStore.settipoFetch(value));
    this.updateFormField(DATOS, 'importe', (value) => this.sanitarioStore.setimporte(value));
  }
}
