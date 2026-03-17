import { InstalacionesPrincipalesRespuestaTabla, PersonaRespuestaTabla, RespuestaTabla } from '@libs/shared/data-access-user/src/core/models/31616/dato-comunes.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio encargado de invocar y obtener los datos necesarios
 * para la solicitud de registro del trámite 31616.
 * Se encarga de consumir archivos JSON locales que simulan las respuestas
 * de diferentes catálogos o entidades relacionadas con el trámite.
 *
 * @export
 * @class SolicitudDeRegistroInvocarService
 */
@Injectable({
  providedIn: 'root'
})
export class SolicitudDeRegistroInvocarService {

  /**
   * Crea una instancia del servicio de invocación.
   *
   * @param {HttpClient} http - Cliente HTTP utilizado para realizar peticiones a los recursos JSON locales.
   * @memberof SolicitudDeRegistroInvocarService
   */
  constructor(private http: HttpClient) {
    // Constructor vacío, puede incluir lógica si es necesario.
  }

  /**
   * Obtiene los datos de la tabla de mercancías.
   * Carga un archivo JSON que contiene información simulada para llenar la tabla de mercancías.
   *
   * @returns {Observable<RespuestaTabla>} Un observable con los datos de la tabla.
   * @memberof SolicitudDeRegistroInvocarService
   */
  obtenerTablaDatos(): Observable<RespuestaTabla> {
    return this.http.get<RespuestaTabla>('assets/json/31616/mercancias-tabla.json');
  }

  /**
   * Obtiene los datos de la tabla de instalaciones principales.
   * Utiliza un recurso JSON para simular la respuesta de una tabla de instalaciones principales.
   *
   * @returns {Observable<InstalacionesPrincipalesRespuestaTabla>} Un observable con los datos de la tabla de instalaciones principales.
   * @memberof SolicitudDeRegistroInvocarService
   */
  obtenerInstalacionesPrincipalesTablaDatos(): Observable<InstalacionesPrincipalesRespuestaTabla> {
    return this.http.get<InstalacionesPrincipalesRespuestaTabla>('assets/json/31616/instalacionesPrincipales-tabla.json');
  }

  /**
   * Obtiene los datos de la tabla de personas.
   * Realiza una petición a un recurso local en formato JSON que contiene datos relacionados con personas.
   *
   * @returns {Observable<PersonaRespuestaTabla>} Un observable con los datos de la tabla de personas.
   * @memberof SolicitudDeRegistroInvocarService
   */
  obtenerPersonaTablaDatos(): Observable<PersonaRespuestaTabla> {
    return this.http.get<PersonaRespuestaTabla>('assets/json/31616/personapara.json');
  }
}
