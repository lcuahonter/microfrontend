import {SeleccionDelCupoTabla, SolicitudResponse } from '../../models/asignacion-directa-cupo.model';
import { Injectable } from '@angular/core';
 
import { Store, StoreConfig } from '@datorama/akita';
import { Catalogo } from '@libs/shared/data-access-user/src';


/**
 * @fileoverview
 * Este archivo define la interfaz `Tramite120402State` utilizada para representar el estado de la aplicación
 * en el contexto del trámite 120402. Proporciona una estructura de datos que incluye información sobre
 * entidades, representaciones, regímenes, tratados, productos, subproductos y la cantidad solicitada.
 * 
 * @module Tramite120402Store
 * @description
 * Este archivo contiene la definición de la interfaz `Tramite120402State`, que se utiliza para manejar
 * el estado relacionado con el trámite 120402 en la aplicación.
 */

/**
 * @interface Tramite120402State
 * @description
 * Representa el estado de la aplicación para el trámite 120402.
 */
export interface Tramite120402State {
  /**
   * Identificador de la solicitud asociada al trámite.
   * @type {number | null}
   */
  idSolicitud: number | null;
  /**
   * Lista de datos seleccionados relacionados con el cupo.
   * @type {SeleccionDelCupoTabla[]}
   */
  datos: SeleccionDelCupoTabla[];

  /**
   * Entidad asociada al trámite. Puede ser nula si no se ha seleccionado ninguna entidad.
   * @type {string | null}
   */
  entidad: string | null;

  /**
   * Representación asociada al trámite. Puede ser nula si no se ha seleccionado ninguna representación.
   * @type {string | null}
   */
  representacion: string | null;

  /**
   * Régimen asociado al trámite. Puede ser nulo si no se ha seleccionado ningún régimen.
   * @type {Catalogo | null}
   */
  regimen: Catalogo | null;

  /**
   * Tratado asociado al trámite. Puede ser nulo si no se ha seleccionado ningún tratado.
   * @type {Catalogo | null}
   */
  tratado: Catalogo | null;

  /**
   * Producto asociado al trámite. Puede ser nulo si no se ha seleccionado ningún nombreProducto.
   * @type {Catalogo | null}
   */
  nombreProducto: Catalogo | null;

  /**
   * Subproducto asociado al trámite. Puede ser nulo si no se ha seleccionado ningún nombreSubproducto.
   * @type {Catalogo | null}
   */
  nombreSubproducto: Catalogo | null;

  /**
   * Cantidad solicitada en el trámite.
   * @type {string}
   */
  cantidadSolicitada: string;

  /** Descripción del cupo disponible */
  descriptionCupo?:SeleccionDelCupoTabla;

  descriptionCupoDisponible?: SolicitudResponse ;
}



/**
 * Crea el estado inicial para el trámite 120402.
 *
 * @returns {Tramite120402State} El estado inicial del trámite, que incluye:
 * - `entidad`: Valor inicial nulo para la entidad.
 * - `representacion`: Valor inicial nulo para la representación.
 * - `regimen`: Valor inicial nulo para el régimen.
 * - `tratado`: Valor inicial nulo para el tratado.
 * - `nombreProducto`: Valor inicial nulo para el nombreProducto.
 * - `nombreSubproducto`: Valor inicial nulo para el nombreSubproducto.
 * - `cantidadSolicitada`: Cadena vacía como valor inicial para la cantidad solicitada.
 */
export function createInitialState(): Tramite120402State {
  return {
    idSolicitud: 0,
    datos:[],
    entidad: null,
    representacion: null,
    regimen: null,
    tratado: null,
    nombreProducto: null,
    nombreSubproducto: null,
    cantidadSolicitada: '',
    descriptionCupo: undefined,
    descriptionCupoDisponible: undefined,
  };
}

/**
 * @fileoverview
 * Este archivo contiene la definición de la clase `Tramite120402Store`, 
 * que extiende la funcionalidad de la clase `Store` para gestionar el estado 
 * de un trámite específico. Proporciona métodos para actualizar diferentes 
 * propiedades del estado relacionadas con catálogos y otros datos relevantes 
 * del trámite.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite120402', resettable: true })
export class Tramite120402Store extends Store<Tramite120402State> {
  constructor() {
    super(createInitialState());
  }
 
  /**
   * Establece el valor del identificador de la solicitud en el estado.
   * @param idSolicitud Identificador numérico de la solicitud.
   */
  public setIdSolicitud(idSolicitud: number | null): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }
  /**
   * Establece el valor del catálogo de entidad en el estado.
   * @param entidad Catálogo seleccionado para la entidad.
   */
  public setEntidad(entidad: string) : void {
    this.update((state) => ({
      ...state,
      entidad,
    }));
  }

  /**
   * Establece el valor del catálogo de representación en el estado.
   * @param representacion Catálogo seleccionado para la representación.
   */
  public setRepresentacion(representacion: string) : void {
    this.update((state) => ({
      ...state,
      representacion,
    }));
  }

  /**
   * Establece el valor del catálogo de régimen en el estado.
   * @param regimen Catálogo seleccionado para el régimen.
   */
  public setRegimen(regimen: Catalogo) : void {
    this.update((state) => ({
      ...state,
      regimen,
    }));
  }

  /**
   * Establece el valor del catálogo de tratado en el estado.
   * @param tratado Catálogo seleccionado para el tratado.
   */
  public setTratado(tratado: Catalogo) : void {
    this.update((state) => ({
      ...state,
      tratado,
    }));
  }

   /**
   * Establece el valor del catálogo de nombreProducto en el estado.
   * @param nombreProducto Catálogo seleccionado para el nombreProducto.
   */
  public setProducto(descripcion: Catalogo): void {
    this.update((state) => ({
      ...state,
      nombreProducto: descripcion,
    }));
  }

   /**
   * Establece el valor del catálogo de nombreSubproducto en el estado.
   * @param nombreSubproducto Catálogo seleccionado para el nombreSubproducto.
   */
  public setSubproducto(descripcion: Catalogo) : void {
    this.update((state) => ({
      ...state,
      nombreSubproducto: descripcion,
    }));
  }

   /**
   * Establece el valor de la cantidad solicitada en el estado.
   * @param cantidadSolicitada Cadena que representa la cantidad solicitada.
   */

  public setCantidadSolicitada(cantidadSolicitada: string) : void{
    this.update((state) => ({
      ...state,
      cantidadSolicitada,
    }));
  }

  /**
   * Establece la descripción del cupo en el store.
   * @param descriptionCupo - Descripción del cupo disponible
   */
  public setDescriptionCupo(descriptionCupo: SeleccionDelCupoTabla | undefined): void {
    this.update((state) => ({
      ...state,
      descriptionCupo,
    }));
  }

  public setDescriptionCupoDisponible(descriptionCupoDisponible: SolicitudResponse | undefined): void {
    this.update((state) => ({
      ...state,
      descriptionCupoDisponible,
    }));
  }

  /**
 * Establece los datos de cupos en el store.
 * @param datos - Array de cupos disponibles
 */
setDatos(datos: SeleccionDelCupoTabla[]): void {
  this.update({ datos });
}
}
