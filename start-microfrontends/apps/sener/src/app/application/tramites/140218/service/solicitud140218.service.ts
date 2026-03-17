import { DatosSolicitudState, Tramite140218Store } from '../estados/store/tramite140218.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Decorador Injectable para indicar que este servicio puede ser inyectado en otros componentes o servicios
@Injectable({
  providedIn: 'root'
})
export class Solicitud140218Service {

  /**
   * Constructor del servicio.
   * Inyecta HttpClient para realizar peticiones HTTP
   * e inyecta Tramite5601Store para manejar el estado del trámite.
   */
  constructor(private http: HttpClient, private tramite5601Store: Tramite140218Store) { 
    // Constructor vacío
  }

  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   *
   * @param datos Objeto que contiene los datos a actualizar en el estado del formulario.
   * 
   * Este método recorre las entradas del objeto `datos` y actualiza cada campo dinámicamente
   * en el store `tramite5601Store`.
   */
  actualizarEstadoFormulario(datos:object): void {
   Object.entries(datos).forEach(([key, value]) => { 
   this.tramite5601Store.setDynamicFieldValue(key, value);
  })

}

  /**
   * Obtiene el estado del certificado de registro desde un archivo JSON local.
   *
   * @returns Un Observable que emite el estado del certificado de registro (`CertiRegistro302State`).
   */
  getCertiRegistroDatos(): Observable<DatosSolicitudState> {
    return this.http.get<DatosSolicitudState>('assets/json/140218/renuncia-de-permiso.json');
  }

}
