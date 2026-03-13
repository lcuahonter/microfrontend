import { CertiRegistro302State, Tramite302Store } from '../../../core/estados/tramites/tramite302.store';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { DetallesDelProducto } from '../models/certi-registro.model';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para gestionar las operaciones relacionadas con el trámite 302.
 *
 * Este servicio proporciona métodos para actualizar el estado del formulario,
 * obtener los datos del certificado de registro y recuperar los detalles de los productos
 * desde archivos JSON locales.
 *
 * @remarks
 * Utiliza inyección de dependencias para acceder a la configuración de la aplicación
 * y al store específico del trámite 302.
 *
 * @example
 * ```typescript
 * constructor(private solicitud302Service: Solicitud302Service) {}
 * ```
 */
@Injectable({
  providedIn: 'root',
})

export class Solicitud302Service {
  /**
   * URL del servidor donde se alojan los recursos de la aplicación.
   * Se obtiene del entorno de configuración de la aplicación.
   */
  urlServer = ENVIRONMENT.URL_SERVER;
  /**
   * URL del servidor de catálogos auxiliares.
   * Se utiliza para acceder a datos adicionales necesarios para el trámite 302.
   */
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
   * Constructor de la clase Service302Service.
   * 
   * @param http Instancia de HttpClient utilizada para realizar solicitudes HTTP.
   * @param tramite302Store Instancia de Tramite302Store para gestionar el estado relacionado con el trámite 302.
   * 
   * Inicializa el servicio y permite la inyección de dependencias necesarias para su funcionamiento.
   */
  constructor(private http: HttpClient, private tramite302Store: Tramite302Store) {
    // Lógica de inicialización si es necesario
  }

  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   *
   * @param datos Objeto que contiene los datos a actualizar en el estado del formulario.
   * 
   * Este método recorre las entradas del objeto `datos` y actualiza cada campo dinámicamente
   * en el store `tramite302Store`.
   */
  actualizarEstadoFormulario(datos:object): void {
   Object.entries(datos).forEach(([key, value]) => { 
   this.tramite302Store.setDynamicFieldValue(key, value);
  })
}

  /**
   * Obtiene el estado del certificado de registro desde un archivo JSON local.
   *
   * @returns Un Observable que emite el estado del certificado de registro (`CertiRegistro302State`).
   */
  getCertiRegistroDatos(): Observable<CertiRegistro302State> {
    return this.http.get<CertiRegistro302State>('assets/json/302/certi-registro.json');
  }

  
  /**
   * Obtiene los detalles de los productos desde un archivo JSON local.
   *
   * @returns Un Observable que emite los detalles del producto (`DetallesDelProducto`).
   */
   getProductos(): Observable<DetallesDelProducto> {
    return this.http.get<DetallesDelProducto>('assets/json/302/producto.json');
  }

  /**
 * @method getUnidadDeMedidaData
 * @description
 * Obtiene los datos del catálogo de unidades de medida desde un archivo JSON local.
 * @returns {Observable<Catalogo>} Observable con los datos del catálogo de unidades de medida.
 */
  getUnidadDeMedidaData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/302/lista-unidad-de-medida.json');
  }

   /**
 * @method getImportacionTemporalData
 * @description
 * Obtiene los datos del catálogo de importación temporal desde un archivo JSON local.
 * @returns {Observable<Catalogo>} Observable con los datos del catálogo de importación temporal.
 */
  getImportacionTemporalData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/302/list-importacion-temporal.json');
  }

  /**
 * @method getAduanaData
 * @description
 * Obtiene los datos del catálogo de aduanas desde un archivo JSON local.
 * @returns {Observable<Catalogo>} Observable con los datos del catálogo de aduanas.
 */
  getAduanaData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/302/lista-de-oficinas-de-aduanas.json');
  }

}
