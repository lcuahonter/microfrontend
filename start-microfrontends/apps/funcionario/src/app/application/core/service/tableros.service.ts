import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListaPendientes } from '../models/pendientes.model';
import { ListaSolicitudes } from '../models/solicitudes.model';
import { Observable } from 'rxjs';
import { TableData } from '@libs/shared/data-access-user/src';

@Injectable({
  providedIn: 'root'
})
export class TablerosService {

  constructor(private http: HttpClient) {
    //
  }

  /**
   * Obtiene una lista de solicitudes desde el backend, aplicando filtros opcionales.
   *
   * @param idSolicitud - (Opcional) Identificador de la solicitud para filtrar resultados.
   * @param fechaInicio - (Opcional) Fecha de inicio del rango a consultar (formato ISO 8601 esperado).
   * @param fechaFinal - (Opcional) Fecha final del rango a consultar (formato ISO 8601 esperado).
   * @returns Un Observable con un arreglo de objetos `ListaSolicitudes`.
   */
  getListaSolicitudes(idSolicitud?: string, fechaInicio?: string, fechaFinal?: string): Observable<ListaSolicitudes[]> {
    let params = new HttpParams();

    if (idSolicitud) {
      params = params.set('idSolicitud', idSolicitud);
    }

    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio);
    }

    if (fechaFinal) {
      params = params.set('fechaFinal', fechaFinal);
    }
    return this.http.get<ListaSolicitudes[]>(`/assets/json/funcionario/lista-solicitudes.json`, { params });
  }

  /**
 * Obtiene una lista de pendientes desde el backend, aplicando filtros opcionales.
 *
 * @param folio - (Opcional) Identificador de la solicitud para filtrar resultados.
 * @param info --(opciona) Información adicionar que el usuario este enviando
 * @param fechaInicio - (Opcional) Fecha de inicio del rango a consultar 
 * @param fechaFinal - (Opcional) Fecha final del rango a consultar 
 * @returns Un Observable con un arreglo de objetos `ListaPendientes`.
 */
  getListaPendientes(folio?: string, info?: string, fechaInicio?: string, fechaFinal?: string): Observable<ListaPendientes[]> {
    let params = new HttpParams();

    if (folio) {
      params = params.set('idSolicitud', folio);
    }

    if (info) {
      params = params.set('idSolicitud', info);
    }

    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio);
    }

    if (fechaFinal) {
      params = params.set('fechaFinal', fechaFinal);
    }
    return this.http.get<ListaPendientes[]>(`/assets/json/funcionario/lista-pendientes.json`, { params });
  }

  /**
* Consulta la lista de trámites de carga masiva.
* Este método construye dinámicamente los parámetros de búsqueda necesarios 
* para consultar un listado de trámites, incluyendo opcionalmente fechas y observaciones. 
* La respuesta contiene los encabezados de la tabla y los datos del cuerpo de la tabla.
* 
* @param catalogoDependencia - Identificador de la dependencia que solicita la carga.
* @param servicio - Identificador del servicio asociado al trámite.
* @param subServicio - Identificador del subservicio relacionado.
* @param modalidad - Modalidad específica del trámite.
* @param tarea - Tarea específica del proceso de trámite.
* @param opciones - (Opcional) Parámetros adicionales para la consulta:
*  - `fechaInicio` (string): Fecha de inicio para filtrar los trámites.
*  - `fechaFinal` (string): Fecha final para filtrar los trámites.
*  - `observacion` (string): Observaciones adicionales para la búsqueda.
*/
  getListaCargaMasiva(
    catalogoDependencia: string,
    servicio: string,
    subServicio: string,
    modalidad: string,
    tarea: string,
    opciones?: {
      fechaInicio?: string;
      fechaFinal?: string;
      observacion?: string;
    }
  ): Observable<TableData> {
    let params = new HttpParams()
      .set('catalogoDependencia', catalogoDependencia)
      .set('servicio', servicio)
      .set('subServicio', subServicio)
      .set('modalidad', modalidad)
      .set('tarea', tarea);

    if (opciones?.fechaInicio) {
      params = params.set('fechaInicio', opciones.fechaInicio);
    }

    if (opciones?.fechaFinal) {
      params = params.set('fechaFinal', opciones.fechaFinal);
    }

    if (opciones?.observacion) {
      params = params.set('observacion', opciones.observacion);
    }

    return this.http.get<TableData>(`/assets/json/funcionario/lista-masivas.json`, { params });
  }

}