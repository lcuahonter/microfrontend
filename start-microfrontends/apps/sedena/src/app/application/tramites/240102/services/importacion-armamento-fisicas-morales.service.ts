import { Tramite240102State,Tramite240102Store } from '../estados/tramite240102Store.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportacionArmamentoFisicasMoralesService {

  /**
   * Constructor del servicio ImportacionArmamentoFisicasMoralesService.
   * Inyecta el HttpClient y el store del trámite 240102.
   * @param httpClient - Cliente HTTP para realizar peticiones.
   * @param tramite240102Store - Store que gestiona el estado del trámite 240102.
   */
  constructor(private httpClient: HttpClient,
    public tramite240102Store: Tramite240102Store) { }

      /**
   * Actualiza el estado del formulario en el store del trámite.
   * @param DATOS Datos del formulario a actualizar.
   */
  actualizarEstadoFormulario(DATOS: Tramite240102State): void {
    this.tramite240102Store.update((state) => ({
      ...state,
      ...DATOS
    }))
  }

  /**
   * Obtiene los datos de registro de toma de muestras de mercancías.
   * @returns Observable con los datos del formulario de registro.
   */
  obtenerRegistroTomarMuestrasDatos(): Observable<Tramite240102State> {
    return this.httpClient.get<Tramite240102State>('assets/json/240102/respuestaDeActualizacionDe.json');
  }
}
