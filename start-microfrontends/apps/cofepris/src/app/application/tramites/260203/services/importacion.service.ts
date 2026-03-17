import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tramite260203Store } from '../estados/stores/tramite260203Store.store';

/**
 * Servicio encargado de manejar la lógica y comunicación relacionada con el trámite 260212.
 * Proporciona métodos para actualizar el estado del formulario y obtener datos de consulta.
 */
@Injectable({
  providedIn: 'root',
})
export class ImportacionService {

  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar peticiones.
   * @param tramite260212Store Almacén de estado para el trámite 260212.
   */
  constructor(private http: HttpClient, private tramite260203Store: Tramite260203Store,) {
    // Lógica de inicialización si es necesario
  }
 
  /**
   * Actualiza el estado del formulario en el store a partir de los datos proporcionados.
   * @param datos Estado actual del formulario de trámite 260203.
   */
  actualizarEstadoFormulario(datos: Tramite260203Store): void {
    this.tramite260203Store.update((state) => {
      return {
        ...state, ...datos
      }
    });
  }

  /**
   * Obtiene los datos del trámite 260203 desde un archivo JSON local.
   *
   * @returns {Observable<Tramite260203State>} Un observable que emite el estado del trámite 260203.
   */
  getTramiteDatos(): Observable<Tramite260203Store> {
    return this.http.get<Tramite260203Store>('assets/json/260203/datos.json');
  }

}
