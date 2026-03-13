import { Tramite140111State, Tramite140111Store } from '../estados/tramite140111.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PermisoFormInterface } from '../model/renuncia-de-derechos.model';
@Injectable({
  providedIn: 'root'
})
export class RenunciaDeDerechosAlServicio {
  constructor( private http: HttpClient, private tramite140111Store: Tramite140111Store,) { 
    // constructor
  }
 
  /**
 * Recupera la descripción del cupo desde un archivo JSON almacenado.
 * El método devuelve un observable que contiene la estructura de datos correspondiente (PermisoFormInterface).
 */
  getDescripcionDelCupo(): Observable<PermisoFormInterface> {
    return this.http.get<PermisoFormInterface>('assets/json/140111/renuncia-de-derechos.json');
  }

  /**
   * Actualiza el estado del formulario en el store global.
   *
   * @param datos - Objeto de tipo Tramites140111State con los datos a establecer en el store.
   * @returns {void}
   */
  actualizarEstadoFormulario(datos: Tramite140111State): void {
      this.tramite140111Store.establecerDatos(datos);
  }

  /**
   * Obtiene los datos de toma de muestras de mercancías desde un archivo JSON local.
   *
   * @returns {Observable<Tramite140111State>} Un observable que emite los datos del trámite 140111.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Tramite140111State> {
    return this.http.get<Tramite140111State>('assets/json/140111/permiso-renuncia-datos.json');
  }
}
