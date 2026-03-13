import { Store, StoreConfig } from '@datorama/akita';
import { DestinatarioForm } from '../../../220203/models/220203/importacion-de-acuicultura.module';
import { Injectable } from '@angular/core';
import { TercerosrelacionadosdestinoTable } from '../../../../shared/models/tercerosrelacionados.model';

import {
  CapturarSolicitud,
  DatosDeLaSolicitud,
  DatosParaMovilizacionNacional,
  FilaSolicitud,
  PagoDeDerechos,
  Solicitante,
  ValidarEnvio,
  createDatosState
} from '../../models/220201/capturar-solicitud.model';

export interface TramiteFolioState {
  idTramite: string | null;
  firma: string | null;
  idSolicitud: number | null; 
  procedure: number | null;
}

/**
 * @fileoverview Store Akita para la gestión del estado de la solicitud zoosanitaria.
 * Permite almacenar y actualizar la información capturada en el trámite, como solicitante,
 * datos de la solicitud, movilización nacional, terceros relacionados, pagos y validaciones.
 * @module ZoosanitarioStore
 */

/**
 * Store Akita para la gestión del estado de la solicitud zoosanitaria.
 * @class ZoosanitarioStore
 * @extends {Store<CapturarSolicitud>}
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'seccion', resettable: true })
export class ZoosanitarioStore extends Store<CapturarSolicitud> {
  /**
   * Inicializa el store con el estado inicial de la solicitud.
   * @method constructor
   */
  constructor() {
    super(createDatosState());
  }

  /**
   * Actualiza el store con la información del solicitante.
   * @method actualizarSolicitante
   * @param {Solicitante} solicitante Datos del solicitante.
   */
  public actualizarSolicitante(solicitante: Solicitante): void {
    this.update(state => ({
      ...state,
      solicitante: solicitante,
    }));
  }

  /**
   * Actualiza el store con los datos generales de la solicitud.
   * @method actualizarDatosDeLaSolicitud
   * @param {DatosDeLaSolicitud} datosDeLaSolicitud Datos generales de la solicitud.
   */
  public actualizarDatosDeLaSolicitud(datosDeLaSolicitud: DatosDeLaSolicitud): void {
    this.update(state => ({
      ...state,
      datosDeLaSolicitud: datosDeLaSolicitud,
    }));
  }

  /**
   * Actualiza el store con los datos de movilización nacional.
   * @method actualizarDatosParaMovilizacionNacional
   * @param {DatosParaMovilizacionNacional} datosParaMovilizacionNacional Datos de movilización nacional.
   */
  public actualizarDatosParaMovilizacionNacional(datosParaMovilizacionNacional: DatosParaMovilizacionNacional): void {
    this.update(state => ({
      ...state,
      datosParaMovilizacionNacional: datosParaMovilizacionNacional,
    }));
  }

  /**
  * Actualiza el store con los datos de movilización nacional.
  * @method actualizarDatosParaMovilizacionNacional
  * @param {DatosParaMovilizacionNacional} datosParaMovilizacionNacional Datos de movilización nacional.
  */
  public actualizarSelectedExdora(datosParaMovilizacionNacional: DestinatarioForm): void {
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
  /**
   * Actualiza el store con los datos de pago de derechos.
   * @method actualizarPagoDeDerechos
   * @param {PagoDeDerechos} pagoDeDerechos Datos del pago de derechos.
   */
  public actualizarPagoDeDerechos(pagoDeDerechos: PagoDeDerechos): void {
    this.update(state => ({
      ...state,
      pagoDeDerechos: pagoDeDerechos,
    }));
  }

  /**
   * Actualiza el campo de validez de los formularios en el estado.
   * @method actualizarformaValida
   * @param {{ [key: string]: boolean }} updatedFormaValida Objeto con los valores de validez de cada formulario.
   */
  public actualizarformaValida(updatedFormaValida: { [key: string]: boolean }): void {
    this.update(state => ({
      ...state,
      validarEnvio: {
        ...state?.validarEnvio,
        ...updatedFormaValida,
      }
    }));
  }

  /**
   * Actualiza el campo de validez de los formularios en el estado con un objeto ValidarEnvio.
   * @method actualizarformaValidas
   * @param {ValidarEnvio} updatedFormaValida Objeto ValidarEnvio con los valores de validez.
   */
  public actualizarformaValidas(updatedFormaValida: ValidarEnvio): void {
    this.update(state => ({
      ...state,
      validarEnvio: updatedFormaValida,
    }));
  }

  /**
  * Actualiza el store con una persona tercero relacionada.
  * @method actualizarTercerosRelacionados
  * @param {TercerosrelacionadosdestinoTable} nuevoTercero Persona tercero relacionada.
  */
  public actualizarTercerosRelacionados(nuevoTercero: TercerosrelacionadosdestinoTable): void {
    this.update(state => ({
      ...state,
      tercerosRelacionados: [
        ...(state.tercerosRelacionados || []),
        nuevoTercero
      ]
    }));
  }
  /**
   * Actualiza el store con la lista de terceros relacionados.
   * @method updateTercerosRelacionados
   * @param {TercerosrelacionadosdestinoTable[]} tercerosRelacionados Lista de personas terceros relacionadas.
   */
  public updateTercerosRelacionados(tercerosRelacionados: TercerosrelacionadosdestinoTable[]): void {
    this.update(state => ({
      ...state,
      tercerosRelacionados: tercerosRelacionados,
    }));
  }
  /**
   * Actualiza el store con la lista de terceros relacionados.
   * @method updateTercerosRelacionados
   * @param {TercerosrelacionadosdestinoTable[]} tercerosRelacionados Lista de personas terceros relacionadas.
   */
  public updatedatosForma(tercerosRelacionados: DestinatarioForm[]): void {
    this.update(state => ({
      ...state,
      datosForma: tercerosRelacionados,
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

  actualizarTodoElEstado(datos: CapturarSolicitud): void {
    this.update(state => ({
      ...state,
      datosDeLaSolicitud: datos.datosDeLaSolicitud,
      datosParaMovilizacionNacional: datos.datosParaMovilizacionNacional,
      pagoDeDerechos: datos.pagoDeDerechos,
      tercerosRelacionados: datos.tercerosRelacionados,
      validarEnvio: datos.validarEnvio,
      tablaDatos: datos.tablaDatos,
      selectedDatos: datos.selectedDatos,
      datos: datos.datos,
      datosForma: datos.datosForma,
      seletedTerceros: datos.seletedTerceros,
      seletedExdora: datos.seletedExdora,
      idSolicitud: datos.idSolicitud
    }));
  }

  setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

  /**
   * Restaura el estado inicial del store, limpiando toda la información almacenada.
   * @method limpiarFormulario
   */
  public limpiarFormulario(): void {
    this.reset();
  }
}