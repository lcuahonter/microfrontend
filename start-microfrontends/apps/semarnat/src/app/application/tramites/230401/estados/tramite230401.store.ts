import { PagoDerechosState, SustanciaSensible } from "../models/tramies230401.model";
import { Store, StoreConfig } from "@datorama/akita";
import { Injectable } from "@angular/core";

/**
 * Representa el estado de la solicitud 230401.
 * Contiene información detallada sobre la solicitud, incluyendo datos comerciales, químicos, 
 * clasificación, estado físico, cantidad, unidad de medida y derechos de pago.
 */
export interface Solicitud230401State {
  /**
   * Tipo de solicitud realizada.
   * @example "Importación"
   */
  tipoSolicitud: string;

  /**
   * Indica si la solicitud ha sido autorizada.
   * @example true
   */
  autorizada: boolean;

  /**
   * Número de permiso de la empresa.
   * @example "12345-ABC"
   */
  noDePermisocoferprise: string;

  /**
   * Nombre comercial asociado a la solicitud.
   * @example "Comercializadora XYZ"
   */
  nombreComercial: string;

  /**
   * Cantidad autorizada para la solicitud.
   * @example "500 kg"
   */
  cantidadAutorizada: string;

  /**
   * Fracción arancelaria correspondiente.
   * @example "2903.15.00"
   */
  fraccionArancelaria: string;

  /**
   * Descripción de la fracción arancelaria.
   * @example "Compuestos orgánicos"
   */
  descripcionDeLaFraccion: string;

  /**
   * Número CAS (Chemical Abstracts Service) de la sustancia.
   * @example "50-00-0"
   */
  numeroCas: string;

  /**
   * Descripción no arancelaria de la sustancia.
   * @example "Formaldehído"
   */
  descripcionNoArancelaria: string;

  /**
   * Nombre químico de la sustancia.
   * @example "Metanal"
   */
  nombreQuimico: string;

  /**
   * Nombre de la mercancía asociada.
   * @example "Solución de formaldehído"
   */
  nombreDeLaMercancia: string;

  /**
   * Número UN (United Nations) para transporte de mercancías peligrosas.
   * @example 2209
   */
  unNumero: string;

  /**
   * Datos adicionales sobre el nombre comercial.
   * @example "Producto registrado bajo la marca XYZ"
   */
  datosNombreComercial: string;

  /**
   * Datos adicionales sobre el número común.
   * @example "Número común asociado a la sustancia"
   */
  datosNumeroComun: string;

  /**
   * Porcentaje de concentración de la sustancia.
   * @example 37.5
   */
  datosPorcentaje: string;

  /**
   * Componentes adicionales de la sustancia.
   * @example "Agua, metanol"
   */
  datosComponentes: string;

  /**
   * Clasificación de la sustancia o mercancía.
   * @example "Sustancia peligrosa"
   */
  clasificacion: string;

  /**
   * Estado físico de la sustancia.
   * @example "Líquido"
   */
  estadoFisico: string;

  /**
   * Datos adicionales sobre el objeto de la solicitud.
   * @example "Importación para uso industrial"
   */
  datosObjecto: string;

  /**
   * Especificación adicional sobre la solicitud.
   * @example "Uso en procesos de manufactura"
   */
  especifique: string;

  /**
   * Segunda especificación adicional sobre la solicitud.
   * @example "Uso en laboratorio químico"
   */
  especifiqueDos: string;

  /**
   * Cantidad solicitada.
   * @example 500
   */
  cantidad: string;

  /**
   * Cantidad solicitada en letras.
   * @example "Quinientos kilogramos"
   */
  cantidadLetra: string;

  /**
   * Unidad de medida de la cantidad solicitada.
   * @example "kg"
   */
  unidadDeMedida: string;

  /**
   * Estado relacionado con el pago de derechos.
   */
  pagoDerechosState: PagoDerechosState;

  /**
   * Tabla de datos sobre sustancias sensibles.
   */
  sustanciasSensiblesTablaDatos: SustanciaSensible[];
}

/**
 * Inicializa el estado de Solicitud230401.
 * 
 * @returns {Solicitud230401State} El estado inicial de Solicitud230401.
 */
export function initializeSolicitud230401State(): Solicitud230401State {
  return {
    tipoSolicitud: '',
    autorizada: false,
    noDePermisocoferprise: '',
    nombreComercial: '',
    cantidadAutorizada: '',
    fraccionArancelaria: '',
    descripcionDeLaFraccion: '',
    numeroCas: '',
    descripcionNoArancelaria: '',
    nombreQuimico: '',
    nombreDeLaMercancia: '',
    unNumero: '',
    datosNombreComercial: '',
    datosNumeroComun: '',
    datosPorcentaje: " ",
    datosComponentes: '',
    clasificacion: '',
    estadoFisico: '',
    datosObjecto: '',
    especifique: '',
    especifiqueDos: '',
    cantidad: '',
    cantidadLetra: '',
    unidadDeMedida: '',
    sustanciasSensiblesTablaDatos: [],
    pagoDerechosState: {
      clave: '084001963',
      dependencia: '0100160910791',
      banco: '',
      llavePago: '12345LLPCI',
      fecha: '',
      importePago: '1842'
    }
  }
}

/**
 * Clase que representa el almacén de estado para el trámite 230401.
 * Proporciona métodos para actualizar diferentes propiedades del estado relacionado con el trámite.
 * 
 * @remarks
 * Esta clase utiliza Akita para la gestión del estado.
 * Cada método permite actualizar una propiedad específica del estado.
 * 
 * @example
 * ```typescript
 * const store = new Tramite230401Store();
 * store.setTipoSolicitud('Importación');
 * store.setCantidad(100);
 * ```
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite230401', resettable: true })
/**
 * Guarda el nombre de la mercancía en el estado.
 *
 * @param nombreDeLaMercancia - El nombre de la mercancía que se va a guardar.
 */
export class Tramite230401Store extends Store<Solicitud230401State> {
  constructor() {
    super(initializeSolicitud230401State());
  }
  /**
 * Guarda el tipo de solicitud en el estado.
 *
 * @param tipoSolicitud - El tipo de solicitud que se va a guardar.
 */
  public setTipoSolicitud(tipoSolicitud: string):void {
    this.update((state) => ({
      ...state,
      tipoSolicitud,
    }));
  }

  /**
 * Guarda el tipo de solicitud en el estado.
 *
 * @param autorizacion - El tipo de solicitud que se va a guardar.
 */
  public setAutorizacion(autorizacion: boolean):void {
    this.update((state) => ({
      ...state,
      autorizacion,
    }));
  }

  /**
 * Guarda el tipo de solicitud en el estado.
 *
 * @param noDePermisocoferprise - El tipo de solicitud que se va a guardar.
 */
  public setNoDePermisocoferprise(noDePermisocoferprise: string):void {
    this.update((state) => ({
      ...state,
      noDePermisocoferprise,
    }));
  }

  /**
 * Guarda el tipo de solicitud en el estado.
 *
 * @param nombreComercial - El tipo de solicitud que se va a guardar.
 */
  public setNombreComercial(nombreComercial: string):void {
    this.update((state) => ({
      ...state,
      nombreComercial,
    }));
  }

  /**
 * Guarda el tipo de solicitud en el estado.
 *
 * @param cantidadAutorizada - El tipo de solicitud que se va a guardar.
 */
  public setCantidadAutorizada(cantidadAutorizada: string): void {
    this.update((state) => ({
      ...state,
      cantidadAutorizada,
    }));
  }

  /**
* Guarda el tipo de solicitud en el estado.
*
* @param descripcionDeLaFraccion - El tipo de solicitud que se va a guardar.
*/
  public setDescripcionDeLaFraccion(descripcionDeLaFraccion: string): void {
    this.update((state) => ({
      ...state,
      descripcionDeLaFraccion,
    }));
  }

  /**
* Guarda el tipo de solicitud en el estado.
*
* @param fraccionArancelaria - El tipo de solicitud que se va a guardar.
*/
  public setFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria,
    }));
  }
  /**
* Guarda el tipo de solicitud en el estado.
*
* @param numeroCas - El tipo de solicitud que se va a guardar.
*/
  public setNumeroCas(numeroCas: string): void {
    this.update((state) => ({
      ...state,
      numeroCas,
    }));
  }

  /**
* Guarda el tipo de solicitud en el estado.
*
* @param descripcionNoArancelaria - El tipo de solicitud que se va a guardar.
*/
  public setDescripcionNoArancelaria(descripcionNoArancelaria: string): void {
    this.update((state) => ({
      ...state,
      descripcionNoArancelaria,
    }));
  }

  /**
 * Guarda el tipo de solicitud en el estado.
 *
 * @param nombreQuimico - El tipo de solicitud que se va a guardar.
 */
  public setNombreQuimico(nombreQuimico: string): void {
    this.update((state) => ({
      ...state,
      nombreQuimico,
    }));
  }

  /**
   * Actualiza el estado con el nombre de la mercancía proporcionado.
   *
   * @param nombreDeLaMercancia - El nombre de la mercancía que se establecerá en el estado.
   */
  public setNombreDeLaMercancia(nombreDeLaMercancia: string): void {
    this.update((state) => ({
      ...state,
      nombreDeLaMercancia,
    }));
  }

  /**
   * Guarda el número UN en el estado.
   *
   * @param unNumero - El número UN que se va a guardar.
   */
  public setUnNumero(unNumero: string): void {
    this.update((state) => ({
      ...state,
      unNumero,
    }));
  }

  /**
   * Guarda el nombre comercial de los datos en el estado.
   *
   * @param datosNombreComercial - El nombre comercial de los datos que se va a guardar.
   */
  public setDatosNombreComercial(datosNombreComercial: string): void {
    this.update((state) => ({
      ...state,
      datosNombreComercial,
    }));
  }

  /**
   * Guarda el número común de los datos en el estado.
   *
   * @param datosNumeroComun - El número común de los datos que se va a guardar.
   */
  public setDatosNumeroComun(datosNumeroComun: string): void {
    this.update((state) => ({
      ...state,
      datosNumeroComun,
    }));
  }

  /**
   * Guarda el porcentaje de los datos en el estado.
   *
   * @param datosPorcentaje - El porcentaje de los datos que se va a guardar.
   */
  public setDatosPorcentaje(datosPorcentaje: string): void {
    this.update((state) => ({
      ...state,
      datosPorcentaje,
    }));
  }

  /**
   * Guarda los componentes de los datos en el estado.
   *
   * @param datosComponentes - Los componentes de los datos que se van a guardar.
   */
  public setDatosComponentes(datosComponentes: string): void {
    this.update((state) => ({
      ...state,
      datosComponentes,
    }));
  }

  /**
   * Guarda la clasificación en el estado.
   *
   * @param clasificacion - La clasificación que se va a guardar.
   */
  public setClasificacion(clasificacion: string): void {
    this.update((state) => ({
      ...state,
      clasificacion,
    }));
  }

  /**
   * Guarda el estado físico en el estado.
   *
   * @param estadoFisico - El estado físico que se va a guardar.
   */
  public setEstadoFisico(estadoFisico: string): void {
    this.update((state) => ({
      ...state,
      estadoFisico,
    }));
  }

  /**
   * Guarda el objeto de los datos en el estado.
   *
   * @param datosObjecto - El objeto de los datos que se va a guardar.
   */
  public setDatosObjecto(datosObjecto: string): void {
    this.update((state) => ({
      ...state,
      datosObjecto,
    }));
  }

  /**
   * Guarda la especificación en el estado.
   *
   * @param especifique - La especificación que se va a guardar.
   */
  public setEspecifique(especifique: string): void {
    this.update((state) => ({
      ...state,
      especifique,
    }));
  }

  /**
   * Guarda la cantidad en el estado.
   *
   * @param cantidad - La cantidad que se va a guardar.
   */
  public setCantidad(cantidad: string): void {
    this.update((state) => ({
      ...state,
      cantidad,
    }));
  }

  /**
   * Guarda la cantidad en letras en el estado.
   *
   * @param cantidadLetra - La cantidad en letras que se va a guardar.
   */
  public setCantidadLetra(cantidadLetra: string): void {
    this.update((state) => ({
      ...state,
      cantidadLetra,
    }));
  }

  /**
   * Guarda la unidad de medida en el estado.
   *
   * @param unidadDeMedida - La unidad de medida que se va a guardar.
   */
  public setUnidadDeMedida(unidadDeMedida: string): void {
    this.update((state) => ({
      ...state,
      unidadDeMedida,
    }));
  }

  /**
   * Guarda la segunda especificación en el estado.
   *
   * @param especifiqueDos - La segunda especificación que se va a guardar.
   */
  public setEspecifiqueDos(especifiqueDos: string): void {
    this.update((state) => ({
      ...state,
      especifiqueDos,
    }));
  }

  /**
   * Establece el estado de pago de derechos.
   *
   * @param {PagoDerechosState} pagoDerechosState - El nuevo estado de pago de derechos.
   * @returns {void}
   */
  public setPagoDerechosState(pagoDerechosState: PagoDerechosState): void {
    this.update((state) => ({
      ...state,
      pagoDerechosState,
    }));
  }

  /**
   * Establece una propiedad del estado de pago de derechos.
   *
   * @param property - El nombre de la propiedad del estado de pago de derechos que se va a actualizar.
   * @param value - El nuevo valor para la propiedad especificada.
   * @returns void
   */
  public setPagoDerechosStateProperty(property: string, value: string): void {
    this.update((state) => ({
      ...state,
      pagoDerechosState: {
        ...state.pagoDerechosState,
        [property]: value,
      },
    }));
  }

  
  /**
   * Agrega un nuevo elemento a la lista de datos de sustancias sensibles en el estado.
   *
   * @param sustanciasSensiblesTablaDatos - El objeto de tipo `SustanciaSensible` que se añadirá a la lista existente.
   * 
   * Este método actualiza el estado actualizando la propiedad `sustanciasSensiblesTablaDatos` 
   * con una nueva lista que incluye el nuevo elemento proporcionado.
   */
  public setSustanciasSensiblesTablaDatos(sustanciasSensiblesTablaDatos: SustanciaSensible[]): void {
    this.update((state) => ({
      ...state,
      sustanciasSensiblesTablaDatos
    }));
  }

  setFecha(fecha: Date): void {
    this.update((state) => ({
      ...state,
      fecha
    }));
  }

}