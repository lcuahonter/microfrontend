/**
 * @file Servicio para manejar la lógica relacionada con Aviso de Importación.
 * Este servicio utiliza HttpClient para realizar solicitudes HTTP.
 */

import { Injectable } from '@angular/core'; // Importa el decorador Injectable de Angular.

import { HttpClient } from '@angular/common/http'; // Importa HttpClient para realizar solicitudes HTTP.

import { Observable, catchError, throwError } from 'rxjs'; // Importa operadores y clases de RxJS para manejar flujos de datos y errores.

/**
 * @Injectable Marca esta clase como un servicio que puede ser inyectado en otros componentes o servicios.
 * @providedIn 'root' Indica que este servicio está disponible en toda la aplicación.
 */
@Injectable({
    providedIn: 'root',
  })

/**
 * @class AvisoImportacionService
 * Servicio para manejar operaciones relacionadas con Aviso de Importación.
 */
export class AvisoImportacionService {
  
    /**
     * @constructor
     * @param http Inyección de dependencia de HttpClient para realizar solicitudes HTTP.
     */
    constructor( private http: HttpClient) {
      //Reservado para futuras inyecciones de dependencias o inicializaciones.
     }

    /**
     * @method getDatos
     * Método para obtener datos desde un archivo JSON.
     * @returns {Observable<unknown>} Un Observable que emite los datos obtenidos o un error.
     */
    getDatos(): Observable<unknown> {
        return this.http.get('assets/json/260514/pagoderechos.json') // Realiza una solicitud GET al archivo JSON.
          .pipe(
            catchError((error: unknown) => { // Maneja errores en la solicitud.
              return throwError(() => error); // Lanza el error para que pueda ser manejado por el suscriptor.
            })
          );
     }
}