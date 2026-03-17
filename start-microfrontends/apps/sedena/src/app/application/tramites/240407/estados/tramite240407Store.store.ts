import { DatosDelTramiteFormState, JustificacionTramiteFormState } from '../../../shared/models/datos-del-tramite.model';
import { DestinoFinal } from '../../../shared/models/terceros-relacionados.model';
import { Injectable } from '@angular/core';
import { MercanciaDetalle } from '../../../shared/models/datos-del-tramite.model';
import { Proveedor } from '../../../shared/models/terceros-relacionados.model';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * Interfaz que representa el estado completo del trámite 240407.
 */
export interface Tramite240407State {
  /**
   * property {number} [tabSeleccionado] - Pestaña actualmente activa en el flujo.
   */
  tabSeleccionado?: number;
  /**
   * property {DestinoFinal[]} destinatarioFinalTablaDatos - Lista de destinatarios finales registrados.
   */
  destinatarioFinalTablaDatos: DestinoFinal[];
  /**
   * property {Proveedor[]} proveedorTablaDatos - Lista de proveedores registrados.
   */
  proveedorTablaDatos: Proveedor[];
  /**
   * property {MercanciaDetalle[]} merccancialTablaDatos - Lista de mercancías registradas.
   */
  merccancialTablaDatos: MercanciaDetalle[];
  /**
   * property {DatosDelTramiteFormState} datosDelTramite - Información general del formulario de datos del trámite.
   */
  datosDelTramite: DatosDelTramiteFormState;
  /**
   * property {JustificacionTramiteFormState} justificacionTramiteFormState - Información del formulario de justificación del trámite.
   */
  justificacionTramiteFormState: JustificacionTramiteFormState;
}

/**
 * Crea el estado inicial para el trámite 240407.
 *
 * function createInitialState
 * returns {Tramite240407State} El estado inicial del store.
 */
export function createInitialState(): Tramite240407State {
  return {
    tabSeleccionado: 1,
    destinatarioFinalTablaDatos: [],
    proveedorTablaDatos: [],
    merccancialTablaDatos: [],
    datosDelTramite: {
      permisoGeneral: '',
      usoFinal: '',
      aduanasSeleccionadas: [],
      paisDestino: '',
      fechaPago: '',
      unoSemestre: '',
      anoEnCurso: false,
      informacionConfidencial: false
    },
    justificacionTramiteFormState :{
      justificacion:''
    }
  };
}

/**
 * Store que maneja el estado del trámite 240407.
 * Utiliza Akita para el control reactivo del estado.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite240407', resettable: true })
export class Tramite240407Store extends Store<Tramite240407State> {
  constructor() {
    super(createInitialState());
  }
  
  /**
   * Actualiza los datos generales del formulario de trámite.
   *
   * method updateDatosDelTramiteFormState
   * param {DatosDelTramiteFormState} datosDelTramiteFormState - Estado actualizado del formulario.
   * returns {void}
   */
  public updateDatosDelTramiteFormState(
    datosDelTramiteFormState: DatosDelTramiteFormState
  ): void {
    this.update((state) => ({
      ...state,
      datosDelTramite: datosDelTramiteFormState,
    }));
  }
/**
 * method updateJustificacionFormulario
 * description Actualiza el estado del formulario de justificación del trámite.
 * Permite modificar los datos capturados en el formulario de justificación.
 * 
 * param {JustificacionTramiteFormState} justificacionTramiteFormState - Estado actualizado del formulario de justificación.
 * returns {void}
 */
  public updateJustificacionFormulario(
    justificacionTramiteFormState: JustificacionTramiteFormState
  ): void {
    this.update((state) => ({
      ...state,
      justificacionTramiteFormState: justificacionTramiteFormState,
    }));
  }

  /**
   * Agrega nuevos registros a la tabla de destinatarios finales.
   *
   * method updateDestinatarioFinalTablaDatos
   * param {DestinoFinal[]} newDestinatarios - Nuevos destinatarios a agregar.
   * returns {void}
   */
  public updateDestinatarioFinalTablaDatos(
    newDestinatarios: DestinoFinal[]
  ): void {
    this.update((state) => ({
      ...state,
      destinatarioFinalTablaDatos: [
        ...state.destinatarioFinalTablaDatos,
        ...newDestinatarios,
      ],
    }));
  }

  /**
   * Agrega nuevos registros a la tabla de proveedores.
   *
   * method updateProveedorTablaDatos
   * param {Proveedor[]} newProveedores - Nuevos proveedores a agregar.
   * returns {void}
   */
  public updateProveedorTablaDatos(newProveedores: Proveedor[]): void {
    this.update((state) => ({
      ...state,
      proveedorTablaDatos: [...state.proveedorTablaDatos, ...newProveedores],
    }));
  }

  /**
   * Agrega nuevos registros a la tabla de mercancías.
   *
   * method updateMercanciaTablaDatos
   * param {MercanciaDetalle[]} newMercancia - Nuevas mercancías a agregar.
   * returns {void}
   */
  public updateMercanciaTablaDatos(newMercancia: MercanciaDetalle[]): void {
    this.update((state) => ({
      ...state,
      merccancialTablaDatos: [...state.merccancialTablaDatos, ...newMercancia],
    }));
  }
}
