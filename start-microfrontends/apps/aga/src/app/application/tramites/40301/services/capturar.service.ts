/**
 * Servicio para la gestión y captura de datos del trámite CAAT Naviero 40301.
 *
 * Este archivo contiene el servicio Angular que maneja todas las operaciones relacionadas
 * con la captura, validación y gestión de datos del trámite 40301 (Certificado de
 * Autorización de Agente de Transporte para operadores navieros). Proporciona funcionalidad
 * centralizada para la comunicación con APIs, gestión de estado reactivo, y manejo de
 * datos de formularios a través del patrón Akita Store.
 *
 * El servicio implementa:
 * - Gestión de estado reactivo del trámite 40301 usando Akita Store/Query
 * - Comunicación HTTP con APIs locales y remotas para obtención de catálogos
 * - Manejo de metadatos y configuraciones del trámite
 * - Actualización y persistencia del estado de formularios
 * - Obtención de roles de usuario y validaciones de permisos
 * - Gestión de datos guardados y recuperación de estado previo
 *
 * @fileoverview Servicio principal para captura y gestión de datos del trámite CAAT Naviero 40301
 * @author Sistema de Gestión de Trámites - Frontend Team
 * @version 1.0.0
 * @since 1.0.0
 * @module CapturarService
 */

import { CONSTRUIR_ENDPOINT_INICIAR, Catalogo, ENVIRONMENT, GUARDAR_SOLICITUD } from '@libs/shared/data-access-user/src';
import { GuardarSolicitudRequest, GuardarSolicitudResponse } from '../modelos/guardar-solicitud.model';
import { IniciarSolicitudRequest, IniciarSolicitudResponse } from '../modelos/iniciar-solicitud.model';
import { Observable, catchError, throwError } from 'rxjs';
import { Tramite40301State, Tramite40301Store } from '../estados/tramite40301.store';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { CaatNaviroMetaInfo } from '../modelos/caat-naviero.modalidad.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tramite40301Query } from '../estados/tramite40301.query';



/**
 * Servicio Angular para la captura y gestión de datos del trámite CAAT Naviero 40301.
 *
 * Este servicio proporciona funcionalidad centralizada para manejar todas las operaciones
 * relacionadas con la captura de datos del trámite 40301. Implementa el patrón de gestión
 * de estado reactivo utilizando Akita Store/Query para coordinar el estado de la aplicación
 * y maneja la comunicación HTTP con diversos endpoints para obtener catálogos, metadatos
 * y configuraciones necesarias para el proceso de registro CAAT Naviero.
 *
 * Funcionalidades principales:
 * - Inicialización y gestión del estado del trámite 40301
 * - Obtención de metadatos y configuraciones del proceso
 * - Consulta de catálogos de agentes y tipos de transporte
 * - Gestión de roles de usuario y permisos
 * - Actualización reactiva del estado de formularios
 * - Persistencia y recuperación de datos guardados
 * - Integración con el sistema de gestión de estado Akita
 *
 * @service
 * @injectable
 * @providedIn 'root'
 *
 * @example
 * ```typescript
 * // Inyección del servicio en un componente:
 * constructor(private capturarService: CapturarService) {}
 *
 * // Inicializar valores del trámite:
 * this.capturarService.setInitialValues();
 *
 * // Obtener estado reactivo del trámite:
 * this.capturarService.getTramiteState().subscribe(estado => {
 *   console.log('Estado del trámite:', estado);
 * });
 *
 * // Obtener catálogo de agentes:
 * this.capturarService.getCatalogo().subscribe(agentes => {
 *   this.agentesDisponibles = agentes;
 * });
 * ```
 *
 * @since 1.0.0
 */
@Injectable({
  providedIn: 'root'
})
export class CapturarService {
  /**
   * URL base para acceso a archivos JSON de configuración del trámite 40301.
   *
   * Esta propiedad define la ruta base donde se encuentran almacenados los archivos
   * JSON que contienen configuraciones, catálogos y metadatos específicos del
   * trámite CAAT Naviero 40301. Se utiliza como prefijo para todas las peticiones
   * HTTP que requieren acceso a recursos estáticos de configuración.
   *
   * @private
   * @property {string} baseUrl
   * @readonly
   * @default 'assets/json/40301'
   *
   * @example
   * ```typescript
   * // Ejemplos de uso interno del servicio:
   * // `${this.baseUrl}/metaData.json` -> 'assets/json/40301/metaData.json'
   * // `${this.baseUrl}/userRoles.json` -> 'assets/json/40301/userRoles.json'
   * // `${this.baseUrl}/tipoAgentoData.json` -> 'assets/json/40301/tipoAgentoData.json'
   * ```
   *
   * @since 1.0.0
   */
  private baseUrl: string = 'assets/json/40301';
  private readonly baseApiUrlTramite: string;

  /**
   * Constructor del servicio de captura de datos del trámite 40301.
   *
   * Inyecta las dependencias necesarias para el funcionamiento del servicio,
   * incluyendo el cliente HTTP para comunicación con APIs, el store para gestión
   * de estado, y el query para consultas reactivas. La inyección de dependencias
   * es manejada automáticamente por el framework de Angular.
   *
   * @constructor
   * @param {HttpClient} http - Cliente HTTP de Angular para realizar peticiones a APIs y recursos estáticos
   * @param {Tramite40301Store} tramite40301Store - Store de Akita para gestión del estado del trámite 40301
   * @param {Tramite40301Query} tramite40301Query - Query de Akita para consultas reactivas del estado del trámite
   *
   * @example
   * ```typescript
   * // Angular maneja automáticamente la inyección de dependencias:
   * // - http: Para peticiones HTTP a archivos JSON y APIs
   * // - tramite40301Store: Para actualizar estado del trámite
   * // - tramite40301Query: Para consultar estado reactivo del trámite
   * ```
   *
   * @since 1.0.0
   */
  constructor(private http: HttpClient,
              private tramite40301Store: Tramite40301Store,
              private tramite40301Query: Tramite40301Query) {
  
    this.baseApiUrlTramite = `${ENVIRONMENT.API_HOST}/api/`;
  
  }

  /**
   * Establece los valores iniciales del estado del trámite 40301 en el store.
   *
   * Este método inicializa el estado del trámite CAAT Naviero con valores predeterminados
   * limpios, preparando el store para recibir nuevos datos de usuario. Es fundamental
   * llamar a este método al comenzar un nuevo proceso de captura de datos para asegurar
   * que no existan datos residuales de sesiones anteriores.
   *
   * Operaciones realizadas:
   * - Reseteo del estado del trámite a valores por defecto
   * - Limpieza de datos de formularios previos
   * - Inicialización de propiedades del estado según configuración base
   * - Preparación del store para nueva captura de datos
   *
   * @method setInitialValues
   * @returns {void} No retorna valor, pero actualiza el estado del store
   *
   * @example
   * ```typescript
   * // Inicializar al comenzar nuevo trámite:
   * ngOnInit(): void {
   *   this.capturarService.setInitialValues();
   *   // El estado queda listo para nueva captura
   * }
   *
   * // Resetear formulario:
   * onNuevoTramite(): void {
   *   this.capturarService.setInitialValues();
   *   this.formulario.reset();
   * }
   * ```
   *
   * @since 1.0.0
   */
  setInitialValues(): void {
    this.tramite40301Store.setInitialValues();
  }

  /**
   * Obtiene el estado actual del trámite 40301 como Observable reactivo.
   *
   * Este método proporciona acceso reactivo al estado completo del trámite CAAT Naviero,
   * permitiendo a los componentes suscribirse a cambios en tiempo real. El Observable
   * emite automáticamente cuando cualquier parte del estado del trámite es actualizada,
   * facilitando la sincronización de la interfaz de usuario con el estado de la aplicación.
   *
   * Funcionalidades del Observable retornado:
   * - Emisión automática en cada cambio de estado
   * - Acceso completo a todas las propiedades del trámite
   * - Sincronización reactiva con componentes suscriptos
   * - Integración con patrones RxJS para transformación de datos
   *
   * @method getTramiteState
   * @returns {Observable<Tramite40301State>} Observable que emite el estado completo del trámite 40301
   *
   * @example
   * ```typescript
   * // Suscripción básica al estado:
   * this.capturarService.getTramiteState().subscribe(estado => {
   *   console.log('Director General:', estado.directorGeneralNombre);
   *   console.log('Tipo de Agente:', estado.tipoAgente);
   *   console.log('Rol:', estado.rol);
   * });
   *
   * // Uso con async pipe en template:
   * tramiteState$ = this.capturarService.getTramiteState();
   *
   * // Transformación con operadores RxJS:
   * this.capturarService.getTramiteState().pipe(
   *   map(estado => estado.directorGeneralNombre),
   *   filter(nombre => nombre !== null)
   * ).subscribe(nombre => {
   *   this.nombreDirector = nombre;
   * });
   * ```
   *
   * @since 1.0.0
   */
  getTramiteState(): Observable<Tramite40301State> {
    return this.tramite40301Query.select();
  }

  /**
   * Obtiene la información de metadatos del proceso CAAT Naviero desde archivo de configuración.
   *
   * Este método realiza una petición HTTP GET para recuperar los metadatos específicos
   * del trámite CAAT Naviero, incluyendo títulos, etiquetas de tipos de agente, y otra
   * información descriptiva necesaria para la interfaz de usuario. Los metadatos se
   * obtienen desde un archivo JSON estático que contiene la configuración del proceso.
   *
   * @method obtenerMetaInfo
   * @returns {Observable<CaatNaviroMetaInfo>} Observable que emite los metadatos del proceso CAAT Naviero
   *
   * @example
   * ```typescript
   * // Obtener metadatos para configurar interfaz:
   * this.capturarService.obtenerMetaInfo().subscribe(metaInfo => {
   *   this.tituloFormulario = metaInfo.tutilo;
   *   this.etiquetaTipoAgente = metaInfo.tipoAgenteLabel;
   * });
   *
   * // Uso con async pipe:
   * metaInfo$ = this.capturarService.obtenerMetaInfo();
   * ```
   *
   * @since 1.0.0
   */
  obtenerMetaInfo(): Observable<CaatNaviroMetaInfo> {
    return this.http.get<CaatNaviroMetaInfo>(`${this.baseUrl}/metaData.json`);
  }

  /**
   * Obtiene los roles de usuario autorizados para el trámite CAAT Naviero desde archivo de configuración.
   *
   * Este método recupera la lista de roles que el usuario actual tiene asignados
   * y que son válidos para realizar operaciones en el trámite 40301. Los roles
   * determinan las funcionalidades disponibles y los niveles de acceso dentro
   * del proceso de registro CAAT Naviero.
   *
   * @method obtenerRolesUsuario
   * @returns {Observable<string[]>} Observable que emite un array de strings con los roles del usuario
   *
   * @example
   * ```typescript
   * // Verificar roles para habilitar funcionalidades:
   * this.capturarService.obtenerRolesUsuario().subscribe(roles => {
   *   this.puedeEditarFormulario = roles.includes('EDITOR_TRAMITE');
   *   this.puedeAprobar = roles.includes('APROBADOR');
   *   this.esAdministrador = roles.includes('ADMIN');
   * });
   *
   * // Filtrar opciones según roles:
   * this.capturarService.obtenerRolesUsuario().pipe(
   *   map(roles => this.filtrarOpcionesPorRoles(roles))
   * ).subscribe(opcionesDisponibles => {
   *   this.opcionesFormulario = opcionesDisponibles;
   * });
   * ```
   *
   * @since 1.0.0
   */
  obtenerRolesUsuario(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/userRoles.json`);
  }

  /**
   * Obtiene el catálogo de tipos de agentes disponibles para el trámite CAAT Naviero.
   *
   * Este método recupera el catálogo completo de tipos de agentes de transporte
   * naviero disponibles en el sistema. El catálogo incluye información detallada
   * sobre cada tipo de agente, sus características, y los datos necesarios para
   * poblar campos de selección en formularios de registro.
   *
   * @method getCatalogo
   * @returns {Observable<Catalogo[]>} Observable que emite un array de objetos Catalogo con los tipos de agente
   *
   * @example
   * ```typescript
   * // Cargar catálogo para combo box:
   * this.capturarService.getCatalogo().subscribe(catalogoAgentes => {
   *   this.tiposDeAgente = catalogoAgentes;
   *   this.cargarFormulario();
   * });
   *
   * // Buscar agente específico:
   * this.capturarService.getCatalogo().pipe(
   *   map(catalogo => catalogo.find(agente => agente.id === this.tipoAgenteId))
   * ).subscribe(agenteSeleccionado => {
   *   this.configurarFormularioPorTipoAgente(agenteSeleccionado);
   * });
   * ```
   *
   * @since 1.0.0
   */
  getCatalogo(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(`${this.baseUrl}/tipoAgentoData.json`);
  }

  /**
   * Obtiene el identificador único del trámite CAAT Naviero desde el servidor.
   *
   * Este método realiza una petición HTTP para recuperar el ID único asignado
   * al trámite actual. Este identificador es fundamental para el seguimiento,
   * la trazabilidad y la gestión del proceso de registro CAAT Naviero a través
   * de todos los sistemas involucrados.
   *
   * @method obtenerIdTramite
   * @returns {Observable<string>} Observable que emite el ID único del trámite como string
   *
   * @example
   * ```typescript
   * // Obtener ID para seguimiento:
   * this.capturarService.obtenerIdTramite().subscribe(idTramite => {
   *   this.tramiteId = idTramite;
   *   this.mostrarNumeroSeguimiento(idTramite);
   * });
   *
   * // Usar ID para otras operaciones:
   * this.capturarService.obtenerIdTramite().pipe(
   *   switchMap(id => this.guardarDocumentoConId(id))
   * ).subscribe(resultado => {
   *   console.log('Documento guardado con ID:', resultado);
   * });
   * ```
   *
   * @since 1.0.0
   */
  obtenerIdTramite(): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/obtenerIdTramite`);
  }

  /**
   * Actualiza el estado del formulario del trámite 40301 con los datos proporcionados.
   *
   * Este método recibe un objeto con el estado completo del trámite y actualiza
   * selectivamente las propiedades correspondientes en el store de Akita. Cada
   * propiedad se actualiza individualmente utilizando métodos específicos del
   * store, garantizando la inmutabilidad del estado y la emisión correcta de
   * eventos de cambio para componentes suscriptos.
   *
   * Propiedades actualizadas:
   * - Nombre del director general
   * - Primer apellido
   * - Segundo apellido
   * - Rol del usuario
   * - Tipo de agente seleccionado
   *
   * @method actualizarEstadoFormulario
   * @param {Tramite40301State} data - Objeto con los datos completos del estado del trámite a actualizar
   * @returns {void} No retorna valor, pero actualiza el estado del store
   *
   * @example
   * ```typescript
   * // Actualizar desde formulario:
   * onGuardarFormulario(): void {
   *   const datosFormulario: Tramite40301State = {
   *     directorGeneralNombre: this.form.get('nombre').value,
   *     primerApellido: this.form.get('primerApellido').value,
   *     segundoApellido: this.form.get('segundoApellido').value,
   *     rol: this.form.get('rol').value,
   *     tipoAgente: this.form.get('tipoAgente').value
   *   };
   *   this.capturarService.actualizarEstadoFormulario(datosFormulario);
   * }
   *
   * // Actualizar con datos parciales:
   * const estadoParcial = { directorGeneralNombre: 'Nuevo Nombre' };
   * this.capturarService.actualizarEstadoFormulario(estadoParcial);
   * ```
   *
   * @since 1.0.0
   */
  actualizarEstadoFormulario(data: Tramite40301State): void {
    this.tramite40301Store.setDirectorGeneralNombre(data.directorGeneralNombre);
    this.tramite40301Store.setPrimerApellido(data.primerApellido);
    this.tramite40301Store.setSegundoApellido(data.segundoApellido);
    this.tramite40301Store.setRol(data.rol);
    this.tramite40301Store.setTipoAgente(data.tipoAgente);
  }

  /**
   * Recupera los datos previamente guardados del trámite desde archivo de configuración.
   *
   * Este método obtiene el estado completo de un trámite que fue guardado anteriormente,
   * permitiendo la recuperación de sesiones de trabajo previas o la continuación de
   * procesos de registro que fueron interrumpidos. Los datos incluyen toda la información
   * capturada en formularios y el estado de progreso del trámite.
   *
   * @method getTramiteSavedData
   * @returns {Observable<Tramite40301State>} Observable que emite el estado completo del trámite guardado
   *
   * @example
   * ```typescript
   * // Recuperar sesión anterior:
   * ngOnInit(): void {
   *   this.capturarService.getTramiteSavedData().subscribe(datosGuardados => {
   *     this.cargarDatosEnFormulario(datosGuardados);
   *     this.mostrarMensajeRecuperacion('Sesión anterior recuperada');
   *   });
   * }
   *
   * // Verificar si existen datos guardados:
   * this.capturarService.getTramiteSavedData().pipe(
   *   map(datos => datos && Object.keys(datos).length > 0)
   * ).subscribe(tieneDatosGuardados => {
   *   if (tieneDatosGuardados) {
   *     this.mostrarDialogoRecuperacion();
   *   }
   * });
   * ```
   *
   * @since 1.0.0
   */
  getTramiteSavedData(): Observable<Tramite40301State> {
    return this.http.get<Tramite40301State>(`${this.baseUrl}/tramiteSavedData.json`);
  }  

  
  /**
   * Metodo que ejecuta el llamado al api de iniciar solicitud.
   *
   * @param {IniciarSolicitudRequest} iniciarSolicitudRequest
   * @return {*}  {Observable<BaseResponse<IniciarSolicitudResponse>>}
   * @memberof CapturarService
   */
  iniciarTramite(iniciarSolicitudRequest: IniciarSolicitudRequest): Observable<BaseResponse<IniciarSolicitudResponse>>{    
    const ENDPOINT = `${CONSTRUIR_ENDPOINT_INICIAR('40301')}`;        
    return this.http.post<BaseResponse<IniciarSolicitudResponse>>(ENDPOINT,iniciarSolicitudRequest).pipe(       
        catchError((error) => {
          console.error(`[SolicitudService] Error en guardarTramite:`, error);
          return throwError(() => error);
        })
    );
  }
  
  
  /**
   * Metodo que ejecuta el llamado al api de guardar solicitud.
   *
   * @param {GuardarSolicitudRequest} guardarTramiteRequest
   * @return {*}  {Observable<BaseResponse<GuardarSolicitudResponse>>}
   * @memberof CapturarService
   */
  guardarTramite(guardarTramiteRequest: GuardarSolicitudRequest): Observable<BaseResponse<GuardarSolicitudResponse>>{    
    const ENDPOINT = `${this.baseApiUrlTramite}${GUARDAR_SOLICITUD('40301')}`;    

    return this.http.post<BaseResponse<GuardarSolicitudResponse>>(ENDPOINT,guardarTramiteRequest).pipe(       
        catchError((error) => {
          console.error(`[SolicitudService] Error en guardarTramite:`, error);
          return throwError(() => error);
        })
    );
  }
  
}