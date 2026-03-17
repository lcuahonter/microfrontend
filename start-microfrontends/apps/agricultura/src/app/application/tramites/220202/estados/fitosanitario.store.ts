import {
  DatosForma,
  FilaSolicitud,
  ListaDeDatosFinal,
  Movilizacion,
  PagoDeDerechos,
  TercerosrelacionadosExportadorTable,
  TercerosrelacionadosdestinoTable,
  createDatosState,
} from '../models/220202/fitosanitario.model';

import { Injectable } from '@angular/core';

import { Store, StoreConfig } from '@datorama/akita';

@Injectable({
  providedIn: 'root',
})

@StoreConfig({ name: 'fitosanitariostore', resettable: true })
/**
 * Almacén de estado para el trámite fitosanitario.
 *
 * Esta clase extiende de `Store<ListaDeDatosFinal>` y gestiona el estado relacionado con el formulario fitosanitario,
 * incluyendo los datos del formulario, información de movilización, pago de derechos, validez de formularios y datos finales de la tabla.
 *
 * Métodos:
 * - `actualizarDatosForma(datos: DatosForma): void`
 *   Actualiza el estado con la información del formulario recibido.
 *
 * - `actualizarMovilizacion(movilizacion: Movilizacion): void`
 *   Actualiza el estado con la información de movilización proporcionada.
 *
 * - `actualizarPago(pago: PagoDeDerechos): void`
 *   Actualiza el estado con los datos de pago de derechos.
 *
 * - `actualizarformaValida(updatedFormaValida: { [key: string]: boolean }): void`
 *   Actualiza el estado de validez de los formularios, permitiendo indicar si cada formulario es válido o no.
 *
 * - `tablaDatosFinal(tablaDatos: FilaSolicitud[]): void`
 *   Actualiza el estado con los datos finales de la tabla de solicitudes.
 *
 * - `limpiarFormulario(): void`
 *   Restablece el estado a su valor inicial, limpiando todos los datos almacenados.
 */
export class FitosanitarioStore extends Store<ListaDeDatosFinal> {
  
  /**
   * Constructor de la clase.
   *
   * Llama al constructor de la clase base (`super`) con el estado inicial generado por `createDatosState()`.
   * Este estado se utiliza para inicializar el store o el estado interno de la clase.
   */
  constructor() {
    super(createDatosState());
  }

  /**
   * Actualiza el estado con la información del formulario.
   * @param datos Datos del formulario.
   */
  public actualizarDatosForma(datos: DatosForma): void {
    this.update((state) => ({
      ...state,
      datos, // Envuelve los datos en un array
    }));
  }

  /**
   * Actualiza el estado con la información de movilización.
   * @param movilizacion Datos de movilización.
   */
  public actualizarMovilizacion(movilizacion: Movilizacion): void {
    this.update((state) => ({
      ...state,
      movilizacion, // Envuelve los datos en un array
    }));
  }

  /**
   * Actualiza el estado con la información de pago.
   * @param pago Datos de pago.
   */
  public actualizarPago(pago: PagoDeDerechos): void {
    this.update((state) => ({
      ...state,
      pago, // Envuelve los datos en un array
    }));
  }

  /**
   * Actualiza el estado de validez de los formularios.
   * @param updatedFormaValida Objeto con las claves de los formularios y su estado de validez (true/false).
   */
  public actualizarformaValida(updatedFormaValida: {
    [key: string]: boolean;
  }): void {
    this.update((state) => ({
      ...state,
      finalEnviar: {
        ...state.finalEnviar,
        ...updatedFormaValida,
      },
    }));
  }

  /**
   * Actualiza el store con la lista de terceros relacionados.
   * @method updateTercerosRelacionados
   * @param {TercerosrelacionadosdestinoTable[]} tercerosRelacionados Lista de personas terceros relacionadas.
   */
  public updateFilaSolicitud(tercerosRelacionados: FilaSolicitud[]): void {
    this.update(state => ({
      ...state,
      tablaDatos: tercerosRelacionados,
    }));
  }

  /**
   * Actualiza el estado con los datos finales de la tabla.
   * @param tablaDatos Arreglo de filas con los datos de la solicitud.
   */
  public tablaDatosFinal(tablaDatos: FilaSolicitud[]): void {
    this.update((state) => ({
      ...state,
      tablaDatos,
    }));
  }

  /**
   * Restablece el estado a su estado inicial.
   */
  public limpiarFormulario(): void {
    this.reset();
  }

  /**
   * Actualiza el store con una persona tercero relacionada.
   * @method actualizarTercerosRelacionados
   * @param {TercerosrelacionadosdestinoTable} nuevoTercero Persona tercero relacionada.
   */
  public actualizarTercerosRelacionados(
    nuevoTercero: TercerosrelacionadosdestinoTable
  ): void {
    this.update((state) => ({
      ...state,
      tercerosRelacionados: [...state.tercerosRelacionados, nuevoTercero],
    }));
  }

  /**
   * Actualiza el store con la lista de terceros relacionados.
   * @method updateTercerosRelacionados
   * @param {TercerosrelacionadosdestinoTable[]} tercerosRelacionados Lista de personas terceros relacionadas.
   */
  public updateTercerosRelacionados(
    tercerosRelacionados: TercerosrelacionadosdestinoTable[]
  ): void {
    this.update((state) => ({
      ...state,
      tercerosRelacionados: tercerosRelacionados,
    }));
  }

  /**
   * Actualiza el store con los datos de pago de derechos.
   * @method actualizarPagoDeDerechos
   * @param {PagoDeDerechos} pagoDeDerechos Datos del pago de derechos.
   */
  public actualizarPagoDeDerechos(pagoDeDerechos: PagoDeDerechos): void {
    this.update(state => ({
      ...state,
      pago: pagoDeDerechos,
    }));
  }

  /**
   * Actualiza el store con la lista de terceros exportadores.
   * @method updateTercerosExportador
   * @param {TercerosrelacionadosExportadorTable[]} tercerosRelacionados Lista de terceros exportadores.
   */
  public updateTercerosExportador(
    tercerosRelacionados: TercerosrelacionadosExportadorTable[]
  ): void {
    this.update((state) => ({
      ...state,
      datosForma: [...tercerosRelacionados],
    }));
  }
  
  /**
  * Actualiza el store con los datos de movilización nacional.
  * @method actualizarDatosParaMovilizacionNacional
  * @param {TercerosrelacionadosdestinoTable} datosParaMovilizacionNacional Datos de movilización nacional.
  */
  public actualizarSelectedExdora(datosParaMovilizacionNacional: TercerosrelacionadosExportadorTable): void {
    this.update(state => ({
      ...state,
      seletedExdora: datosParaMovilizacionNacional
    }));
  }

/**
 * Actualiza el store con los datos de movilización nacional.
 * @method actualizarDatosParaMovilizacionNacional
 * @param {DatosParaMovilizacionNacional} datosParaMovilizacionNacional Datos de movilización nacional.
 */
  public actualizarSelectedTerceros(datosParaMovilizacionNacional: TercerosrelacionadosdestinoTable): void {
    this.update(state => ({
      ...state,
      seletedTerceros: datosParaMovilizacionNacional
    }));
  }
}