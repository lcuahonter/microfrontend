/**
 * Servicio para la gestión de datos de beneficios en el trámite 290101.
 *
 * Este servicio proporciona funcionalidades para obtener y procesar información relacionada
 * con los beneficios desde archivos JSON externos. Está diseñado para ser utilizado
 * en el contexto del trámite 290101 de AMECAFE.
 *
 * @Injectable
 * @description Servicio para obtener los datos del beneficios.
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio inyectable para la gestión de datos de beneficios.
 *
 * Proporciona métodos para obtener información de beneficios desde recursos externos
 * utilizando el cliente HTTP de Angular.
 *
 * @class BeneficiosService
 * @Injectable
 */
@Injectable({
  providedIn: 'root'
})
export class BeneficiosService {
  /**
   * URL del archivo JSON que contiene los datos de beneficios.
   *
   * Ruta relativa al archivo JSON ubicado en los assets del proyecto,
   * específicamente para el trámite 220701.
   *
   * @private
   * @readonly
   * @property {string} jsonUrl
   */
  private jsonUrl = '/assets/json/220701/beneficios.json';

  /**
   * Constructor del servicio BeneficiosService.
   *
   * Inicializa el servicio con las dependencias necesarias para realizar
   * solicitudes HTTP y obtener datos de beneficios.
   *
   * @constructor
   * @param {HttpClient} httpClient - Cliente HTTP de Angular para realizar solicitudes HTTP.
   */
  constructor(private httpClient: HttpClient) {
     // Se puede agregar aquí la lógica del constructor si es necesario
  }

  /**
   * Obtiene los datos de beneficios desde el archivo JSON configurado.
   *
   * Realiza una solicitud HTTP GET para recuperar la información de beneficios
   * desde el archivo JSON especificado en la propiedad jsonUrl.
   *
   * @method getDatos
   * @description Obtiene los datos del beneficios desde el archivo JSON.
   * @returns {Observable<any>} Observable que emite los datos de beneficios obtenidos del archivo JSON.
   *
   * @example
   * ```typescript
   * this.beneficiosService.getDatos().subscribe(
   *   (datos) => {
   *     console.log('Datos de beneficios:', datos);
   *   },
   *   (error) => {
   *     console.error('Error al obtener beneficios:', error);
   *   }
   * );
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  /* eslint-disable @typescript-eslint/no-explicit-any */
  getDatos(): Observable<any> {
    return this.httpClient.get<any[]>(this.jsonUrl).pipe(
      // Se pueden agregar operadores adicionales si es necesario
    );
  }  
}