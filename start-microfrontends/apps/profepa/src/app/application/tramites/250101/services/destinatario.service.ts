import { Catalogo } from '@libs/shared/data-access-user/src';
import { DestinatarioTablaDatos } from '../models/flora-fauna.models'; 
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio encargado de obtener los datos relacionados con destinatarios y agentes aduanales,
 * así como los datos de países y estados desde archivos JSON locales.
 * Este servicio realiza peticiones HTTP para cargar los datos necesarios para las tablas y formularios.
 */
@Injectable({
  providedIn: 'root' // Indica que este servicio está disponible a nivel global en la aplicación.
})
export class DestinatarioService {

  /**
   * Constructor del servicio. Recibe una instancia de HttpClient para realizar peticiones HTTP.
   * 
   * @param http Instancia de HttpClient para realizar las peticiones.
   */
  constructor(private http: HttpClient) { 
    //
  }

  /**
   * Método que obtiene los datos de los encabezados de la tabla de destinatarios.
   * Realiza una petición GET al archivo JSON 'datos-destinatario.json'.
   * 
   * @returns {Observable<DestinatarioTablaDatos>} Observable con los datos de los encabezados de la tabla de destinatarios.
   */
  getDestinatarioEncabezadoDeTabla(): Observable<DestinatarioTablaDatos> {
    return this.http.get<DestinatarioTablaDatos>('assets/json/250101/datos-destinatario.json');
  }

  /**
   * Método que obtiene los datos de los encabezados de la tabla de agentes aduanales.
   * Realiza una petición GET al archivo JSON 'datos-agente-aduanal.json'.
   * 
   * @returns {Observable<DestinatarioTablaDatos>} Observable con los datos de los encabezados de la tabla de agentes aduanales.
   */
  getAduanalEncabezadoDeTabla(): Observable<DestinatarioTablaDatos> {
    return this.http.get<DestinatarioTablaDatos>('assets/json/250101/datos-agente-aduanal.json');
  }

  /**
   * Método que obtiene los datos de países desde un archivo JSON.
   * Realiza una petición GET al archivo JSON 'pais.json'.
   * 
   * @returns {Observable<Catalogo[]>} Observable con la lista de países.
   */
  getPaisData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/250101/pais.json');
  }

  /**
   * Método que obtiene los datos de estados desde un archivo JSON.
   * Realiza una petición GET al archivo JSON 'estado.json'.
   * 
   * @returns {Observable<Catalogo[]>} Observable con la lista de estados.
   */
  getEstadoData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/250101/estado.json');
  }
}
