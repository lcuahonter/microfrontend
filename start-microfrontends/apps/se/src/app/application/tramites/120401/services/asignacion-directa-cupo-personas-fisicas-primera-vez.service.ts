/**
 * @fileoverview
 * Servicio `AsignacionDirectaCupoPersonasFisicasPrimeraVezService` encargado de gestionar las solicitudes HTTP
 * para obtener datos desde archivos JSON locales y asignarlos dinámicamente al estado de la aplicación o a propiedades específicas.
 *
 * Este servicio está disponible globalmente en la aplicación gracias al decorador `providedIn: 'root'`.
 *
 * @module AsignacionDirectaCupoPersonasFisicasPrimeraVezService
 */
import { BuscarCuposRequest, DescripcionDelCupo, SeleccionDelCupoTabla, SolicitudCupoRequest, TablaRowRequest } from '../models/asignacion-directa-cupo.model';
import {
  Catalogo,
  HttpCoreService,
  JSONResponse,
  JsonResponseCatalogo,
  RespuestaCatalogos,
} from '@libs/shared/data-access-user/src';
import { Observable, Subject, catchError, map, throwError } from 'rxjs';
import { Tramite120401State, Tramite120401Store } from '../estados/tramites/tramite120401.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_120401 } from '../servers/api-route';
import { Tramite120401Query } from '../estados/queries/tramite120401.query';

/**
 * Servicio responsable de obtener datos desde archivos JSON locales
 * y asignarlos dinámicamente a propiedades de un componente.
 *
 * Este servicio está disponible de forma global en toda la aplicación
 * gracias al decorador `providedIn: 'root'`.
 */
@Injectable({
  providedIn: 'root',
})

export class AsignacionDirectaCupoPersonasFisicasPrimeraVezService {
  /**
   * Sujeto que emite un evento cuando el servicio se destruye.
   * Esto se utiliza para limpiar las suscripciones activas y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Constructor de la clase AsignacionDirectaCupoPersonasFisicasPrimeraVezService.
   * 
   * @param httpServicios - Servicio HttpClient para realizar solicitudes HTTP.
   * @param tramite120401Store - Almacén que gestiona el estado del trámite 120401.
   */
  constructor(
    private httpServicios: HttpClient,
    public tramite120401Store: Tramite120401Store,
    public httpService: HttpCoreService,
    private tramite120401Query: Tramite120401Query
  ) {}

  /**
   * Obtiene datos desde un archivo JSON localizado en la carpeta `assets/json`
   * y asigna el resultado a una propiedad del componente o clase llamadora.
   *
   * @param self - Referencia al componente o contexto que recibe los datos.
   * @param variable - Nombre de la propiedad dentro de `self` donde se asignará la respuesta.
   * @param url - Ruta relativa al archivo JSON dentro de `assets/json`.
   */

  obtenerRespuestaPorUrl(variable: string, url: string): void {
    if (self && variable && url) {
      this.httpServicios
        .get<RespuestaCatalogos>(`assets/json${url}`)
        .subscribe((resp): void => {
          const VALOR = resp?.code === 200 && resp.data ? resp.data : [];
          this.tramite120401Store.update((state) => ({
            ...state,
            [variable]: VALOR,
          }));
        });
    }
  }

  /**
   * Obtiene la descripción del cupo desde un archivo JSON y actualiza las propiedades del objeto `datos`.
   *
   * @param {DescripcionDelCupo} datos - Objeto que será actualizado con los datos obtenidos.
   * @returns {void}
   */
  getDescripcionDelCupo(_datos: DescripcionDelCupo): Observable<DescripcionDelCupo> {
    return this.httpServicios.get<DescripcionDelCupo>(
      'assets/json/120401/descripcion-del-cupo.json'
    );
  }

  /**
   * Obtiene la lista de entidades federativas desde un archivo JSON.
   *
   * @returns {Observable<Catalogo[]>} Observable con la lista de entidades federativas.
   */
  getEntidad(): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      PROC_120401.ENTIDAD_FEDERATIVA,
      {},
      false
    );
  }

  /**
   * Obtiene la lista de representaciones federales desde un archivo JSON.
   *
   * @returns {Observable<Catalogo[]>} Observable con la lista de representaciones federales.
   */
  getRepresentacion(entidad: string): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      PROC_120401.REPRESENTACION_FEDERAL(entidad),
      {},
      false
    );
  }
  /**
   * Obtiene la lista de productos desde un archivo JSON.
   *
   * @returns {Observable<Catalogo[]>} Observable con la lista de productos.
   */
  getProducto(): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      PROC_120401.PRODUCTO,
      {},
      false
    );
  }

  /**
   * Obtiene la lista de subproductos desde un archivo JSON.
   *
   * @returns {Observable<Catalogo[]>} Observable con la lista de subproductos.
   */
  getSubProducto(): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      PROC_120401.NOMBRE_SUBPRODUCTO,
      {},
      false
    );
  }
  /**
   * Obtiene la lista de selección del cupo desde un archivo JSON.
   *
   * @returns {Observable<Catalogo[]>} Observable con la lista de selección del cupo.
   */
  getSeleccionDelCupo(): Observable<Catalogo[]> {
    return this.httpServicios.get<Catalogo[]>(
      'assets/json/120401/seleccion-del-cupo.json'
    );
  }

  /**
   * Obtiene la lista de regímenes desde un archivo JSON.
   *
   * @returns {Observable<Catalogo[]>} Observable con la lista de regímenes.
   */
  getRegimen(): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      PROC_120401.REGIMEN,
      {},
      false
    );
  }

  /**
   * Obtiene la lista de cupos disponibles vigentes desde la API.
   * @param {BuscarCuposRequest} body - Criterios de búsqueda para los cupos.
   * @returns {Observable<JSONResponse>} Observable con la respuesta de la API.
   */
  obtenerBuscarCupos(body:BuscarCuposRequest): Observable<JSONResponse> {
    return this.httpServicios.post(PROC_120401.BUSCAR_CUPOS, body).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_120401.BUSCAR_CUPOS}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Obtiene la lista de datos de la tabla desde la API.
   * @param {TablaRowRequest} body - Criterios de búsqueda para los cupos.
   * @returns {Observable<JSONResponse>} Observable con la respuesta de la API.
   */
  obtenerTablaRowDatos(body:TablaRowRequest): Observable<JSONResponse> {
    return this.httpServicios.post(PROC_120401.TABLA_CLICK, body).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_120401.TABLA_CLICK}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Obtiene la lista de guardar solicitud desde la API.
   * @param {SolicitudCupoRequest} body - Criterios de búsqueda para los cupos.
   * @returns {Observable<JSONResponse>} Observable con la respuesta de la API.
   */
  obtenerGuardarSolicitud(body:SolicitudCupoRequest): Observable<JSONResponse> {
    return this.httpServicios.post(PROC_120401.GUARDAR_SOLICITUD, body).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_120401.GUARDAR_SOLICITUD}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Obtiene la lista de tratados desde un archivo JSON.
   *
   * @returns {Observable<Catalogo[]>} Observable con la lista de tratados.
   */
  getTratado(): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      PROC_120401.TRATADO,
      {},
      false
    );
  }

  /**
 * Actualiza el estado del formulario de desistimiento en el store.
 * 
 * @param {Partial<DesistimientoForm>} DATOS - Datos parciales del formulario para actualizar el estado.
 */
actualizarEstadoFormulario(DATOS: Partial<Catalogo[]>): void {
  this.tramite120401Store.update((state) => ({
    ...state,
    ...DATOS
  }));
}

/**
 * Obtiene los datos precargados para el registro de toma de muestras de mercancías desde un archivo JSON.
 *
 * @returns {Observable<Catalogo[]>} Observable con los datos precargados.
 */
getRegistroTomaMuestrasMercanciasData(): Observable<Catalogo[]> {
  return this.httpServicios.get<Catalogo[]>(`assets/json/120401/datosPrecargados.json`);
}

/**
 * Busca cupos disponibles basado en los criterios proporcionados.
 * @param criterios - Objeto con los criterios de búsqueda del formulario
 * @returns Observable con los cupos filtrados
 */
buscarCuposPorCriterios(criterios: SeleccionDelCupoTabla): Observable<SeleccionDelCupoTabla[]> {
  // Replace with your actual API endpoint
  return this.httpServicios.post<SeleccionDelCupoTabla[]>('/api/cupos/buscar', criterios);
}

/**
 * Obtiene todo el estado del trámite 120401 como un Observable.
 * @returns Observable con el estado completo del trámite 120401
 */
getAllState(): Observable<Tramite120401State> {
  return this.tramite120401Query.tramiteState$;
}

}
