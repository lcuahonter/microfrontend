import { DestinoFinalRespuesta, ProveedorRespuesta } from '../models/modificacion.model';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tramite240321State } from '../estados/tramite240321Store.store';

/**
 * @class ModificacionService
 * @description
 * Servicio encargado de obtener datos locales (mock JSON) para las entidades:
 * - `DestinoFinal`
 * - `Proveedor`
 * - `Tramite240321State`
 *
 * Los datos se recuperan desde archivos JSON alojados en `assets/json/240321/`.
 */
@Injectable({
  providedIn: 'root',
})
export class ModificacionService {
  /**
   * @private
   * @description
   * Ruta base donde se almacenan los archivos mock en formato JSON para este servicio.
   *
   * @type {string}
   */
  private apiUrl = 'assets/json/240321/';

  /**
   * @constructor
   * @description Inyecta `HttpClient` para realizar peticiones HTTP.
   * @param http - Cliente HTTP de Angular.
   */
  constructor(private http: HttpClient) {}

  /**
   * @method getDestinatariosFinales
   * @description
   * Obtiene un listado de destinatarios finales desde un archivo JSON local.
   *
   * @returns Observable que emite un objeto de tipo `DestinoFinalRespuesta`.
   *
   * @example
   * this.modificacionService.getDestinatariosFinales().subscribe(res => console.log(res));
   */
  getDestinatariosFinales(): Observable<DestinoFinalRespuesta> {
    return this.http
      .get<DestinoFinalRespuesta>(`${this.apiUrl}destino-final.json`)
      .pipe(map((res) => res));
  }

  /**
   * @method getProveedores
   * @description
   * Recupera el listado de proveedores desde un archivo JSON simulado.
   *
   * @returns Observable que emite un objeto `ProveedorRespuesta`.
   */
  getProveedores(): Observable<ProveedorRespuesta> {
    return this.http
      .get<ProveedorRespuesta>(`${this.apiUrl}proveedor.json`)
      .pipe(map((res) => res));
  }

  /**
   * @method getTrimateState240321
   * @description
   * Obtiene el estado inicial simulado del trámite `240321` desde un archivo JSON.
   *
   * @returns Observable que emite un objeto `Tramite240321State`.
   */
  getTrimateState240321(): Observable<Tramite240321State> {
    return this.http
      .get<Tramite240321State>(`${this.apiUrl}tramateState240321.json`)
      .pipe(map((res) => res));
  }
}