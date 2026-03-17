import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * ## Solicitud40302State
 * 
 * Esta interfaz define la estructura del estado de una solicitud 40302.
 */
export interface Solicitud40302State {
  /**
   * ## cveFolioCaat
   * 
   * Clave del folio de CAAT.
   */
  cveFolioCaat: string;

  /**
   * ## descTipoCaat
   * 
   * Descripción del tipo de CAAT.
   */
  descTipoCaat: string;

  /**
   * ## descTipoAgente
   * 
   * Descripción del tipo de agente.
   */
  descTipoAgente: string;

  /**
   * ## directorGeneralNombre
   * 
   * Nombre del director general.
   */
  directorGeneralNombre: string;

  /**
   * ## primerApellido
   * 
   * Primer apellido.
   */
  primerApellido: string;

  /**
   * ## segundoApellido
   * 
   * Segundo apellido.
   */
  segundoApellido: string;
}

/**
 * ## createInitialState
 * 
 * Esta función crea el estado inicial de la solicitud.
 * 
 * ### Retorno
 * Un objeto `Solicitud40302State` con todos los campos vacíos.
 */
export function createInitialState(): Solicitud40302State {
  return {
    cveFolioCaat: '',
    descTipoCaat: '',
    descTipoAgente: '',
    directorGeneralNombre: '',
    primerApellido: '',
    segundoApellido: '',
  };
}

/**
 * ## Decorador @Injectable
 * 
 * Este decorador hace que el servicio sea inyectable en la aplicación.
 * 
 * ### Parámetros
 * - **providedIn**: `'root'`  
 *   Indica que el servicio está disponible en el nivel raíz de la aplicación, lo que significa que puede ser inyectado en cualquier componente o servicio sin necesidad de declararlo en un módulo específico.
 */
@Injectable({ providedIn: 'root' })
/**
 * ## Decorador @StoreConfig
 * 
 * Configura el almacén de estado con las siguientes opciones:
 * 
 * ### Parámetros
 * - **name**: `'solicitud40302'`  
 *   Nombre del almacén de estado.
 * - **resettable**: `true`  
 *   Indica que el almacén puede ser reseteado a su estado inicial.
 */
@StoreConfig({ name: 'solicitud40302', resettable: true })
/**
 * ## Solicitud40302Store
 * 
 * Este almacén de estado (`Store`) gestiona los datos relacionados con una solicitud 40302 utilizando Akita.
 * 
 * ### Constructor
 * 
 * Inicializa el almacén con el estado inicial creado por `createInitialState`.
 */
export class Solicitud40302Store extends Store<Solicitud40302State> {
  /**
 * ## Constructor
 * 
 * Inicializa el almacén de estado con el estado inicial creado por `createInitialState`.
 * 
 * ### Funcionalidad
 * Llama al constructor del padre (`Store`) y establece el estado inicial del almacén.
 */
  constructor() {
    super(createInitialState());
  }

  /**
   * ## setDirectorGeneralNombre
   * 
   * Establece el nombre del director general en el estado.
   * 
   * ### Parámetros
   * - **directorGeneralNombre**: `string`  
   *   Nuevo nombre del director general.
   * 
   * ### Funcionalidad
   * Actualiza el estado manteniendo los demás campos intactos.
   */
  public setDirectorGeneralNombre(directorGeneralNombre: string): void {
    this.update((state) => ({
      ...state,
      directorGeneralNombre,
    }));
  }

  /**
   * ## setPrimerApellido
   * 
   * Establece el primer apellido en el estado.
   * 
   * ### Parámetros
   * - **primerApellido**: `string`  
   *   Nuevo primer apellido.
   * 
   * ### Funcionalidad
   * Actualiza el estado manteniendo los demás campos intactos.
   */
  public setPrimerApellido(primerApellido: string): void {
    this.update((state) => ({
      ...state,
      primerApellido,
    }));
  }

  /**
   * ## setSegundoApellido
   * 
   * Establece el segundo apellido en el estado.
   * 
   * ### Parámetros
   * - **segundoApellido**: `string`  
   *   Nuevo segundo apellido.
   * 
   * ### Funcionalidad
   * Actualiza el estado manteniendo los demás campos intactos.
   */
  public setSegundoApellido(segundoApellido: string): void {
    this.update((state) => ({
      ...state,
      segundoApellido,
    }));
  }

  /**
   * ## resetStore
   * 
   * Resetea el almacén a su estado inicial.
   * 
   * ### Funcionalidad
   * Utiliza el método `reset` de Akita para restaurar el estado inicial.
   */
  resetStore(): void {
    this.reset();
  }
}
