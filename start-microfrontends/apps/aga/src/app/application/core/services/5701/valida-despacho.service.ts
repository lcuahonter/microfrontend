import {
  BodyValidarRFCAutorizacionDDEX,
  BodyValidarRFCAutorizacionLDA,
  ValidacionDDEXAutorizacionResponse,
  ValidacionLDAAutorizacionResponse,
} from '../../models/5701/validaciones-depacho.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { API_POST_VALIDA_LDA } from '../../../constantes/5701/api-constants';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidaDespachoService {
  private readonly host: string;

  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Método para obtener la entidad o persona asociada a un proceso de comercio o negocio que interactúa con el sistema.
   * @param claveSocioComercial Clave del socio comercial a consultar.
   * @returns Observable<CatalogosBooleanResponse> Respuesta del servicio con la información del socio comercial.
   */
  validaRFCAutorizacionLda(
    bodyValidarRFCAutorizacionLda: BodyValidarRFCAutorizacionLDA
  ): Observable<ValidacionLDAAutorizacionResponse> {
    const ENDPOINT = `${this.host}${API_POST_VALIDA_LDA}`;

    return this.http
      .post<ValidacionLDAAutorizacionResponse>(
        ENDPOINT,
        bodyValidarRFCAutorizacionLda
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const MENSAJE_ERROR =
            error.error?.mensaje || `Error al consultar ${ENDPOINT}`;
          console.error(MENSAJE_ERROR);
          return throwError(() => new Error(MENSAJE_ERROR));
        })
      );
  }

  /**
   * @description
   * Método para validar si el RFC está autorizado para operar en DDEX.
   * @param bodyValidarRFCAutorizacionLda Objeto que contiene el RFC a validar.
   * @return Observable<ValidacionDDEXAutorizacionResponse> Respuesta del servicio con la validación del RFC.
   */
  validaRFCAutorizacionDDEX(
    bodyValidarRFCAutorizacionDdex: BodyValidarRFCAutorizacionDDEX
  ): Observable<ValidacionDDEXAutorizacionResponse> {
    const ENDPOINT = 'assets/json/5701/validar-despacho-ddx.json';
    return this.http.get<ValidacionDDEXAutorizacionResponse>(ENDPOINT).pipe(
      map((response) => {
        return response;
      }),
      catchError(() => {
        const ERROR = new Error(
          `Ocurrió un error al devolver la información ${ENDPOINT} `
        );
        return throwError(() => ERROR);
      })
    );
  }
}