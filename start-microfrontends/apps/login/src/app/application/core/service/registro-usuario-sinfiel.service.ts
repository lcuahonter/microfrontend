import { delay, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Interfaz que define la estructura de respuesta del backend
 * @interface AuthResponse
 * @property {boolean} success - Indica si la operación fue exitosa
 * @property {string} message - Mensaje descriptivo de la respuesta
 */
export interface AuthResponse {
  success: boolean;
  message: string;
}

/**
 * Servicio para manejar el registro y autenticación de usuarios sin FIEL
 * @description Gestiona las operaciones relacionadas con usuarios que no cuentan con FIEL
 */
@Injectable({
  providedIn: 'root',
})
export class RegistroUsuarioSinFielService {
  /**
   * URL base para obtener los datos simulados desde archivos JSON.
   * @private
   * @type {string}
   */  
  private responseUrl = '../../../../../assets/json/login/respuestaRegistroUsuario_sinFiel.json';

  /**
   * Constructor del servicio.
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes al backend.
   */
  constructor(private http: HttpClient) {}  

  /**
   * Simula la autenticación de un usuario sin FIEL.
   * @param emailData Datos del correo anterior y nuevo
   * @returns Observable con la respuesta simulada
   */
  public autenticarUsuario_sinFiel(usuario: string, contrasena: string): Observable<AuthResponse> {
    /**
         * Objeto que contiene los datos de autenticación
         * @type {Object}
         */
      const PAYLOAD = { usuario, contrasena };
      
      // Validación básica de los datos de entrada
      if (!usuario || !contrasena) {
          return new Observable<AuthResponse>(observer => {
              observer.error(new Error('Usuario y contraseña son requeridos'));
          });
      }        

      // Hacer la petición GET al archivo JSON mock
        return this.http.get<AuthResponse>(this.responseUrl)
            .pipe(
                /**
                 * Simula latencia de red de 500ms
                 */
                delay(500),
                /**
                 * Transforma la respuesta para incluir mensaje de éxito
                 */
                map(response => ({
                    ...response,
                    success: response.success,
                    message: 'Usuario autenticado correctamente.',
                }))
            );
    }
}