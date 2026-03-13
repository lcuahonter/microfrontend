import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tramite260205Store } from '../estados/stores/tramite260205.store';


/**
 * Decorador que marca la clase como un servicio inyectable en Angular.
 * 
 * Este servicio está registrado en el nivel raíz del sistema de inyección de dependencias,
 * lo que significa que estará disponible en toda la aplicación sin necesidad de declararlo
 * explícitamente en los módulos.
 * 
 * @decorator @Injectable
 * @providedIn 'root' Indica que el servicio se proporciona en el nivel raíz de la aplicación.
 */
@Injectable({
  providedIn: 'root',
})
export class MateriasPrimasDestinadosService {

  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar peticiones.
   * @param tramite260212Store Almacén de estado para el trámite 260212.
   */
  constructor(private http: HttpClient, private tramite260205Store: Tramite260205Store,) {
    // Lógica de inicialización si es necesario
  }
 
  /**
   * Actualiza el estado del formulario en el store a partir de los datos proporcionados.
   * @param datos Estado actual del formulario de trámite 260212.
   */
  actualizarEstadoFormulario(datos: Tramite260205Store): void {
    this.tramite260205Store.update((state) => {
      return {
        ...state, ...datos
      }
    });
  }

  /**
   * Obtiene los datos del trámite 260205 desde un archivo JSON local.
   *
   * @returns {Observable<Tramite260205State>} Un observable que emite el estado del trámite 260205.
   */
  getTramiteDatos(): Observable<Tramite260205Store> {
    return this.http.get<Tramite260205Store>('assets/json/260205/datos.json');
  }

}
