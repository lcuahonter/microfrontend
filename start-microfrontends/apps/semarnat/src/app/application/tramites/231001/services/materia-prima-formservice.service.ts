import {
  Solicitud231001State,
  Tramite231001Store,
} from '../estados/tramites/tramite231001.store';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MateriaprimaformserviceService {
  constructor(
    private http: HttpClient,
    private tramite231001Store: Tramite231001Store
  ) {
    // Constructor del servicio.
  }

  // Obtiene el catálogo de unidades de medida desde un archivo JSON.
  getUnidadMedida(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      'assets/json/231001/comboUnidadMedida.json'
    );
  }

  // Obtiene el catálogo de capítulos de fracción desde un archivo JSON.
  getCapituloFraccion(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      'assets/json/231001/comboCapituloFraccion.json'
    );
  }

  // Obtiene el catálogo de partidas de fracción desde un archivo JSON.
  getPartidaFraccion(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      './assets/json/231001/comboPartidaFraccion.json'
    );
  }

  // Obtiene el catálogo de subpartidas de fracción desde un archivo JSON.
  getSubPartidaFraccion(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      './assets/json/231001/comboSubPartidaFraccion.json'
    );
  }

  // Obtiene el catálogo de fracciones arancelarias desde un archivo JSON.
  getFraccionArancelariaParametros(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      './assets/json/231001/comboFraccionArancelariaParametros.json'
    );
  }

  

  /**
   * Obtiene los datos vigentes de licitaciones para el formulario principal.
   */
  getDatos(): Observable<Solicitud231001State> {
    return this.http.get<Solicitud231001State>('assets/json/231001/datos.json');
  }

  /**
   * Actualiza el estado global del formulario en el store con los datos proporcionados.
   */
  actualizarEstadoFormulario(DATOS: Solicitud231001State): void {
    this.tramite231001Store.actualizarEstado(DATOS);
  }
}
