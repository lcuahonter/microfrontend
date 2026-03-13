import { Observable,catchError, map, throwError } from 'rxjs';
import { BienesProducidos } from '../models/programas-reporte.model';
import { GuardarDatosFormulario } from '../models/programas-reporte.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JSONResponse } from '@libs/shared/data-access-user/src';
import { PROC_150102 } from '../servers/api-route';
import { ReporteFechas } from '../models/programas-reporte.model';
import { Solicitud150102Query } from '../estados/solicitud150102.query';
import { Solicitud150102Store } from '../estados/solicitud150102.store';


/**
 * @description Servicio encargado de realizar solicitudes HTTP relacionadas con el reporte anual.
 * Proporciona métodos para obtener los programas de reporte, las fechas del reporte y los datos de bienes producidos.
 */
@Injectable({
  providedIn: 'root',
})
/**
 * @description Servicio encargado de realizar solicitudes HTTP relacionadas con el reporte anual.
 *  Proporciona métodos para obtener los programas de reporte, las fechas del reporte y los datos de bienes producidos.
 * @class SolicitudService
 */
export class SolicitudService {
  /**
   * @description Constructor del servicio. Inyecta la dependencia de HttpClient para realizar las solicitudes HTTP.
   * @param http Cliente HTTP de Angular para realizar solicitudes al servidor.
   */
  constructor(
    private http: HttpClient,
    private solicitud150102Store: Solicitud150102Store,
    private Tramite150102Query: Solicitud150102Query,
  ) {
    // Constructor vacío, inicialización del servicio HttpClient
  }

  /**
   * @description Obtiene los datos de los programas de reporte desde un archivo JSON.
   * @returns Un observable con un arreglo de objetos ProgramasReporte.
   */
  obtenerProgramasReporte(rfc: string): Observable<JSONResponse> {
    return this.http.get<JSONResponse>(
      PROC_150102.OBTENER(rfc)
    );
  }

  /**
   * @description Obtiene las fechas de inicio y fin del reporte desde un archivo JSON.
   * @returns Un observable con un objeto ReporteFechas.
   */
  obtenerReporteFechas(): Observable<ReporteFechas> {
    return this.http.get<ReporteFechas>(
      'assets/json/150102/reporte-fechas.json'
    );
  }

  /**
   * @description Obtiene los datos de los bienes producidos desde un archivo JSON.
   * @returns Un observable con un arreglo de objetos BienesProducidos.
   */
  obtenerProducidosDatos(): Observable<BienesProducidos[]> {
    return this.http.get<BienesProducidos[]>(
      'assets/json/150102/producidos-datos.json'
    );
  }

  /**
   * Obtiene los datos guardados del formulario desde un archivo JSON local.
   *
   * @returns {Observable<JSONResponse>} Un observable con los datos del formulario.
   */
  guardarDatosFormulario(idSolicitude: string): Observable<JSONResponse> {
    return this.http.get<JSONResponse>(
      PROC_150102.MOSTRA(idSolicitude)
    );
  }

  /**
   * Actualiza el estado del formulario en el store con los datos proporcionados.
   *
   * @param {GuardarDatosFormulario} resp - Objeto con los datos del formulario que se utilizarán para actualizar el store.
   */
  actualizarEstadoFormulario(resp: GuardarDatosFormulario): void {
    this.solicitud150102Store.actualizarInicio(resp.inicio);
    this.solicitud150102Store.actualizarFin(resp.fin);
    this.solicitud150102Store.actualizarFolioPrograma(resp.folioPrograma);
    this.solicitud150102Store.actualizarModalidad(resp.modalidad);
    this.solicitud150102Store.actualizarTipoPrograma(resp.tipoPrograma);
    this.solicitud150102Store.actualizarEstatus(resp.estatus);
    this.solicitud150102Store.actualizarVentasTotales(resp.ventasTotales);
    this.solicitud150102Store.actualizarTotalExportaciones(
      resp.totalExportaciones
    );
    this.solicitud150102Store.actualizarTotalImportaciones(
      resp.totalImportaciones
    );
    this.solicitud150102Store.actualizarSaldo(resp.saldo);
    this.solicitud150102Store.actualizarPorcentajeExportacion(
      resp.porcentajeExportacion
    );
  }


  /**
   * Envía una solicitud POST para guardar los datos proporcionados para el trámite actual.
   *
   * @param body - La carga útil de la solicitud como un registro de pares clave-valor.
   * @returns Un Observable que emite el JSONResponse del backend.
   * @throws Emite un Observable de error si la solicitud HTTP falla.
   */
  guardar(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.http.post(PROC_150102.GUARDAR, body).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_150102.GUARDAR}`);
        return throwError(() => ERROR);
      })
    );
  }
}
