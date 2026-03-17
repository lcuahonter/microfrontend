import { Observable, catchError, map, of } from 'rxjs';
import { CambioContrasena } from '../models/cambio-contrasena.model';
import { ConsultaRegistro } from '../models/consulta-registro.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Servicio para operaciones relacionadas con contraseñas de usuario.
 * Proporciona métodos para interactuar con la API de cambio y verificación de contraseñas.
 */
@Injectable({
    providedIn: 'root'
})
export class PasswordService {
    /**
     * Constructor del servicio.
     * @param http Cliente HTTP para realizar peticiones a la API.
     */
    constructor(private http: HttpClient) {
    }
    /**
     * Realiza el cambio de contraseña del usuario.
     * Simula la validación de la contraseña anterior y el "guardado" de la nueva contraseña.
     * @param model Modelo con las contraseñas ingresadas por el usuario.
     * @returns Observable<boolean> que indica si el cambio fue exitoso.
     */
    cambioContrasena(model: CambioContrasena): Observable<boolean> {
        return this.http.get<{ passwordsValidas: string[] }>(
            '/assets/json/login/cambio-contrasena.json'
        ).pipe(
            map((data) => {
                const CONTRASENIA_VALIDA = data.passwordsValidas.includes(model.contrasenaAnterior);
                // Simulamos el "guardado" si la contraseña anterior es válida
                return CONTRASENIA_VALIDA;
            }),
            catchError((error) => {
                console.error('Error al cargar contraseñas simuladas', error);
                return of(false); // Regresa falso en caso de error
            })
        );
    }

    /**
     * Verifica si la contraseña anterior ingresada es válida.
     * @param password Contraseña anterior ingresada por el usuario.
     * @returns Observable<boolean> que indica si la contraseña es válida.
     */
    verificarContrasenaAnterior(password: string): Observable<boolean> {
        return this.http.get<{ passwordsValidas: string[] }>(
            '/assets/json/login/cambio-contrasena.json'
        ).pipe(
            map(response => response.passwordsValidas.includes(password)),
            catchError(() => of(false)) // en error, se asume inválida
        );
    }
}