import { Tramite260102State,Tramite260102Store } from '../estados/stores/tramite260102Store.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ConsumoPersonalService {
  /**
   * Crea una instancia del servicio ConsumoPersonalService.
   * @param httpClient Cliente HTTP para realizar peticiones.
   * @param tramite260102Store Store del trámite 260102 para manejar el estado.
   */
  constructor(private httpClient: HttpClient,
    public tramite260102Store: Tramite260102Store) { }

  /**
   * Actualiza el estado del formulario en el store del trámite.
   * @param DATOS Datos del formulario a actualizar.
   */
  actualizarEstadoFormulario(DATOS: Tramite260102State): void {
    this.tramite260102Store.update((state) => ({
      ...state,
      ...DATOS
    }))
  }

  /**
   * Obtiene los datos de registro de toma de muestras de mercancías.
   * @returns Observable con los datos del formulario de registro.
   */
  obtenerRegistroTomarMuestrasDatos(): Observable<Tramite260102State> {
    return this.httpClient.get<Tramite260102State>('assets/json/260102/datos-previos.json');
  }
}
