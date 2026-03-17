import { BUSCAR_PROGRAMAS, PROC_150103 } from '../servers/api-route';
import { Solicitud150103State,Solicitud150103Store } from '../estados/solicitud150103.store';
import { HttpClient } from '@angular/common/http';
import { HttpCoreService, JSONResponse } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Solicitud150103Query } from '../estados/solicitud150103.query';

@Injectable({
  providedIn: 'root'
})
export class InformeAnualProgramaService {  
  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar solicitudes a servicios externos.
   * @param solicitud150103Store Store para manejar el estado de la solicitud.
   * @param solicitud150103Query Query para acceder al estado de la solicitud.
   * @param httpService Servicio HTTP core para comunicación con el backend.
   */
  constructor(
    private http: HttpClient, 
    private solicitud150103Store: Solicitud150103Store,
    private solicitud150103Query: Solicitud150103Query,
    private httpService: HttpCoreService
  ) {}  
  
  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   * @param DATOS Datos para actualizar el estado del formulario.
   */
  actualizarEstadoFormulario(DATOS: Solicitud150103State): void {
    this.solicitud150103Store.actualizarInicio(DATOS.inicio);
    this.solicitud150103Store.actualizarFin(DATOS.fin);
    this.solicitud150103Store.actualizarFolioPrograma(DATOS.folioPrograma);
    this.solicitud150103Store.actualizarModalidad(DATOS.modalidad);
    this.solicitud150103Store.actualizarTipoPrograma(DATOS.tipoPrograma);
    this.solicitud150103Store.actualizarEstatus(DATOS.estatus);
    this.solicitud150103Store.actualizarVentasTotales(DATOS.ventasTotales);
    this.solicitud150103Store.actualizarTotalExportaciones(DATOS.totalExportaciones);
    this.solicitud150103Store.actualizarTotalImportaciones(DATOS.totalImportaciones);
    this.solicitud150103Store.actualizarSaldo(DATOS.saldo);
    this.solicitud150103Store.actualizarPorcentajeExportacion(DATOS.porcentajeExportacion);
  }

  /**
   * Obtiene los datos del formulario para mostrar - equivalente a guardarDatosFormulario en 150102.
   * @param idSolicitud ID de la solicitud a obtener
   * @returns Observable con los datos de la solicitud
   */
  guardarDatosFormulario(idSolicitud: string): Observable<JSONResponse> {
    return this.httpService.get<JSONResponse>(PROC_150103.MOSTRAR(idSolicitud));
  }

 /**
 * @method getRegistroData
 * @description Método que obtiene los datos de registro desde un archivo JSON.
 * Realiza una solicitud HTTP para obtener un objeto de tipo `Solicitud150103State`.
 * @returns Un observable que emite los datos de registro.
 */
getRegistroData(): Observable<Solicitud150103State> {
    return this.http.get<Solicitud150103State>('assets/json/150103/registro.json');
}

  /**
   * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
   *
   * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  guardarDatosPost(body: Record<string, unknown>): Observable<Record<string, unknown>> {
    return this.httpService.post<Record<string, unknown>>(PROC_150103.GUARDAR, { body: body });
  }
  /**
   * Construye el objeto de datos del reporte basado en el estado actual.
   * @param data - Estado actual de la solicitud 150103.
   * @returns Objeto con los datos del reporte estructurados para el API.
   */
  buildDatosReporte(data: Solicitud150103State): Record<string, unknown> {
    return {
      "saldo": data.saldo,
      "porcentaje": data.porcentajeExportacion,
      "ventasTotales": parseFloat(data.ventasTotales),
      "totalExportaciones": parseFloat(data.totalExportaciones),
      "totalImportaciones": parseFloat(data.totalImportaciones),
      "totalPersonalAdmin1": 0,
      "totalPersonalAdmin2": 0,
      "totalPersonalObrero1": 0,
      "totalPersonalObrero2": 0
    };
  }
  
  /**
   * Obtiene todos los datos del estado almacenado en el store.
   * @returns Observable con todos los datos del estado.
   */
  getAllState(): Observable<Solicitud150103State> {
    return this.solicitud150103Query.seleccionarSolicitud$;
  }
  /**
   * Obtiene la lista de programas para el reporte desde un archivo JSON local.
   * @returns {Observable<Record<string, unknown>>} Observable que emite un arreglo de programas para el reporte.
   */
  obtenerProgramasReporte(rfc: string): Observable<Record<string, unknown>> {
    return this.http.get<Record<string, unknown>>(BUSCAR_PROGRAMAS(rfc));
  }

  /** Obtiene los datos de una solicitud específica mediante su ID. */
  getMostrarSolicitud(id: string): Observable<JSONResponse> {
    return this.httpService.get<JSONResponse>(PROC_150103.MOSTRAR(id));
  }

}