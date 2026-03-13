import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tramite260204Store } from '../estados/stores/tramite260204Store.store';

/**
 * Servicio encargado de manejar la lógica y comunicación relacionada con el trámite 260212.
 * Proporciona métodos para actualizar el estado del formulario y obtener datos de consulta.
 */
@Injectable({
  providedIn: 'root',
})
export class PermisoSanitarioImportacionMedicamentosService {

  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar peticiones.
   * @param tramite260212Store Almacén de estado para el trámite 260212.
   */
  constructor(private http: HttpClient, private tramite260204Store: Tramite260204Store,) {
    // Lógica de inicialización si es necesario
  }
 
  /**
   * Actualiza el estado del formulario en el store a partir de los datos proporcionados.
   * @param datos Estado actual del formulario de trámite 260212.
   */
  actualizarEstadoFormulario(datos: Tramite260204Store): void {
    this.tramite260204Store.update((state) => {
      return {
        ...state, ...datos
      }
    });
  }

  /**
   * Obtiene los datos del trámite 260204 desde un archivo JSON local.
   *
   * @returns {Observable<Tramite260204State>} Un observable que emite el estado del trámite 260204.
   */
  getTramiteDatos(): Observable<Tramite260204Store> {
    return this.http.get<Tramite260204Store>('assets/json/260204/datos.json');
  }

}
