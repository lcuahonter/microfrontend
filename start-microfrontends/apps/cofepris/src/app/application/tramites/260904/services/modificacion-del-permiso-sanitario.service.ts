import { Tramite260904State, Tramite260904Store } from '../estados/tramite260904.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio encargado de gestionar la modificación del permiso sanitario de importación de insumos.
 * Permite obtener los datos del trámite y actualizar el estado correspondiente en el store.
 */
@Injectable({
  providedIn: 'root',
})
export class ModificacionDelPermisoSanitarioService {
  /**
   * Inicializa el servicio con las dependencias necesarias.
   * @param http Servicio HttpClient para realizar peticiones HTTP.
   * @param tramite260904store Store para gestionar el estado del trámite 260904.
   */
  constructor(private http: HttpClient, private tramite260904store: Tramite260904Store) {
    //constructor
  }

  /**
   * Obtiene los datos del trámite desde un archivo JSON local.
   * Retorna un observable con el estado del trámite 260904.
   * @returns Observable con los datos del trámite.
   */
  public getData(): Observable<Tramite260904State> {
    return this.http.get<Tramite260904State>('assets/json/260904/datos.json');
  }

  /**
   * Actualiza el estado del formulario en el store.
   * Recorre cada campo de la respuesta y actualiza solo aquellos que no son nulos.
   * @param resp Objeto con los nuevos valores del estado del trámite.
   */
  public actualizarEstadoFormulario(resp: Tramite260904State): void {
    for (const CAMPO of Object.keys(resp) as (keyof Tramite260904State)[]) {
      if (Object.prototype.hasOwnProperty.call(resp, CAMPO) && resp[CAMPO] !== null) {
        this.tramite260904store.setTramite260904State({ [CAMPO]: resp[CAMPO] });
      }
    }
  }
}