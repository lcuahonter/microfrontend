import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaConsulta } from '../models/aviso.model';

@Injectable({
  providedIn: 'root'
})
export class AvisoService {

  /**
   * @constructor
   * @description Constructor del servicio AvisoService.
   * Inyecta el cliente HTTP para realizar solicitudes a recursos externos o archivos locales.
   * @param http Instancia de HttpClient utilizada para las peticiones HTTP.
   */
  constructor(private http: HttpClient) { }

  /**
   * @method getDatosConsulta
   * @description Obtiene los datos de consulta desde un archivo JSON local.
   * 
   * Este método realiza una solicitud HTTP GET para obtener los datos de consulta simulados desde el archivo `consultaDatos.json`.
   * 
   * @returns {Observable<RespuestaConsulta>} Un observable que emite la respuesta de los datos de consulta.
   */
  getDatosConsulta(): Observable<RespuestaConsulta> {
    return this.http.get<RespuestaConsulta>(`assets/json/32513/consultaDatos.json`);
  }
  
}
