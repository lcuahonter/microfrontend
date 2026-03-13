import { Solicitud32102State, Tramite32102Store } from '../../../estados/tramites/tramite32102.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


/**
 * Servicio encargado de manejar la lógica relacionada con la solicitud del trámite 31601.
 * Se encarga de actualizar el estado de la solicitud en el store y de obtener datos precargados desde archivos JSON.
 */
@Injectable({
  providedIn: 'root',
})
export class AvisoDeAmpliacionService{
  
    
  constructor(
    private http: HttpClient,
    private tramite32101Store: Tramite32102Store
  ) {
    // Lógica de inicialización si es necesario
  }

  /**
   * Actualiza el estado del formulario de la solicitud en el store con la información proporcionada.
   * Cada propiedad del objeto recibido es asignada al store correspondiente.
   * 
   * @param DATOS Objeto con la estructura completa del estado del formulario del trámite 31601.
   */
  actualizarEstadoFormulario(DATOS:Solicitud32102State): void {
    this.tramite32101Store.setManifiesto1(DATOS.MANIFIESTO_1);
    this.tramite32101Store.setManifiesto2(DATOS.MANIFIESTO_2);
    this.tramite32101Store.setManifiesto3(DATOS.MANIFIESTO_3);
    this.tramite32101Store.setManifiesto4(DATOS.MANIFIESTO_4);
 }

  /**
   * Obtiene los datos precargados desde un archivo JSON relacionado con el registro de toma de muestras de mercancías.
   * Este archivo contiene información que se puede utilizar para precargar el estado del formulario.
   * 
   * @returns Observable con la estructura del estado de la solicitud.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud32102State> {
    return this.http.get<Solicitud32102State>('assets/json/32102/registro_toma_muestras_mercancias.json');
  }
}
