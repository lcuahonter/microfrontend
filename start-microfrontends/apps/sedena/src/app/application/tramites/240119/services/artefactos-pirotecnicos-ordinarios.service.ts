import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tramite240119State } from '../estados/tramite240119Store.store';
import { Tramite240119Store } from '../estados/tramite240119Store.store';


@Injectable({
  providedIn: 'root'
})
export class ArtefactosPirotecnicosOrdinariosService {
  /**
   * Crea una instancia del servicio ArtefactosPirotecnicosOrdinariosService.
   * @param httpClient Cliente HTTP para realizar peticiones.
   * @param tramite24119Store Store del trámite 240119 para manejar el estado.
   */
  constructor(private httpClient: HttpClient,
    public tramite24119Store: Tramite240119Store) { }

  /**
   * Actualiza el estado del formulario en el store del trámite.
   * @param DATOS Datos del formulario a actualizar.
   */
  actualizarEstadoFormulario(DATOS: Tramite240119State): void {
    this.tramite24119Store.update((state) => ({
      ...state,
      ...DATOS
    }))
  }

  /**
   * Obtiene los datos de registro de toma de muestras de mercancías.
   * @returns Observable con los datos del formulario de registro.
   */
  obtenerRegistroTomarMuestrasDatos(): Observable<Tramite240119State> {
    return this.httpClient.get<Tramite240119State>('assets/json/240119/datos-previos.json');
  }
}
