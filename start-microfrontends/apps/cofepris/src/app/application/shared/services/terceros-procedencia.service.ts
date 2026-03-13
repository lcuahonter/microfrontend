
/**
 * Servicio para la gestión de terceros relacionados.
 * Proporciona métodos para obtener datos de terceros.
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Catalogo, JSONResponse } from '@libs/shared/data-access-user/src';
import { TableData } from '../models/permiso-importacion-biologica.models';


/**
 * Servicio que se provee en el ámbito de la aplicación.
 */
@Injectable({
  providedIn: 'root'
})
export class TercerosProcedenciaService {

  /**
   * Constructor del servicio.
   * Inyecta el cliente HTTP para realizar peticiones.
   * 
   * @param http Cliente HTTP para realizar peticiones.
   */
  constructor(private http: HttpClient) {
     // Constructor logic can be added here if needed
   }

  /**
   * Obtiene los datos de terceros relacionados desde un archivo JSON local.
   * 
   * @returns Observable que emite un arreglo de objetos Catalogo.
   */
  getData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/260212/terceros-relacionados.json');
  }

  /**
   * Obtiene información de la tabla desde un archivo JSON local.
   *
   * @returns Un observable que emite los datos de la tabla en formato JSON.
   */
  getInformacioDeTabla(){
    return this.http.get<JSONResponse>('assets/json/260402/informacio-procedencia.json');
  }

/**
 * Obtiene los datos del fabricante desde un archivo JSON local.
 *
 * @returns Observable que emite un arreglo de objetos TableData.
 */
getFabricanteDatos(): Observable<TableData[]> {
  return this.http.get<TableData[]>('assets/json/260402/fabricante.json');
}
}
