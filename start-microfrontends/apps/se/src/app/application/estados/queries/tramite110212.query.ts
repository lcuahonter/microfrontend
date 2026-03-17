import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite110212State } from '../tramites/tramite110212.store';
import { Tramite110212Store } from '../tramites/tramite110212.store';

/**
 * Servicio de consulta para el estado del trámite 110212.
 * 
 * Este servicio permite realizar consultas al estado del trámite 110212 utilizando Akita.
 */
@Injectable({ providedIn: 'root' })
export class Tramite110212Query extends Query<Tramite110212State> {
  /**
   * Observable que selecciona el estado completo del trámite.
   *
   * Este observable emite el estado actual del trámite 110212.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });
  /**
    * Observable que emite los valores del formulario de datos del destinatario
   * @returns Observable<FormValues> con los valores actuales del formulario
   */
  selectFormDatosDelDestinatario$ = this.select((state) => {
    return state.formDatosDelDestinatario;
  });
  
   /**
   * Observable que emite los valores del formulario de destinatario principal
   * @returns Observable<FormValues> con los valores actuales del formulario
   */
  selectFormDestinatario$ = this.select((state) => {
    return state.formDestinatario;
  });

  /**
   * Selecciona las fechas del certificado.
   * @returns {Observable<any>} - Observable con las fechas del certificado.
   */
  formDatosCertificado$ = this.select((state) => {
    return state.formDatosCertificado;
  });

  /**
   * Selecciona el catálogo de idiomas.s
   */
  selectIdioma$ = this.select((state) => state.idiomaDatos);

  /**
   * Selecciona los datos de la entidad federativa.
   * @returns {Observable<any>} - Observable con los datos de la entidad federativa.
   */
  selectEntidadFederativa$ = this.select((state) => {
    return state.entidadFederativaDatos;
  });

  /**
   * Selecciona los datos de la representación federal.
   * @returns {Observable<any>} - Observable con los datos de la representación federal.
   */
  selectrepresentacionFederal$ = this.select((state) => {
    return state.representacionFederalDatos;
  });

  /**
   * Constructor de la clase Tramite110212Query.
   *
   * @param {Tramite110212Store} store - El store que contiene el estado del trámite 110212.
   */
  constructor(protected override store: Tramite110212Store) {
    super(store);
  }
}