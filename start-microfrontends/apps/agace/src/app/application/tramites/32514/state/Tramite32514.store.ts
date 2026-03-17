import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Representa un catálogo con un identificador y una descripción.
 */
export interface Catalogo {
  /** Identificador único del catálogo. */
  id: number;
  /** Descripción del catálogo. */
  descripcion: string;
}

/**
 * Representa el estado de la solicitud 32514 con información del solicitante, permiso y vehículo.
 * @interface
 *
 * @property {string} residenteNacExt - Indica si el residente es nacional o del extranjero.
 * @property {string} tipoSolicitude - Tipo de solicitud del permiso.
 * @property {string} numeroVehiculo - Número de identificación del vehículo.
 * @property {string} numeroPermiso - Número del permiso de importación temporal.
 * @property {string} fechaEmision - Fecha de emisión del permiso.
 * @property {string} fechaVencimiento - Fecha de vencimiento del permiso.
 * @property {string} númeroPedimento - Número de pedimento aduanal.
 * @property {string} fechaPedimento - Fecha del pedimento.
 * @property {string} avisoNacExt - Aviso relacionado con la residencia (nacional/extranjero).
 * @property {string} fechaAcuse - Fecha del acuse de recibo.
 * @property {string} conformidad - Documento de conformidad u observaciones.
 *
 * @property {string} marca - Marca del vehículo.
 * @property {string} tipo - Tipo del vehículo.
 * @property {string} modelo - Modelo del vehículo.
 * @property {string} niv - Número de identificación vehicular (NIV).
 * @property {string} numeroDePlacas - Número de placas del vehículo.
 * @property {string} estadoPlacas - Estado donde están registradas las placas.
 *
 * @property {string} declara - Declaración relacionada con la importación.
 * @property {string} tipoVehiculo - Tipo específico de vehículo.
 * @property {string} especifique - Detalles adicionales del tipo de vehículo.
 * @property {string} numeroSerie - Número de serie del vehículo.
 */
export interface Solicitud32514State {
  /**
   * @property {string} residenteNacExt 
   * @description
   * Indica si el residente es nacional o del extranjero.
   */
  residenteNacExt: string;
  /**
   * @property {string} tipoSolicitude 
   * @description
   * Tipo de solicitud del permiso.
   */
  tipoSolicitude: string;
  /**
   * @property {string} numeroVehiculo 
   * @description
   * Número de identificación del vehículo.
   */
  numeroVehiculo: string;
  /**
   * @property {string} numeroPermiso 
   * @description
   * Número del permiso de importación temporal.
   */
  numeroPermiso: string;
  /**
   * @property {string} fechaEmision 
   * @description
   * Fecha de emisión del permiso.
   */
  fechaEmision: string;
  /**
   * @property {string} fechaVencimiento 
   * @description
   * Fecha de vencimiento del permiso.
   */
  fechaVencimiento: string;
  /**
   * @property {string} númeroPedimento 
   * @description
   * Número de pedimento aduanal.
   */
  númeroPedimento: string;
  /**
   * @property {string} fechaPedimento 
   * @description
   * Fecha del pedimento.
   */
  fechaPedimento: string;
  /**
   * @property {string} avisoNacExt 
   * @description
   * Aviso relacionado con la residencia (nacional/extranjero).
   */
  avisoNacExt: string;
  /**
   * @property {string} fechaAcuse 
   * @description
   * Fecha del acuse de recibo.
   */
  fechaAcuse: string;
  /**
   * @property {string} conformidad 
   * @description
   * Documento de conformidad u observaciones.
   */
  conformidad: string;
  /**
   * @property {string} marca 
   * @description
   * Marca del vehículo.
   */
  marca: string;
  /**
   * @property {string} tipo 
   * @description
   * Tipo del vehículo.
   */
  tipo: string;
  /**
   * @property {string} modelo 
   * @description
   * Modelo del vehículo.
   */
  modelo: string;
  /**
   * @property {string} niv 
   * @description
   * Número de identificación vehicular (NIV).
   */
  niv: string;
  /**
   * @property {string} numeroDePlacas 
   * @description
   * Número de placas del vehículo.
   */
  numeroDePlacas: string;
  /**
   * @property {string} estadoPlacas 
   * @description
   * Estado donde están registradas las placas.
   */
  estadoPlacas: string;
  /**
   * @property {string} declara 
   * @description
   * Declaración relacionada con la importación.
   */
  declara: string;
  /**
   * @property {string} tipoVehiculo 
   * @description
   * Tipo específico de vehículo.
   */
  tipoVehiculo: string;
  /**
   * @property {string} especifique 
   * @description
   * Detalles adicionales del tipo de vehículo.
   */
  especifique: string;
  /**
   * @property {string} numeroSerie 
   * @description
   * Número de serie del vehículo.
   */
  numeroSerie: string;
}

/**
 * Crea el estado inicial para la solicitud del trámite 32514.
 * @returns Estado inicial de tipo `Solicitud32514State`.
 */
export function createInitialState(): Solicitud32514State {
  return {
    residenteNacExt: '',
    tipoSolicitude: '',
    numeroVehiculo: '',
    numeroPermiso: '',
    fechaEmision: '',
    fechaVencimiento: '',
    númeroPedimento: '',
    fechaPedimento: '',
    avisoNacExt: '',
    fechaAcuse: '',
    conformidad: '',

    marca: '',
    tipo: '',
    modelo: '',
    niv: '',
    numeroDePlacas: '',
    estadoPlacas: '',

    declara: '',
    tipoVehiculo: '',
    especifique: '',
    numeroSerie: '',
  };
}

/**
 * Clase que representa el almacén de estado para el trámite 32514.
 * Gestiona el estado global de la solicitud y proporciona métodos para actualizarlo.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite32514', resettable: true })
export class Tramite32514Store extends Store<Solicitud32514State> {
  /**
   * Constructor del almacén.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Establece o actualiza una propiedad específica del estado con un nuevo valor.
   *
   * @param {string} key - Clave de la propiedad del estado que se desea modificar.
   * @param {string} value - Nuevo valor que se asignará a la propiedad especificada.
   * @returns {void}
   */
  public setEstado(key: string, value: string): void {
    this.update((state) => ({ ...state, [key]: value }));
  }

  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   * 
   * @param DATOS - Estado de la solicitud `Tramite110222State` con la información 
   *                del tipo de solicitud a actualizar en el store.
   */
  actualizarEstadoFormulario(DATOS: Solicitud32514State): void {
    this.update((state) => ({
      ...state,
      ...DATOS
    }))

  }
}
