import { DatosModificacion, DatosSolicitante } from '../../tramites/80306/estados/models/datos-tramite.model';
import { Injectable } from '@angular/core';
import { Store, } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * Creacion del estado inicial para la interfaz de tramite 80306
 * @returns Solicitud80306
 */

/**
 * Representa el estado de la solicitud 80306.
 */
export interface Solicitud80306State {
  /**
   * Menú desplegable seleccionado.
   */
  menuDesplegable: string;

  /**
   * Datos del solicitante.
   */
  datosSolicitante: DatosSolicitante;

  /**
   * Información relacionada con la modificación.
   */
  datosModificacion: DatosModificacion;

  /**
   * Lista de datos del contenedor.
   */
  datosDelContenedor: [];

  /**
   * Tipo de búsqueda seleccionada.
   */
  tipoBusqueda: string;

  /**
   * Aduana seleccionada.
   */
  aduana: string;

  /**
   * Fecha de ingreso.
   */
  fechaIngreso: string;

  /**
   * Iniciales del contenedor.
   */
  inicialesContenedor: string;

  /**
   * Número del contenedor.
   */
  numeroContenedor: string;

  /**
   * Dígito de control del contenedor.
   */
  digitoDeControl: string;

  /**
   * Contenedores asociados.
   */
  contenedores: string;

  /**
   * Menú desplegable de aduanas.
   */
  aduanaMenuDesplegable: string;

  /**
   * Estado de las casillas de verificación individuales.
   */
  casillaDeVerificacionindividual: boolean[];

  /**
   * Número del manifiesto.
   */
  numeroManifiesta: number;

  /**
   * Fecha de ingreso del manifiesto.
   */
  fechaDeIngreso: string;

  /**
   * Archivo seleccionado.
   */
  archivoSeleccionado: string;

 /** linea
 * @type {string}
 */
  linea: string;

  /**
* linea checkbox
* @type {string}
*/
  lineaCheckbox: string;

  monto: string;

}

export function createInitialState(): Solicitud80306State {
  return {
    menuDesplegable: '',
    datosSolicitante: {
      rfc: "",
      denominacion: "",
      actividadEconomica: "",
      correoElectronico: ""
    },
    datosModificacion: {
      rfc: "",
      federal: "",
      tipo: "",
      programa: ""
    },   
    datosDelContenedor: [],
    tipoBusqueda: '',
    aduana: '',
    inicialesContenedor: '',
    numeroContenedor: '',
    digitoDeControl: '',
    contenedores: '',
    fechaIngreso: '',
    aduanaMenuDesplegable: '',
    casillaDeVerificacionindividual: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    numeroManifiesta: 0,
    fechaDeIngreso: '',
    archivoSeleccionado: '',
    linea: '',
    lineaCheckbox: '',
    monto: '',

  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite80306', resettable: true })
export class Tramite80306Store extends Store<Solicitud80306State> {
  constructor() {
    super(createInitialState());
  }

  /**
   * Guarda el tipo de solicitud en el estado.
   *
   * @param casillaDeVerificacionindividual - El tipo de solicitud que se va a guardar.
   */
  public setCasillaDeVerificacionindividual(casillaDeVerificacionindividual: []): void {
    this.update((state) => ({
      ...state,
      casillaDeVerificacionindividual,
    }));
  }

  /**
   * Establece el número de manifiesta en el estado de la tienda.
   *
   * @param numeroManifiesta - El número de manifiesta que se desea asignar.
   */
  public setNumeroManifiesta(numeroManifiesta: number): void {
    this.update((state) => ({
      ...state,
      numeroManifiesta,
    }));
  }

  /**
   * Establece el valor del menú desplegable en el estado de la tienda.
   *
   * @param menuDesplegable - El nuevo valor para el menú desplegable.
   */
  public setMenuDesplegable(menuDesplegable: string): void {
    this.update((state) => ({
      ...state,
      menuDesplegable,
    }));
  }

  /**
   * Establece el valor del menú desplegable de aduana en el estado de la tienda.
   *
   * @param aduanaMenuDesplegable - El nuevo valor para el menú desplegable de aduana.
   *                                Este valor se actualizará en el estado de la tienda.
   */
  public setAduanaMenuDesplegable(aduanaMenuDesplegable: string): void {
    this.update((state) => ({
      ...state,
      aduanaMenuDesplegable,
    }));
  }

  /**
   * Establece la fecha de ingreso en el estado de la tienda.
   *
   * @param fechaDeIngreso - La nueva fecha de ingreso que se debe establecer en el estado.
   *                          Debe ser una cadena en formato válido.
   */
  public setFechaDeIngreso(fechaDeIngreso: string): void {
    this.update((state) => ({
      ...state,
      fechaDeIngreso,
    }));
  }


  /**
   * Establece los datos del solicitante en el estado de la tienda.
   *
   * @param datosSolicitante - Objeto que contiene la información del solicitante.
   */
  public setDatosSolicitante(datosSolicitante: DatosSolicitante): void {
    this.update((state) => ({
      ...state,
      datosSolicitante
    }));
  }

  /**
   * Establece los datos de modificación en el estado de la tienda.
   *
   * @param datosModificacion - Objeto que contiene los datos de modificación que se deben actualizar en el estado.
   */
  public setDatosModificacion(datosModificacion: DatosModificacion): void {
    this.update((state) => ({
      ...state,
      datosModificacion
    }));
  }
  
  /**
   * Establece los datos del contenedor en el estado de la tienda.
   *
   * @param datosDelContenedor - Un arreglo que contiene los datos del contenedor a establecer.
   * 
   * @remarks
   * Este método actualiza el estado de la tienda con los datos proporcionados para el contenedor.
   */
  public setDelContenedor(datosDelContenedor: []): void {
    this.update((state) => ({
      ...state,
      datosDelContenedor
    }));
  }

  /**
   * Establece el tipo de búsqueda en el estado de la tienda.
   *
   * @param tipoBusqueda - El tipo de búsqueda que se desea establecer.
   */
  public setTipoBusqueda(tipoBusqueda: string): void {
    this.update((state) => ({
      ...state,
      tipoBusqueda
    }));
  }

  /**
   * Establece el valor de la propiedad "aduana" en el estado.
   *
   * @param aduana - El nuevo valor para la propiedad "aduana".
   */
  public setAduana(aduana: string): void {
    this.update((state) => ({
      ...state,
      aduana
    }));
  }

  
  public setFechaIngreso(fechaIngreso: string): void {
    this.update((state) => ({
      ...state,
      fechaIngreso
    }));
  }

  
  /**
   * Establece las iniciales del contenedor en el estado de la tienda.
   *
   * @param inicialesContenedor - Las iniciales del contenedor que se deben establecer.
   */
  public setInicialesContenedor(inicialesContenedor: string): void {
    this.update((state) => ({
      ...state,
      inicialesContenedor
    }));
  }


  /**
   * Establece el número de contenedor en el estado de la tienda.
   *
   * @param numeroContenedor - El número de contenedor que se va a asignar.
   * @returns void
   */
  public setNumeroContenedor(numeroContenedor: string): void {
    this.update((state) => ({
      ...state,
      numeroContenedor
    }));
  }

  
  /**
   * Establece el valor del dígito de control en el estado de la tienda.
   *
   * @param digitoDeControl - El nuevo valor del dígito de control que se debe establecer.
   */
  public setDigitoDeControl(digitoDeControl: string): void {
    this.update((state) => ({
      ...state,
      digitoDeControl
    }));
  }


  /**
   * Establece el valor de los contenedores en el estado de la tienda.
   *
   * @param contenedores - Una cadena que representa los contenedores a establecer en el estado.
   */
  public setContenedores(contenedores: string): void {
    this.update((state) => ({
      ...state,
      contenedores
    }));
  }


  /**
   * Establece el archivo seleccionado en el estado de la tienda.
   *
   * @param archivoSeleccionado - El nombre o identificador del archivo que se seleccionará.
   */
  public setArchivoSeleccionado(archivoSeleccionado: string): void {
    this.update((state) => ({
      ...state,
      archivoSeleccionado
    }));
  }

  /**
   * Establece el valor de la propiedad `linea` en el estado actual.
   *
   * @param linea - El nuevo valor para la propiedad `linea`.
   */
  public setLinea(linea: string): void {
    this.update((state) => ({
      ...state,
      linea,
    }));
  }


  /**
   * Establece el valor de la propiedad `lineaCheckbox` en el estado.
   *
   * @param lineaCheckbox - El nuevo valor para la propiedad `lineaCheckbox`.
   */
  public setLineaCheckbox(lineaCheckbox: string): void {
    this.update((state) => ({
      ...state,
      lineaCheckbox,
    }));
  }

  /**
   * Establece el valor de "monto" en el estado.
   *
   * @param monto - El nuevo valor de "monto" que se asignará al estado.
   */
  public setMonto(monto: string): void {
    this.update((state) => ({
      ...state,
      monto,
    }));
  }

  /**
   * Limpia los datos de la solicitud
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}