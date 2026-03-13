import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { RespuestaCatalogos } from '@ng-mf/data-access-user';

import { API_GUARDAR_INSPECCION_FISICA_SAGARPA } from '../../../../core/server/api-router';

import { Solicitud220502State, Solicitud220502Store } from '../../../220502/estados/tramites220502.store';

import { InspeccionFisicaPayload, InspeccionFisicaResponse } from '../../../220502/models/solicitud-pantallas.model';
import { RegistroTomaMuestrasMercanciasDatos } from '../../models/datos-generales.model';

import { Observable, catchError, throwError } from 'rxjs';
/**
 * Servicio para gestionar las operaciones relacionadas con SAGARPA.
 */
@Injectable({
  providedIn: 'root'
})
export class SagarpaService {
  /**
   * Host base de la API (por ejemplo: https://api-v30.cloud-ultrasist.net).
   * Se utiliza para construir las URLs absolutas de los servicios SAGARPA.
   */
  host: string;

  private static getApiHeaders(): HttpHeaders {
    const CLAVEUSUARIO = localStorage.getItem('ClaveUsuario') || '';
    const RFC = localStorage.getItem('Rfc') || '';
    const CVEROLE = localStorage.getItem('CveRole') || '';

    return new HttpHeaders({
      'ClaveUsuario': CLAVEUSUARIO,
      'Rfc': RFC,
      'CveRole': CVEROLE
    });
  }
  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar solicitudes.
   */
  constructor(
    private http: HttpClient,
    private solicitud220502Store: Solicitud220502Store,
  ) {
    this.host = ENVIRONMENT.API_HOST;
  }

  /**
   * Método para obtener los medios de transporte.
   * @returns Observable con la respuesta de los catálogos de medios de transporte.
   */
  getMediodetransporte(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/220501/medio-transporte.json');
  }

  /**
     * Guarda los datos del trámite de inspección física.
     * @param payload - Datos del trámite.
     * @returns Observable con la respuesta de la API.
     */
    guardarInspeccionFisicaSagarpa(payload: InspeccionFisicaPayload,procedimiento:string): Observable<InspeccionFisicaResponse> { 
      const ENDPOINT = `${this.host}${API_GUARDAR_INSPECCION_FISICA_SAGARPA(procedimiento)}`;
      return this.http.post<InspeccionFisicaResponse>(ENDPOINT, payload, { headers: SagarpaService.getApiHeaders() })
        .pipe(
          catchError(error => {
            return throwError(() => error);
          })
        );
    }
  

  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   * @param DATOS Datos de la solicitud que se utilizarán para actualizar el estado del formulario.
   * @returns {void}
   */
  actualizarEstadoFormulario(DATOS: Solicitud220502State): void {
    this.solicitud220502Store.setNombre(DATOS.nombre);
    this.solicitud220502Store.setPrimerapellido(DATOS.primerapellido);
    this.solicitud220502Store.setSegundoapellido(DATOS.segundoapellido);
    this.solicitud220502Store.setMercancia(DATOS.mercancia);
    this.solicitud220502Store.setTipocontenedor(DATOS.tipocontenedor);
    this.solicitud220502Store.setCertificadosAutorizados(DATOS.certificadosAutorizados);
    this.solicitud220502Store.setHoraDeInspeccion(DATOS.horaDeInspeccion);
    this.solicitud220502Store.setAduanaDeIngreso(DATOS.aduanaDeIngreso);
    this.solicitud220502Store.setFechaInspeccion(DATOS.fechaInspeccion);
    this.solicitud220502Store.setSanidadAgropecuaria(DATOS.sanidadAgropecuaria);
    this.solicitud220502Store.setPuntoDeInspeccion(DATOS.puntoDeInspeccion);
  }

  /**
   * Método para obtener los datos de registro de toma de muestras de mercancías.
   * @returns Observable con los datos del registro de toma de muestras de mercancías.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<RegistroTomaMuestrasMercanciasDatos> {
    return this.http.get<RegistroTomaMuestrasMercanciasDatos>('assets/json/220501/registro_toma_muestras_mercancias.json');
  }

  /**
   * Método para obtener los datos de la selección de registro de toma de muestras de mercancías.
   * @returns Observable con los datos de la selección de registro de toma de muestras de mercancías.
   */
  obtenerSeleccionadaRegistroDatos(): Observable<RegistroTomaMuestrasMercanciasDatos> {
    return this.http.get<RegistroTomaMuestrasMercanciasDatos>('assets/json/220501/seleccionada_registro_datos.json');
  }
}
