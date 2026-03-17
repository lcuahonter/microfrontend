/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * MaterialesPeligrososService
 *
 * Este servicio gestiona la obtención de catálogos desde archivos JSON locales y realiza tareas relacionadas
 * con materiales peligrosos, como la inicialización de catálogos de pago de derechos y la conversión de números a letras.
 */
import { Catalogo, RespuestaCatalogos } from '@ng-mf/data-access-user';
import { Observable, map } from 'rxjs';
import { Tramite230501State, Tramite230501Store } from '../estados/stores/tramite230501Store.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Decorador `@Injectable` que define un servicio como una clase que puede ser inyectada en otros componentes o servicios.
 * 
 * Este servicio está configurado con el proveedor `root`, lo que significa que se crea una única instancia compartida en toda la aplicación.
 * 
 * @remarks
 * Este servicio está diseñado para gestionar las acciones relacionadas con las pantallas del trámite 230501. Proporciona métodos para inicializar y manejar los datos de los catálogos necesarios en el proceso del trámite, así como para actualizar el estado del formulario y obtener datos específicos desde archivos JSON.
 * 
 * @author Muneez
 */
@Injectable({
  providedIn: 'root'
})
/**
 * Servicio para gestionar los datos relacionados con materiales peligrosos.
 * 
 * Este servicio proporciona métodos para interactuar con catálogos, listas de países, estados, municipios, localidades, códigos postales y colonias,
 * así como para actualizar el estado del formulario y obtener datos específicos desde archivos JSON.
 * 
 * @remarks
 * Los métodos de este servicio están diseñados para realizar solicitudes HTTP y procesar datos estructurados en formato JSON.
 * También incluye funcionalidades para convertir números a letras y gestionar el estado de la solicitud en el store correspondiente.
 * 
 * @example
 * // Ejemplo de uso para obtener la lista de países:
 * const listaPaises = materialesPeligrososService.obtenerListaPaises().subscribe((paises) => {
 *   console.log(paises);
 * });
 * 
 * @example
 * // Ejemplo de uso para actualizar el estado del formulario:
 * materialesPeligrososService.actualizarEstadoFormulario({
 *   tipoSolicitud: 'Nuevo',
 *   datos: { nombre: 'Ejemplo' }
 * });
 */
export class MaterialesPeligrososService {
  /**
   * Arreglo de objetos `Catalogo` que contiene los tipos de solicitud obtenidos desde `tiposDeSolicitud.json`.
   */
  tiposSolicitud: Catalogo[] = [];

  /**
   * Arreglo de objetos `Catalogo` que contiene los datos de permisos obtenidos desde `noDePermisocoferprise.json`.
   */
  noDePermisocoferprise: Catalogo[] = [];

  /**
   * Arreglo de objetos `Catalogo` que contiene la fracción arancelaria obtenida desde `fraccionArancelaria.json`.
   */
  fraccionArancelaria: Catalogo[] = [];

  /**
   * Arreglo de objetos `Catalogo` que contiene los números CAS obtenidos desde `numeroCas.json`.
   */
  numeroCas: Catalogo[] = [];

  /**
   * Arreglo de objetos `Catalogo` que contiene la clasificación obtenida desde `clasificacion.json`.
   */
  clasificacion: Catalogo[] = [];

  /**
   * Arreglo de objetos `Catalogo` que contiene los estados físicos obtenidos desde `estadoFisico.json`.
   */
  estadoFisico: Catalogo[] = [];

  /**
   * Arreglo de objetos `Catalogo` que contiene los datos del objeto obtenidos desde `datosObjecto.json`.
   */
  datosObjecto: Catalogo[] = [];

  /**
   * Arreglo de objetos `Catalogo` que contiene las unidades de medida obtenidas desde `unidadDeMedida.json`.
   */
  unidadDeMedida: Catalogo[] = [];

  /**
   * Arreglo de objetos `Catalogo` que contiene la lista de bancos para el pago de derechos obtenida desde `pagoDerechosBanco.json`.
   */
  listoBanco: Catalogo[] = [];

  /**
   * Constructor de la clase `MaterialesPeligrososService`.
   * 
   * @param httpServicios - Instancia de `HttpClient` utilizada para realizar solicitudes HTTP.
   * @param tramite230501Store - Instancia de `Tramite230501Store` utilizada para gestionar el estado del trámite 230501.
   */
  constructor(public httpServicios: HttpClient,
     public tramite230501Store: Tramite230501Store) {
  
    }

  /**
   * URL del archivo JSON que contiene información relacionada con el domicilio.
   * 
   * Esta propiedad se utiliza para especificar la ubicación del archivo JSON
   * dentro de los activos de la aplicación. El archivo se encuentra en la ruta
   * `assets/json/230501/domicilio.json` y se espera que contenga datos estructurados
   * necesarios para el funcionamiento de los servicios relacionados con materiales peligrosos.
   * 
   * @private
   * @type {string}
   */
  private jsonUrl = 'assets/json/230501/domicilio.json';

  /**
   * Inicializa el catálogo de pago de derechos.
   * Este método obtiene la respuesta desde una URL específica y la asigna a la propiedad `listoBanco`.
   * @returns {void}
   */
  inicializaPagoDerechosCatalogo(): void {
    this.obtenerRespuestaPorUrl(this, 'listoBanco', '/230501/pagoDerechosBanco.json');
  }

  /**
   * Obtiene una respuesta desde una URL y asigna los datos a una variable.
   *
   * @param {any} self - El objeto que contiene la variable donde se almacenarán los datos de la respuesta.
   * @param {string} variable - El nombre de la variable donde se almacenarán los datos de la respuesta.
   * @param {string} url - La URL desde la cual se obtendrá la respuesta.
   * @returns {void}
   * @remarks Si la variable y la URL son válidas, se realiza una solicitud HTTP GET a la URL especificada.
   * Si la respuesta tiene un código 200 y contiene datos, estos se asignan a la variable especificada.
   * Si la variable o la URL no son válidas, se asigna un arreglo vacío a la variable.
   */
  obtenerRespuestaPorUrl(self: any, variable: string, url: string): void {
    if (self && variable && url) {
      this.httpServicios.get<RespuestaCatalogos>(`assets/json${url}`).subscribe((resp): void => {
        self[variable] = resp?.code === 200 && resp.data ? resp.data : [];
      });
    }
  }

  /**
   * Convierte un número a su equivalente en letras.
   * 
   * @param {number} num - El número que se desea convertir a letras.
   * @returns {string} - El número convertido a palabras.
   * @example
   * convertirNumeroALetras(123) -> 'ciento veintitrés'
   */
  // eslint-disable-next-line class-methods-use-this
  convertirNumeroALetras(num: number): string {
    const UNIDADES = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const ESPECIALES = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince'];
    const DECENAS = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const CENTENAS = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

    if (num === 0) { return 'cero' }
    if (num === 100) { return 'cien' }

    let letras = '';

    const C = Math.floor(num / 100);
    const D = Math.floor((num % 100) / 10);
    const U = num % 10;
    const DOS_DIGITOS = num % 100;

    if (C > 0) {
      letras += CENTENAS[C] + ' ';
    }

    if (DOS_DIGITOS < 10) {
      letras += UNIDADES[DOS_DIGITOS];
    } else if (DOS_DIGITOS >= 10 && DOS_DIGITOS < 16) {
      letras += ESPECIALES[DOS_DIGITOS - 10];
    } else if (DOS_DIGITOS < 30) {
      letras += 'veinti' + UNIDADES[U];
    } else {
      letras += DECENAS[D];
      if (U > 0) {
        letras += ' y ' + UNIDADES[U];
      }
    }

    return letras.trim();
  }

  /**
   * Obtiene una lista de países desde un endpoint JSON.
   *
   * @returns {Observable<Catalogo[]>} - Un observable que emite un arreglo de objetos `Catalogo` representando la lista de países.
   */
  obtenerListaPaises(): Observable<Catalogo[]> {
    return this.httpServicios
      .get<{ pais: Catalogo[] }>(this.jsonUrl)
      .pipe(map((res) => res.pais));
  }

  /**
   * Obtiene una lista de estados desde un endpoint JSON.
   *
   * @returns {Observable<Catalogo[]>} - Un `Observable` que emite un arreglo de objetos `Catalogo` representando los estados.
   */
  obtenerListaEstados(): Observable<Catalogo[]> {
    return this.httpServicios
      .get<{ estado: Catalogo[] }>(this.jsonUrl)
      .pipe(map((res) => res.estado));
  }

  /**
   * Obtiene una lista de municipios desde un endpoint JSON.
   *
   * @returns {Observable<Catalogo[]>} - Un observable que emite un arreglo de objetos `Catalogo` representando los municipios.
   */
  obtenerListaMunicipios(): Observable<Catalogo[]> {
    return this.httpServicios
      .get<{ municipio: Catalogo[] }>(this.jsonUrl)
      .pipe(map((res) => res.municipio));
  }

  /**
   * Obtiene la lista de localidades desde un archivo JSON.
   * 
   * @returns {Observable<Catalogo[]>} - Un observable que emite un arreglo de objetos del tipo `Catalogo`.
   */
  obtenerListaLocalidades(): Observable<Catalogo[]> {
    return this.httpServicios
      .get<{ localidad: Catalogo[] }>(this.jsonUrl)
      .pipe(map((res) => res.localidad));
  }

  /**
   * Obtiene una lista de códigos postales desde un servicio HTTP.
   * 
   * @returns {Observable<Catalogo[]>} - Un observable que emite un arreglo de objetos de tipo `Catalogo`.
   */
  obtenerListaCodigosPostales(): Observable<Catalogo[]> {
    return this.httpServicios
      .get<{ codigo_postal: Catalogo[] }>(this.jsonUrl)
      .pipe(map((res) => res.codigo_postal));
  }

  /**
   * Obtiene la lista de colonias desde un servicio HTTP.
   * 
   * @returns {Observable<Catalogo[]>} - Un observable que emite un arreglo de objetos de tipo `Catalogo`.
   */
  obtenerListaColonias(): Observable<Catalogo[]> {
    return this.httpServicios
      .get<{ colonia: Catalogo[] }>(this.jsonUrl)
      .pipe(map((res) => res.colonia));
  }
  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   * 
   * @param DATOS - Estado de la solicitud `Solicitud230501State` con la información 
   *                del tipo de solicitud a actualizar en el store.
   */
  actualizarEstadoFormulario(DATOS: Tramite230501State): void {
    this.tramite230501Store.update((state) => ({
      ...state,
      ...DATOS
    }))

  }

  /**
  * Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
  * 
  * @returns Observable con los datos del estado de la solicitud `Solicitud230501State`,
  *          cargados desde el archivo JSON especificado en la ruta de `assets`.
  */
  getRegistroTomaMuestrasMercanciasData(): Observable<Tramite230501State> {
    return this.httpServicios.get<Tramite230501State>('assets/json/230501/datos-previos.json');
  }
}
