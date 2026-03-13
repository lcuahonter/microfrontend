import { Tramite5601State, Tramite5601Store } from '../estados/stores/tramite5601.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Decorador Injectable para indicar que este servicio puede ser inyectado en otros componentes o servicios
@Injectable({
  providedIn: 'root'
})
export class SolicitudDespachoExportacionService {

  /**
   * Constructor del servicio.
   * Inyecta HttpClient para realizar peticiones HTTP
   * e inyecta Tramite5601Store para manejar el estado del trámite.
   */
  constructor(private http: HttpClient, private tramite5601Store: Tramite5601Store) { 
    // Constructor vacío
  }

  /**
   * Actualiza el estado del formulario en el store.
   * @param DATOS Objeto con los datos del estado a actualizar.
   */
  actualizarEstadoFormulario(DATOS: Tramite5601State): void {
    Object.entries(DATOS).forEach(([clave, valor]) => {
      this.tramite5601Store.setDynamicFieldValue(
        clave as keyof Tramite5601State,
        valor as Tramite5601State[keyof Tramite5601State]
      );
    });
  }

  /**
   * Obtiene los datos iniciales del formulario desde un archivo JSON.
   * @returns Observable con el estado inicial del formulario.
   */
  obtenerDatosInicialesFormulario(): Observable<Tramite5601State> {
    return this.http.get<Tramite5601State>('assets/json/5601/inicializar-formulario.json');
  }
}
