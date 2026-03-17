import { Tramite240121State, Tramite240121Store } from '../estados/tramite240121Store.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PermisoOrdinarioExportacionExplosivoService {
  /**
   * Crea una instancia del servicio PermisoExportacionPirotecniaService.
   * @param httpClient Cliente HTTP para realizar peticiones.
   * @param tramite240121Store Store del trámite 240121 para manejar el estado.
   */
  constructor(private httpClient: HttpClient,
    public tramite240121Store: Tramite240121Store) { }

  /**
   * Actualiza el estado del formulario en el store del trámite.
   * @param DATOS Datos del formulario a actualizar.
   */
  actualizarEstadoFormulario(DATOS: Tramite240121State): void {
    this.tramite240121Store.update((state) => ({
      ...state,
      ...DATOS
    }))
  }

  /**
   * Obtiene los datos de registro de toma de muestras de mercancías.
   * @returns Observable con los datos del formulario de registro.
   */
  obtenerRegistroTomarMuestrasDatos(): Observable<Tramite240121State> {
    return this.httpClient.get<Tramite240121State>('assets/json/240121/datos-previos.json');
  }
}
