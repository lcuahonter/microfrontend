import { HttpCoreService,JSONResponse } from '@libs/shared/data-access-user/src';
import { Observable,catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_301 } from '../servers/api-route';
import { Solicitud301State } from '../../../core/estados/tramites/tramite301.store';

/**
 * Decorador que marca la clase como un servicio inyectable y la registra en el inyector raíz de Angular.
 * Esto permite que el servicio esté disponible en toda la aplicación sin necesidad de declararlo en los providers de un módulo específico.
 */
@Injectable({
  providedIn: 'root'
})

export class Pantallas301Service {

  /**
   * @property mostrarRegistroCampo
   * @type {boolean}
   * @public
   * @description
   * Indica si el registro de campo debe mostrarse u ocultarse en la interfaz.
   * Se utiliza para controlar la visibilidad de la sección correspondiente en la pantalla.
   *
   * @example
   * this.mostrarRegistroCampo = true; // Muestra el registro de campo
   * this.mostrarRegistroCampo = false; // Oculta el registro de campo
   */
  public mostrarRegistroCampo: boolean = false;

  /**
   * Constructor del servicio Pantallas301Service.
   * Inicializa la inyección del servicio HttpClient para realizar peticiones HTTP.
   *
   * @param {HttpClient} http - Servicio de Angular para realizar solicitudes HTTP.
   */
  constructor(private http: HttpClient, private _httpCoreService: HttpCoreService) { }

  /**
   * @method getPantallaDatos
   * @description
   * Obtiene los datos de la pantalla de registro de toma de muestras de mercancías.
   * Realiza una petición HTTP para obtener la información desde un archivo JSON local.
   * Si ocurre un error durante la petición, lo captura y lo retorna como un observable de error.
   *
   * @returns {Observable<Solicitud301State>} Observable con el estado de la solicitud 301.
   *
   * @example
   * this.getPantallaDatos().subscribe(data => { ... });
   */
  public getPantallaDatos(): Observable<Solicitud301State> {
    return this.http.get<Solicitud301State>('assets/json/301/registro_toma_muestras_mercancias.json').pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * @method actualizarRegistroCampo
   * @description
   * Cambia el estado de visibilidad del registro de campo.
   * Si actualmente está visible, lo oculta; si está oculto, lo muestra.
   * Esto permite alternar la visualización de la sección correspondiente en la interfaz.
   *
   * @example
   * this.actualizarRegistroCampo();
   * // Alterna la visibilidad del registro de campo.
   */
  actualizarRegistroCampo(): void {
    if (!this.mostrarRegistroCampo) {
      this.mostrarRegistroCampo = !this.mostrarRegistroCampo;
    }
  }

  /**
   * @method obtenerRegistroCampoVisibilidad
   * @description
   * Devuelve el estado actual de visibilidad del registro de campo.
   * Permite consultar si la sección correspondiente está visible u oculta en la interfaz.
   *
   * @returns {boolean} `true` si el registro de campo está visible, `false` si está oculto.
   *
   * @example
   * const visible = this.obtenerRegistroCampoVisibilidad();
   * // visible será true o false según el estado actual.
   */
  obtenerRegistroCampoVisibilidad(): boolean {
    return this.mostrarRegistroCampo;
  }

  //Example of API integration. P.S.:- Once real API is available, this should be updated.
  public getEstadoCatalogo(): Observable<JSONResponse> {
    return this._httpCoreService.get<JSONResponse>(PROC_301.ESTADO).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  //Example of API integration. P.S.:- Once real API is available, this should be updated.
  public getOpiniones(numFolioTramite: string | number): Observable<JSONResponse> {
    return this._httpCoreService.get<JSONResponse>(PROC_301.OPINIONES(numFolioTramite)).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
