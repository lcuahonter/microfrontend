import { Tramite420103State, Tramite420103Store } from '../estados/tramite420103.store';
import { DetallesDelMercancia } from '@libs/shared/data-access-user/src/core/models/420103/concluir-relacion.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para gestionar las operaciones relacionadas con la retirada de la autorización de donaciones.
 */
@Injectable({
  providedIn: 'root',
})
export class ConcluirRelacionService {
  /**
   * Constructor de la clase.
   * @param http Cliente HTTP para realizar peticiones a servicios externos.
   */
  constructor(private http: HttpClient, private tramite420103Store:Tramite420103Store) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Obtiene los detalles de la mercancía relacionados con la solicitud.
   * @returns Un observable que emite un objeto del tipo `DetallesDelMercancia`.
   */
  getDetallesDelMercanciaDatos(): Observable<DetallesDelMercancia> {
    return this.http.get<DetallesDelMercancia>(
      'assets/json/420103/concluir-relacion-datos.json'
    );
  }

  /**
  * Actualiza el estado del formulario en el store.
  * @param DATOS Estado actualizado del trámite.
  */
  actualizarEstadoFormulario(DATOS: Tramite420103State): void {
    this.tramite420103Store.actualizarEstado(DATOS);
  }

  /**
  * Obtiene los datos de la solicitud.
  * @returns Observable con los datos de la solicitud.
  */
  getDatosDeLaSolicitud(): Observable<Tramite420103State> {
    return this.http.get<Tramite420103State>('assets/json/420103/datos-de-la-solicitud.json');
  }
}