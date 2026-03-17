import { Catalogo, JSONResponse } from '@libs/shared/data-access-user/src';
import { Observable, catchError, throwError } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src/enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_260605 } from '../server/api-route';
import { Solicitud260605State } from '../../../estados/tramites/tramite260605.store';
import { Tramite260605Store } from '../../../estados/tramites/tramite260605.store';

/**
 * Servicio para manejar las solicitudes relacionadas con los DATOS de representantes y aduanas.
 * Este servicio utiliza `HttpClient` para realizar solicitudes HTTP y recuperar DATOS desde archivos JSON.
 * 
 * @export
 * @class ModificatNoticeService
 */
@Injectable({
  providedIn: 'root',
})
export class ModificatNoticeService {
  /**
   * URL del servidor utilizado para servicios auxiliares JSON.
   * Esta URL se obtiene de la configuración del entorno.
   * 
   * @type {string}
   * @memberof ModificatNoticeService
   */
  urlServer = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
   * Construye una instancia de `ModificatNoticeService`.
   * 
   * @param {HttpClient} http - La instancia de HttpClient utilizada para realizar solicitudes HTTP.
   * @memberof ModificatNoticeService
   */
  constructor(private http: HttpClient, private tramite260605Store: Tramite260605Store) {
    // Lógica de inicialización si es necesario
  }

  /**
   * Recupera los DATOS del representante desde un archivo JSON local.
   *
   * Este método envía una solicitud HTTP GET para recuperar los DATOS del archivo JSON especificado.
   * Se espera que los DATOS sean del tipo `ReprestantanteData`.
   *
   * @returns {Observable<ReprestantanteData>} Un observable que emite los DATOS del representante obtenidos.
   * @throws Lanzará un error si la solicitud HTTP falla.
   * @memberof ModificatNoticeService
   */
  public ObtenerReprestantanteData(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.http
      .post<JSONResponse>(PROC_260605.BUSCAR, body)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  /**
   * Recupera la lista de aduanas disponibles desde un archivo JSON local.
   *
   * Este método envía una solicitud HTTP GET para recuperar los DATOS del archivo JSON especificado.
   * Se espera que los DATOS sean del tipo `Aduana[]`.
   *
   * @returns {Observable<Aduana[]>} Un observable que emite un array de objetos `Aduana`.
   * @throws Lanzará un error si la solicitud HTTP falla.
   * @memberof ModificatNoticeService
   */
  public obteneraduanasDisponiblesdatos(): Observable<BaseResponse<Catalogo[]>> {
    return this.http.get<BaseResponse<Catalogo[]>>(PROC_260605.CATALOGO).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

/**
 * Actualiza el estado del formulario con los datos proporcionados.
 *
 * Este método toma un objeto de tipo `Solicitud260605State` y actualiza los valores
 * correspondientes en el store `tramite260605Store`, incluyendo número de permiso,
 * costumbres actuales, RFC, nombre, apellidos, aduanas disponibles y seleccionadas,
 * así como la cantidad solicitada.
 *
 * @param DATOS - Objeto que contiene los datos del formulario a actualizar.
 */
 actualizarEstadoFormulario(DATOS: Solicitud260605State): void {
    this.tramite260605Store.setNumeroDPmiso(DATOS.numeroDePermiso);
  this.tramite260605Store.setCstumbresAtuales(DATOS.cstumbresAtuales);
  this.tramite260605Store.setRfc(DATOS.rfc);
  this.tramite260605Store.setNombre(DATOS.nombre);
  this.tramite260605Store.setApellidoPaterno(DATOS.apellidoPaterno);
  this.tramite260605Store.setApellidoMaterno(DATOS.apellidoMaterno);
  this.tramite260605Store.setAduanasDisponibles(DATOS.aduanasDisponibles);
  this.tramite260605Store.setAduanasSeleccionadas(DATOS.aduanasSeleccionadas);
  this.tramite260605Store.setCantidadSolicitada(DATOS.cantidadSolicitada);
  //this.tramite260605Store.setCostumbresActuales(DATOS.costumbresActuales);
  
  }

/**
 * Obtiene los datos del registro de toma de muestras de mercancías.
 *
 * Realiza una solicitud HTTP GET para recuperar la información almacenada en el archivo JSON correspondiente
 * a la toma de muestras de mercancías para el trámite 260605.
 *
 * @returns Un observable que emite el estado de la solicitud (`Solicitud260605State`) con los datos obtenidos.
 */
public getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud260605State> {
    return this.http.get<Solicitud260605State>('assets/json/260605/registro_toma_muestras_mercancias.json');
  }

  /**
   * Guarda la solicitud en el servidor.
   * @param data Los datos de la solicitud a guardar.
   * @returns Un observable que emite la respuesta del servidor.
   */
  public guardarSolicitud(payload: Record<string, unknown>): Observable<JSONResponse> {
      return this.http.post<JSONResponse>(PROC_260605.GUARDAR, payload).pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }

}