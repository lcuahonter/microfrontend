import { FilaPlantas, FilaProducir, FilaProductos, FilaSectors } from '../models/prosec.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';

/**
 * @interface ProsecState
 * @description
 * Interfaz que define la estructura del estado utilizado en el flujo del trámite de autorización PROSEC.
 * Contiene todas las propiedades necesarias para almacenar la información y el estado de validación de cada sección del formulario.
 * 
 * - modalidad: Modalidad seleccionada en el trámite.
 * - estadoSeleccionar: Lista de estados seleccionados.
 * - RepresentacionFederal: Lista de representaciones federales seleccionadas.
 * - ActividadProductiva: Lista de actividades productivas seleccionadas.
 * - Sector: Lista de sectores seleccionados.
 * - Fraccion_arancelaria: Fracción arancelaria seleccionada.
 * - contribuyentes: Contribuyentes registrados.
 * - domiciliosFormaValida: Indica si el formulario de domicilios es válido.
 * - productorFromValida: Indica si el formulario del productor es válido.
 * - sectoresFromValida: Indica si el formulario de sectores es válido.
 */
export interface ProsecState {
  /**
   * @property {number | null} idSolicitud
   * @description
   * Identificador único de la solicitud de autorización PROSEC.
   */
  idSolicitud: null | number;
  /**
   * @property {string} modalidad
   * @description
   * Modalidad seleccionada en el trámite.
   */
  modalidad: string;

  /**
   * @property {Catalogo[]} estadoSeleccionar
   * @description
   * Lista de estados seleccionados.
   */
  estadoSeleccionar: Catalogo[];
  Estado: string;

  /**
   * @property {Catalogo[]} RepresentacionFederal
   * @description
   * Lista de representaciones federales seleccionadas.
   */
  RepresentacionFederalLista: Catalogo[];
  RepresentacionFederal: string;

  /**
   * @property {Catalogo[]} ActividadProductiva
   * @description
   * Lista de actividades productivas seleccionadas.
   */
  ActividadProductiva: string;
  ActividadProductivaLista: Catalogo[];

  /**
   * @property {Catalogo[]} Sector
   * @description
   * Lista de sectores seleccionados.
   */
  Sector: Catalogo[];

  /**
   * @property {string} Fraccion_arancelaria
   * @description
   * Fracción arancelaria seleccionada.
   */
  Fraccion_arancelaria: string;

  /**
   * @property {string} contribuyentes
   * @description
   * Contribuyentes registrados.
   */
  contribuyentes: string;

  /**
   * @property {string} rfc
   * @description
   * RFC del solicitante.
   */
  rfc: string;

  /**
   * @property {boolean} domiciliosFormaValida
   * @description
   * Indica si el formulario de domicilios es válido.
   */
  domiciliosFormaValida: boolean;

  /**
   * @property {boolean} productorFromValida
   * @description
   * Indica si el formulario del productor es válido.
   */
  productorFromValida: boolean;

  /**
   * @property {boolean} sectoresFromValida
   * @description
   * Indica si el formulario de sectores es válido.
   */
  sectoresFromValida: boolean;
  sectorDatos: FilaSectors[];
  producirDatos: FilaProducir[];
  plantasDatos: FilaPlantas[];
  prosecDatos: FilaPlantas[];
  productorDatos: FilaProductos[];
  selectedDatos?: FilaPlantas[];
  selectedSectorDatos?: FilaSectors[];
  selectedProducirDatos?: FilaProducir[];
  selectedProductorDatos?: FilaProductos[];
}

/**
 * @function createInitialState
 * @method createInitialState
 * @description
 * Retorna el estado inicial para el store de autorización PROSEC.
 * Inicializa todas las propiedades del estado con valores por defecto, asegurando que el formulario comience limpio y sin datos previos.
 * 
 * @returns {ProsecState} estadoSeleccionar inicial con valores por defecto para cada campo del trámite PROSEC.
 */
export function createInitialState(): ProsecState {
  return {
    idSolicitud: null,
    modalidad: 'Productor directo',
    estadoSeleccionar: [],
    Estado: '',
    RepresentacionFederal: '',
    RepresentacionFederalLista: [],
    ActividadProductivaLista: [],
    ActividadProductiva: '',
    Sector: [],
    Fraccion_arancelaria: '',
    contribuyentes: '',
    rfc: '',
    domiciliosFormaValida: false,
    productorFromValida: false,
    sectoresFromValida: false,
    sectorDatos: [
    ],
    producirDatos: [],
    plantasDatos: [
    ],
    prosecDatos: [],
    productorDatos: [
    ],
    selectedDatos: [],
    selectedSectorDatos: [],
    selectedProducirDatos: [],
    selectedProductorDatos: []
  };
}

/**
 * @class AutorizacionProsecStore
 * @description
 * Store encargado de gestionar el estado del formulario PROSEC.
 * Permite almacenar y actualizar la información relacionada con el trámite de autorización PROSEC,
 * incluyendo modalidad, estados, representaciones federales, actividades productivas, sectores, fracción arancelaria,
 * contribuyentes y la validez de los formularios de domicilios, productor y sectores.
 * Utiliza Akita para el manejo reactivo del estado.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'seccion', resettable: true })
export class AutorizacionProsecStore extends Store<ProsecState> {
  /**
   * @constructor
   * @description Inicializa el store con el estado inicial.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * @method setModalidad
   * @description
   * Establece la modalidad seleccionada en el estado.
   * @param {string} modalidad Modalidad seleccionada.
   * @returns {void}
   */
  public setModalidad(modalidad: string): void {
    this.update((state) => ({ ...state, modalidad }));
  }

  /**
   * @method setEstadoSeleccionar
   * @description
   * Establece los estados seleccionados en el estado.
   * @param {Catalogo[]} estadoSeleccionar Lista de estados.
   * @returns {void}
   */
  public setEstadoSeleccionar(estadoSeleccionar: Catalogo[]): void {
    this.update((state) => ({ ...state, estadoSeleccionar }));
  }

  setEstado(Estado: string): void {
    this.update((state) => ({ ...state, Estado }));
  }
  /**
   * @method setRepresentacionFederalLista
   * @description
   * Establece la representación federal en el estado.
   * @param {Catalogo[]} RepresentacionFederal Lista de representaciones.
   * @returns {void}
   */
  public setRepresentacionFederalLista(RepresentacionFederalLista: Catalogo[]): void {
    this.update((state) => ({ ...state, RepresentacionFederalLista }));
  }

  setRepresentacionFederal(RepresentacionFederal: string): void {
    this.update((state) => ({ ...state, RepresentacionFederal }));
  }
  /**
   * @method setActividadProductiva
   * @description
   * Establece la actividad productiva en el estado.
   * @param {Catalogo[]} ActividadProductiva Lista de actividades.
   * @returns {void}
   */
  public setActividadProductiva(ActividadProductiva: string): void {
    this.update((state) => ({ ...state, ActividadProductiva }));
  }

  setActividadProductivaLista(ActividadProductivaLista: Catalogo[]): void {
    this.update((state) => ({ ...state, ActividadProductivaLista }));
  }
  /**
   * @method setSector
   * @description
   * Establece los sectores seleccionados en el estado.
   * @param {Catalogo[]} Sector Lista de sectores.
   * @returns {void}
   */
  public setSector(Sector: Catalogo[]): void {
    this.update((state) => ({ ...state, Sector }));
  }

  setsectorLista(sectorLista: Catalogo[]): void {
    this.update((state) => ({ ...state, sectorLista }));
  }
  /**
   * @method setFraccionArancelaria
   * @description
   * Establece la fracción arancelaria en el estado.
   * @param {string} Fraccion_arancelaria Fracción seleccionada.
   * @returns {void}
   */
  public setFraccionArancelaria(Fraccion_arancelaria: string): void {
    this.update((state) => ({ ...state, Fraccion_arancelaria }));
  }

  /**
   * @method setcontribuyentes
   * @description
   * Establece los contribuyentes registrados en el estado.
   * @param {string} contribuyentes RFC o nombre.
   * @returns {void}
   */
  public setcontribuyentes(contribuyentes: string): void {
    this.update((state) => ({ ...state, contribuyentes }));
  }

  /**
   * @method setcontribuyentes
   * @description
   * Establece los contribuyentes registrados en el estado.
   * @param {string} contribuyentes RFC o nombre.
   * @returns {void}
   */
  public setRfc(rfc: string): void {
    this.update((state) => ({ ...state, rfc }));
  }

  /**
   * @method setDomiciliosFormaValida
   * @description
   * Valida el formulario de domicilios y actualiza el estado.
   * @param {boolean} domiciliosFormaValida Valor booleano.
   * @returns {void}
   */
  public setDomiciliosFormaValida(domiciliosFormaValida: boolean): void {
    this.update((state) => ({ ...state, domiciliosFormaValida }));
  }

  /**
   * @method setProductorFromValida
   * @description
   * Valida el formulario del productor y actualiza el estado.
   * @param {boolean} productorFromValida Valor booleano.
   * @returns {void}
   */
  public setProductorFromValida(productorFromValida: boolean): void {
    this.update((state) => ({ ...state, productorFromValida }));
  }

  /**
   * @method setSectoresFromValida
   * @description
   * Valida el formulario de sectores y actualiza el estado.
   * @param {boolean} sectoresFromValida Valor booleano.
   * @returns {void}
   */
  public setSectoresFromValida(sectoresFromValida: boolean): void {
    this.update((state) => ({ ...state, sectoresFromValida }));
  }

    /**
   * @method setSectorDatos
   * @description
   * Actualiza el arreglo de datos de sectores en el estado.
   * @param {FilaSectors[]} sectorDatos - Nuevo arreglo de sectores a almacenar.
   * @returns {void}
   */
  public setSectorDatos(sectorDatos: FilaSectors[]): void {
    this.update((state) => ({ ...state, sectorDatos }));
  }

  /**
   * @method setProducirDatos
   * @description
   * Actualiza el arreglo de datos de producción en el estado.
   * @param {FilaProducir[]} producirDatos - Nuevo arreglo de datos de producción a almacenar.
   * @returns {void}
   */
  public setProducirDatos(producirDatos: FilaProducir[]): void {
    this.update((state) => ({ ...state, producirDatos }));
  }

  /**
   * @method setPlantasDatos
   * @description
   * Actualiza el arreglo de datos de plantas en el estado.
   * @param {FilaPlantas[]} plantasDatos - Nuevo arreglo de datos de plantas a almacenar.
   * @returns {void}
   */
  public setPlantasDatos(plantasDatos: FilaPlantas[]): void {
    this.update((state) => ({ ...state, plantasDatos }));
  }

  /**
   * @method setProsecDatos
   * @description
   * Actualiza el arreglo de datos de plantas PROSEC en el estado.
   * @param {FilaPlantas[]} prosecDatos - Nuevo arreglo de plantas PROSEC a almacenar.
   * @returns {void}
   */
  public setProsecDatos(prosecDatos: FilaPlantas[]): void {
    this.update((state) => ({ ...state, prosecDatos }));
  }

  /**
   * @method setProductorDatos
   * @description
   * Actualiza el arreglo de datos de productores en el estado.
   * @param {FilaProductos[]} productorDatos - Nuevo arreglo de datos de productores a almacenar.
   * @returns {void}
   */
  public setProductorDatos(productorDatos: FilaProductos[]): void {
    this.update((state) => ({ ...state, productorDatos }));
  }
   /**
   * Actualiza el estado con el nuevo valor de `idSolicitud`.
   */
   setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }
}
