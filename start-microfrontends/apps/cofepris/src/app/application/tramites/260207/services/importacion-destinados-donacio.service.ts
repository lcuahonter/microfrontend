import { Tramite260207State, Tramite260207Store } from '../estados/tramite260207Store.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportacionDestinadosDonacioService {

  /**
   * Creates an instance of ImportacionDestinadosDonacioService.
   *
   * @param http - The Angular HttpClient used to perform HTTP requests.
   * @param tramite260207Store - The store that manages the state of the 260207 process.
   */
  constructor(
    private readonly http: HttpClient,
    private readonly tramite260207Store: Tramite260207Store
  ) { }

  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   * 
   * @param DATOS - Estado de la solicitud `Tramite260207State` con la información 
   *                del tipo de solicitud a actualizar en el store.
   */
  actualizarEstadoFormulario(DATOS: Tramite260207State): void {
    this.tramite260207Store.update((state) => ({
      ...state,
      ...DATOS
    }));
  }

  /**
  * Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
  * 
  * @returns Observable con los datos del estado de la solicitud `Tramite260207State`,
  *          cargados desde el archivo JSON especificado en la ruta de `assets`.
  */
  getRegistroTomaMuestrasMercanciasData(): Observable<Tramite260207State> {
    return this.http.get<Tramite260207State>('assets/json/260207/datos.json');
  }
}
