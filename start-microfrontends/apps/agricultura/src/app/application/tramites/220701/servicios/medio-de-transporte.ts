/**
 * @@Injectable
 * @description Servicio para obtener los datos del permiso IMMEX.
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedioDeTransporteService {
  /**
   * @property {string} jsonUrl - URL del archivo JSON que contiene los datos del permiso IMMEX.
   */
  private jsonUrl = '/assets/json/220701/medio-de-transporte-tabla.json';
  /**
   * @constructor
   * @param {HttpClient} httpClient - Cliente HTTP para realizar solicitudes.
   */
  constructor(private httpClient: HttpClient) {
    // Se puede agregar aquí la lógica del constructor si es necesario
  }

  /**
   * @method getDatos
   * @description Obtiene los datos del permiso IMMEX desde el archivo JSON.
   * @returns {Observable<any[]>} Observable con los datos del permiso IMMEX.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getDatos(): Observable<any> {
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.httpClient.get<any[]>(this.jsonUrl).pipe(
    );
  }  
}