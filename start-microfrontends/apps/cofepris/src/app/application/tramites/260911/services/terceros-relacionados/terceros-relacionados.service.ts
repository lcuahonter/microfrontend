/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Servicio para la gestión de operaciones relacionadas con terceros relacionados.
 * Proporciona métodos para recuperar datos de fabricantes y destinatarios desde archivos JSON locales,
 * utilizados en la visualización y gestión de tablas en el frontend.
 *
 * @service TercerosRelacionadosService
 * @providedIn root
 */

import { catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio inyectable para gestionar operaciones de terceros relacionados,
 * como la obtención de datos de fabricantes y destinatarios.
 */
@Injectable({
  providedIn: 'root'
})
export class TercerosRelacionadosService {
  /**
   * Ruta al archivo JSON con los datos de la tabla de fabricantes.
   */
  dataTableLink = 'assets/json/260911/datos-de-tabla.json';

  /**
   * Ruta al archivo JSON con los datos de la tabla de destinatarios.
   */
  destinatarioTableLink = 'assets/json/260911/destinatario-de-tabla.json';

  /**
   * Inicializa una nueva instancia del servicio TercerosRelacionadosService.
   * @param http Cliente HTTP de Angular para realizar solicitudes a recursos externos.
   */
  constructor(private http: HttpClient) {
    // No se necesita lógica de inicialización adicional.
  }

  /**
   * Recupera los datos de la tabla de fabricantes desde un archivo JSON local.
   * @returns Observable que emite los datos de la tabla de fabricantes o un arreglo vacío en caso de error.
   */
  obtenerInformaciónDeTablaDeFabricantes(): Observable<any> {
    return this.http.get(this.dataTableLink).pipe(
      catchError((_error: any) => {
        // Retorna un arreglo vacío como valor por defecto en caso de error.
        return of([]);
      })
    );
  }

  /**
   * Recupera los datos de la tabla de destinatarios desde un archivo JSON local.
   * @returns Observable que emite los datos de la tabla de destinatarios o un arreglo vacío en caso de error.
   */
  obtenerInformaciónDeTablaDeDestinatraios(): Observable<any> {
    return this.http.get(this.destinatarioTableLink).pipe(
      catchError((_error: any) => {
        // Retorna un arreglo vacío como valor por defecto en caso de error.
        return of([]);
      })
    );
  }
}