import { ApiResponse, Catalogo, ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { ApiResponseChofer, ChoferesExtranjeros, DatosDelChoferNacional, DirectorGeneralData } from '../models/registro-muestras-mercancias.model';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { Chofer40101Store } from './chofer40101.store';
import { DatosDelVehículo } from '@libs/shared/data-access-user/src/core/models/40101/transportista-terrestre.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Servicio para gestionar datos relacionados con choferes y vehículos en el contexto del trámite 40101.
 * Proporciona métodos para agregar choferes, obtener datos de choferes nacionales, y consultar catálogos relacionados.
 * 
 * @author Ultrasist
 * @version 1.0
 * @since 2025
 */
@Injectable({
  providedIn: 'root',
})
export class Chofer40101Service {
  /**
   * Host base de la API (por ejemplo: https://api-v30.cloud-ultrasist.net).
   * Se utiliza para construir las URLs absolutas de los servicios.
   */
  host: string;

  url = '../../../../../assets/json/40101/';
  /**
   * URL base del servidor para realizar solicitudes HTTP.
   */
  private urlServer = 'https://dev.v30.ultrasist.net/api/json-auxiliar';

  private static getApiHeaders(): HttpHeaders {
    const CLAVEUSUARIO = localStorage.getItem('ClaveUsuario') || '';
    const RFC = localStorage.getItem('Rfc') || '';
    const CVEROLE = localStorage.getItem('CveRole') || '';

    return new HttpHeaders({
      'ClaveUsuario': CLAVEUSUARIO,
      'Rfc': RFC,
      'CveRole': CVEROLE
    });
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
    this.chofer40101Store.update((state) => ({
      ...state,
      //directorGeneral: data,
      nombre: data.nombre,
      primerApellido: data.primerApellido,
      segundoApellido: data.segundoApellido,
      apellidoPaterno: data.primerApellido,
      apellidoMaternoCHN: data.apellidoMaternoCHN,
    }));
  }

  /**
   * Sujeto de comportamiento que almacena la lista de choferes.
   */
  private choferesListSubject = new BehaviorSubject<DatosDelVehículo[]>([]);

  /**
   * Observable que expone la lista de choferes.
   */
  choferesList$ = this.choferesListSubject.asObservable();

  /**
   * Constructor del servicio.
   * Inicializa los datos almacenados en el almacenamiento local y actualiza el estado de la tienda Akita.
   * 
   * @param chofer40101Store Tienda Akita para gestionar el estado de los choferes.
   * @param http Cliente HTTP para realizar solicitudes al servidor.
   */
  constructor(
    private chofer40101Store: Chofer40101Store,
    private http: HttpClient
  ) {
    this.host = ENVIRONMENT.API_HOST;
    const STORE_DATA = localStorage.getItem('choferesList');
    if (STORE_DATA) {
      this.choferesListSubject.next(JSON.parse(STORE_DATA));
    }
  }

  /**
   * Obtiene los datos de choferes nacionales.
   * 
   * @returns Un observable con la lista de datos de choferes nacionales.
   */
  getChoferNacionalData(): Observable<DatosDelVehículo[]> {
    return this.http.get<DatosDelVehículo[]>(this.urlServer);
  }

  /**
   * Obtiene la lista de estados.
   * 
   * @returns Un observable con la lista de estados.
   */
  getEstados(): Observable<{ clave: string; descripcion: string }[]> {
    return this.http.get<{ clave: string; descripcion: string }[]>(
      `${this.urlServer}/estados`
    );
  }

  /**
   * Obtiene la lista de municipios de un estado específico.
   * 
   * @param claveEstado La clave del estado.
   * @returns Un observable con la lista de municipios.
   */
  getMunicipios(
    claveEstado: string
  ): Observable<{ clave: string; descripcion: string }[]> {
    return this.http.get<{ clave: string; descripcion: string }[]>(
      `${this.urlServer}/municipios?estado=${claveEstado}`
    );
  }

  /**
   * Obtiene la lista de colonias de un municipio específico.
   * 
   * @param claveMunicipio La clave del municipio.
   * @returns Un observable con la lista de colonias.
   */
  getColonias(
    claveMunicipio: string
  ): Observable<{ clave: string; descripcion: string }[]> {
    return this.http.get<{ clave: string; descripcion: string }[]>(
      `${this.urlServer}/colonias?municipio=${claveMunicipio}`
    );
  }

  /**
   * Obtiene el catálogo de tipos de vehículos de arrastre.
   * 
   * @returns Un observable con el catálogo de tipos de vehículos de arrastre.
   */
  getTipoVehiculoArrastreAGA(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      '/assets/json/40101/tipo-vehiculo-arrastre.json'
    );
  }


  /**
   * Obtiene el catálogo de países emisores.
   * 
   * @returns Un observable con el catálogo de países emisores.
   */
  getPaisEmisor(): Observable<Catalogo[]> {
    return this.http.get<ApiResponse<Catalogo>>(`${this.host}/api/sat-t40101/catalogo/paises`, { headers: Chofer40101Service.getApiHeaders() })
      .pipe(
        map(response => response.datos),
        catchError(error => {
          console.error('Error fetching countries:', error);
          return of([]);
        })
      );
  }

  /**
   * Obtiene el catálogo de colores de vehículos.
   * 
   * @returns Un observable con el catálogo de colores de vehículos.
   */
  getcolorAGA(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/40101/color-catalogo.json');
  }

  /**
   * Obtiene el catálogo de países emisores de la segunda placa.
   * 
   * @returns Un observable con el catálogo de países emisores de la segunda placa.
   */
  getpaisEmisor2DaPlacaData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      '/assets/json/40101/pais-emisor-2da-placa.json'
    );
  }

  /**
   * Obtiene el catálogo de colores de vehículos para solicitudes.
   * 
   * @returns Un observable con el catálogo de colores de vehículos.
   */
  getsolicitudVehiculoColor(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/40101/vehiculo-color.json');
  }

  /**
   * Obtiene el catálogo de países de origen.
   * 
   * @returns Un observable con el catálogo de países de origen.
   */
  getPaisOrigenChn(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/40101/pais-origen.json');
  }

  /**
   * Obtiene el catálogo de delegaciones.
   * 
   * @returns Un observable con el catálogo de delegaciones.
   */
  getDelegacionChn(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/40101/municipio.json');
  }

  /**
   * Obtiene la lista de estados desde un archivo JSON local.
   *
   * @returns {Observable<Catalogo[]>} Un observable que emite la lista de estados.
   */
  getEstado(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/40101/estado.json');
  }

  /**
   * Obtiene la lista de estados desde un archivo JSON local.
   *
   * @returns {Observable<Catalogo[]>} Un observable que emite la lista de estados.
   */
  getEstadosPorPais(id: number): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/40101/estado.json');
  }


  /**
  * Obtiene la lista de estados desde un archivo JSON local.
  *
  * @returns {Observable<Catalogo[]>} Un observable que emite la lista de estados.
  */
  getEstadosPorPaisMex(): Observable<Catalogo[]> {
    return this.http.get<ApiResponse<Catalogo>>(`${this.host}/api/sat-t40101/catalogo/entidades-federativas`, { headers: Chofer40101Service.getApiHeaders() })
      .pipe(
        map(response => response.datos),
        catchError(error => {
          console.error('Error fetching Estados:', error);
          return of([]);
        })
      );
  }


  getMunicipiosPorEstado(
    claveEstado: string
  ): Observable<Catalogo[]> {
    return this.http.get<ApiResponse<Catalogo>>(`${this.host}/api/sat-t40101/catalogo/entidad-federativa/${claveEstado}/municipio-o-alcaldia`, { headers: Chofer40101Service.getApiHeaders() })
      .pipe(
        map(response => response.datos),
        catchError(error => {
          console.error('Error fetching Municipios:', error);
          return of([]);
        })
      );
  }
  /**
   * Obtiene la lista de colonias de un municipio específico.
   * 
   * @param claveMunicipio La clave del municipio.
   * @returns Un observable con la lista de colonias.
   */
  getColoniasPorMunicipio(
    clave: string
  ): Observable<Catalogo[]> {
    return this.http.get<ApiResponse<Catalogo>>(`${this.host}/api/sat-t40101/catalogo/municipio-o-alcaldia/${clave}/colonia`, { headers: Chofer40101Service.getApiHeaders() })
      .pipe(
        map(response => response.datos),
        catchError(error => {
          console.error('Error fetching Colonia:', error);
          return of([]);
        })
      );
  }


  /**
   * Obtiene el catálogo de colonias.
   * 
   * @returns Un observable con el catálogo de colonias.
   */
  getColoniaChn(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/40101/colonia.json');
  }

  /**
   * Obtiene el catálogo de nacionalidades.
   * 
   * @returns Un observable con el catálogo de nacionalidades.
   */
  getNacionaliDadChe(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/40101/nacionalidad.json');
  }

  /**
   * Obtiene el catálogo de choferes.
   * 
   * @returns Un observable con el catálogo de choferes.
   */
  getChoferData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/40101/chofer.json');
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
   * Obtiene los datos de una tabla desde un archivo JSON.
   *
   * @template T El tipo genérico de los datos que se espera recibir.
   * @param {string} fileName - Nombre del archivo JSON que contiene los datos.
   * @returns {Observable<T[]>} Un observable que emite la lista de datos del archivo JSON.
   */
  obtenerDatos(nss: string): Observable<ApiResponseChofer> {
    const FULL_URL = `${this.host}/api/sat-t40101/chofer/detalles/nss/${nss}`;
    return this.http.get<ApiResponseChofer>(FULL_URL, { headers: Chofer40101Service.getApiHeaders() });
  }

  loadInitialDrivers(type: 'nacional' | 'extranjero', drivers: (DatosDelChoferNacional | ChoferesExtranjeros)[]): void {
    this.chofer40101Store.loadInitialDrivers(type, drivers);
  }

  guardarDatosFirma(datos: { id_solicitud: number; cadena_original: string, is_extranjero: boolean }): void {
    this.chofer40101Store.update({
      id_solicitud: datos.id_solicitud,
      cadena_original: datos.cadena_original,

    });
  }
}