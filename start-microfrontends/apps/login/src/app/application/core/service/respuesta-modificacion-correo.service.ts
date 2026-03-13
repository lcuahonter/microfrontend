import { EmailData, EmailModifyResponse } from '../models/response-email.model';
import { Observable, delay, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EmailModifyService {
    /**
     * URL base para obtener los datos simulados desde archivos JSON.
     * @private
     * @type {string}
     */
    private responseUrl = '@libs/shared/theme/assets/json/login/respuestaModificacion_correo.json';

    /**
     * Constructor del servicio.
     * 
     * @param {HttpClient} http - Cliente HTTP para realizar solicitudes.
     */
    constructor(private http: HttpClient) { }

    /**
   * Simula la actualización del correo electrónico del usuario
   * @param emailData Datos del correo anterior y nuevo
   * @returns Observable con la respuesta simulada
   */
    public actualizarEmail(emailData: EmailData): Observable<EmailModifyResponse> {
        // Validación básica de los datos de entrada
        if (!emailData.currentEmail || !emailData.newEmail) {
            return of({
                codigo: -1,
                mensaje: 'Los campos de correo son requeridos'
            }).pipe(delay(500));
        }

        // Validación de que los correos sean diferentes
        if (emailData.currentEmail === emailData.newEmail) {
            return of({
                codigo: -2,
                mensaje: 'El nuevo correo debe ser diferente al actual'
            }).pipe(delay(500));
        }

        // Hacer la petición POST al archivo JSON mock
        return this.http.post<EmailModifyResponse>(this.responseUrl, emailData)
            .pipe(
                delay(500), // Simular latencia de red
                map(response => ({
                    ...response,
                    datos: {
                        correoNuevo: emailData.newEmail
                    }
                }))
            );
    }

}