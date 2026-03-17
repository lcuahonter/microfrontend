import { Programa140102State, Tramite140102Store } from '../../../estados/tramites/tramite140102.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Decorador Injectable que permite que este servicio sea inyectable en cualquier módulo.
/**
 * Servicio para gestionar las operaciones relacionadas con el programa a cancelar.
 * 
 * Este servicio permite obtener los datos del programa a cancelar desde un archivo JSON local.
 * 
 * @providedIn 'any' - Define que este servicio puede ser inyectado en cualquier módulo.
 */
@Injectable({
  providedIn: 'any'
})
export class ProgramaACancelarService {
  /**
   * Constructor del servicio.
   * 
   * @param http - Cliente HTTP utilizado para realizar solicitudes a recursos externos.
   */
  constructor(private http: HttpClient,private tramiteStore: Tramite140102Store) {
     // El constructor se utiliza para la inyección de dependencias.
  }
 
  /**
   * Obtiene los datos del programa para cancelar.
   *
   * Realiza una solicitud HTTP GET para recuperar la información del programa
   * desde un archivo JSON localizado en 'assets/json/140102/programa-cancelar.json'.
   *
   * @returns Un Observable que emite el estado del programa de tipo Programa140102State.
   */
  getProgramaDatos(): Observable<Programa140102State> {
    return this.http.get<Programa140102State>('assets/json/140102/programa-cancelar.json');
  }


  /**
   * Establece los datos del formulario en el store del trámite.
   *
   * @param datos - Objeto de tipo `Programa140102State` que contiene la información del formulario,
   * incluyendo la confirmación, observaciones de la solicitud, el programa a cancelar y la selección de radio.
   *
   * Este método actualiza el estado del store del trámite con los valores proporcionados en el objeto `datos`.
   */
  setDatosFormulario(datos: Programa140102State): void {
    this.tramiteStore.setConfirmar(datos.confirmar);
    this.tramiteStore.setSolicitudObservaciones(datos.solicitudObservaciones);
    this.tramiteStore.setPrograma(datos.programaACancelar);
    this.tramiteStore.setRadioSelection(datos.radio);
}
}