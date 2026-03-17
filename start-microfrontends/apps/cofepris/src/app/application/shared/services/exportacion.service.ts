import { Injectable } from '@angular/core';
import { PermisoModel } from '../../shared/models/aviso-exportacion.model';
 
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
 
import { PreOperativo } from '../models/datos-modificacion.model';
/**
* Servicio que proporciona métodos para obtener datos relacionados con la exportación.
*/
@Injectable({
  providedIn: 'root'
})
export class ExportacionService {
 
  /**
   * Constructor del servicio `ExportacionService`.
   * @param http Cliente HTTP para realizar solicitudes a los archivos JSON.
   */
  constructor(private http: HttpClient) {
    //constructor
  }
 
  /**
   * Obtiene los datos de la localidad desde un archivo JSON.
   * @returns Un observable que emite los datos de la localidad.
   * En caso de error, lanza un observable con el error capturado.
   */
  obtenerDatosLocalidad(): Observable<unknown> {
    return this.http.get('assets/json/260604/exportacion.json').pipe(
      catchError((error: unknown) => {
        return throwError(() => error);
      })
    );
  }
 
  /**
   * Obtiene los datos de la tabla de permisos desde un archivo JSON.
   * @returns Un observable que emite una lista de objetos `PermisoModel` con los datos de los permisos.
   */
  obtenerTabla(): Observable<PermisoModel[]> {
    return this.http.get<PermisoModel[]>('assets/json/260604/terceros.json');
  }
 
  /**
   * @description Obtiene una lista de objetos de tipo PreOperativo desde un archivo JSON local.
   * @returns {Observable<PreOperativo[]>} Un observable que emite un arreglo de objetos PreOperativo.
   * @method obtenerRadio
   * @memberof ExportacionService
   * @example
   * this.exportacionService.obtenerRadio().subscribe((data: PreOperativo[]) => {
   *   console.log(data);
   * });
   */
  obtenerRadio(): Observable<PreOperativo[]> {
    return this.http.get<PreOperativo[]>('assets/json/260604/tipoPersonaradio.json');
  }
 
}