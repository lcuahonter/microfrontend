/**
 * @fileoverview
 * Servicio para gestionar el aviso de importación de sustancias químicas.
 * Proporciona métodos para actualizar el estado del formulario y obtener datos de registro desde un archivo JSON.
 *
 * @author
 * @version 1.0
 * @since 2025-06-24
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tramite240106State } from '../estados/tramite240106Store.store';
import { Tramite240106Store } from '../estados/tramite240106Store.store';

/**
 * Servicio para gestionar el aviso de importación de sustancias químicas.
 * Proporciona métodos para actualizar el estado del formulario y obtener datos de registro.
 */
@Injectable({
  providedIn: 'root',
})

/**
 * @description
 * Servicio Angular inyectable para el manejo del aviso de importación de sustancias químicas.
 * Permite actualizar el estado del formulario y obtener datos de registro desde un archivo JSON.
 *
 * @see Tramite240106Store
 * @see Tramite240106State
 */
export class AvisoImportacionSustanciasQuimicasService {
  /**
   * Crea una instancia del servicio AvisoImportacionSustanciasQuimicasService.
   * @param httpClient Cliente HTTP para realizar peticiones.
   * @param tramite240106Store Store del trámite 240106 para manejar el estado.
   */
  constructor(
    private httpClient: HttpClient,
    public tramite240106Store: Tramite240106Store
  ) {}

  /**
   * Actualiza el estado del formulario en el store del trámite.
   * @param DATOS Datos del formulario a actualizar.
   */
  actualizarEstadoFormulario(DATOS: Tramite240106State): void {
    this.tramite240106Store.update((state) => ({
      ...state,
      ...DATOS,
    }));
  }

  /**
   * Obtiene los datos de registro de toma de muestras de mercancías.
   * @returns Observable con los datos del formulario de registro.
   */
  obtenerRegistroTomarMuestrasDatos(): Observable<Tramite240106State> {
    return this.httpClient.get<Tramite240106State>(
      'assets/json/240106/datos-previos.json'
    );
  }
}
