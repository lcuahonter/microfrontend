/**
 * @fileoverview Servicio para la gestión de choferes en el trámite 40102
 * 
 * Este archivo contiene el servicio responsable de gestionar todos los aspectos
 * relacionados con choferes y vehículos en el contexto del trámite 40102 del sistema AGA.
 * Incluye funcionalidades para consultar catálogos, obtener datos de choferes nacionales
 * y extranjeros, y actualizar el estado en la tienda Akita.
 * 
 * El servicio actúa como intermediario entre los componentes y las fuentes de datos,
 * proporcionando una interfaz unificada para acceder a información de choferes,
 * vehículos, catálogos geográficos y otros datos relacionados.
 * 
 * @author Ultrasist
 * @version 1.0
 * @since 2025
 * @module Chofer40102Service
 */

import { BehaviorSubject, Observable } from 'rxjs'; 
import { ChoferesExtranjeros, DatosDelChoferNacional, DirectorGeneralData } from '../models/registro-muestras-mercancias.model';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { Chofer40102Store } from './chofer40102.store';
import { DatosDelVehículo } from '@libs/shared/data-access-user/src/core/models/40102/transportista-terrestre.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Servicio para gestionar datos relacionados con choferes y vehículos en el contexto del trámite 40102.
 * 
 * Esta clase proporciona métodos para:
 * - Obtener catálogos de diversos tipos (países, estados, municipios, colonias, etc.)
 * - Consultar datos de choferes nacionales y extranjeros
 * - Actualizar el estado de la aplicación mediante la tienda Akita
 * - Gestionar la lista de choferes en memoria y localStorage
 * - Obtener información del Director General
 * 
 * El servicio centraliza todas las operaciones relacionadas con choferes y vehículos,
 * proporcionando una interfaz consistente para el acceso a datos tanto locales como remotos.
 * 
 * @author Ultrasist
 * @version 1.0
 * @since 2025
 * 
 * @example
 * ```typescript
 * // Inyectar el servicio en un componente
 * constructor(private choferService: Chofer40102Service) {}
 * 
 * // Obtener lista de estados
 * this.choferService.getEstado().subscribe(estados => {
 *   console.log('Estados disponibles:', estados);
 * });
 * 
 * // Actualizar datos del chofer nacional
 * const choferes: DatosDelChoferNacional[] = [...];
 * this.choferService.updateDatosDelChoferNacional(choferes);
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class Chofer40102Service {
  /**
   * URL base para archivos JSON locales utilizados en el trámite 40102.
   * Ruta relativa a los archivos de configuración y catálogos en formato JSON.
   * 
   * @property {string} url
   * @readonly
   */
  url = '../../../../../assets/json/40102/';
  
  /**
   * URL base del servidor para realizar solicitudes HTTP a APIs externas.
   * Utilizada para consultas de datos dinámicos como estados, municipios y colonias.
   * 
   * @property {string} urlServer
   * @private
   * @readonly
   */
  private urlServer = 'https://dev.v30.ultrasist.net/api/json-auxiliar';

  /**
   * Sujeto de comportamiento que almacena la lista de choferes en memoria.
   * Permite la comunicación reactiva entre componentes sobre cambios en la lista de choferes.
   * 
   * @property {BehaviorSubject<DatosDelVehículo[]>} choferesListSubject
   * @private
   */
  private choferesListSubject = new BehaviorSubject<DatosDelVehículo[]>([]);

  /**
   * Observable que expone la lista de choferes para suscripción por parte de componentes.
   * Proporciona acceso de solo lectura a los datos de choferes.
   * 
   * @property {Observable<DatosDelVehículo[]>} choferesList$
   * @readonly
   */
  choferesList$ = this.choferesListSubject.asObservable();

  /**
   * Constructor del servicio Chofer40102Service.
   * 
   * Inicializa el servicio configurando la lista de choferes desde localStorage si existe.
   * Establece la conexión con la tienda Akita para gestión de estado y configura
   * el cliente HTTP para comunicación con servicios externos.
   * 
   * Al instanciar el servicio, se recuperan automáticamente los datos almacenados
   * localmente y se actualizan los observables correspondientes.
   * 
   * @param {Chofer40102Store} chofer40102Store - Tienda Akita para gestionar el estado de los choferes
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes al servidor
   * 
   * @example
   * ```typescript
   * // El constructor se invoca automáticamente por Angular DI
   * // No es necesario llamarlo manualmente
   * constructor(private choferService: Chofer40102Service) {
   *   // El servicio ya está inicializado con datos de localStorage
   * }
   * ```
   */
  constructor(
    private chofer40102Store: Chofer40102Store,
    private http: HttpClient
  ) {
    const STORE_DATA = localStorage.getItem('choferesList');
    if (STORE_DATA) {
      this.choferesListSubject.next(JSON.parse(STORE_DATA));
    }
  }

  /**
   * Obtiene los datos de choferes nacionales desde el servidor.
   * 
   * Realiza una consulta HTTP GET al servidor para recuperar información
   * detallada de choferes nacionales. Los datos incluyen información personal,
   * documentos de identificación y datos del vehículo asociado.
   * 
   * @returns {Observable<DatosDelVehículo[]>} Observable que emite la lista de datos de choferes nacionales
   * 
   * @example
   * ```typescript
   * this.choferService.getChoferNacionalData().subscribe({
   *   next: (choferes) => {
   *     console.log('Choferes nacionales:', choferes);
   *     this.processChoferesData(choferes);
   *   },
   *   error: (error) => {
   *     console.error('Error al obtener choferes:', error);
   *   }
   * });
   * ```
   */
  getChoferNacionalData(): Observable<DatosDelVehículo[]> {
    return this.http.get<DatosDelVehículo[]>(this.urlServer);
  }

  /**
   * Obtiene la lista de estados desde el servidor.
   * 
   * Consulta dinámicamente la lista de estados disponibles desde una API externa.
   * Cada estado incluye una clave única y su descripción correspondiente.
   * 
   * @returns {Observable<{clave: string; descripcion: string}[]>} Observable que emite la lista de estados
   * 
   * @example
   * ```typescript
   * this.choferService.getEstados().subscribe({
   *   next: (estados) => {
   *     this.estadosDisponibles = estados;
   *     console.log('Estados cargados:', estados.length);
   *   },
   *   error: (error) => {
   *     console.error('Error al cargar estados:', error);
   *   }
   * });
   * ```
   */
  getEstados(): Observable<{ clave: string; descripcion: string }[]> {
    return this.http.get<{ clave: string; descripcion: string }[]>(
      `${this.urlServer}/estados`
    );
  }

  /**
   * Obtiene la lista de municipios pertenecientes a un estado específico.
   * 
   * Consulta los municipios disponibles para un estado dado, utilizando su clave
   * como parámetro de filtrado. Útil para formularios en cascada donde primero
   * se selecciona el estado y luego el municipio.
   * 
   * @param {string} claveEstado - La clave única del estado para filtrar municipios
   * @returns {Observable<{clave: string; descripcion: string}[]>} Observable que emite la lista de municipios
   * 
   * @example
   * ```typescript
   * const claveEstado = '09'; // CDMX
   * this.choferService.getMunicipios(claveEstado).subscribe({
   *   next: (municipios) => {
   *     this.municipiosDelEstado = municipios;
   *     console.log(`Municipios de ${claveEstado}:`, municipios);
   *   },
   *   error: (error) => {
   *     console.error('Error al obtener municipios:', error);
   *   }
   * });
   * ```
   */
  getMunicipios(
    claveEstado: string
  ): Observable<{ clave: string; descripcion: string }[]> {
    return this.http.get<{ clave: string; descripcion: string }[]>(
      `${this.urlServer}/municipios?estado=${claveEstado}`
    );
  }

  /**
   * Obtiene la lista de colonias pertenecientes a un municipio específico.
   * 
   * Consulta las colonias disponibles para un municipio dado, utilizando su clave
   * como parámetro de filtrado. Completa la cadena geográfica estado -> municipio -> colonia
   * para proporcionar información detallada de ubicación.
   * 
   * @param {string} claveMunicipio - La clave única del municipio para filtrar colonias
   * @returns {Observable<{clave: string; descripcion: string}[]>} Observable que emite la lista de colonias
   * 
   * @example
   * ```typescript
   * const claveMunicipio = '001'; // Municipio específico
   * this.choferService.getColonias(claveMunicipio).subscribe({
   *   next: (colonias) => {
   *     this.coloniasDelMunicipio = colonias;
   *     console.log(`Colonias del municipio ${claveMunicipio}:`, colonias);
   *   },
   *   error: (error) => {
   *     console.error('Error al obtener colonias:', error);
   *   }
   * });
   * ```
   */
  getColonias(
    claveMunicipio: string
  ): Observable<{ clave: string; descripcion: string }[]> {
    return this.http.get<{ clave: string; descripcion: string }[]>(
      `${this.urlServer}/colonias?municipio=${claveMunicipio}`
    );
  }

  /**
   * Obtiene el catálogo de tipos de vehículos de arrastre específicos para AGA.
   * 
   * Consulta un archivo JSON local que contiene los tipos de vehículos de arrastre
   * autorizados para operaciones aduaneras. Incluye información como tractocamiones,
   * remolques, semirremolques y otros vehículos de carga.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite el catálogo de tipos de vehículos de arrastre
   * 
   * @example
   * ```typescript
   * this.choferService.getTipoVehiculoArrastreAGA().subscribe({
   *   next: (tiposVehiculo) => {
   *     this.tiposVehiculoArrastre = tiposVehiculo;
   *     console.log('Tipos de vehículo de arrastre:', tiposVehiculo);
   *   },
   *   error: (error) => {
   *     console.error('Error al cargar tipos de vehículo:', error);
   *   }
   * });
   * ```
   */
  getTipoVehiculoArrastreAGA(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      '/assets/json/40102/tipo-vehiculo-arrastre.json'
    );
  }

  /**
   * Obtiene el catálogo de países emisores para documentos y licencias.
   * 
   * Consulta un archivo JSON local que contiene la lista de países que pueden
   * emitir documentos válidos como licencias de conducir, pasaportes y otros
   * documentos de identificación reconocidos por el sistema aduanero.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite el catálogo de países emisores
   * 
   * @example
   * ```typescript
   * this.choferService.getPaisEmisor().subscribe({
   *   next: (paises) => {
   *     this.paisesEmisores = paises;
   *     console.log('Países emisores disponibles:', paises);
   *   },
   *   error: (error) => {
   *     console.error('Error al cargar países emisores:', error);
   *   }
   * });
   * ```
   */
  getPaisEmisor(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/40102/pais-catalogo.json');
  }

  /**
   * Obtiene el catálogo de colores de vehículos para operaciones AGA.
   * 
   * Consulta un archivo JSON local que contiene los colores estándar reconocidos
   * para vehículos en operaciones aduaneras. Los colores están codificados según
   * estándares internacionales para facilitar la identificación vehicular.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite el catálogo de colores de vehículos
   * 
   * @example
   * ```typescript
   * this.choferService.getcolorAGA().subscribe({
   *   next: (colores) => {
   *     this.coloresVehiculo = colores;
   *     console.log('Colores de vehículo disponibles:', colores);
   *   },
   *   error: (error) => {
   *     console.error('Error al cargar colores:', error);
   *   }
   * });
   * ```
   */
  getcolorAGA(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/40102/color-catalogo.json');
  }

  /**
   * Obtiene el catálogo de países emisores para segundas placas vehiculares.
   * 
   * Consulta un archivo JSON local que contiene la lista de países autorizados
   * para emitir segundas placas o placas adicionales en vehículos de transporte
   * internacional. Estas placas son comunes en vehículos que operan en múltiples países.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite el catálogo de países emisores de segunda placa
   * 
   * @example
   * ```typescript
   * this.choferService.getpaisEmisor2DaPlacaData().subscribe({
   *   next: (paises) => {
   *     this.paisesSegundaPlaca = paises;
   *     console.log('Países para segunda placa:', paises);
   *   },
   *   error: (error) => {
   *     console.error('Error al cargar países de segunda placa:', error);
   *   }
   * });
   * ```
   */
  getpaisEmisor2DaPlacaData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      '/assets/json/40102/pais-emisor-2da-placa.json'
    );
  }

  /**
   * Obtiene el catálogo de colores específico para solicitudes de vehículos.
   * 
   * Consulta un archivo JSON local que contiene los colores autorizados específicamente
   * para solicitudes de registro vehicular. Puede diferir del catálogo general de colores
   * al incluir opciones específicas para procesos de solicitud.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite el catálogo de colores para solicitudes de vehículo
   * 
   * @example
   * ```typescript
   * this.choferService.getsolicitudVehiculoColor().subscribe({
   *   next: (colores) => {
   *     this.coloresSolicitud = colores;
   *     console.log('Colores para solicitud:', colores);
   *   },
   *   error: (error) => {
   *     console.error('Error al cargar colores de solicitud:', error);
   *   }
   * });
   * ```
   */
  getsolicitudVehiculoColor(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/40102/vehiculo-color.json');
  }

  /**
   * Obtiene el catálogo de países de origen para choferes (CHN - Chofer Nacional).
   * 
   * Consulta un archivo JSON local que contiene la lista de países de origen
   * reconocidos para choferes que operan en territorio nacional. Incluye información
   * relevante para la identificación y clasificación de conductores por origen.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite el catálogo de países de origen
   * 
   * @example
   * ```typescript
   * this.choferService.getPaisOrigenChn().subscribe({
   *   next: (paises) => {
   *     this.paisesOrigen = paises;
   *     console.log('Países de origen para CHN:', paises);
   *   },
   *   error: (error) => {
   *     console.error('Error al cargar países de origen:', error);
   *   }
   * });
   * ```
   */
  getPaisOrigenChn(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/40102/pais-origen.json');
  }

  /**
   * Obtiene el catálogo de delegaciones para choferes nacionales (CHN).
   * 
   * Consulta un archivo JSON local que contiene las delegaciones o municipios
   * donde pueden registrarse choferes nacionales. Proporciona información
   * jurisdiccional necesaria para el registro y seguimiento de conductores.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite el catálogo de delegaciones
   * 
   * @example
   * ```typescript
   * this.choferService.getDelegacionChn().subscribe({
   *   next: (delegaciones) => {
   *     this.delegacionesDisponibles = delegaciones;
   *     console.log('Delegaciones CHN:', delegaciones);
   *   },
   *   error: (error) => {
   *     console.error('Error al cargar delegaciones:', error);
   *   }
   * });
   * ```
   */
  getDelegacionChn(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/40102/municipio.json');
  }

  /**
   * Obtiene la lista de estados desde un archivo JSON local.
   *
   * @returns {Observable<Catalogo[]>} Un observable que emite la lista de estados.
   */
  getEstado(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/40102/estado.json');
  }

  /**
   * Obtiene la lista de estados desde un archivo JSON local.
   *
   * @returns {Observable<Catalogo[]>} Un observable que emite la lista de estados.
   */
  getEstadosPorPais(_id: number): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/40102/estado.json');
  }

  getMunicipiosPorEstado(
    _claveEstado: number
  ): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(`/assets/json/40102/municipio.json`);
  }
  /**
   * Obtiene la lista de colonias de un municipio específico.
   * 
   * @param claveMunicipio La clave del municipio.
   * @returns Un observable con la lista de colonias.
   */
  getColoniasPorMunicipio(
        _municipiosId: number
  ): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      `/assets/json/40102/colonia.json`
    );
  }


  /**
   * Obtiene el catálogo de colonias.
   * 
   * @returns Un observable con el catálogo de colonias.
   */
  getColoniaChn(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/40102/colonia.json');
  }

  /**
   * Obtiene el catálogo de nacionalidades.
   * 
   * @returns Un observable con el catálogo de nacionalidades.
   */
  getNacionaliDadChe(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/40102/nacionalidad.json');
  }

  /**
   * Obtiene el catálogo de choferes.
   * 
   * @returns Un observable con el catálogo de choferes.
   */
  getChoferData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/40102/chofer.json');
  }

  /**
   * Obtiene los datos de una tabla desde un archivo JSON.
   *
   * @template T El tipo genérico de los datos que se espera recibir.
   * @param {string} fileName - Nombre del archivo JSON que contiene los datos.
   * @returns {Observable<T[]>} Un observable que emite la lista de datos del archivo JSON.
   */
  obtenerTablaDatos<T>(fileName: string): Observable<T[]> {
    const JSONURL = this.url + fileName;
    return this.http.get<T[]>(JSONURL);
  }

  /**
   * Recupera datos simulados para el Director General.
   *
   * Envía una solicitud HTTP GET para obtener los datos del Director General desde un archivo JSON simulado.
   *
   * @returns Un Observable que emite el objeto DirectorGeneralData.
   */
  getDirectorGeneralData(): Observable<DirectorGeneralData> {
    return this.http.get<DirectorGeneralData>(`${this.url}director-general-mockdata.json`);
  }

  /**
   * Actualiza la propiedad `directorGeneral` en la tienda con los datos proporcionados.
   *
   * @param data - El nuevo objeto `DirectorGeneralData` que se establecerá como la información del director general.
   */
  updateStateDirectorGeneralData(data: DirectorGeneralData): void {
    this.chofer40102Store.update((state) => ({
      ...state,
      //directorGeneral: data,
      nombre: data.nombre,
      primerApellido: data.primerApellido,
      segundoApellido: data.segundoApellido,
      apellidoPaterno: data.primerApellido,
      apellidoMaternoCHN: data.apellidoMaternoCHN,
    }));
  }

  updateDatosDelChoferNacional(data: DatosDelChoferNacional[]): void {
    this.chofer40102Store.update((state) => ({
      ...state,
      datosDelChoferNacionalAlta: data
    }));
  }

  updateDatosDelChoferNacionalModification(data: DatosDelChoferNacional[]): void {
    this.chofer40102Store.update((state) => ({
      ...state,
      datosDelChoferNacionalModification: data
    }));
  }

  updateDatosDelChoferNacionalRetirada(data: DatosDelChoferNacional[]): void {
    this.chofer40102Store.update((state) => ({
      ...state,
      datosDelChoferNacionalRetirada: data
    }));
  }

  updateDatosDelChoferExtranjero(data: ChoferesExtranjeros[]): void {
    this.chofer40102Store.update((state) => ({
      ...state,
      datosDelChoferExtranjerosAlta: data
    }));
  }

  updateDatosDelChoferExtranjeroModification(data: ChoferesExtranjeros[]): void {
    this.chofer40102Store.update((state) => ({
      ...state,
      datosDelChoferExtranjerosModification: data
    }));
  }

  updateDatosDelChoferExtranjeroRetirada(data: ChoferesExtranjeros[]): void {
    this.chofer40102Store.update((state) => ({
      ...state,
      datosDelChoferExtranjerosRetirada: data
    }));
  }
}