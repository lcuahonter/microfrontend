import { Tramite240123State, Tramite240123Store } from '../estados/tramite240123Store.store';
import { Catalogo } from '@ng-mf/data-access-user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatosSolicitudService {
  /**
   * @property {string} jsonUrl
   * Ruta relativa al archivo JSON que contiene los datos del domicilio.
   * Usado para cargar información desde el frontend (assets).
   * @private
   */
  private jsonUrl = 'assets/json/240123/exportacion-datos.json';

  constructor(public httpServicios: HttpClient, public tramite240123Store: Tramite240123Store) {}

  /**
   * Obtiene la lista de países desde el archivo JSON.
   *
   * @method obtenerListaPaises
   * @returns {Observable<Catalogo[]>} Observable con el catálogo de países.
   */
  obtenerListaPaises(): Observable<Catalogo[]> {
    return this.httpServicios
      .get<{ pais: Catalogo[] }>(this.jsonUrl)
      .pipe(map((res) => res.pais));
  }

  /**
   * Obtiene la lista de entidades federativas (estados) desde el archivo JSON.
   *
   * @method obtenerListaEstados
   * @returns {Observable<Catalogo[]>} Observable con el catálogo de estados.
   */
  obtenerListaEstados(): Observable<Catalogo[]> {
    return this.httpServicios
      .get<{ estado: Catalogo[] }>(this.jsonUrl)
      .pipe(map((res) => res.estado));
  }

  /**
   * Obtiene la lista de municipios desde el archivo JSON.
   *
   * @method obtenerListaMunicipios
   * @returns {Observable<Catalogo[]>} Observable con el catálogo de municipios.
   */
  obtenerListaMunicipios(): Observable<Catalogo[]> {
    return this.httpServicios
      .get<{ municipio: Catalogo[] }>(this.jsonUrl)
      .pipe(map((res) => res.municipio));
  }

  /**
   * Obtiene la lista de localidades desde el archivo JSON.
   *
   * @method obtenerListaLocalidades
   * @returns {Observable<Catalogo[]>} Observable con el catálogo de localidades.
   */
  obtenerListaLocalidades(): Observable<Catalogo[]> {
    return this.httpServicios
      .get<{ localidad: Catalogo[] }>(this.jsonUrl)
      .pipe(map((res) => res.localidad));
  }

  /**
   * Obtiene la lista de códigos postales desde el archivo JSON.
   *
   * @method obtenerListaCodigosPostales
   * @returns {Observable<Catalogo[]>} Observable con el catálogo de códigos postales.
   */
  obtenerListaCodigosPostales(): Observable<Catalogo[]> {
    return this.httpServicios
      .get<{ codigo_postal: Catalogo[] }>(this.jsonUrl)
      .pipe(map((res) => res.codigo_postal));
  }

  /**
   * Obtiene la lista de colonias desde el archivo JSON.
   *
   * @method obtenerListaColonias
   * @returns {Observable<Catalogo[]>} Observable con el catálogo de colonias.
   */
  obtenerListaColonias(): Observable<Catalogo[]> {
    return this.httpServicios
      .get<{ colonia: Catalogo[] }>(this.jsonUrl)
      .pipe(map((res) => res.colonia));
  }

  /**
   * Obtiene el catálogo de bancos desde el archivo JSON.
   *
   * @method obtenerBancos
   * @returns {Observable<Catalogo[]>} Observable con el catálogo de bancos.
   */
  obtenerBancos(): Observable<Catalogo[]> {
    return this.httpServicios
      .get<{ banco: Catalogo[] }>(this.jsonUrl)
      .pipe(map((res) => res.banco));
  }

  /**
   * Obtiene el catálogo de fracciones arancelarias desde el archivo JSON.
   *
   * @method obtenerFraccionesCatalogo
   * @returns {Observable<Catalogo[]>} Observable con el catálogo de fracciones arancelarias.
   */
  obtenerFraccionesCatalogo(): Observable<Catalogo[]> {
    return this.httpServicios
      .get<{ fraccionesCatalogo: Catalogo[] }>(this.jsonUrl)
      .pipe(map((res) => res.fraccionesCatalogo));
  }

  /**
   * Obtiene el catálogo de unidades de medida comercial (UMC) desde el archivo JSON.
   *
   * @method obtenerUMCCatalogo
   * @returns {Observable<Catalogo[]>} Observable con el catálogo de UMC.
   */
  obtenerUMCCatalogo(): Observable<Catalogo[]> {
    return this.httpServicios
      .get<{ umcCatalogo: Catalogo[] }>(this.jsonUrl)
      .pipe(map((res) => res.umcCatalogo));
  }

  /**
   * Obtiene el catálogo de tipos de moneda desde el archivo JSON.
   *
   * @method obtenerMonedaCatalogo
   * @returns {Observable<Catalogo[]>} Observable con el catálogo de monedas.
   */
  obtenerMonedaCatalogo(): Observable<Catalogo[]> {
    return this.httpServicios
      .get<{ monedaCatalogo: Catalogo[] }>(this.jsonUrl)
      .pipe(map((res) => res.monedaCatalogo));
  }

   /**
   * Actualiza el estado del formulario en el store del trámite.
   * @param DATOS Datos del formulario a actualizar.
   */
  actualizarEstadoFormulario(DATOS: Tramite240123State): void {
    this.tramite240123Store.update((state) => ({
      ...state,
      ...DATOS
    }))
  }

  /**
   * Obtiene los datos de registro de toma de muestras de mercancías.
   * @returns Observable con los datos del formulario de registro.
   */
  obtenerRegistroTomarMuestrasDatos(): Observable<Tramite240123State> {
    return this.httpServicios.get<Tramite240123State>('assets/json/240123/aviso-de-exportacion.json');
  }
}
