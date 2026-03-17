import { Tramite240407State, Tramite240407Store } from '../estados/tramite240407Store.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SolicitudProrrogaAvisoImportacionService {

 
  /**
   * URL del archivo JSON que contiene los datos del permiso IMMEX.
   */
  private jsonUrl = 'assets/json/240407';

  constructor(private httpClient: HttpClient,
    public tramite240407Store: Tramite240407Store) { }

  /**
   * Actualiza el estado del formulario en el store del trámite.
   * @param DATOS Datos del formulario a actualizar.
   */
  actualizarEstadoFormulario(DATOS: Tramite240407State): void {
    this.tramite240407Store.update((state) => ({
      ...state,
      ...DATOS
    }))
  }

  /**
   * Obtiene los datos de registro de toma de muestras de mercancías.
   * @returns Observable con los datos del formulario de registro.
   */
  obtenerRegistroTomarMuestrasDatos(): Observable<Tramite240407State> {
    return this.httpClient.get<Tramite240407State>('assets/json/240407/solicitud-prorroga-aviso-importacion.json');
  }
}

