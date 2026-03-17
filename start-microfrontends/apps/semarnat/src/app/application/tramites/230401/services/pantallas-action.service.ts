/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Inicializa los datos de los catálogos para el primer paso.
 *
 * Este método realiza solicitudes HTTP para obtener varios catálogos desde archivos JSON locales y asigna los datos recibidos a las propiedades correspondientes de la clase.
 * 
 * - `tiposSolicitud`: Obtiene los tipos de solicitud desde `tiposDeSolicitud.json`.
 * - `noDePermisocoferprise`: Obtiene los datos desde `noDePermisocoferprise.json`.
 * - `fraccionArancelaria`: Obtiene los datos desde `fraccionArancelaria.json`.
 * - `numeroCas`: Obtiene los datos desde `numeroCas.json`.
 * - `clasificacion`: Obtiene los datos desde `clasificacion.json`.
 * - `estadoFisico`: Obtiene los datos desde `estadoFisico.json`.
 * - `datosObjecto`: Obtiene los datos desde `datosObjecto.json`.
 * - `unidadDeMedida`: Obtiene los datos desde `unidadDeMedida.json`.
 */
import { Catalogo, RespuestaCatalogos } from '@ng-mf/data-access-user';
import { Solicitud230401State, Tramite230401Store } from '../estados/tramite230401.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Decorador `@Injectable` que define un servicio como una clase que puede ser inyectada en otros componentes o servicios.
 * 
 * Este servicio está configurado con el proveedor `root`, lo que significa que se crea una única instancia compartida en toda la aplicación.
 * 
 * @remarks
 * Este servicio está diseñado para gestionar las acciones relacionadas con las pantallas del trámite 230401. Proporciona métodos para inicializar y manejar los datos de los catálogos necesarios en el proceso del trámite, así como para actualizar el estado del formulario y obtener datos específicos desde archivos JSON.
 * 
 * @author Muneez
 */
@Injectable({
  providedIn: 'root'
})
/**
 * Servicio para gestionar las acciones relacionadas con las pantallas del trámite 230401.
 * 
 * Este servicio proporciona métodos para inicializar y manejar los datos de los catálogos 
 * necesarios en el proceso del trámite, así como para actualizar el estado del formulario 
 * y obtener datos específicos desde archivos JSON.
 * 
 * @author Muneez
 * @remarks
 * Los métodos de este servicio están diseñados para interactuar con servicios HTTP y 
 * manejar el estado global del trámite mediante el store correspondiente.
 */
export class PantallasActionService {
/**
 * Catálogo de tipos de solicitud disponibles para selección.
 * 
 * Se utiliza para mostrar las distintas opciones de tipo de trámite
 * que el usuario puede elegir al iniciar una solicitud.
 *
 * @type {Catalogo[]}
 */
tiposSolicitud: Catalogo[] = [];

/**
 * Catálogo de números de permiso Cofepris disponibles.
 * 
 * Proporciona una lista de identificadores válidos emitidos por Cofepris
 * para seleccionar dentro del formulario de solicitud.
 *
 * @type {Catalogo[]}
 */
noDePermisocoferprise: Catalogo[] = [];

/**
 * Catálogo de fracciones arancelarias.
 * 
 * Este catálogo permite seleccionar la fracción arancelaria correspondiente
 * a la mercancía para efectos de clasificación aduanera.
 *
 * @type {Catalogo[]}
 */
fraccionArancelaria: Catalogo[] = [];

/**
 * Catálogo de números CAS disponibles.
 * 
 * El número CAS (Chemical Abstracts Service) permite identificar de forma única
 * sustancias químicas incluidas en la solicitud.
 *
 * @type {Catalogo[]}
 */
numeroCas: Catalogo[] = [];

/**
 * Catálogo de clasificaciones posibles para la mercancía.
 * 
 * Se utiliza para seleccionar la clasificación regulatoria, química u otra
 * aplicable al producto.
 *
 * @type {Catalogo[]}
 */
clasificacion: Catalogo[] = [];

/**
 * Catálogo de estados físicos de la sustancia o mercancía.
 * 
 * Permite seleccionar si el producto es sólido, líquido, gaseoso, etc.,
 * información importante para la gestión del trámite.
 *
 * @type {Catalogo[]}
 */
estadoFisico: Catalogo[] = [];

/**
 * Catálogo de objetos o finalidades de uso.
 * 
 * Define el propósito específico del producto dentro del trámite (por ejemplo,
 * industrial, agrícola, farmacéutico, etc.).
 *
 * @type {Catalogo[]}
 */
datosObjecto: Catalogo[] = [];

/**
 * Catálogo de unidades de medida.
 * 
 * Define las unidades en las que se reportan las cantidades (litros, kilogramos, etc.).
 * Fundamental para la precisión del trámite.
 *
 * @type {Catalogo[]}
 */
unidadDeMedida: Catalogo[] = [];

/**
 * Catálogo adicional para opciones del banco u otras entidades relacionadas.
 * 
 * Su uso específico puede estar relacionado con validaciones complementarias o
 * referencias de instituciones financieras.
 *
 * @type {Catalogo[]}
 */
listoBanco: Catalogo[] = [];

/**
 * Constructor principal del componente.
 * 
 * Inyecta servicios necesarios como el cliente HTTP para llamadas a API y el store
 * del trámite 230401 para el manejo del estado global.
 *
 * @param {HttpClient} httpServicios - Cliente HTTP para consumo de servicios externos
 * @param {Tramite230401Store} tramite230401Store - Store con el estado de la solicitud
 */
constructor(
  public httpServicios: HttpClient,
  public tramite230401Store: Tramite230401Store
) {
}



  /**
   * Inicializa los datos de los catálogos necesarios para el paso uno.
   *
   * Este método realiza múltiples solicitudes a diferentes servicios para obtener datos de catálogos específicos.
   * Los datos obtenidos se asignan a las propiedades correspondientes para su uso posterior.
   *
   * Las solicitudes realizadas son:
   * - Tipos de solicitud
   * - Número de permiso coferprise
   * - Fracción arancelaria
   * - Número CAS
   * - Clasificación
   * - Estado físico
   * - Datos de objeto
   * - Unidad de medida
   */
  public inicializaPasoUnoDatosCatalogos(): void {
    /**
     * Obtiene los tipos de solicitud desde el catálogo y los asigna a `datosTiposSolicitud`.
     *
     * Este método realiza una solicitud al servicio `catalogosServices` para obtener el catálogo de tipos de solicitud identificado por `CATALOGOS_ID.CAT_TIPO_SOL`. Una vez que recibe la  respuesta, verifica si la respuesta contiene elementos. Si es así, asigna los datos recibidos a la propiedad `datosTiposSolicitud` con la estructura adecuada.
     */
    this.obtenerRespuestaPorUrl(this, 'tiposSolicitud', '/230401/tiposDeSolicitud.json');
    this.obtenerRespuestaPorUrl(this, 'noDePermisocoferprise', '/230401/noDePermisocoferprise.json');
    this.obtenerRespuestaPorUrl(this, 'fraccionArancelaria', '/230401/fraccionArancelaria.json');
    this.obtenerRespuestaPorUrl(this, 'numeroCas', '/230401/numeroCas.json');
    this.obtenerRespuestaPorUrl(this, 'clasificacion', '/230401/clasificacion.json');
    this.obtenerRespuestaPorUrl(this, 'estadoFisico', '/230401/estadoFisico.json');
    this.obtenerRespuestaPorUrl(this, 'datosObjecto', '/230401/datosObjecto.json');
    this.obtenerRespuestaPorUrl(this, 'unidadDeMedida', '/230401/unidadDeMedida.json');
  }

  /**
   * Inicializa el catálogo de pago de derechos.
   * 
   * Este método obtiene la respuesta desde una URL específica y la asigna a la propiedad 'listoBanco'.
   * 
   * @returns {void}
   */
  inicializaPagoDerechosCatalogo():void {
    this.obtenerRespuestaPorUrl(this, 'listoBanco', '/230401/pagoDerechosBanco.json');
  }

  /**
   * Obtiene una respuesta desde una URL y asigna los datos a una variable.
   *
   * @param {string} variable - El nombre de la variable donde se almacenarán los datos de la respuesta.
   * @param {string} url - La URL desde la cual se obtendrá la respuesta.
   * @param {Object} self - El objeto que contiene la variable donde se almacenarán los datos de la respuesta.
   * @returns {void}
   * @author Muneez
   * @remarks
   * Si la variable y la URL son válidas, se realiza una solicitud HTTP GET a la URL especificada.
   * Si la respuesta tiene un código 200 y contiene datos, estos se asignan a la variable especificada.
   * Si la variable o la URL no son válidas, se asigna un arreglo vacío a la variable.
   */
  obtenerRespuestaPorUrl(self: any, variable: string, url: string) :void {
    if (self && variable && url) {
      this.httpServicios.get<RespuestaCatalogos>(`assets/json${url}`).subscribe((resp): void => {
        self[variable] = resp?.code === 200 && resp.data ? resp.data : [];
      });
    }
  }

/**
 * Actualiza el estado del formulario con los datos proporcionados.
 * 
 * @param DATOS - Estado de la solicitud `Solicitud230401State` con la información 
 *                del tipo de solicitud a actualizar en el store.
 */
actualizarEstadoFormulario(DATOS: Solicitud230401State): void {
  // this.tramite230401Store.setTipoSolicitud(DATOS.tipoSolicitud);
  this.tramite230401Store.update((state) => ({
    ...state,
    ...DATOS
  }))

}

/**
* Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
* 
* @returns Observable con los datos del estado de la solicitud `Solicitud230401State`,
*          cargados desde el archivo JSON especificado en la ruta de `assets`.
*/
getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud230401State> {
  return this.httpServicios.get<Solicitud230401State>('assets/json/230401/respuestaDeActualizacionDe.json');
}

}
