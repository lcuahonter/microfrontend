/**
 * Store de gestión de estado para el trámite 40102 de registro de vehículos y unidades de arrastre.
 *
 * Este archivo contiene la implementación del patrón Store de Akita para gestionar
 * el estado de los datos de vehículos principales y unidades de arrastre en el
 * trámite 40102. Proporciona una interfaz centralizada para el manejo de estado
 * inmutable y métodos específicos para actualizar propiedades individuales
 * de vehículos y unidades de transporte.
 *
 * @file tramite40102.store.ts
 * @author Sistema de Gestión de Trámites - State Management Team
 * @version 1.0.0
 * @since 1.0.0
 */

import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

import {
  DatosUnidad,
  DatosVehiculo,
} from '../models/registro-muestras-mercancias.model';

/**
 * Interfaz que define el estado completo del store para el trámite 40102.
 *
 * Esta interfaz establece la estructura del estado global que mantiene
 * la información de vehículos principales y unidades de arrastre utilizados
 * en operaciones de transporte de mercancías. Cada propiedad representa
 * un conjunto completo de datos necesarios para el registro aduanero.
 *
 * @interface Tramite40102State
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * const estadoInicial: Tramite40102State = {
 *   datosVehiculo: {
 *     numero: "VEH001",
 *     tipoDeVehiculo: "Camión",
 *     idDeVehiculo: "VIN123456789",
 *     // ... otros campos del vehículo
 *   },
 *   datosUnidad: {
 *     vinVehiculo: "1HGBH41JXMN109186",
 *     tipoDeUnidadArrastre: "Remolque",
 *     // ... otros campos de la unidad
 *   }
 * };
 * ```
 */
export interface Tramite40102State {
  /**
   * @property {DatosVehiculo} datosVehiculo
   * Datos completos del vehículo principal.
   * Contiene toda la información técnica, legal y de identificación del vehículo motor.
   */
  datosVehiculo: DatosVehiculo;

  /**
   * @property {DatosUnidad} datosUnidad
   * Datos completos de la unidad de arrastre.
   * Contiene la información específica de remolques, semirremolques y otros vehículos auxiliares.
   */
  datosUnidad: DatosUnidad;

  /**
   * Indica si el trámite está en modo solo lectura (readonly), útil para flujos de consulta.
   */
  readonly?: boolean;
}
/**
 * Función que crea el estado inicial para el store del trámite 40102.
 *
 * Esta función factory genera el estado inicial con valores por defecto
 * para todos los campos de vehículos y unidades de arrastre. Garantiza
 * que el store comience con una estructura de datos consistente y completa,
 * evitando errores de propiedades undefined durante la ejecución.
 *
 * @function createInitialState
 * @returns {Tramite40102State} Estado inicial con valores vacíos para vehículo y unidad de arrastre.
 *
 * @example
 * ```typescript
 * const estadoInicial = createInitialState();
 * console.log(estadoInicial.datosVehiculo.numero); // ""
 * console.log(estadoInicial.datosUnidad.vinVehiculo); // ""
 * ```
 *
 * @since 1.0.0
 */
export function createInitialState(): Tramite40102State {
  return {
    /**
     * Estado inicial de datos del vehículo principal.
     * Todos los campos se inicializan con cadenas vacías para permitir
     * la captura progresiva de información sin errores de validación.
     */
    datosVehiculo: {
      numero: '',
      tipoDeVehiculo: '',
      idDeVehiculo: '',
      numeroPlaca: '',
      paisEmisor: '',
      estado: '',
      marca: '',
      modelo: '',
      ano: '',
      transponder: '',
      colorVehiculo: '',
      numuroEconomico: '',
      numero2daPlaca: '',
      estado2daPlaca: '',
      paisEmisor2daPlaca: '',
      descripcion: '',
    },
    /**
     * Estado inicial de datos de la unidad de arrastre.
     * Configuración base para remolques y unidades auxiliares
     * con campos vacíos listos para captura de datos.
     */
    datosUnidad: {
      vinVehiculo: '',
      tipoDeUnidadArrastre: '',
      idDeVehiculo: '',
      numeroEconomico: '',
      numeroPlaca: '',
      paisEmisor: '',
      estado: '',
      colorVehiculo: '',
      numero2daPlaca: '',
      estado2daPlaca: '',
      paisEmisor2daPlaca: '',
      descripcion: '',
    },
  };
}
/**
 * Store de Akita para la gestión centralizada del estado del trámite 40102.
 *
 * Esta clase implementa el patrón Store de Akita para proporcionar una gestión
 * de estado reactiva y predecible para los datos de vehículos y unidades de
 * arrastre. Ofrece métodos especializados para actualizar propiedades individuales
 * manteniendo la inmutabilidad del estado y notificando automáticamente a todos
 * los suscriptores sobre los cambios realizados.
 *
 * @class Tramite40102Store
 * @extends {Store<Tramite40102State>}
 * @injectable
 * @providedIn 'root'
 *
 * @example
 * ```typescript
 * constructor(private store: Tramite40102Store) {
 *   // Actualizar el número del vehículo
 *   this.store.setDatosVehiculoNumero("VEH001");
 *   
 *   // Actualizar el VIN de la unidad
 *   this.store.setDatosUnidadVinVehiculo("1HGBH41JXMN109186");
 * }
 * ```
 *
 * @since 1.0.0
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite40102', resettable: true })
export class Tramite40102Store extends Store<Tramite40102State> {
  /**
   * Constructor del store del trámite 40102.
   *
   * Inicializa el store con el estado inicial proporcionado por la función
   * createInitialState(), estableciendo los valores por defecto para todos
   * los campos de vehículos y unidades de arrastre.
   *
   * @constructor
   * @example
   * ```typescript
   * // El store se inyecta automáticamente
   * constructor(private tramiteStore: Tramite40102Store) {
   *   // El store está listo para usar
   * }
   * ```
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el número identificador del vehículo principal en el estado.
   *
   * Este método permite modificar el número único asignado al vehículo
   * dentro del sistema de gestión de transporte. Utiliza el patrón inmutable
   * de Akita para garantizar la integridad del estado y notificar automáticamente
   * a todos los suscriptores sobre el cambio realizado.
   *
   * @method setDatosVehiculoNumero
   * @param {string} numero - Nuevo número identificador del vehículo.
   * @returns {void}
   *
   * @example
   * ```typescript
   * // Actualizar el número del vehículo
   * this.tramiteStore.setDatosVehiculoNumero("VEH001");
   * 
   * // El cambio se propaga automáticamente a todos los suscriptores
   * this.tramiteQuery.select().subscribe(state => {
   *   console.log('Nuevo número:', state.datosVehiculo.numero); // "VEH001"
   * });
   * ```
   *
   * @since 1.0.0
   */
  public setDatosVehiculoNumero(numero: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        numero,
      },
    }));
  }

  /**
   * Actualiza la clasificación del tipo de vehículo en el estado.
   *
   * Modifica la categoría o tipo específico del vehículo principal según
   * las clasificaciones oficiales del sistema aduanero. Permite categorizar
   * vehículos como camión, tractocamión, automóvil, etc.
   *
   * @method setDatosVehiculoTipoDeVehiculo
   * @param {string} tipoDeVehiculo - Nueva clasificación del tipo de vehículo.
   * @returns {void}
   *
   * @example
   * ```typescript
   * // Establecer tipo de vehículo
   * this.tramiteStore.setDatosVehiculoTipoDeVehiculo("Tractocamión");
   * 
   * // Verificar el cambio
   * this.tramiteQuery.getValue().datosVehiculo.tipoDeVehiculo; // "Tractocamión"
   * ```
   *
   * @since 1.0.0
   */
  public setDatosVehiculoTipoDeVehiculo(tipoDeVehiculo: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        tipoDeVehiculo,
      },
    }));
  }

  /**
   * Actualiza el identificador único del vehículo (VIN) en el estado.
   *
   * Establece el Número de Identificación Vehicular (VIN) que identifica
   * únicamente al vehículo a nivel internacional. Este código alfanumérico
   * de 17 caracteres es fundamental para el registro aduanero.
   *
   * @method setDatosVehiculoIdDeVehiculo
   * @param {string} idDeVehiculo - Nuevo VIN del vehículo (17 caracteres).
   * @returns {void}
   *
   * @example
   * ```typescript
   * // Establecer VIN del vehículo
   * this.tramiteStore.setDatosVehiculoIdDeVehiculo("1HGBH41JXMN109186");
   * 
   * // Validar formato del VIN
   * const vin = this.tramiteQuery.getValue().datosVehiculo.idDeVehiculo;
   * console.log('VIN válido:', vin.length === 17); // true
   * ```
   *
   * @since 1.0.0
   */
  public setDatosVehiculoIdDeVehiculo(idDeVehiculo: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        idDeVehiculo,
      },
    }));
  }

  /**
   * Actualiza el número de placa del vehículo.
   * @param numeroPlaca Nuevo número de placa.
   */
  public setDatosVehiculoNumeroPlaca(numeroPlaca: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        numeroPlaca,
      },
    }));
  }

  /**
   * Actualiza el país emisor de la placa del vehículo.
   * @param paisEmisor Nuevo país emisor.
   */
  public setDatosVehiculoPaisEmisor(paisEmisor: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        paisEmisor,
      },
    }));
  }

  /**
   * Actualiza el estado de la placa del vehículo.
   * @param estado Nuevo estado.
   */
  public setDatosVehiculoEstado(estado: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        estado,
      },
    }));
  }

  /**
   * Actualiza la marca del vehículo.
   * @param marca Nueva marca.
   */
  public setDatosVehiculoMarca(marca: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        marca,
      },
    }));
  }

  /**
   * Actualiza el modelo del vehículo.
   * @param modelo Nuevo modelo.
   */
  public setDatosVehiculoModelo(modelo: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        modelo,
      },
    }));
  }

  /**
   * Actualiza el año del vehículo.
   * @param ano Nuevo año.
   */
  public setDatosVehiculoAno(ano: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        ano,
      },
    }));
  }

  /**
   * Actualiza el transponder del vehículo.
   * @param transponder Nuevo transponder.
   */
  public setDatosVehiculoTransponder(transponder: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        transponder,
      },
    }));
  }

  /**
   * Actualiza el color del vehículo.
   * @param colorVehiculo Nuevo color.
   */
  public setDatosVehiculoColorVehiculo(colorVehiculo: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        colorVehiculo,
      },
    }));
  }

  /**
   * Actualiza el número económico del vehículo.
   * @param numuroEconomico Nuevo número económico.
   */
  public setDatosVehiculoNumuroEconomico(numuroEconomico: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        numuroEconomico,
      },
    }));
  }

  /**
   * Actualiza el número de segunda placa del vehículo.
   * @param numero2daPlaca Nuevo número de segunda placa.
   */
  public setDatosVehiculoNumero2daPlaca(numero2daPlaca: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        numero2daPlaca,
      },
    }));
  }

  /**
   * Actualiza el estado de la segunda placa del vehículo.
   * @param estado2daPlaca Nuevo estado de la segunda placa.
   */
  public setDatosVehiculoEstado2daPlaca(estado2daPlaca: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        estado2daPlaca,
      },
    }));
  }

  /**
   * Actualiza el país emisor de la segunda placa del vehículo.
   * @param paisEmisor2daPlaca Nuevo país emisor de la segunda placa.
   */
  public setDatosVehiculoPaisEmisor2daPlaca(paisEmisor2daPlaca: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        paisEmisor2daPlaca,
      },
    }));
  }

  /**
   * Actualiza la descripción del vehículo.
   * @param descripcion Nueva descripción.
   */
  public setDatosVehiculoDescripcion(descripcion: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        descripcion,
      },
    }));
  }

  /**
   * Actualiza el VIN de la unidad de arrastre.
   * @param vinVehiculo Nuevo VIN.
   */
  public setDatosUnidadVinVehiculo(vinVehiculo: string): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        vinVehiculo,
      },
    }));
  }

  /**
   * Actualiza el tipo de unidad de arrastre.
   * @param tipoDeUnidadArrastre Nuevo tipo de unidad.
   */
  public setDatosUnidadTipoDeUnidadArrastre(
    tipoDeUnidadArrastre: string
  ): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        tipoDeUnidadArrastre,
      },
    }));
  }

  /**
   * Actualiza el número económico de la unidad de arrastre.
   * @param numeroEconomico Nuevo número económico.
   */
  public setDatosUnidadNumeroEconomico(numeroEconomico: string): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        numeroEconomico,
      },
    }));
  }

  /**
   * Actualiza el número de placa de la unidad de arrastre.
   * @param numeroPlaca Nuevo número de placa.
   */
  public setDatosUnidadNumeroPlaca(numeroPlaca: string): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        numeroPlaca,
      },
    }));
  }

  /**
   * Actualiza el país emisor de la unidad de arrastre.
   * @param paisEmisor Nuevo país emisor.
   */
  public setDatosUnidadPaisEmisor(paisEmisor: string): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        paisEmisor,
      },
    }));
  }

  /**
   * Actualiza el estado de la unidad de arrastre.
   * @param estado Nuevo estado.
   */
  public setDatosUnidadEstado(estado: string): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        estado,
      },
    }));
  }

  /**
   * Actualiza el tipo de vehículo de la unidad de arrastre.
   * @param tipoVehiculo Nuevo tipo de vehículo.
   */
  public setDatosUnidadTipoVehiculo(tipoVehiculo: string): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        tipoVehiculo,
      },
    }));
  }

  /**
   * Actualiza el identificador de la unidad de arrastre.
   * @param idDeVehiculo Nuevo identificador.
   */
  public setDatosUnidadIdDeVehiculo(idDeVehiculo: string): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        idDeVehiculo,
      },
    }));
  }

  /**
   * Actualiza el color de la unidad de arrastre.
   * @param colorVehiculo Nuevo color.
   */
  public setDatosUnidadColorVehiculo(colorVehiculo: string): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        colorVehiculo,
      },
    }));
  }

  /**
   * Actualiza el número de segunda placa de la unidad de arrastre.
   * @param numero2daPlaca Nuevo número de segunda placa.
   */
  public setDatosUnidadNumero2daPlaca(numero2daPlaca: string): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        numero2daPlaca,
      },
    }));
  }

  /**
   * Actualiza el estado de la segunda placa de la unidad de arrastre.
   * @param estado2daPlaca Nuevo estado de la segunda placa.
   */
  public setDatosUnidadEstado2daPlaca(estado2daPlaca: string): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        estado2daPlaca,
      },
    }));
  }

  /**
   * Actualiza el país emisor de la segunda placa de la unidad de arrastre.
   * @param paisEmisor2daPlaca Nuevo país emisor de la segunda placa.
   */
  public setDatosUnidadPaisEmisor2daPlaca(paisEmisor2daPlaca: string): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        paisEmisor2daPlaca,
      },
    }));
  }

  /**
   * Actualiza la descripción de la unidad de arrastre.
   * @param descripcion Nueva descripción.
   */
  public setDatosUnidadDescripcion(descripcion: string): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        descripcion,
      },
    }));
  }

}