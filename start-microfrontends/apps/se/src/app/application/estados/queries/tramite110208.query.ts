import { Solicitud110208State, Tramite110208Store } from '../tramites/tramite110208.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio para consultar el estado de la Solicitud31601.
 */
@Injectable({ providedIn: 'root' })
export class Tramite110208Query extends Query<Solicitud110208State> {

  
    /**
   * Selecciona las fechas del certificado.
   * @returns {Observable<any>} - Observable con las fechas del certificado.
   */
  formDatosCertificado$ = this.select((state) => {
    return state.formDatosCertificado;
  });

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
   * Selecciona el catálogo de idiomas.s
   */
  selectIdioma$ = this.select((state) => state.idioma);

  /**
   * Observable to select the complete state of the solicitud.
   * @returns {Observable<Solicitud110208State>} The complete state of the solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

    /**
   * @descripcion
   * Observable que selecciona los datos del formulario de destinatario.
   */
  selectFormDatosDelDestinatario$ = this.select((state) => {
    return state.formDatosDelDestinatario;
  });

   /**
   * Observable que emite los valores del formulario de destinatario
   * @returns Observable<FormValues> con los valores actuales del formulario
   */
  selectDestinatarioForm$ = this.select((state) => {
    return state.destinatarioForm;
  });

 /**
   * @descripcion
   * Observable que selecciona el formulario de destinatario.
   */
  selectFormDestinatario$ = this.select((state) => {
    return state.formDestinatario;
  });
   /**
   * Observable que emite la lista de países de destino
   * @returns Observable<Catalogo[]> con los países de destino disponibles
   */
  selectPaisDestino$ = this.select((state) => {
    return state.paisDestin;
  });
    /**
   * Observable que emite la lista de medios de transporte disponibles
   * @returns Observable<Catalogo[]> con los medios de transporte
   */
  selectMedioDeTransporte$ = this.select((state) => {
    return state.medioDeTransporte;
  });
  /**
   * Constructor para Tramite110208Store.
   * @param {Tramite110208Store} store - The store that holds the state of Solicitud110208.
   */
  constructor(
    protected override store: Tramite110208Store) {
    super(store);
  }
}