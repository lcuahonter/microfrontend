/* eslint-disable @typescript-eslint/no-explicit-any */

import { catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para gestionar la información de terceros relacionados
 * 
 * Este servicio proporciona métodos para obtener datos de fabricantes y destinatarios
 * desde archivos JSON locales ubicados en la carpeta de assets.
 * 
 * @class TercerosRelacionadosService
 * @since 1.0.0
 * @author Sistema de Gestión
 */
@Injectable({
  providedIn: 'root'
})
export class TercerosRelacionadosService {
  
  /**
   * Enlace al archivo JSON que contiene los datos de la tabla de fabricantes
   * 
   * @type {string}
   * @readonly
   * @memberof TercerosRelacionadosService
   */
  dataTableLink = 'assets/json/260912/datos-de-tabla.json'; // Updated path

  /**
   * Enlace al archivo JSON que contiene los datos de la tabla de destinatarios
   * 
   * @type {string}
   * @readonly
   * @memberof TercerosRelacionadosService
   */
  destinatarioTableLink = 'assets/json/260912/destinatario-de-tabla.json'; // Updated path

  proveedorTableLink = 'assets/json/260912/proveedor-de-tabla.json'; // Updated path

  facturadorTableLink = 'assets/json/260912/facturador-de-tabla.json'; // Updated path

  /**
   * Constructor del servicio TercerosRelacionadosService
   * 
   * Inicializa el servicio con las dependencias necesarias para realizar
   * peticiones HTTP y obtener datos de terceros relacionados.
   * 
   * @param {HttpClient} http - Cliente HTTP de Angular para realizar peticiones
   * @memberof TercerosRelacionadosService
   */
  constructor(private http: HttpClient) {
    //
  }

  /**
   * Obtiene la información de la tabla de fabricantes desde el archivo JSON
   * 
   * Este método realiza una petición HTTP GET para obtener los datos de fabricantes
   * almacenados en el archivo JSON local. En caso de error, devuelve un array vacío.
   * 
   * @returns {Observable<any>} Observable que emite los datos de fabricantes o array vacío en caso de error
   * @memberof TercerosRelacionadosService
   * 
   * @example
   * ```typescript
   * this.tercerosService.obtenerInformaciónDeTablaDeFabricantes().subscribe(
   *   datos => console.log('Datos de fabricantes:', datos),
   *   error => console.error('Error al obtener fabricantes:', error)
   * );
   * ```
   */
  obtenerInformaciónDeTablaDeFabricantes(): Observable<any> {
    return this.http.get(this.dataTableLink).pipe(
      catchError((_error: any) => {
        return of([]);
      })
    );
  }

  /**
   * Obtiene la información de la tabla de proveedores desde el archivo JSON
   * 
   * Este método realiza una petición HTTP GET para obtener los datos de proveedores
   * almacenados en el archivo JSON local. En caso de error, devuelve un array vacío.
   * 
   * @returns {Observable<any>} Observable que emite los datos de proveedores o array vacío en caso de error
   * @memberof TercerosRelacionadosService
   * 
   * @example
   * ```typescript
   * this.tercerosService.obtenerInformaciónDeTablaDeproveedors().subscribe(
   *   datos => console.log('Datos de proveedores:', datos),
   *   error => console.error('Error al obtener proveedores:', error)
   * );
   * ```
   */

  obtenerInformacionDeTablaDeproveedors(): Observable<any> {
    return this.http.get(this.proveedorTableLink).pipe(
      catchError((_error: any) => {
        return of([]);
      })
    );
  }

  /**
   * Obtiene la información de la tabla de destinatarios desde el archivo JSON
   * 
   * Este método realiza una petición HTTP GET para obtener los datos de destinatarios
   * almacenados en el archivo JSON local. En caso de error, devuelve un array vacío.
   * 
   * @returns {Observable<any>} Observable que emite los datos de destinatarios o array vacío en caso de error
   * @memberof TercerosRelacionadosService
   * 
   * @example
   * ```typescript
   * this.tercerosService.obtenerInformaciónDeTablaDeDestinatraios().subscribe(
   *   datos => console.log('Datos de destinatarios:', datos),
   *   error => console.error('Error al obtener destinatarios:', error)
   * );
   * ```
   */
  obtenerInformacionDeTablaDeDestinatraios(): Observable<any> {
    return this.http.get(this.destinatarioTableLink).pipe(
      catchError((_error: any) => {
        return of([]);
      })
    );
  }
  /**
   * Obtiene la información de la tabla de facturadores desde el archivo JSON
   * 
   * Este método realiza una petición HTTP GET para obtener los datos de facturadores
   * almacenados en el archivo JSON local. En caso de error, devuelve un array vacío.
   * 
   * @returns {Observable<any>} Observable que emite los datos de facturadores o array vacío en caso de error
   * @memberof TercerosRelacionadosService
   * 
   * @example
   * ```typescript
   * this.tercerosService.obtenerInformaciónDeTablaDeFacturadores().subscribe(
   *   datos => console.log('Datos de facturadores:', datos),
   *   error => console.error('Error al obtener facturadores:', error)
   * );
   * ```
   */
  obtenerInformacionDeTablaDeFacturadores(): Observable<any> {
    return this.http.get(this.facturadorTableLink).pipe(
      catchError((_error: any) => {
        return of([]);
      })
    );
  }
}