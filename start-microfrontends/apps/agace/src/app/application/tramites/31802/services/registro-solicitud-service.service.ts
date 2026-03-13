import { Solicitud31802State, Tramite31802Store } from '../state/Tramite31802.store';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para gestionar las operaciones relacionadas con la solicitud del trámite 31803.
 * Proporciona métodos para obtener datos necesarios desde fuentes externas.
 */
@Injectable({
  providedIn: 'root',
})
export class RegistroSolicitudService {
  /**
    * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
    */
  urlServer = ENVIRONMENT.URL_SERVER;
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  constructor(private http: HttpClient, private tramite31802Store: Tramite31802Store,) {
    // Lógica de inicialización si es necesario
  }

  /**
   * Actualiza el estado del formulario en el store con los datos proporcionados.
   * @param DATOS Objeto con los datos del formulario de tipo Solicitud10301State.
   */

  public actualizarEstadoFormulario(DATOS: Solicitud31802State): void {
    this.tramite31802Store.setNumeroOficio(DATOS.numeroOficio);
    this.tramite31802Store.setNumeroOperacion(DATOS.numeroOperacion);
    this.tramite31802Store.setLlave(DATOS.llave);
    this.tramite31802Store.setManifiesto1(DATOS.manifiesto1);
    this.tramite31802Store.setManifiesto2(DATOS.manifiesto2);
    this.tramite31802Store.setManifiesto3(DATOS.manifiesto3);
    this.tramite31802Store.setManifiesto4(DATOS.manifiesto4);
    this.tramite31802Store.setManifiesto5(DATOS.manifiesto5);
    this.tramite31802Store.setFechaPago(DATOS.fechaPago);
    this.tramite31802Store.setRenovacion(DATOS.renovacion);
    this.tramite31802Store.setHomologacion(DATOS.homologacion);
    this.tramite31802Store.setMonedaNacional(DATOS.monedaNacional);
    this.tramite31802Store.setFechaInicio(DATOS.fechaInicio);
    this.tramite31802Store.setFechaFinal(DATOS.fechaFinal);
  }

    /**
   * Obtiene los datos del aviso de renovación desde un archivo JSON local.
   * @returns Un observable con los datos del estado de la solicitud (Solicitud31802State).
   */
  
  public getDatosDeAvisoRenovacionDoc(): Observable<Solicitud31802State> {
    return this.http.get<Solicitud31802State>('assets/json/31802/aviso-de-renovacion.json');
  }
}