import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tramite260206Store } from '../estados/stores/tramite260206Store.store';

/**
 * Servicio encargado de manejar la lógica y comunicación relacionada con el trámite 260206.
 * Proporciona métodos para actualizar el estado del formulario y obtener datos de consulta.
 */
@Injectable({
  providedIn: 'root',
})
export class MaquilaMateriasPrimasService {

  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar peticiones.
   * @param tramite260206Store Almacén de estado para el trámite 260206.
   */
  constructor(private http: HttpClient, private tramite260206Store: Tramite260206Store,) {
    // Lógica de inicialización si es necesario
  }
 
  /**
   * Actualiza el estado del formulario en el store a partir de los datos proporcionados.
   * @param datos Estado actual del formulario de trámite 260206.
   */
  actualizarEstadoFormulario(datos: Tramite260206Store): void {
    this.tramite260206Store.update((state) => {
      return {
        ...state, ...datos
      }
    });
  }

  /**
   * Obtiene los datos del trámite 260206 desde un archivo JSON local.
   *
   * @returns {Observable<Tramite260206State>} Un observable que emite el estado del trámite 260206.
   */
  getTramiteDatos(): Observable<Tramite260206Store> {
    return this.http.get<Tramite260206Store>('assets/json/260206/datos.json');
  }

}
