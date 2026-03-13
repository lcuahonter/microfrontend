import { Injectable } from '@angular/core';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';
/**
 * Interfaz que define el estado inicial para los datos de un trámite.
 * Contiene todas las propiedades necesarias para gestionar la información
 * relacionada con un trámite.
 */
export interface DatosProcedureState {
  /**
   * Identificador genérico del trámite.
   * @type {string}
   */
  ideGenerica1: string;

  /**
   * Observaciones relacionadas con el trámite.
   * @type {string}
   */
  observaciones: string;

  /**
   * Denominación del trámite.
   * @type {string}
   */
  denominacion: string;

  /**
   * Código del trámite.
   * @type {string}
   */
  codigo: string;

  /**
   * Estado donde se realiza el trámite.
   * @type {string}
   */
  estado: string;

  /**
   * Municipio donde se realiza el trámite.
   * @type {string}
   */
  municipio: string;

  /**
   * Localidad donde se realiza el trámite.
   * @type {string}
   */
  localidad: string;

  /**
   * Colonia donde se realiza el trámite.
   * @type {string}
   */
  colonia: string;

  /**
   * Calle donde se realiza el trámite.
   * @type {string}
   */
  calle: string;

  /**
   * Correo electrónico asociado al trámite.
   * @type {string}
   */
  correo: string;

  /**
   * Información sanitaria relacionada con el trámite.
   * @type {string}
   */
  sanitario: string;

  /**
   * Lada telefónica asociada.
   * @type {string}
   */
  lada: string;

  /**
   * Teléfono de contacto.
   * @type {string}
   */
  telefono: string;

  /**
   * Información sobre el funcionamiento del trámite.
   * @type {string}
   */
  funcionamiento: string;

  /**
   * Licencia asociada al trámite.
   * @type {string}
   */
  licencia: string;

  /**
   * RFC del representante legal.
   * @type {string}
   */
  representanteLegalRFC: string;

  /**
   * Nombre del representante legal.
   * @type {string}
   */
  representanteLegalNombre: string;

  /**
   * Campo de búsqueda relacionado con el trámite.
   * @type {string}
   */
  buscar: string;

  /**
   * Apellido paterno del representante legal.
   * @type {string}
   */
  representanteLegalApPaterno: string;

  /**
   * Apellido materno del representante legal.
   * @type {string}
   */
  representanteLegalApMaterno: string;

  /**
   * Régimen asociado al trámite.
   * @type {string}
   */
  regimen: string;

  /**
   * Información confidencial relacionada con el trámite.
   * @type {string}
   */
  informacionConfidencial: string;

  /**
   * Información sobre aduanas.
   * @type {string}
   */
  aduanas: string;

  /**
   * Clave de referencia del trámite.
   * @type {string}
   */
  claveDeReferencia: string;

  /**
   * Cadena de pago de la dependencia.
   * @type {string}
   */
  cadenaPagoDependencia: string;

  /**
   * Clave del banco asociada al trámite.
   * @type {string}
   */
  bancoClave: string;

  /**
   * Llave de pago asociada al trámite.
   * @type {string}
   */
  llaveDePago: string;

  /**
   * Fecha de pago del trámite.
   * @type {string}
   */
  fecPago: string;

  /**
   * Importe del pago realizado.
   * @type {string}
   */
  impPago: string;
}

/**
 * Función que crea el estado inicial para los datos del trámite.
 * @returns {DatosProcedureState} Estado inicial del trámite.
 */
export function createInitialState(): DatosProcedureState {
  return {
    ideGenerica1: '',
    observaciones: '',
    denominacion: '',
    codigo: '',
    estado: '',
    municipio: '',
    localidad: '',
    colonia: '',
    calle: '',
    correo: '',
    sanitario: '',
    lada: '',
    telefono: '',
    funcionamiento: '',
    licencia: '',
    representanteLegalRFC: '',
    representanteLegalNombre: '',
    buscar: '',
    representanteLegalApPaterno: '',
    representanteLegalApMaterno: '',
    regimen: '',
    informacionConfidencial: '',
    aduanas: '',
    claveDeReferencia: '',
    cadenaPagoDependencia: '',
    bancoClave: '',
    llaveDePago: '',
    fecPago: '',
    impPago: '',
  };
}

/**
 * Clase que representa el store para gestionar el estado de los datos del trámite.
 * Utiliza Akita para la gestión del estado.
 */
@Injectable({
  providedIn: 'root',
})

/**
 * Configuración del store para gestionar el estado de los datos del trámite.
 * 
 * @param {string} name - Nombre único del store. En este caso, 'tramite261101'.
 * @param {boolean} resettable - Indica si el estado del store puede ser reiniciado a su estado inicial.
 *                               Si es `true`, se puede restablecer el estado utilizando el método `reset()`.
 */
@StoreConfig({ name: 'tramite261101', resettable: true })

/**
 * Clase que representa el store para gestionar el estado de los datos del trámite.
 * Utiliza Akita para la gestión del estado.
 */
export class DatosProcedureStore extends Store<DatosProcedureState> {
  /**
   * Constructor de la clase DatosProcedureStore.
   * Inicializa el store con el estado inicial definido en la función createInitialState.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Método para actualizar el estado del store con nuevos valores.
   * @param {Partial<DatosProcedureState>} values Valores parciales para actualizar el estado.
   */
  public establecerDatos(values: Partial<DatosProcedureState>): void {
    this.update((state) => ({
      ...state,
      ...values,
    }));
  }
}