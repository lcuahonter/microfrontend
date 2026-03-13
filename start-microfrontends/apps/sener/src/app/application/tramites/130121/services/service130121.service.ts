import { Tramite130121State, Tramite130121Store } from '../estados/tramites/tramites130121.store';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class Solocitud130121Service {
    /**
     * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
     */
    urlServer = ENVIRONMENT.URL_SERVER;

    /**
   * URL base para los catálogos auxiliares en formato JSON.
   * Se obtiene desde la configuración de entorno (`ENVIRONMENT.URL_SERVER_JSON_AUXILIAR`).
   *
   * @type {string}
   * @memberof Solocitud130121Service
   */
    urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

   /**
   * Constructor del servicio Solocitud130121Service.
   *
   * Inyecta el cliente HTTP para realizar peticiones a servicios REST y el store para gestionar el estado del trámite 130121.
   *
   * @param {HttpClient} http Cliente HTTP para peticiones a la API.
   * @param {Tramite130121Store} tramite130121Store Store para la gestión del estado del trámite 130121.
   * @memberof Solocitud130121Service
   */
    constructor(private http: HttpClient, private tramite130121Store: Tramite130121Store,) { }

    /**
     * Actualiza el estado del formulario en el store del trámite 130121.
     *
     * Este método recibe un objeto de tipo `Tramite130121State` con los datos a actualizar
     * y los establece en el store correspondiente mediante el método `establecerDatos`.
     *
     * @param {Tramite130121State} DATOS - Datos actualizados del formulario.
     * @memberof Solocitud130121Service
     */
    actualizarEstadoFormulario(DATOS: Tramite130121State): void {
        this.tramite130121Store.establecerDatos(DATOS);
    }

    /**
   * Obtiene los datos de registro de toma de muestras de mercancías desde un archivo JSON local.
   *
   * Realiza una petición HTTP GET para recuperar la información del formulario desde el archivo
   * `assets/json/130121/campos-formulario.json` y la retorna como un observable de tipo `Tramite130121State`.
   *
   * @returns {Observable<Tramite130121State>} Observable con los datos del formulario.
   * @memberof Solocitud130121Service
   */
    getRegistroTomaMuestrasMercanciasData(): Observable<Tramite130121State> {
        return this.http.get<Tramite130121State>('assets/json/130121/campos-formulario.json');
    }

}
