import { BUSCAR_PROGRAMAS, PROC_150101 } from '../servers/api-route';
import { HttpClient } from '@angular/common/http';
import { HttpCoreService, JSONResponse } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistroSolicitudDatos } from '../models/programas-reporte.model';
import { ReporteFechas } from '../models/programas-reporte.model';
import { Solicitud150101Query } from '../estados/solicitud150101.query';
import { Solicitud150101State } from '../estados/solicitud150101.store';


/**
 * @file Servicio para gestionar las solicitudes relacionadas con los trámites del módulo 150101.
 * Proporciona métodos para obtener datos de programas y reportes desde archivos JSON locales.
 */

/**
 * @class SolicitudService
 * @description Servicio que permite obtener información de programas y reportes de fechas
 * desde archivos JSON locales para el módulo 150101.
 */
@Injectable({
  providedIn: 'root',
})

/**
 * Servicio para manejar las solicitudes de datos relacionados con los programas y reportes.
 * Este servicio utiliza HttpClient para realizar solicitudes a archivos JSON locales.
 */
export class SolicitudService {
  /**
   * @constructor
   * @param http Cliente HTTP utilizado para realizar solicitudes a los archivos JSON.
   */
  constructor(
    private http: HttpClient,
    private solicitud150101Query: Solicitud150101Query,
    public httpService: HttpCoreService
  ) {
    //constructor
  }

  /**
   * Obtiene la lista de programas para el reporte desde un archivo JSON local.
   * @returns {Observable<Record<string, unknown>>} Observable que emite un arreglo de programas para el reporte.
   */
  obtenerProgramasReporte(rfc: string): Observable<Record<string, unknown>> {
    return this.http.get<Record<string, unknown>>(BUSCAR_PROGRAMAS(rfc));
  }

  /**
   * Obtiene las fechas del reporte desde un archivo JSON local.
   * @returns {Observable<ReporteFechas>} Observable que emite las fechas del reporte.
   */
  obtenerReporteFechas(): Observable<ReporteFechas> {
    return this.http.get<ReporteFechas>(
      'assets/json/150101/reporte-fechas.json'
    );
  }

  /**
   * Obtiene los datos del registro de solicitud anual desde un archivo JSON local.
   * @returns {Observable<JSONResponse>} Observable que emite los datos del registro de solicitud anual.
   */
  getRegistroSolicitudDatos(idSolicitude: string): Observable<JSONResponse> {
    return this.http.get<JSONResponse>(
      PROC_150101.MOSTRAR(idSolicitude)
    );
  }

  /**
   * Obtiene todos los datos del estado almacenado en el store.
   * @returns {Observable<Solicitud150101State>} Observable con todos los datos del estado.
  */
  getAllState(): Observable<Solicitud150101State> {
    return this.solicitud150101Query.allStoreData$;
  }

  /**
   * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
   *
   * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  guardarDatosPost(body: Record<string, unknown>): Observable<Record<string, unknown>> {
    return this.httpService.post<Record<string, unknown>>(PROC_150101.GUARDAR, { body: body });
  }

  /**
 * Construye el objeto con los datos del reporte anual a partir del estado de la solicitud.
 * @param data Estado actual de la solicitud anual.
 * @returns Objeto con los datos requeridos para el reporte anual.
 */
  buildReporteAnual(data: Solicitud150101State): Record<string, unknown> {
    return { 
      "saldo": data.saldo,
      "porcentaje": data.porcentajeExportacion,
      "ventasTotales": data.ventasTotales,
      "totalExportaciones": data.totalExportaciones,
      "totalImportaciones": data.totalImportaciones,
      "totalPersonalAdmin1": 0,
      "totalPersonalAdmin2": 0,
      "totalPersonalObrero1": 0,
      "totalPersonalObrero2": 0
    };
  }
}
