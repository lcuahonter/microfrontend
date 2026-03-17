/**
 * Tramite130110Store
 * Este módulo define el `Store` de Akita para gestionar el estado del trámite con ID 130110.
 * Proporciona métodos para actualizar diferentes partes del estado del trámite, como la fracción arancelaria,
 * la solicitud, la información del producto, los valores de las partidas de la mercancía, y otros datos relevantes.
 */

import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { MostrarPartidas } from '@libs/shared/data-access-user/src';
import { PartidasDeLaMercanciaModelo } from '../../shared/models/partidas-de-la-mercancia.model';


export interface Tramite130110State {

  idSolicitud: number | null;
  /**
   * Producto seleccionado en el formulario.
   */
  producto: string;

  /**
   * Descripción del producto ingresada en el formulario.
   */
  descripcion: string;

  /**
   * Fracción arancelaria seleccionada en el formulario.
   */
  fraccion: string;

  /**
   * Cantidad del producto ingresada en el formulario.
   */
  cantidad: string;

  /**
   * Valor en USD de la partida ingresada en el formulario.
   */
  valorPartidaUSD: number;

  /**
   * Unidad de medida seleccionada en el formulario.
   */
  unidadMedida: string;

  fraccionDescripcionPartidasDeLaMercancia: string;

  /**
   * Solicitud seleccionada en el formulario.
   */
  solicitud: string;

  /**
   * Valor por defecto para el campo de selección de solicitud.
   */
  defaultSelect: string;

  /**
   * Valor por defecto para el campo de selección de producto.
   */
  defaultProducto: string;

  /**
   * Régimen seleccionado en el formulario.
   */
  regimen: string;

  /**
   * Clasificación del régimen seleccionada en el formulario.
   */
  clasificacion: string;

  /**
   * Lista de filas seleccionadas en la tabla dinámica.
   */
  filaSeleccionada: PartidasDeLaMercanciaModelo[];

  /**
   * Cantidad de partidas de la mercancía ingresada en el formulario.
   */
  cantidadPartidasDeLaMercancia: string;

  /**
   * Valor en USD de las partidas de la mercancía ingresado en el formulario.
   */
  valorPartidaUSDPartidasDeLaMercancia: string;

  /**
   * Descripción de las partidas de la mercancía ingresada en el formulario.
   */
  descripcionPartidasDeLaMercancia: string;

  /**
   * Valor de la factura en USD ingresado en el formulario.
   */
  valorFacturaUSD: string;

  /**
   * Bloque seleccionado en el formulario.
   */
  bloque: string;

  /**
   * Uso específico seleccionado en el formulario.
   */
  usoEspecifico: string;

  /**
   * Justificación para la importación/exportación ingresada en el formulario.
   */
  justificacionImportacionExportacion: string;

  /**
   * Observaciones ingresadas en el formulario.
   */
  observaciones: string;

  /**
   * Entidad seleccionada en el formulario.
   */
  entidad: string;

  /**
   * Representación seleccionada en el formulario.
   */
  representacion: string;

  /**
   * Indica si la tabla dinámica debe mostrarse.
   */
  mostrarTabla: boolean;
   /**
   * Datos del cuerpo de la tabla dinámica.
   */
  tableBodyData: PartidasDeLaMercanciaModelo[];
  /**
   * Cantidad total de partidas de la mercancía.
   */
  cantidadTotal: string;
  /*
  Valor total en USD de las partidas de la mercancía.
  */
  valorTotalUSD: string;

    /**
     * Lista de partidas a mostrar.
     */
    mostrarPartidas: MostrarPartidas[];
    /**   
     * Fechas seleccionadas en el formulario.
     */
   fechasSeleccionadas: string[];
}

/**
 * createInitialState
 * Función que define y retorna el estado inicial para el `Tramite130110State`.
 * Inicializa todas las propiedades del estado con valores por defecto, como arrays vacíos para las filas seleccionadas,
 * `false` para mostrar la tabla, y cadenas vacías o cero para los demás campos.
 *
 * El estado inicial del trámite 130110.
 */
export function createInitialState(): Tramite130110State {
  return {
    idSolicitud: 0,
    filaSeleccionada: [],
    mostrarTabla: true,
    solicitud: '',
    fraccion: '',
    defaultSelect: 'Inicial',
    producto: '',
    descripcion: '',
    cantidad: '',
    valorPartidaUSD: 0,
    unidadMedida: '',
    fraccionDescripcionPartidasDeLaMercancia: '',
    defaultProducto: 'Nuevo',
    regimen: '',
    clasificacion: '',
    cantidadPartidasDeLaMercancia: '',
    valorPartidaUSDPartidasDeLaMercancia: '',
    descripcionPartidasDeLaMercancia: '',
    valorFacturaUSD: '',
    bloque: '',
    usoEspecifico: '',
    justificacionImportacionExportacion: '',
    observaciones: '',
    entidad: '',
    representacion: '',
    tableBodyData: [],
    cantidadTotal: '',
    valorTotalUSD: '',
    mostrarPartidas: [],
    fechasSeleccionadas: []
  };
}

/**
 * Clase que representa el `Store` de Akita para el trámite 130110.
 * Contiene el estado actual del trámite y proporciona métodos para actualizar porciones específicas de este estado.
 * Está decorado con `@Injectable({ providedIn: 'root' })`, lo que significa que Angular lo proveerá como un singleton
 * en toda la aplicación.
 *
 * Inicializa el `Store` llamando al constructor de la clase padre `Store` con el estado inicial definido por `createInitialState()`.
 *
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite130110' })
export class Tramite130110Store extends Store<Tramite130110State> {
  constructor() {
    super(createInitialState());
  }
  
    /**
     * Actualiza si la tabla dinámica debe mostrarse en el estado.
     * mostrar Indica si la tabla debe mostrarse.
     */
    public setMostrarTabla(mostrar: boolean): void {
      this.update({ mostrarTabla: mostrar });
    }
  
      /**
   * Actualiza el estado del store con los valores proporcionados.
   * Valores a actualizar en el estado.
   */
  public actualizarEstado(valores: Partial<Tramite130110State>): void {
    this.update((state) => ({
      ...state,
      ...valores,
    }));
  }

  /**
   * Guarda el ID de la solicitud en el estado.
   *
   * @param idSolicitud - El ID de la solicitud que se va a guardar.
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }
}