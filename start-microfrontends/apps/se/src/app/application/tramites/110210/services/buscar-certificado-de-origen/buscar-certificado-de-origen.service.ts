/**
 *  Este servicio proporciona métodos para buscar certificados de origen.
 */

import { Catalogo, HttpCoreService } from '@libs/shared/data-access-user/src';
import { CertificadoPayload, GeneraCadenaPayload, GuardarPayload } from '../../models/certificados-disponsible.model';
import { Observable, catchError, map, throwError } from 'rxjs';
import { API_ROUTES } from '../../../../shared/servers/api-route';
import { ComplimentosService } from '../../../../shared/services/complimentos.service';
import { Injectable } from '@angular/core';
import {
  JSONResponse
} from '@ng-mf/data-access-user';


@Injectable({
  providedIn: 'root'
})
export class BuscarCertificadoDeOrigenService {

  /**
   * @constructor
   * {HttpCoreService} http - Servicio HTTP para realizar solicitudes.
   */
  constructor(private http: HttpCoreService,
    private complimentosService:ComplimentosService
  ) { 
    this.setProcedure();
    this.setProcedureNo();
  }
  
  /**
   * @method getPaisBloque
   *  Obtiene los datos de la entidad federativa desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite los datos obtenidos.
   */
  getPaisBloque(): Observable<Catalogo[]> {
    return this.http.get('./assets/json/110210/pais-bloque.json');
  }

  /**
   * @method getTratadoAcuerdo
   *  Obtiene los datos de la representación federal desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite los datos obtenidos.
   */
  getTratadoAcuerdo(): Observable<Catalogo[]> {
    return this.http.get('./assets/json/110210/tratado-acuerdo.json');
  }

  /**
 * Establece el procedimiento actual para la gestión de trámites industriales.
 * Asigna el identificador de procedimiento 'st_t80101' y lo configura en el servicio de cumplimientos.
 *
 * @returns {void} No retorna ningún valor.
 */
  setProcedure():void{
    const PROCEDURE='sat-t110210';
    this.complimentosService.setProcedure(PROCEDURE);
  }

  /**
 * Establece el número de procedimiento actual para la gestión de trámites industriales.
 * Asigna el número de procedimiento '80101' y lo configura en el servicio de cumplimientos.
 *
 * @returns {void} No retorna ningún valor.
 */
  setProcedureNo(): void {
    this.complimentosService.setProcedureNo('110210');
  }
   /**
   * @method getCertificadosDisponibles
   * Envía una solicitud para obtener una lista de certificados disponibles según el payload proporcionado.
   * @param {CertificadoPayload} body - El payload que contiene los datos necesarios para la solicitud.
   * @returns {Observable<JSONResponse>} Un observable que emite la respuesta de la solicitud.
   */
  getCertificadosDisponibles(body: CertificadoPayload): Observable<JSONResponse> {
    return this.http.post(API_ROUTES('/sat-t110210').certificadoDisponsible, {body}).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${API_ROUTES().certificadoDisponsible}`);
        return throwError(() => ERROR);
      })
    );
  }
      /**
   * @method guardar
   * Envía una solicitud para guardar un certificado según el payload proporcionado.
   * @param {CertificadoPayload} body - El payload que contiene los datos necesarios para la solicitud.
   * @returns {Observable<JSONResponse>} Un observable que emite la respuesta de la solicitud.
   */
  guardar(body: GuardarPayload): Observable<JSONResponse> {
    return this.http.post(API_ROUTES('/sat-t110210').guardarCertificadoDisponsible, {body}).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${API_ROUTES().guardarCertificadoDisponsible}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * @method generaCadena
   * @description
   * Genera la cadena original para la solicitud guardada.
   * @param {GeneraCadenaPayload} body - El payload que contiene los datos necesarios para la solicitud.
   * @param {number} solicitudId - El ID de la solicitud.
   * @returns {Observable<JSONResponse>} Un observable que emite la respuesta de la solicitud.
   */
  generaCadena(body: GeneraCadenaPayload, solicitudId: number): Observable<JSONResponse> {
    return this.http.post(API_ROUTES('/sat-t110210').generaCadena(solicitudId), { body }).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al generar la cadena en ${API_ROUTES().generaCadena(solicitudId)}`);
        return throwError(() => ERROR);
      })
    );
  }
}