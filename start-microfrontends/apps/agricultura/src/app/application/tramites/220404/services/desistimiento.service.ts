/**
 * @fileoverview
 * Este archivo define el servicio `DesistimientoService`, que proporciona métodos para gestionar
 * los datos relacionados con el desistimiento en el trámite 220404. Incluye operaciones para obtener
 * datos simulados desde archivos JSON y actualizar el estado del formulario en el store.
 * 
 * @module DesistimientoService
 * @description
 * Este archivo contiene la implementación del servicio `DesistimientoService`, que interactúa con
 * el store y realiza solicitudes HTTP para manejar los datos del desistimiento.
 */

import { DesistimientoForm } from '../modelos/desistimiento.model';
import { DesistimientoStore } from '../estados/tramite220404.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * @class DesistimientoService
 * @description
 * Servicio que gestiona los datos relacionados con el desistimiento en el trámite 220404.
 * Proporciona métodos para obtener datos simulados desde archivos JSON y actualizar el estado
 * del formulario en el store.
 */
@Injectable({
  providedIn: 'root',
})
export class DesistimientoService {
  /**
   * URL base para obtener los datos simulados desde archivos JSON.
   * @private
   * @type {string}
   */
  private readonly desistimientoUrl: string = '/assets/json/220404/';

  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes.
   * @param {DesistimientoStore} DesistimientoStore - Store para gestionar el estado del desistimiento.
   */
  constructor(
    private readonly http: HttpClient,
    public readonly DesistimientoStore: DesistimientoStore
  ) {
    /** No se necesita lógica de inicialización adicional. */
  }

  /**
   * Obtiene los datos simulados para el formulario de desistimiento.
   * 
   * Realiza una solicitud HTTP GET para recuperar los datos desde un archivo JSON local.
   * 
   * @returns {Observable<DesistimientoForm>} Observable que emite los datos del formulario.
   */
  getDesistimientoSolicitud(): Observable<DesistimientoForm> {
    return this.http.get<DesistimientoForm>(`${this.desistimientoUrl}desistimiento.json`);
  }

  /**
   * Guarda los datos del formulario de desistimiento en el store.
   * 
   * Actualiza el estado del store con los datos proporcionados.
   * 
   * @param {Partial<DesistimientoForm>} datos - Datos parciales del formulario a guardar.
   */
  guardarFormularioDesistimiento(datos: Partial<DesistimientoForm>): void {
    this.DesistimientoStore.update((state) => ({
      ...state,
      ...datos,
    }));
  }

  /**
   * Actualiza el estado del formulario de desistimiento en el store.
   * 
   * Combina los datos proporcionados con el estado actual del store.
   * 
   * @param {Partial<DesistimientoForm>} DATOS - Datos parciales del formulario para actualizar el estado.
   */
  actualizarEstadoFormulario(DATOS: Partial<DesistimientoForm>): void {
    this.DesistimientoStore.update((state) => ({
      ...state,
      ...DATOS,
    }));
  }

  /**
   * Obtiene los datos del formulario de desistimiento para la toma de muestras de mercancías.
   * 
   * Realiza una solicitud HTTP GET para recuperar los datos desde un archivo JSON local.
   * 
   * @returns {Observable<DesistimientoForm>} Observable que emite los datos del formulario.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<DesistimientoForm> {
    return this.http.get<DesistimientoForm>(`${this.desistimientoUrl}descripcion.json`);
  }
}