import { CancelarModalidad, CancelarSolicitudForm } from '../modelos/cancelar-solicitud.modalidad.model';
import { CancelarSolicitudState, CancelarSolicitudStore } from '../estados/tramite570101.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class CancelarSolicitudService {

  /**
   * URL base para obtener los datos simulados desde archivos JSON.
   * @private
   * @type {string}
   */
  private cancelarSolicitudUrl = '/assets/json/570101/';

  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient,public CancelarSolicitudStore: CancelarSolicitudStore) {
    // No se necesita lógica de inicialización adicional.
  }

  /**
   * Obtiene los datos simulados para el formulario de cambio de modalidad.
   * 
   * @returns {Observable<CancelarSolicitudForm>} Observable que emite los datos del formulario.
   */
  getCancelarSolicitud(): Observable<CancelarSolicitudForm> {
    return this.http.get<CancelarSolicitudForm>(`${this.cancelarSolicitudUrl}cancelarSolicitud.json`);
  }

  /**
   * Método para obtener el rango de días disponibles para selección.
   * Realiza una solicitud HTTP al archivo 'selectRangoDias.json' para obtener los datos necesarios.
   * @returns Un observable que emite un array de cadenas representando los días disponibles.
   */
    getSelectRangoDias(): Observable<string[]> {
      return this.http.get<string[]>(`${this.cancelarSolicitudUrl}selectRangoDias.json`);
    }

  /**
   * Método para obtener los tipos de solicitud disponibles (Total o Parcial).
   * Realiza una solicitud HTTP al archivo 'tipoSolicitud.json' para recuperar los datos.
   * @returns Un observable que emite un array de objetos de tipo 'CancelarModalidad'.
   */
    getTipoSolicitud(): Observable<CancelarModalidad[]> {
      return this.http.get<CancelarModalidad[]>(`${this.cancelarSolicitudUrl}tipoSolicitud.json`);
    }

 /**
 * Actualiza el estado del formulario con los datos proporcionados.
 * 
 * @param DATOS - Estado de la solicitud `Solicitud230401State` con la información 
 *                del tipo de solicitud a actualizar en el store.
 */
actualizarEstadoFormulario(DATOS: Partial<CancelarSolicitudState>): void {
  this.CancelarSolicitudStore.update((state) => ({
    ...state,
    ...DATOS
  }));
}

/**

Obtiene los datos simulados para el registro de toma de muestras de mercancías.
Realiza una solicitud HTTP al archivo 'requestCancallar.json' ubicado en la carpeta de assets.
Devuelve un observable que emite el estado de la solicitud de cancelación.
@returns {Observable<CancelarSolicitudState>} Observable que emite los datos del estado de la solicitud de cancelación. */
getRegistroTomaMuestrasMercanciasData(): Observable<CancelarSolicitudState> {
  return this.http.get<CancelarSolicitudState>('assets/json/570101/requestCancallar.json');
}

}