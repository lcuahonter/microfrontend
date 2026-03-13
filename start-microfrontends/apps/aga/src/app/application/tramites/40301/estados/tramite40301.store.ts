import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * ## Tramite40301State
 * 
 * Esta interfaz define la estructura del estado de una solicitud 40301.
 */
export interface Tramite40301State {
  /**
   * ## cveFolioCaat
   * 
   * Clave del folio de CAAT.
   */
  cveFolioCaat: string;

  /**
   * ## rol
   * 
   * Descripción del user role.
   */
  rol: string;

  /**
   * ## descTipoAgente
   * 
   * Descripción del tipo de agente.
   */
  tipoAgente: string;

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

  idSolicitud: number | null;
}

/**
 * ## createInitialState
 * 
 * Esta función crea el estado inicial de la solicitud.
 * 
 * ### Retorno
 * Un objeto `Tramite40301State` con todos los campos vacíos.
 */
export function createInitialState(): Tramite40301State {
  return {
    cveFolioCaat: '',
    rol: '',
    tipoAgente: '',
    directorGeneralNombre: '',
    primerApellido: '',
    segundoApellido: '',
    idSolicitud: null
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
 * - **name**: `'tramite40301'`  
 *   Nombre del almacén de estado.
 * - **resettable**: `true`  
 *   Indica que el almacén puede ser reseteado a su estado inicial.
 */
@StoreConfig({ name: 'tramite40301', resettable: true })
/**
 * ## Tramite40301Store
 * 
 * Este almacén de estado (`Store`) gestiona los datos relacionados con una solicitud 40301 utilizando Akita.
 * 
 * ### Constructor
 * 
 * Inicializa el almacén con el estado inicial creado por `createInitialState`.
 */
export class Tramite40301Store extends Store<Tramite40301State> {
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
   * Establece los valores iniciales para el estado de `Tramite40301Store`.
   *
   * @param store - La instancia del almacén de tipo `Tramite40301Store` a actualizar.
   * @returns El estado actualizado de tipo `Tramite40301State` con valores iniciales predefinidos.
   *
   * La función inicializa las siguientes propiedades en el estado:
   * - `cveFolioCaat`: Una cadena que representa el código de folio CAAT, inicializado a '3L6V'.
   * - `descTipoCaat`: Una cadena que describe el tipo de CAAT, inicializado a 'Naviero'.
   * - `tipoAgente`: Una cadena que representa el tipo de agente, inicializado a 'Agente Naviero'.
   * - `directorGeneralNombre`: Una cadena que representa el nombre del director general, inicializado a 'HAZEL'.
   * - `primerApellido`: Una cadena que representa el primer apellido del director general, inicializado a 'NAVA'.
   * - `segundoApellido`: Una cadena que representa el segundo apellido del director general, inicializado a 'AVILA'.
   * - `rol`: Una cadena que representa el rol, inicializado a 'Agente Naviero'.
   */
  public setInitialValues(): Tramite40301State {
    return this.update((state) => ({
      ...state,
      cveFolioCaat: '3L6V',
      descTipoCaat: 'Naviero',
      tipoAgente: 'Agente Naviero',
      directorGeneralNombre: 'HAZEL',
      primerApellido: 'NAVA',
      segundoApellido: 'AVILA',
      rol: 'Agente Naviero',
    }));
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
   * ## setRol
   * Establece el rol en el estado.
   * ### Parámetros
   * - **rol**: `string`  
   *   Nuevo rol.
   * ### Funcionalidad
   * Actualiza el estado manteniendo los demás campos intactos.
   */
  public setRol(rol: string): void {
    this.update((state) => ({
      ...state,
      rol: rol,
    }));
  }

  /**
   * ## setTipoAgente
   * 
   * Establece el tipo de agente en el estado.
   * 
   * ### Parámetros
   * - **tipoAgente**: `string`  
   *   Nuevo tipo de agente.
   * 
   * ### Funcionalidad
   * Actualiza el estado manteniendo los demás campos intactos.
   */
  public setTipoAgente(tipoAgente: string): void {
    this.update((state) => ({
      ...state,
      tipoAgente,
    }));
  }

  
  /**
   * Establece el id de la solicitud en el estado
   *
   * @param {number} idSolicitud
   * @memberof Tramite40301Store
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
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
