import { Catalogo, RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { MercanciasTabla, RespuestaTabla } from '../modelos/modificación-del-permiso-sanitario-de-importación-de-insumo.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


// Interface para el representante legal
export interface RepresentanteLegal {
  rfc: string;
  nombreDenominacionORazonSocial: string;
}

/**
 * Servicio para gestionar las operaciones relacionadas con el domicilio del establecimiento.
 * 
 * Este servicio proporciona métodos para obtener datos de tablas, estados y mercancías
 * necesarios para la modificación del permiso sanitario de importación de insumos.
 * 
 * @author [Nombre del desarrollador]
 * @version 1.0.0
 * @since 2024
 * 
 * @example
 * ```typescript
 * constructor(private domicilioService: DomicilioDelEstablecimientoService) {}
 * 
 * ngOnInit() {
 *   this.domicilioService.obtenerTablaDatos().subscribe(datos => {
 *     console.log(datos);
 *   });
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class DomicilioDelEstablecimientoService {
  
  /**
   * URL del archivo JSON que contiene los datos de la tabla principal.
   * 
   * @private
   * @readonly
   * @type {string}
   * @memberof DomicilioDelEstablecimientoService
   */
  private readonly tablaDatosUrl =
    '../../../../../assets/json/260912/tablaDatos.json';
  
  /**
   * URL del archivo JSON que contiene la lista de estados disponibles.
   * 
   * @private
   * @readonly
   * @type {string}
   * @memberof DomicilioDelEstablecimientoService
   */
  private readonly estadoListUrl =
    '../../../../../assets/json/260912/seleccion.json';
  
  /**
   * URL del archivo JSON que contiene los datos de mercancías.
   * 
   * @private
   * @readonly
   * @type {string}
   * @memberof DomicilioDelEstablecimientoService
   */
  private readonly mercanciasDatosUrl =
    '../../../../../assets/json/260912/mercanciasDatos.json';

  /**
   * Constructor del servicio DomicilioDelEstablecimientoService.
   * 
   * Inicializa las dependencias necesarias para el funcionamiento del servicio,
   * específicamente el cliente HTTP para realizar peticiones a los archivos JSON.
   * 
   * @param {HttpClient} http - Cliente HTTP de Angular para realizar peticiones HTTP
   * 
   * @memberof DomicilioDelEstablecimientoService
   */
  constructor(private http: HttpClient) {
    // Constructor - Inicialización de dependencias
  }

  /**
   * Obtiene los datos de la tabla NICO desde el archivo JSON correspondiente.
   * 
   * Este método realiza una petición HTTP GET para recuperar los datos de la tabla
   * principal utilizada en el proceso de modificación del permiso sanitario.
   * 
   * @returns {Observable<RespuestaTabla>} Observable que emite los datos de la tabla NICO
   * 
   * @throws {Error} Puede lanzar errores relacionados con la petición HTTP
   * 
   * @example
   * ```typescript
   * this.domicilioService.obtenerTablaDatos().subscribe({
   *   next: (datos) => {
   *     console.log('Datos de tabla obtenidos:', datos);
   *     this.tablaDatos = datos;
   *   },
   *   error: (error) => {
   *     console.error('Error al obtener datos de tabla:', error);
   *   }
   * });
   * ```
   * 
   * @see {@link RespuestaTabla} Para más información sobre la estructura de respuesta
   * @memberof DomicilioDelEstablecimientoService
   */
  obtenerTablaDatos(): Observable<RespuestaTabla> {
    return this.http.get<RespuestaTabla>(this.tablaDatosUrl);
  }

  /**
   * Obtiene la lista de estados disponibles desde el archivo JSON de selección.
   * 
   * Este método recupera los catálogos de estados que pueden ser utilizados
   * en los formularios de domicilio del establecimiento.
   * 
   * @returns {Observable<RespuestaCatalogos>} Observable que emite la lista de estados disponibles
   * 
   * @throws {Error} Puede lanzar errores relacionados con la petición HTTP
   * 
   * @example
   * ```typescript
   * this.domicilioService.obtenerEstadoList().subscribe({
   *   next: (estados) => {
   *     console.log('Estados obtenidos:', estados);
   *     this.listaEstados = estados.catalogos;
   *   },
   *   error: (error) => {
   *     console.error('Error al obtener estados:', error);
   *   }
   * });
   * ```
   * 
   * @see {@link RespuestaCatalogos} Para más información sobre la estructura de respuesta
   * @memberof DomicilioDelEstablecimientoService
   */
  obtenerEstadoList(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(this.estadoListUrl);
  }

  /**
   * Obtiene los datos de mercancías desde el archivo JSON correspondiente.
   * 
   * Este método recupera la información de las mercancías asociadas al proceso
   * de modificación del permiso sanitario de importación de insumos.
   * 
   * @returns {Observable<MercanciasTabla>} Observable que emite los datos de mercancías
   * 
   * @throws {Error} Puede lanzar errores relacionados con la petición HTTP
   * 
   * @example
   * ```typescript
   * this.domicilioService.obtenerMercanciasDatos().subscribe({
   *   next: (mercancias) => {
   *     console.log('Mercancías obtenidas:', mercancias);
   *     this.datosMercancias = mercancias;
   *   },
   *   error: (error) => {
   *     console.error('Error al obtener mercancías:', error);
   *   }
   * });
   * ```
   * 
   * @see {@link MercanciasTabla} Para más información sobre la estructura de respuesta
   * @memberof DomicilioDelEstablecimientoService
   */
  obtenerMercanciasDatos(): Observable<MercanciasTabla> {
    return this.http.get<MercanciasTabla>(this.mercanciasDatosUrl);
  }

  /**
   * Obtiene la lista de representaciones federales desde un archivo JSON local.
   * @returns Observable que emite los datos de las representaciones federales.
   */
  getRepresentacion(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/260911/descriptionClave.json');
  }

  /**
   * Obtiene la lista de entidades federativas desde un archivo JSON local.
   * @returns Observable que emite los datos de las entidades federativas.
   */
  getEntidad(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/260911/clavescian.json');
  }

    buscarRepresentanteLegalPorRFC(
      rfc: string
    ): Observable<{ nombre: string; apellidoPaterno: string; apellidoMaterno: string } | null> {
      // Busca el RFC en el archivo destinatario-de-tabla.json
      return new Observable(observer => {
        this.http.get<RepresentanteLegal[]>('assets/json/260911/destinatario-de-tabla.json').subscribe(data => {
          const FOUND = data.find(item => item.rfc === rfc);
          if (FOUND) {
            // Separar nombre en nombre, apellidoPaterno, apellidoMaterno si es posible
            const NOMBRE_COMPLETO = FOUND.nombreDenominacionORazonSocial || '';
            const PARTES = NOMBRE_COMPLETO.split(' ');
            observer.next({
              nombre: PARTES[0] || '',
              apellidoPaterno: PARTES[1] || '',
              apellidoMaterno: PARTES.slice(2).join(' ') || ''
            });
          } else {
            observer.next(null);
          }
          observer.complete();
        }, () => {
          observer.next(null);
          observer.complete();
        });
      });
    }
}