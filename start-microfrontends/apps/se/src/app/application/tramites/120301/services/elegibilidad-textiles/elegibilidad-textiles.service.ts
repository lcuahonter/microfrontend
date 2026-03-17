/**
 * @description
 * Servicio para gestionar la elegibilidad de textiles en el trámite 120301.
 * Proporciona métodos para obtener catálogos, datos de tablas, datos precargados y el estado del formulario
 * desde archivos JSON locales y desde el store de estado de elegibilidad de textiles.
 *
 * @example
 * // Obtener un catálogo para un menú desplegable
 * elegibilidadTextilesService.obtenerMenuDesplegable('archivo.json').subscribe(data => ...);
 *
 * // Obtener datos de una tabla
 * elegibilidadTextilesService.obtenerTablaDatos<any>('tabla.json').subscribe(data => ...);
 *
 * // Obtener el estado actual del formulario
 * elegibilidadTextilesService.getFormData().subscribe(state => ...);
 *
 * // Obtener la lista de países
 * elegibilidadTextilesService.obtenerListaPaises().subscribe(paises => ...);
 *
 * // Obtener datos precargados
 * elegibilidadTextilesService.getPrefillDatos().subscribe(prefill => ...);
 *
 * @see ElegibilidadDeTextilesStore
 * @see TextilesState
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Catalogo, RespuestaCatalogos } from '@ng-mf/data-access-user';

import {
  ElegibilidadDeTextilesStore,
  TextilesState,
} from '../../estados/elegibilidad-de-textiles.store';
import { FitosanitarioForm } from '../../models/elegibilidad-de-textiles.model';

/**
 * Servicio para la gestión de elegibilidad de textiles.
 */
@Injectable({
  providedIn: 'root',
})
export class ElegibilidadTextilesService {
    /**
   * Ruta base para los archivos JSON de catálogos y datos.
   */
  url = '../../../../../assets/json/120301/';

    /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar solicitudes a archivos JSON.
   * @param elegibilidadDeTextilesStore Store para el estado de elegibilidad de textiles.
   */
  constructor(
    private readonly http: HttpClient,
    private elegibilidadDeTextilesStore: ElegibilidadDeTextilesStore
  ) {
    // Se puede agregar aquí la lógica del constructor si es necesario
  }

  /**
   * Obtiene un catálogo para un menú desplegable a partir de un archivo JSON.
   * @param fileName Nombre del archivo JSON a consultar.
   * @returns Observable con el catálogo de opciones.
   */
  obtenerMenuDesplegable(fileName: string): Observable<Catalogo[]> {
    const BASEURL = this.url + fileName;
    return this.http
      .get<RespuestaCatalogos>(BASEURL)
      .pipe(map((response) => response.data));
  }

  /**
   * Obtiene los datos de una tabla a partir de un archivo JSON.
   * @param fileName Nombre del archivo JSON a consultar.
   * @returns Observable con los datos de la tabla.
   */
  obtenerTablaDatos<T>(fileName: string): Observable<T[]> {
    const JSONURL = this.url + fileName;
    return this.http.get<T[]>(JSONURL);
  }

  /**
   * @description Actualiza los datos de la solicitud en el store.
   * @param solicitudState Datos de la solicitud.
   */
  updateSolicitud(solicitudState: FitosanitarioForm): void {
    this.elegibilidadDeTextilesStore.setTextilesState({
      ...this.elegibilidadDeTextilesStore.getValue(),
      SolicitudState: solicitudState
    });
  }
    /**
   * @description Actualiza el estado completo del formulario en el store.
   * @param {TextilesState} DATOS - Objeto con todos los datos del formulario.
   */
  actualizarEstadoFormulario(DATOS: TextilesState): void {
    this.elegibilidadDeTextilesStore.setTextilesState(DATOS);
  }

  /**
   * Obtiene el estado actual del formulario de elegibilidad de textiles desde el store.
   * @returns Observable con el estado actual del formulario.
   */
  getFormData(): Observable<TextilesState> {
    return this.elegibilidadDeTextilesStore._select((state) => state);
  }

  /**
   * Obtiene la lista de países desde un archivo JSON local.
   * @returns Observable con el catálogo de países.
   */
  obtenerListaPaises(): Observable<Catalogo[]> {
    const JSONURL = 'assets/json/120301/ano-de-la-constancia.json';
    return this.http.get<Catalogo[]>(JSONURL);
  }

  /**
   * Obtiene los datos precargados desde un archivo JSON local.
   * @returns Observable que emite el estado de datos textiles precargado.
   */
  getPrefillDatos(): Observable<TextilesState> {
    const JSONURL = 'assets/json/120301/datos-prefill.json';
    return this.http.get<TextilesState>(JSONURL);
  }
}
