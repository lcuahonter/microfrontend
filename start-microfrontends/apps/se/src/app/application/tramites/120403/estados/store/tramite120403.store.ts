import { Store, StoreConfig } from '@datorama/akita';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';

/**
 * Estado inicial del trámite 120403.
 * Contiene propiedades clave para la gestión del trámite.
 */
export interface Tramite120403State{
    asignacionRadio:boolean,
    asignacionsolitud:string,
    numTramite:string,
    anosDatos: Catalogo[];
    idSolicitud: number;
    showBuscar: boolean;
    ampliar:string
    fechaFin: string;
    isContinuarTriggered?: boolean;
    formValidity?: {
    asigncion?: boolean;
    solicitante?: boolean;
  }
}

/**
 * Función que establece el estado inicial del trámite.
 * Devuelve los valores predeterminados para cada propiedad.
 */

export function createInitialState(): Tramite120403State {
    return {
        asignacionRadio: false,
        asignacionsolitud: '',
        numTramite: '',
        anosDatos: [],
        idSolicitud: 0,
        showBuscar: false,
        ampliar: '',
        fechaFin: '',
        isContinuarTriggered: false,
        formValidity: {},    
    }
}
/**
 * Tienda Akita para la gestión del estado del trámite 120403.
 * Permite almacenar y actualizar la información del trámite en la aplicación.
 */
@Injectable({
    providedIn: 'root',
  })
  @StoreConfig({ name: 'tramite120403', resettable: true })
  export class Tramite120403Store extends Store<Tramite120403State> {
    constructor() {
      super(createInitialState());
    }

  /**
     * Método para actualizar datos en la tienda.
     * Recibe un objeto parcial con datos del trámite y los fusiona con el estado actual.
     *
     * @param datos Datos parciales a actualizar en la tienda.
  */
public establecerDatos(datos: Partial<Tramite120403State>): void {
  this.update((state) => ({
    ...state,
    ...datos,
  }));
}

/**
 * Método para actualizar años de datos en la tienda.
 * Recibe un array de catálogos y actualiza la propiedad anosDatos.
 *
 * @param anos Array de catálogos a establecer.
 */
  public setAnosDatos(anos: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      anosDatos: anos,
    }));
  }

  /**
 * Método para actualizar años de datos en la tienda.
 * Recibe un array de catálogos y actualiza la propiedad anosDatos.
 *
 * @param anos Array de catálogos a establecer.
 */
  public setBuscarSection(showBuscar: boolean): void {
    this.update((state) => ({
      ...state,
      showBuscar: showBuscar,
    }));
  }

  /**
   * Actualiza el estado de si se ha activado la acción de continuar.
   * @param isContinuarTriggered Indica si la acción de continuar ha sido activada.
   */
  public setContinuarTriggered(isContinuarTriggered: boolean): void {
    this.update((state) => ({
      ...state,
      isContinuarTriggered: isContinuarTriggered,
    }));
  }

   /**
 * Actualiza el estado de validez de un formulario específico dentro del trámite.
 * @param formName Nombre del formulario a actualizar.
 * @param isValid Indica si el formulario es válido o no.
 */
  setFormValidity(formName: string, isValid: boolean): void {
    this.update((state) => ({
      ...state,
      formValidity: {
        ...state.formValidity,
        [formName]: isValid,
      },
    }));
  }

/** Establece el ID de la solicitud en el estado actual. */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({ ...state, idSolicitud }));
  }
}