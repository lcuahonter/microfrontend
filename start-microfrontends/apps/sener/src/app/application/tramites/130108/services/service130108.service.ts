import { Tramite130108State, Tramite130108Store } from '../estados/tramites/tramites130108.store';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class Solocitud130108Service {
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
   * @param {Tramite130108Store} tramite130108Store Store para la gestión del estado del trámite 130201.
   * @memberof Solocitud130201Service
   */
    constructor(private http: HttpClient, private tramite130108Store: Tramite130108Store,) { }

    /**
     * Actualiza el estado del formulario en el store del trámite 130201.
     *
     * Este método recibe un objeto de tipo `Tramite130201State` con los datos a actualizar
     * y los establece en el store correspondiente mediante el método `establecerDatos`.
     *
     * @param {Tramite130108State} DATOS - Datos actualizados del formulario.
     * @memberof Solocitud130108Service
     */
    actualizarEstadoFormulario(DATOS: Tramite130108State): void {
        this.tramite130108Store.establecerDatos(DATOS);
    }

    /**
   * Obtiene los datos de registro de toma de muestras de mercancías desde un archivo JSON local.
   *
   * Realiza una petición HTTP GET para recuperar la información del formulario desde el archivo
   * `assets/json/130108/campos-formulario.json` y la retorna como un observable de tipo `Tramite130201State`.
   *
   * @returns {Observable<Tramite130108State>} Observable con los datos del formulario.
   * @memberof Solocitud130108Service
   */
    getRegistroTomaMuestrasMercanciasData(): Observable<Tramite130108State> {
        return this.http.get<Tramite130108State>('assets/json/130108/campos-formulario.json');
    }

}