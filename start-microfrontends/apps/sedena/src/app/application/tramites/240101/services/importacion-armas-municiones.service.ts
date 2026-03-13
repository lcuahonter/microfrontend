import { Tramite240101State, Tramite240101Store } from '../estados/tramite240101Store.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ImportacionArmasMunicionesService {

  /**
   * URL del archivo JSON que contiene los datos del permiso IMMEX.
   */
  private jsonUrl = 'assets/json/240101';

  /**
   * Constructor del servicio ImportacionArmasMunicionesService.
   * Inyecta el HttpClient y el store del trámite 240101.
   * @param httpClient - Cliente HTTP para realizar peticiones.
   *  @param tramite240101Store - Store que gestiona el estado del trámite 240101.
   */
  constructor(private httpClient: HttpClient,
    public tramite240101Store: Tramite240101Store) { }

  /**
   * Actualiza el estado del formulario en el store del trámite.
   * @param DATOS Datos del formulario a actualizar.
   */
  actualizarEstadoFormulario(DATOS: Tramite240101State): void {
    this.tramite240101Store.update((state) => ({
      ...state,
      ...DATOS
    }))
  }

  /**
   * Obtiene los datos de registro de toma de muestras de mercancías.
   * @returns Observable con los datos del formulario de registro.
   */
  obtenerRegistroTomarMuestrasDatos(): Observable<Tramite240101State> {
    return this.httpClient.get<Tramite240101State>('assets/json/240101/respuestaDeActualizacionDe.json');
  }
}
