import { Tramite130204State, Tramite130204Store } from '../estados/tramites/tramites130204.store';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class Solocitud130204Service {
    /**
     * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
     */
    urlServer = ENVIRONMENT.URL_SERVER;

    /**
   * URL base para los catálogos auxiliares en formato JSON.
   * Se obtiene desde la configuración de entorno (`ENVIRONMENT.URL_SERVER_JSON_AUXILIAR`).
   *
   * @type {string}
   * @memberof Solocitud130204Service
   */
    urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

   /**
   * Constructor del servicio Solocitud130204Service.
   *
   * Inyecta el cliente HTTP para realizar peticiones a servicios REST y el store para gestionar el estado del trámite 130204.
   *
   * @param {HttpClient} http Cliente HTTP para peticiones a la API.
   * @param {Tramite130204Store} tramite130204Store Store para la gestión del estado del trámite 130204.
   * @memberof Solocitud130204Service
   */
    constructor(private http: HttpClient, private tramite130204Store: Tramite130204Store,) { }

    /**
     * Actualiza el estado del formulario en el store del trámite 130204.
     *
     * Este método recibe un objeto de tipo `Tramite130204State` con los datos a actualizar
     * y los establece en el store correspondiente mediante el método `establecerDatos`.
     *
     * @param {Tramite130204State} DATOS - Datos actualizados del formulario.
     * @memberof Solocitud130204Service
     */
    actualizarEstadoFormulario(DATOS: Tramite130204State): void {
        this.tramite130204Store.establecerDatos(DATOS);
    }

    /**
   * Obtiene los datos de registro de toma de muestras de mercancías desde un archivo JSON local.
   *
   * Realiza una petición HTTP GET para recuperar la información del formulario desde el archivo
   * `assets/json/130204/campos-formulario.json` y la retorna como un observable de tipo `Tramite130204State`.
   *
   * @returns {Observable<Tramite130204State>} Observable con los datos del formulario.
   * @memberof Solocitud130204Service
   */
    getRegistroTomaMuestrasMercanciasData(): Observable<Tramite130204State> {
        return this.http.get<Tramite130204State>('assets/json/130204/campos-formulario.json');
    }

}
