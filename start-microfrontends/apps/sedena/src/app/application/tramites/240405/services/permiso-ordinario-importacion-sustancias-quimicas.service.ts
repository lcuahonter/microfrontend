import { Tramite240405State, Tramite240405Store } from '../estados/tramite240405Store.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermisoOrdinarioImportacionSustanciasQuimicasService {

 /**
   * URL del archivo JSON que contiene los datos del permiso IMMEX.
   */
  private jsonUrl = 'assets/json/240405';

  constructor(private httpClient: HttpClient,
    public tramite240405Store: Tramite240405Store) { }

  /**
   * Actualiza el estado del formulario en el store del trámite.
   * @param DATOS Datos del formulario a actualizar.
   */
  actualizarEstadoFormulario(DATOS:Tramite240405State): void {
    this.tramite240405Store.update((state) => ({
      ...state,
      ...DATOS
    }))
  }

  /**
   * Obtiene los datos de registro de toma de muestras de mercancías.
   * @returns Observable con los datos del formulario de registro.
   */
  obtenerRegistroTomarMuestrasDatos(): Observable<Tramite240405State> {
    return this.httpClient.get<Tramite240405State>('assets/json/240405/permiso-ordinario-importacion-sustancias-quimicas.json');
  }
}

