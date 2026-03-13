/**
 * Este servicio proporciona métodos para obtener y actualizar datos relacionados con exportadores autorizados.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Tramite110102State, Tramite110102Store } from '../estados/store/tramite110102.store';
/**
 * ExportadorAutorizadoService
 */
@Injectable({
  providedIn: 'root'
})
/**
 * Servicio para gestionar la obtención y actualización de datos de exportadores autorizados.
 *
 * @export
 * @class ExportadorAutorizadoService
 */
export class ExportadorAutorizadoService {
  /**
   * Constructor del servicio.
   * @param {HttpClient} http - Servicio HTTP para realizar solicitudes al servidor.
   * @param {Tramite110102Store} estadoTramite - Servicio para manejar el estado global del trámite.
   */
  constructor(
    private http: HttpClient,
    private estadoTramite: Tramite110102Store
  ) {}

  /**
   * Obtiene los datos del registro de exportadores autorizados desde un archivo JSON.
   * @returns {Observable<Tramite110102State>} - Un observable con los datos del registro.
   */
  obtenerRegistro(): Observable<Tramite110102State> {
    return this.http.get<Tramite110102State>('./assets/json/110102/registro.json');
  }

  /**
   * Actualiza el estado global del trámite con los datos proporcionados.
   * @param {Tramite110102State} registro - Los datos del registro que se actualizarán en el estado global.
   */
  actualizarRegistro(registro: Tramite110102State): void {
    this.estadoTramite.update({
      cveRegistroProductor: registro.cveRegistroProductor,
      claveUnidadAdministrativa: registro.claveUnidadAdministrativa,
      claveEntidadFederativa: registro.claveEntidadFederativa,
      protestoDecirVerdad: registro.protestoDecirVerdad,
      solicitaSeparacionContable: registro.solicitaSeparacionContable,
      solicitaExportadorAutorizado: registro.solicitaExportadorAutorizado,
      condicionExportador: registro.condicionExportador,
      solicitaExportadorAutorizadoJPN: registro.solicitaExportadorAutorizadoJPN,
      condicionExportadorJPN: registro.condicionExportadorJPN
    });
  }
}