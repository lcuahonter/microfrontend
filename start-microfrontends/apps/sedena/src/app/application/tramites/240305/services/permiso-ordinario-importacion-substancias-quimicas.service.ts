import { Tramite240305State, Tramite240305Store } from '../estados/tramite240305Store.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermisoOrdinarioImportacionSubstanciasQuimicasService {

  constructor(private httpClient: HttpClient,
    public tramite240305Store: Tramite240305Store) { }

  /**
   * Actualiza el estado del formulario en el store del trámite.
   * @param DATOS Datos del formulario a actualizar.
   */
  actualizarEstadoFormulario(DATOS: Tramite240305State): void {
    this.tramite240305Store.update((state) => ({
      ...state,
      ...DATOS
    }))
  }

  /**
   * Obtiene los datos de registro de toma de muestras de mercancías.
   * @returns Observable con los datos del formulario de registro.
   */
  obtenerRegistroTomarMuestrasDatos(): Observable<Tramite240305State> {
    return this.httpClient.get<Tramite240305State>('assets/json/240305/permiso-ordinario-importacion-substancias-quimicas.json');
  }
}
