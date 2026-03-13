import { CaatAereoData, CatalogoLista } from '../models/certi-registro.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENVIRONMENT} from '@libs/shared/data-access-user/src/enviroments/enviroment';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { GuardarSolicitudRequest } from '../models/guardar-solicitud-request.model';

@Injectable({
  providedIn: 'root'
})
export class RegistroCaatAereoService {
  /**
   * URL Base construida usando la variable de entorno que encontraste.
   * En local apuntará a: http://localhost:8080/api/sat-t40401
   */
  private readonly baseUrl = `${ENVIRONMENT.API_HOST}/api/sat-t40401`;
  /**
   * Constructor del servicio.
   *
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes a los archivos JSON.
   */
  constructor(private http: HttpClient) { 
    // Constructor vacío
  }

  /**
   * Fetches the CAAT Aereo catalog data from a local JSON file.
   *
   * @returns {Observable<CatalogoLista>} An observable that emits the catalog data.
   */
  obtenerCAATAereo(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>('assets/json/40401/tipo_caat_aereo.json');
  }

  /**
   * Fetches the Codigo Aereo catalog data from a local JSON file.
   *
   * @returns {Observable<CatalogoLista>} An observable that emits the catalog data.
   */
    obtenerCodigoAereo(): Observable<CatalogoLista> {
      return this.http.get<CatalogoLista>('assets/json/40401/codigo_transportacion_aereo.json');
    }

  /**
   * Fetches the CAAT Aereo data from a local JSON file.
   *
   * @returns {Observable<CaatAereoData>} An observable that emits the CAAT Aereo data.
   */
  obtenerCAATAereoData(): Observable<CaatAereoData> {
    return this.http.get<CaatAereoData>('assets/json/40401/caat.aereo.data.json');
  } 


obtenerCodigoIataIcao() {
  return this.http.get<CatalogoLista>('assets/json/40401/codigo_iata_icao.json');
}
  /**
   * Guarda la solicitud en el Backend.
   * Este es el método crítico para la integración.
   * * @param request El objeto JSON con la estructura snake_case exacta.
   */
  guardar(request: GuardarSolicitudRequest): Observable<BaseResponse<any>> {
    return this.http.post<BaseResponse<any>>(`${this.baseUrl}/solicitud/guardar`, request);
  }
  /**
   * Genera la Cadena Original (Paso 2 del flujo).
   */
  generarCadenaOriginal(idSolicitud: number, request: any): Observable<BaseResponse<string>> {
     return this.http.post<BaseResponse<string>>(`${this.baseUrl}/solicitud/cadena-original/${idSolicitud}`, request);
  }

   /**
   * Firma la solicitud (Paso 3 del flujo).
   */
  firmar(idSolicitud: number, request: any): Observable<BaseResponse<string>> {
     return this.http.post<BaseResponse<string>>(`${this.baseUrl}/solicitud/firmar/${idSolicitud}`, request);
  }
}