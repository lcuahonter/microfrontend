import { Login, TokenResponse } from '../../../models/shared/inicio-sesion.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ENVIRONMENT } from '../../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class InicioSesionService {
  urlServer = ENVIRONMENT.URL_SERVER;

  constructor(public http: HttpClient) {
    // Lógica de inicialización si es necesario
  }

  /**
   * Obtiene un token de autenticación enviando las credenciales de inicio de sesión.
   * @param body - Objeto con las credenciales de inicio de sesión.
   * @returns Observable que emite la respuesta con el token de autenticación.
   */
  obtenerToken(body: Login): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.urlServer}/login`, body);
  }
}
