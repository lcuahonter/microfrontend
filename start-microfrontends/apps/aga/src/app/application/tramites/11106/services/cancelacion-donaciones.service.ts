import { Solicitud11106State, Solicitud11106Store } from '../estados/solicitud11106.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para gestionar las operaciones relacionadas con la retirada de la autorización de donaciones.
 */
@Injectable({
  providedIn: 'root',
})
export class CancelacionDonacionesService {
  /**
   * Constructor de la clase.
   * @param http Cliente HTTP para realizar peticiones a servicios externos.
   * @param store Store de Akita para gestionar el estado de la solicitud 11106.
   */
  constructor(private http: HttpClient, private store: Solicitud11106Store, ) {
    // El constructor se utiliza para la inyección de dependencias.
  }


  /**
   * @description
   * Combina el estado actual con los nuevos datos utilizando el operador spread.
   * @method actualizarEstadoFormulario
   * @param {Solicitud11106State} DATOS - Objeto que contiene los nuevos datos para actualizar el estado del formulario.
   */
  actualizarEstadoFormulario(DATOS: Solicitud11106State): void {
    this.store.update((state) => ({
      ...state,
      ...DATOS
    }))
  }

  /**
   * @description
   * Obtiene los datos de registro de toma de muestras de mercancías desde un archivo JSON local.
   * @memberof CancelacionDonacionesService
   * @returns {Observable<Solicitud11106State>} Observable que emite el estado de la solicitud 11106 
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud11106State> {
    return this.http.get<Solicitud11106State>('assets/json/11106/prefill-datos.json');
  }
}
