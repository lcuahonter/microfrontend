import {
  CodigosAleatorio,
  Detalle,
  HojaTrabajoModel,
  OrdenTratamiento,
  RemisionMuestra,
  ValidacionesModel,
  createDatosState,
} from '../../core/models/hoja-trabajo/hoja-trabajo.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'HojaTrabajoAgriculturaStore', resettable: true })
export class HojaTrabajoAgriculturaStore extends Store<HojaTrabajoModel> {
  state: HojaTrabajoModel = createDatosState();

  constructor() {
    super(createDatosState());
  }

  /**
   * Reemplaza en el estado todos los datos de la hoja de trabajo
   * con el objeto completo proporcionado.
   *
   * @param datos Modelo completo de la hoja de trabajo.
   */
  public setDatosHojaTrabajo(datos: HojaTrabajoModel): void {
    this.update((state) => ({
      ...state,
      id_hoja_trabajo: datos.id_hoja_trabajo,
      num_folio_tramite: datos.num_folio_tramite,
      numero_fleje: datos.numero_fleje,
      requiere_toma_muestra: datos.requiere_toma_muestra,
      requiere_tratamiento: datos.requiere_tratamiento,
      aplica_guardia_custodia: datos.aplica_guardia_custodia,
      lugar_inspeccion: datos.lugar_inspeccion,
      tipo_prueba: datos.tipo_prueba,
      orden_tratamiento: datos.orden_tratamiento,
      remision_muestra: datos.remision_muestra,
      detalles: datos.detalles,
      codigos_aleatorios: datos.codigos_aleatorios,
    }));
  }

  /**
   * Actualiza únicamente una parte de los datos generales de la hoja de trabajo
   * (folio, fleje, banderas de toma de muestra/tratamiento, etc.).
   *
   * @param datos Objeto parcial con los campos a actualizar de la hoja de trabajo.
   */
  public setParteDatosHojaTrabajo(datos: Partial<HojaTrabajoModel>): void {
    this.update((state) => ({
      ...state,
      numero_fleje: datos.numero_fleje,
      requiere_toma_muestra: datos.requiere_toma_muestra,
      requiere_tratamiento: datos.requiere_tratamiento,
    }));
  }

  /**
   * actualiza el elemento detalles de la hoja de trabajo
   * */
  public setDetalles(detalles: Detalle[]): void {
    this.update((state) => ({
      ...state,
      detalles: detalles,
    }));
  }

  /**
   * Actualiza únicamente el identificador de la hoja de trabajo en el estado.
   *
   * @param datos Objeto parcial que contiene el id de la hoja de trabajo.
   */
  public setIdHojaTrabajo(datos: {
    id_hoja_trabajo: number;
    orden_tratamiento: number;
    remision_muestra: number;
  }): void {
    this.update((state) => ({
      ...state,
      id_hoja_trabajo: datos.id_hoja_trabajo,
      orden_tratamiento: {
        ...state.orden_tratamiento,
        orden_tratamiento: datos.orden_tratamiento,
      },
      remision_muestra: {
        ...state.remision_muestra,
        id_remision_muestra: datos.remision_muestra,
      },
    }));
  }

  /**
   * Agrega uno o varios detalles a la lista de detalles de la hoja de trabajo.
   * Los nuevos elementos se concatenan al arreglo existente.
   *
   * @param datos Arreglo de detalles a agregar.
   */
  public setDatosDetalles(datos: Detalle[]): void {
    this.update((state) => ({
      ...state,
      detalles: [...state.detalles, ...datos],
    }));
  }

  /**
   * Agrega uno o varios códigos aleatorios a la lista existente
   * en el estado de la hoja de trabajo.
   *
   * @param datos Arreglo de códigos aleatorios a agregar.
   */
  public setDatosCodigosAleatorios(datos: CodigosAleatorio[]): void {
    this.update((state) => ({
      ...state,
      codigos_aleatorios: [...state.codigos_aleatorios, ...datos],
    }));
  }

  /**
   * Actualiza en el estado la sección de orden de tratamiento,
   * reemplazando el objeto completo de orden_tratamiento.
   *
   * @param datos Modelo de la orden de tratamiento.
   */
  public setDatosOrdenTratamiento(datos: OrdenTratamiento): void {
    this.update((state) => ({
      ...state,
      orden_tratamiento: { ...datos },
    }));
  }

  /**
   * Actualiza en el estado la sección de remisión de muestras,
   * reemplazando el objeto completo de remision_muestra.
   *
   * @param datos Modelo de la remisión de muestra.
   */
  public setDatosRemisionMuestra(datos: RemisionMuestra): void {
    this.update((state) => ({
      ...state,
      remision_muestra: { ...datos },
    }));
  }

  /**
   * Actualiza el estado de validaciones del formulario,
   * almacenando qué secciones o formularios son válidos.
   *
   * @param data Objeto parcial con las banderas de validación a actualizar.
   */
  public setVaidaciones(data: ValidacionesModel): void {
    this.update((state) => ({
      ...state,
      validaciones: {
        ...data,
      },
    }));
  }

  /**
   * Restablece el estado a su estado inicial.
   */
  public limpiarFormulario(): void {
    this.reset();
  }
}
