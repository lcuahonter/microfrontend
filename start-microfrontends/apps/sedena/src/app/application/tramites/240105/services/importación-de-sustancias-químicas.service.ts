import { Tramite240105State, Tramite240105Store } from '../estados/tramite240105Store.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportaciónDeSustanciasQuímicasService {

  /**
   * URL del archivo JSON que contiene los datos del permiso IMMEX.
   */
  private jsonUrl = 'assets/json/240105';

  /**
   * Constructor del servicio ImportaciónDeSustanciasQuímicasService.
   * Inyecta el HttpClient y el store del trámite 240105.
   * @param httpClient - Cliente HTTP para realizar peticiones.
   * @param tramite240105Store - Store que gestiona el estado del trámite 240105.
   */
  constructor(private httpClient: HttpClient,
    public tramite240105Store: Tramite240105Store) { }


  /**
   * Actualiza el estado del formulario en el store del trámite.
   * @param DATOS Datos del formulario a actualizar.
  */
  actualizarEstadoFormulario(DATOS: Tramite240105State): void {
    this.tramite240105Store.update((state) => ({
      ...state,
      ...DATOS
    }))
  }

  /**
   * Obtiene los datos de registro de toma de muestras de mercancías.
   * @returns Observable con los datos del formulario de registro.
   */
  obtenerRegistroTomarMuestrasDatos(): Observable<Tramite240105State> {
    return this.httpClient.get<Tramite240105State>('assets/json/240105/respuestaDeActualizacionDe.json');
  }
}
