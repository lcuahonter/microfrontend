import {
  AduanaDeSalida,
  DatosDelSolicitud,
} from '../models/exportar-ilustraciones.model';
import { ExportarIlustraciones270101State, Tramite270101Store } from '../../../estados/tramites/270101/tramite270101.store';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * @Injectable
 * @providedIn 'root'
 * @description
 * Este decorador marca la clase `ExportarIlustracionesService` como un servicio inyectable
 * en el nivel raíz de la aplicación. Esto asegura que el servicio esté disponible en toda
 * la aplicación y se comparta una única instancia del mismo.
 */
@Injectable({
  providedIn: 'root',
})
export class ExportarIlustracionesService {
  /**
   * @property formsMap
   * @type {{ [key: string]: FormGroup }}
   * @description
   * Este mapa almacena los formularios reactivos (`FormGroup`) asociados a diferentes claves.
   * Permite gestionar múltiples formularios dentro del servicio, proporcionando acceso rápido
   * a cada formulario mediante su clave única.
   *
   * Funcionalidad:
   * - Almacena formularios reactivos asociados a claves específicas.
   * - Facilita la recuperación, validación y reinicio de formularios.
   *
   * @example
   * this.formsMap['aduana'] = new FormGroup({...});
   * const formulario = this.formsMap['aduana'];
   */
  private formsMap: { [key: string]: FormGroup } = {};

  /**
   * @property formValues
   * @type {{ [key: string]: unknown }}
   * @description
   * Este objeto almacena los valores iniciales de los formularios reactivos asociados a diferentes claves.
   * Se utiliza para restaurar los valores de los formularios al estado inicial cuando sea necesario.
   *
   * Funcionalidad:
   * - Almacena los valores iniciales de los formularios.
   * - Facilita la restauración de los formularios a su estado inicial.
   *
   * @example
   * this.formValues['aduana'] = { campo1: 'valor1', campo2: 'valor2' };
   * const valoresIniciales = this.formValues['aduana'];
   */
  private formValues: { [key: string]: unknown } = {};

  /**
   * @property aduanaArray
   * @type {AduanaDeSalida[]}
   * @description
   * Este arreglo almacena los datos relacionados con las aduanas de salida.
   * Se utiliza para gestionar y almacenar múltiples registros de aduanas en el flujo de trabajo.
   *
   * Funcionalidad:
   * - Almacena objetos de tipo `AduanaDeSalida`.
   * - Permite agregar, consultar y manipular los datos de las aduanas de salida.
   *
   * @example
   * this.aduanaArray.push({ id: 1, descripcion: 'Aduana 1' });
   * console.log(this.aduanaArray);
   * // [{ id: 1, descripcion: 'Aduana 1' }]
   */
  public aduanaArray: AduanaDeSalida[] = [];

  /**
   * @property datosDeSolicitudArray
   * @type {DatosDelSolicitud[]}
   * @description
   * Este arreglo almacena los datos relacionados con las solicitudes.
   * Se utiliza para gestionar y almacenar múltiples registros de datos de solicitudes en el flujo de trabajo.
   *
   * Funcionalidad:
   * - Almacena objetos de tipo `DatosDelSolicitud`.
   * - Permite agregar, consultar y manipular los datos de las solicitudes.
   *
   * @example
   * this.datosDeSolicitudArray.push({ id: 1, descripcion: 'Solicitud 1' });
   * console.log(this.datosDeSolicitudArray);
   * // [{ id: 1, descripcion: 'Solicitud 1' }]
   */
  public datosDeSolicitudArray: DatosDelSolicitud[] = [];

  /**
   * @constructor
   * @description
   * Inicializa el servicio con una instancia de HttpClient para realizar solicitudes HTTP.
   * @param {HttpClient} http - Cliente HTTP para realizar las solicitudes.
   */
  constructor(private http: HttpClient, private tramite270101Store: Tramite270101Store) {
    //
  }

  /**
   * @method setAduanaArray
   * @description
   * Este método agrega un nuevo registro al arreglo `aduanaArray`, que almacena los datos relacionados
   * con las aduanas de salida en el flujo de trabajo.
   *
   * Funcionalidad:
   * - Recibe un objeto de tipo `AduanaDeSalida`.
   * - Agrega el objeto al arreglo `aduanaArray`.
   *
   * @param {AduanaDeSalida} event - Objeto que representa los datos de una aduana de salida.
   *
   * @example
   * const nuevaAduana = { id: 1, descripcion: 'Aduana 1' };
   * this.setAduanaArray(nuevaAduana);
   * console.log(this.aduanaArray);
   * // [{ id: 1, descripcion: 'Aduana 1' }]
   */
  setAduanaArray(event: AduanaDeSalida): void {
    this.aduanaArray.push(event);
  }

  /**
   * @method setDatosDeSolicitudArray
   * @description
   * Este método agrega un nuevo registro al arreglo `datosDeSolicitudArray`, que almacena los datos relacionados
   * con las solicitudes en el flujo de trabajo.
   *
   * Funcionalidad:
   * - Recibe un objeto de tipo `DatosDelSolicitud`.
   * - Agrega el objeto al arreglo `datosDeSolicitudArray`.
   *
   * @param {DatosDelSolicitud} event - Objeto que representa los datos de una solicitud.
   *
   * @example
   * const nuevaSolicitud = { id: 1, descripcion: 'Solicitud 1' };
   * this.setDatosDeSolicitudArray(nuevaSolicitud);
   * console.log(this.datosDeSolicitudArray);
   * // [{ id: 1, descripcion: 'Solicitud 1' }]
   */
  setDatosDeSolicitudArray(event: DatosDelSolicitud): void {
    this.datosDeSolicitudArray.push(event);
  }

  /**
   * @method setForm
   * @description
   * Este método almacena un formulario reactivo (`FormGroup`) en el mapa `formsMap` asociado a una clave específica.
   * También guarda los valores iniciales del formulario en el objeto `formValues` para facilitar su restauración.
   *
   * Funcionalidad:
   * - Asocia un formulario reactivo a una clave única en el mapa `formsMap`.
   * - Almacena los valores iniciales del formulario en `formValues`.
   *
   * @param {string} key - Clave única para identificar el formulario.
   * @param {FormGroup} form - El formulario reactivo que se desea almacenar.
   *
   * @example
   * const formulario = new FormGroup({...});
   * this.setForm('aduana', formulario);
   * console.log(this.formsMap['aduana']); // Muestra el formulario almacenado.
   */
  setForm(key: string, form: FormGroup): void {
    this.formsMap[key] = form;
    this.formValues[key] = form.value;
  }

  /**
   * @method getForm
   * @description
   * Este método recupera un formulario reactivo (`FormGroup`) del mapa `formsMap` utilizando una clave específica.
   *
   * Funcionalidad:
   * - Busca el formulario asociado a la clave proporcionada en el mapa `formsMap`.
   * - Devuelve el formulario si existe, o `undefined` si no se encuentra.
   *
   * @param {string} key - Clave única para identificar el formulario.
   * @returns {FormGroup | undefined} El formulario reactivo asociado a la clave, o `undefined` si no existe.
   *
   * @example
   * const formulario = this.getForm('aduana');
   * console.log(formulario); // Muestra el formulario asociado a la clave 'aduana'.
   */
  getForm(key: string): FormGroup | undefined {
    return this.formsMap[key];
  }

  /**
   * @method getFormValidity
   * @description
   * Este método verifica si un formulario reactivo (`FormGroup`) asociado a una clave específica es válido.
   *
   * Funcionalidad:
   * - Busca el formulario asociado a la clave proporcionada en el mapa `formsMap`.
   * - Devuelve `true` si el formulario es válido, o `false` si no es válido o no existe.
   *
   * @param {string} key - Clave única para identificar el formulario.
   * @returns {boolean} `true` si el formulario es válido, `false` en caso contrario.
   *
   * @example
   * const esValido = this.getFormValidity('aduana');
   * console.log(esValido); // Muestra `true` si el formulario es válido, `false` en caso contrario.
   */
  getFormValidity(key: string): boolean {
    return this.formsMap[key]?.valid ?? false;
  }

  /**
   * @method getFormValues
   * @description
   * Este método recupera los valores actuales de un formulario reactivo (`FormGroup`) del mapa `formsMap`
   * utilizando una clave específica.
   *
   * Funcionalidad:
   * - Busca el formulario asociado a la clave proporcionada en el mapa `formsMap`.
   * - Devuelve los valores actuales del formulario si existe, o un objeto vacío si no se encuentra.
   *
   * @param {string} key - Clave única para identificar el formulario.
   * @returns {Record<string, unknown>} Los valores actuales del formulario, o un objeto vacío si no existe.
   *
   * @example
   * const valores = this.getFormValues('aduana');
   * console.log(valores); // Muestra los valores actuales del formulario asociado a la clave 'aduana'.
   */
  getFormValues(key: string): Record<string, unknown> {
    return this.formsMap[key]?.value ?? {};
  }

  /**
   * @method resetForm
   * @description
   * Este método reinicia un formulario reactivo (`FormGroup`) asociado a una clave específica en el mapa `formsMap`.
   * Restaura los valores del formulario a su estado inicial utilizando los valores almacenados en `formValues`.
   *
   * Funcionalidad:
   * - Reinicia el formulario asociado a la clave proporcionada.
   * - Restaura los valores iniciales del formulario desde `formValues`.
   *
   * @param {string} key - Clave única para identificar el formulario.
   *
   * @example
   * this.resetForm('aduana');
   * // Reinicia el formulario asociado a la clave 'aduana' y restaura sus valores iniciales.
   */
  resetForm(key: string): void {
    this.formsMap[key]?.reset();
    this.formsMap[key].patchValue(this.formValues[key] ?? {});
  }

  /**
   * @method getMonedaData
   * @description
   * Obtiene los datos del catálogo de monedas desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos de monedas.
   */
  getMonedaData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/270201/moneda.json');
  }

  /**
   * @method getArancelariaData
   * @description
   * Obtiene los datos del catálogo de fracciones arancelarias desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos arancelarios.
   */
  getArancelariaData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/270201/arancelaria.json');
  }

  /**
   * @method getAutorData
   * @description
   * Obtiene los datos del catálogo de fracciones arancelarias desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos arancelarios.
   */
  getAutorData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/270101/autor.json');
  }

  /**
   * @method getMotivoData
   * @description
   * Obtiene los datos del catálogo de motivos desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos de motivos.
   */
  getMotivoData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/270201/motivo.json');
  }

  /**
   * Obtiene los datos del país de importación.
   * @returns Observable con los datos del catálogo de país de importación.
   */
  getPaisData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      './assets/json/290201/paisdeimportacion.json'
    );
  }

  /**
   * Obtiene los datos del catálogo de aduanas de salida.
   * @returns {Observable<Catalogo[]>} Un observable con los datos del catálogo de aduanas de salida.
   */
  getAduanaDeSalidaData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/260401/aduanaDeSalida.json');
  }

  /**
   * @method getTransporteData
   * @description
   * Obtiene los datos del catálogo de transportes desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos de transportes.
   */
  getTransporteData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      'assets/json/270101/tipo-de-traslado.json'
    );
  }

  /**
   * @method getBancoData
   * @description
   * Obtiene los datos del catálogo de transportes desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos de transportes.
   */
  getBancoData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/270101/bancos.json');
  }

  
  /**
   * @method getExportarIlustracionesData
   * @description
   * Obtiene los datos necesarios para exportar ilustraciones desde un archivo JSON.
   * @returns {Observable<ExportarIlustraciones270101State>} Un observable que emite el estado de exportación de ilustraciones.
   */
  getExportarIlustracionesData(): Observable<ExportarIlustraciones270101State> {
    return this.http.get<ExportarIlustraciones270101State>('assets/json/270101/exportar-ilustraciones.json');
  }

  /**
 * @method actualizarEstadoFormulario
 * @description
 * Actualiza el valor de un campo específico en el store `tramite270101Store` de manera dinámica.
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
    this.tramite270101Store.setDynamicFieldValue(campo, valor);
  }
}
