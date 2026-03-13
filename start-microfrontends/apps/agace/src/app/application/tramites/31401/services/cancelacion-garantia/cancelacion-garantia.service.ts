import { CancelacionGarantia270101State, Tramite31401Store } from '../../../../estados/tramites/tramite31401.store';
import { MiembroTabla, RequisitosTabla, TerecerosTabla, TipoInversionTabla } from '../../models/cancelacion-garantia.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
  * @Injectable
  * @providedIn root
  * 
  * @description
  * Decorador que marca la clase `CancelacionGarantiaService` como un servicio inyectable en Angular.
  * 
  * Detalles:
  * - El servicio está disponible en el nivel raíz de la aplicación, lo que significa que se comparte en toda la aplicación.
  * - Utiliza `HttpClient` para realizar solicitudes HTTP y gestionar datos relacionados con la cancelación de garantías.
  * 
  * @example
  * constructor(private cancelacionGarantiaService: CancelacionGarantiaService) {
  *   this.cancelacionGarantiaService.getTipoDeGarantiaData().subscribe(data => console.log(data));
  * }
  */
@Injectable({
  providedIn: 'root'
})

export class CancelacionGarantiaService {

  /**
   * @constructor
   * @description
   * Inicializa el servicio con una instancia de HttpClient para realizar solicitudes HTTP.
   * @param {HttpClient} http - Cliente HTTP para realizar las solicitudes.
   */
  constructor(private http: HttpClient, private tramite31401Store: Tramite31401Store) {
    //
  }

  /**
   * @method getTipoDeGarantiaData
   * @description
   * Obtiene los datos del catálogo de monedas desde un archivo JSON.
   * @returns {Observable<{label: string, value: number}[]>} Un observable que emite una lista de datos de garantia.
   */
  getTipoDeGarantiaData(): Observable<{label: string, value: number}[]> {
    return this.http.get<{label: string, value: number}[]>(
      'assets/json/31401/tipo-de-garantia.json'
    );
  }

  /**
   * @method getModalidadDeGarantiaData
   * @description
   * Obtiene los datos del catálogo de monedas desde un archivo JSON.
   * @returns {Observable<{label: string, value: number}[]>} Un observable que emite una lista de datos de garantia.
   */
  getModalidadDeGarantiaData(): Observable<{label: string, value: number}[]> {
    return this.http.get<{label: string, value: number}[]>(
      'assets/json/31401/modalidad-de-la-garantia.json'
    );
  }

  /**
   * @method getTipoSectorData
   * @description
   * Obtiene los datos del catálogo de monedas desde un archivo JSON.
   * @returns {Observable<{label: string, value: number}[]>} Un observable que emite una lista de datos de garantia.
   */
  getTipoSectorData(): Observable<{label: string, value: number}[]> {
    return this.http.get<{label: string, value: number}[]>(
      'assets/json/31401/tipo-sector.json'
    );
  }

  /**
 * @method obtenerDatosTablaRequisitos
 * @description
 * Obtiene los datos de la tabla de insumos desde un archivo JSON.
 * 
 * Funcionalidad:
 * - Realiza una solicitud HTTP GET para obtener los datos de insumos.
 * - Devuelve un observable que emite una lista de objetos `RequisitosTabla`.
 * 
 * @returns {Observable<RequisitosTabla[]>} - Un observable que emite los datos de la tabla de insumos.
 * 
 * @example
 * this.solicitudDeRegistroTplService.obtenerDatosTablaRequisitos().subscribe((datos) => {
 *   console.log(datos);
 * });
 */
  obtenerDatosTablaRequisitos(): Observable<RequisitosTabla[]> {
    return this.http.get<RequisitosTabla[]>(
      'assets/json/31401/requisitos-tabla.json'
    );
  }

  /**
 * @method obtenerDatosTablaTereceros
 * @description
 * Obtiene los datos de la tabla de insumos desde un archivo JSON.
 * 
 * Funcionalidad:
 * - Realiza una solicitud HTTP GET para obtener los datos de insumos.
 * - Devuelve un observable que emite una lista de objetos `TerecerosTabla`.
 * 
 * @returns {Observable<TerecerosTabla[]>} - Un observable que emite los datos de la tabla de insumos.
 * 
 * @example
 * this.solicitudDeRegistroTplService.obtenerDatosTablaTereceros().subscribe((datos) => {
 *   console.log(datos);
 * });
 */
  obtenerDatosTablaTereceros(): Observable<TerecerosTabla[]> {
    return this.http.get<TerecerosTabla[]>(
      'assets/json/31401/tereceros-tabla.json'
    );
  }

  /**
 * @method obtenerDatosTablaMiembro
 * @description
 * Obtiene los datos de la tabla de insumos desde un archivo JSON.
 * 
 * Funcionalidad:
 * - Realiza una solicitud HTTP GET para obtener los datos de insumos.
 * - Devuelve un observable que emite una lista de objetos `MiembroTabla`.
 * 
 * @returns {Observable<MiembroTabla[]>} - Un observable que emite los datos de la tabla de insumos.
 * 
 * @example
 * this.solicitudDeRegistroTplService.obtenerDatosTablaMiembro().subscribe((datos) => {
 *   console.log(datos);
 * });
 */
  obtenerDatosTablaMiembro(): Observable<MiembroTabla[]> {
    return this.http.get<MiembroTabla[]>(
      'assets/json/31401/miembro-de-la-empresa.json'
    );
  }

  /**
 * @method obtenerDatosTablaMiembro
 * @description
 * Obtiene los datos de la tabla de insumos desde un archivo JSON.
 * 
 * Funcionalidad:
 * - Realiza una solicitud HTTP GET para obtener los datos de insumos.
 * - Devuelve un observable que emite una lista de objetos `MiembroTabla`.
 * 
 * @returns {Observable<MiembroTabla[]>} - Un observable que emite los datos de la tabla de insumos.
 * 
 * @example
 * this.solicitudDeRegistroTplService.obtenerDatosTablaMiembro().subscribe((datos) => {
 *   console.log(datos);
 * });
 */
  obtenerTipoInversionData(): Observable<TipoInversionTabla[]> {
    return this.http.get<TipoInversionTabla[]>(
      'assets/json/31401/tipo-de-inversion.json'
    );
  }

  /**
   * @method getRequisitosRadioData
   * @description
   * Obtiene los datos del catálogo de monedas desde un archivo JSON.
   * @returns {Observable<{label: string, value: number}[]>} Un observable que emite una lista de datos de garantia.
   */
  getRequisitosRadioData(): Observable<{label: string, value: number}[]> {
    return this.http.get<{label: string, value: number}[]>(
      'assets/json/31401/requisitos-radio-data.json'
    );
  }

  /**
   * @method getRegimenAduaneraData
   * @description
   * Obtiene los datos del catálogo de monedas desde un archivo JSON.
   * @returns {Observable<{label: string, value: number}[]>} Un observable que emite una lista de datos de garantia.
   */
  getRegimenAduaneraData(): Observable<{label: string, value: number}[]> {
    return this.http.get<{label: string, value: number}[]>(
      'assets/json/31401/regimen-adunaera.json'
    );
  }

  /**
   * Obtiene los datos de cancelación de garantía desde un archivo JSON local.
   * @returns {Observable<CancelacionGarantia270101State>} Observable con el estado de la cancelación de garantía.
   * @example
   * this.getCancelacionGarantiaData().subscribe(data => { ... });
   */
  getCancelacionGarantiaData(): Observable<CancelacionGarantia270101State> {
    return this.http.get<CancelacionGarantia270101State>('assets/json/31401/cancelacion-garantia.json');
  }

  /**
 * @method actualizarEstadoFormulario
 * @description
 * Actualiza el valor de un campo específico en el store `tramite31401Store` de manera dinámica.
 * 
 * Detalles:
 * - Utiliza el método `setDynamicFieldValue` del store para modificar el valor del campo indicado.
 * - Permite mantener sincronizado el estado global del trámite con los cambios realizados en el formulario.
 * 
 * @param {string} campo - Nombre del campo que se desea actualizar en el store.
 * @param {unknown} valor - Valor que se asignará al campo especificado.
 * 
 * @example
 * this.actualizarEstadoFormulario('pais', 'México');
 * // Actualiza el campo 'pais' en el store con el valor 'México'.
 */
  actualizarEstadoFormulario(campo: string, valor: unknown): void {
    this.tramite31401Store.setDynamicFieldValue(campo, valor);
  }
}
