import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';

import {
  Catalogo,
  CatalogoServices,
  JSONResponse,
} from '@libs/shared/data-access-user/src';

import { Observable, combineLatest, map } from 'rxjs';

import { GuardarAdapter_261401 } from '../adapters/guardar-payload.adapter';
import { PROC_261401 } from '../servers/api-route';

import {
  Solicitud2614State,
  Tramite2614Store,
} from '../../../estados/tramites/tramite2614.store';
import { PagoDerechosQuery } from '../../../shared/estados/queries/pago-derechos.query';
import { Solicitud261401State } from '../estados/tramite261401.store';
import { Tramite261401Query } from '../estados/tramite261401.query';
import { Tramite2614Query } from '../../../estados/queries/tramite2614.query';

import { PagoDerechosState } from '../../../shared/estados/stores/pago-de-derechos.store';

/**
 * Interface for the combined state returned by getAllState
 */
export interface CombinedState {
  solicitud2614: Solicitud2614State;
  solicitud261401: Solicitud261401State;
  consultaio: ConsultaioState;
  pagoDerechos: PagoDerechosState;
}


/**
 * Servicio para gestionar la solicitud de modificación de permiso de salida del territorio.
 * Este servicio proporciona métodos para obtener datos relacionados con el trámite 261401,
 * como listas de países, entidades federativas y gestión del estado del formulario.
 */
@Injectable({
  providedIn: 'root',
})
export class SolicitudImportacionAmbulanciaService {
  /**
   * Constructor del servicio.
   * Inyecta las dependencias necesarias para el manejo de estado y comunicación con APIs.
   */
  constructor(
    private http: HttpClient,
    private tramite2614Store: Tramite2614Store,
    private catalogoServices: CatalogoServices,
    private tramite2614Query: Tramite2614Query,
    private tramite261401Query: Tramite261401Query,
    private consultaioQuery: ConsultaioQuery,
    private pagoDerechosQuery: PagoDerechosQuery
  ) {
    //
  }

  /**
   * Obtiene el catálogo de países para el trámite.
   * @returns Observable con un arreglo de países
   */
  getPaisesCatalogo(): Observable<Catalogo[]> {
    return this.catalogoServices
      .entidadesFederativasCatalogo('MX')
      .pipe(map((res) => res?.datos ?? []));
  }

  /**
   * Actualiza el estado del formulario en el store.
   * @param DATOS Estado actualizado del trámite.
   */
  actualizarEstadoFormulario(DATOS: Solicitud2614State): void {
    this.tramite2614Store.actualizarEstado(DATOS);
  }

  /**
   * Obtiene los datos de la solicitud.
   * @returns Observable con los datos de la solicitud.
   */
  getDatosDeLaSolicitud(): Observable<Solicitud2614State> {
    return this.http.get<Solicitud2614State>(
      'assets/json/2614/datos-de-la-solicitud.json'
    );
  }

  /**
   *  Obtiene el catálogo de entidades federativas asociado a un identificador.
   * @param ID Identificador para obtener las entidades federativas
   * @returns Observable con un arreglo de entidades federativas (o vacío si no hay datos)
   */
  getEntidadesFederativasCatalogo(ID: string): Observable<Catalogo[]> {
    return this.catalogoServices
      .entidadesFederativasCatalogo(ID)
      .pipe(map((res) => res?.datos ?? []));
  }

  /**
   * Guarda los datos del trámite en el servidor.
   * @param body - Objeto con los datos a guardar.
   * @returns Observable con la respuesta del servidor.
   */
  guardarDatos(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(PROC_261401.GUARDAR, body);
  }

  /**
   * Obtiene todos los datos de estado combinados de los diferentes stores.
   * Combina los estados de solicitud2614, solicitud261401, consultaio y pagoDerechos.
   * @returns Observable<CombinedState> Observable con todos los datos del estado combinado.
   */
  getAllState(): Observable<CombinedState> {
    return combineLatest({
      solicitud2614: this.tramite2614Query.selectSolicitud$,
      solicitud261401: this.tramite261401Query.selectSolicitud$,
      consultaio: this.consultaioQuery.selectConsultaioState$,
      pagoDerechos: this.pagoDerechosQuery.selectSolicitud$
    });
  }

  /**
   * Genera el payload completo de datos transformando la información del trámite para el envío al servidor.
   * Utiliza el adaptador GuardarAdapter_261401 para crear la estructura correcta del payload.
   * @param {Solicitud261401State} state261401 - Estado específico del trámite 261401
   * @param {Solicitud2614State} state2614 - Estado general del trámite 2614
   * @param {ConsultaioState} guardarDatos - Datos de consulta
   * @param {PagoDerechosState} pagoState - Estado de pago de derechos
   * @returns {unknown} Payload completo formateado para enviar al backend
   */
  static getPayloadDatos(
    state261401: Solicitud261401State,
    datosState: Record<string, unknown>,
    state2614: Solicitud2614State,
    guardarDatos: ConsultaioState,
    pagoState: PagoDerechosState
  ): unknown {
    return GuardarAdapter_261401.toFormPayload(
      state261401,
      datosState, 
      state2614,
      guardarDatos as unknown as Record<string, unknown>,
      pagoState
    );
  }
}