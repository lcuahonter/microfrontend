import {
  Solicitud33304State,
  Solicitud33304Store,
} from '../estados/solicitud33304Store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AvisoModificacionService {
  constructor(
    private http: HttpClient,
    private solicitud33304Store: Solicitud33304Store
  ) {
    // Lógica de inicialización si es necesario
  }

  /**
   * Obtiene el tipo de aviso desde un archivo JSON precargado.
   * @returns Observable con la estructura del estado del formulario del trámite 33304.
   */
  getEntidadFederativa(): Observable<Solicitud33304State> {
    return this.http.get<Solicitud33304State>(
      'assets/json/33304/entidad-federativa.json'
    );
  }

  /**
   * Obtiene el tipo de aviso desde un archivo JSON precargado.
   * @returns Observable con la estructura del estado del formulario del trámite 33304.
   */
  getFraccionArancelaria(): Observable<Solicitud33304State> {
    return this.http.get<Solicitud33304State>(
      'assets/json/33304/fraccion-arancelaria.json'
    );
  }

/**
   * Obtiene el tipo de aviso desde un archivo JSON precargado.
   * @returns Observable con la estructura del estado del formulario del trámite 33304.
   */
  getCveTipoDoc(): Observable<Solicitud33304State> {
    return this.http.get<Solicitud33304State>(
      'assets/json/33304/cve-tipo-doc.json'
    );
  }
 
}
