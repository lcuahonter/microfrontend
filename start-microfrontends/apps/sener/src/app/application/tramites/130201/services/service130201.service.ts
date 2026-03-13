import { Tramite130201State, Tramite130201Store } from '../estados/tramites/tramites130201.store';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class Solocitud130201Service {
    /**
     * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
     */
    urlServer = ENVIRONMENT.URL_SERVER;

    /**
   * URL base para los catálogos auxiliares en formato JSON.
   * Se obtiene desde la configuración de entorno (`ENVIRONMENT.URL_SERVER_JSON_AUXILIAR`).
   *
   * @type {string}
   * @memberof Solocitud130201Service
   */
    urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

   /**
   * Constructor del servicio Solocitud130201Service.
   *
   * Inyecta el cliente HTTP para realizar peticiones a servicios REST y el store para gestionar el estado del trámite 130201.
   *
   * @param {HttpClient} http Cliente HTTP para peticiones a la API.
   * @param {Tramite130201Store} tramite130201Store Store para la gestión del estado del trámite 130201.
   * @memberof Solocitud130201Service
   */
    constructor(private http: HttpClient, private tramite130201Store: Tramite130201Store,) { }

    /**
     * Actualiza el estado del formulario en el store del trámite 130201.
     *
     * Este método recibe un objeto de tipo `Tramite130201State` con los datos a actualizar
     * y los establece en el store correspondiente mediante el método `establecerDatos`.
     *
     * @param {Tramite130201State} DATOS - Datos actualizados del formulario.
     * @memberof Solocitud130201Service
     */
    actualizarEstadoFormulario(DATOS: Tramite130201State): void {
        this.tramite130201Store.establecerDatos(DATOS);
    }

    /**
   * Obtiene los datos de registro de toma de muestras de mercancías desde un archivo JSON local.
   *
   * Realiza una petición HTTP GET para recuperar la información del formulario desde el archivo
   * `assets/json/130201/campos-formulario.json` y la retorna como un observable de tipo `Tramite130201State`.
   *
   * @returns {Observable<Tramite130201State>} Observable con los datos del formulario.
   * @memberof Solocitud130201Service
   */
    getRegistroTomaMuestrasMercanciasData(): Observable<Tramite130201State> {
        return this.http.get<Tramite130201State>('assets/json/130201/campos-formulario.json');
    }

}
