import { Observable, catchError, throwError } from 'rxjs';
import {
  Solicitud231001State,
  Tramite231001Store,
} from '../estados/tramites/tramite231001.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdministrarResiduosService {
  constructor(
    private http: HttpClient,
    private tramite231001Store: Tramite231001Store
  ) {
    // Lógica de inicialización si es necesario
  }

  getAdministrarResiduos(): Observable<unknown> {
    return this.http
      .get('./assets/json/231001/administrar-residuos-mesa.json')
      .pipe(
        catchError((error: unknown) => {
          return throwError(() => error);
        })
      );
  }

  /**
   * Actualiza el estado global del formulario en el store con los datos proporcionados.
   */
  actualizarEstadoFormulario(DATOS: Solicitud231001State): void {
    this.tramite231001Store.actualizarEstado(DATOS);
  }
}
