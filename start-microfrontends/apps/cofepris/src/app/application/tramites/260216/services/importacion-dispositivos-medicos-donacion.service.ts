/**
 * Servicio utilizado en el trámite 260216 para gestionar las solicitudes relacionadas con la importación de dispositivos médicos por donación.
 *
 * Este archivo contiene la definición del servicio `ImportacionDispositivosMedicosDonacionService`, que proporciona métodos
 * para realizar solicitudes HTTP y obtener datos relacionados con el trámite.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tramite260216State } from '../estados/tramite260216Store.store';

/**
 * @service
 * @name ImportacionDispositivosMedicosDonacionService
 * @description
 * Servicio que proporciona métodos para realizar solicitudes HTTP relacionadas con el trámite 260216.
 * Permite obtener datos desde un archivo JSON para simular la respuesta de una API.
 *
 * @decorator Injectable
 * Marca la clase como un servicio inyectable en Angular.
 *
 * @providedIn root
 * Indica que el servicio está disponible en el inyector raíz, asegurando que se pueda inyectar en cualquier parte de la aplicación.
 */
@Injectable({
  providedIn: 'root',
})
export class ImportacionDispositivosMedicosDonacionService {
  /**
   * @constructor
   * @description
   * Constructor que inyecta el cliente HTTP de Angular para realizar solicitudes HTTP.
   *
   * @param {HttpClient} http - Cliente HTTP de Angular utilizado para realizar solicitudes HTTP.
   */
  constructor(private readonly http: HttpClient) {}

  /**
   * @method getRegistroTomaMuestrasMercanciasData
   * @description
   * Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
   * Los datos se cargan desde el archivo JSON especificado en la ruta `assets/json/260216/respuestaDeActualizacionDe.json`.
   *
   * @returns {Observable<Tramite260216State>} Observable que emite los datos del estado de la solicitud `Tramite260216State`.
   *
   * @example
   * ```typescript
   * this.importacionDispositivosMedicosDonacionService.getRegistroTomaMuestrasMercanciasData()
   *   .subscribe((data: Tramite260216State) => {
   *     console.log(data);
   *   });
   * ```
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Tramite260216State> {
    return this.http.get<Tramite260216State>(
      'assets/json/260216/respuestaDeActualizacionDe.json'
    );
  }
}