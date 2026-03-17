import { Tramite240120State, Tramite240120Store } from '../estados/tramite240120Store.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PermisoExportacionPirotecniaService {
  /**
   * Crea una instancia del servicio PermisoExportacionPirotecniaService.
   * @param httpClient Cliente HTTP para realizar peticiones.
   * @param tramite240120Store Store del trámite 240120 para manejar el estado.
   */
  constructor(private httpClient: HttpClient,
    public tramite240120Store: Tramite240120Store) { }

  /**
   * Actualiza el estado del formulario en el store del trámite.
   * @param DATOS Datos del formulario a actualizar.
   */
  actualizarEstadoFormulario(DATOS: Tramite240120State): void {
    this.tramite240120Store.update((state) => ({
      ...state,
      ...DATOS
    }))
  }

  /**
   * Obtiene los datos de registro de toma de muestras de mercancías.
   * @returns Observable con los datos del formulario de registro.
   */
  obtenerRegistroTomarMuestrasDatos(): Observable<Tramite240120State> {
    return this.httpClient.get<Tramite240120State>('assets/json/240120/datos-previos.json');
  }
}
