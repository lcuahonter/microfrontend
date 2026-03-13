import { Solicitud570102State, Tramite570102Store } from '../state/Tramite570102.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  constructor(private http: HttpClient, private tramite570102Store: Tramite570102Store) {
    // El constructor se utiliza para la inyección de dependencias.
   }

   /**
     * Actualiza el estado global del formulario con los datos proporcionados.
     * @param DATOS Objeto con los datos del formulario de tipo Solicitud570102State.
     */
  actualizarEstadoFormulario(DATOS: Solicitud570102State): void {
    this.tramite570102Store.setFolio(DATOS.folio);
    this.tramite570102Store.setMotivoDelDes(DATOS.motivoDelDes);
    
  }
  /**
     * Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
     * @returns Observable con los datos del formulario.
     */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud570102State> {
    return this.http.get<Solicitud570102State>('assets/json/570102/registro_toma_muestras_mercancias.json');
  }

}
