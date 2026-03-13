import { Tramite110202Store, TramiteState } from './tramite110202.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Query para obtener el estado del trámite.
 * Este servicio permite acceder a los estados de los datos almacenados
 * en el store relacionado con el trámite.
 * 
 * @export
 * @class TramiteQuery
 * @extends {Query<TramiteState>}
 */
@Injectable({ providedIn: 'root' })
export class Tramite110202Query extends Query<TramiteState> {

   /**
   * Selecciona el estado general del trámite.
   * @returns {Observable<any>} - Observable con el estado del trámite.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Selecciona el estado general del trámite.
   * @returns {Observable<any>} - Observable con el estado del trámite.
   */
  selectEstado$ = this.select((state) => {
    return state.estado;
  });

  /**
   * Selecciona si todos los valores de la forma son válidos.
   * Verifica si todas las propiedades de `formaValida` son `true`.
   * @returns {Observable<boolean>} - Observable que indica si la forma es válida.
   */
  FormaValida$ = this.select((state) => {
    return state.formaValida ? Object.values(state.formaValida).every(value => value === true) : false;
  });

  /**
   * Selecciona el formulario del certificado.
   * @returns {Observable<any>} - Observable con el formulario del certificado.
   */
  formCertificado$ = this.select((state) => {
    return state.formCertificado;
  });

  /**
   * Selecciona las fechas del certificado.
   * @returns {Observable<any>} - Observable con las fechas del certificado.
   */
  formDatosCertificado$ = this.select((state) => {
    return state.formDatosCertificado;
  });


  /**
 * Selecciona las fechas del certificado.
 * @returns {Observable<any>} - Observable con las fechas del certificado.
 */
  formMercancia$ = this.select((state) => {
    return state.mercanciaForm;
  });

  /**
 * Selecciona la mercancía que se está buscando.
 * @returns {Observable<any>} - Observable con los datos de la mercancía a buscar.
 */
  selectBuscarMercancia$ = this.select((state) => {
    return state.buscarMercancia;
  });

  /**
* Selecciona la mercancía que se está buscando.
* @returns {Observable<any>} - Observable con los datos de la mercancía a buscar.
*/
  selectmercanciaTabla$ = this.select((state) => {
    return state.mercanciaTabla;
  });

  /**
   * Selecciona el estado del alta de la planta.
   * @returns {Observable<any>} - Observable con los datos de alta de la planta.
   */
  selectAltaPlanta$ = this.select((state) => {
    return state.altaPlanta;
  });

  /**
  * Selecciona el estado del factura.
  * @returns {Observable<any>} - Observable con los factura.
  */
  selectFactura$ = this.select((state) => {
    return state.factura;
  });

  /**
 * Selecciona el estado del umc.
 * @returns {Observable<any>} - Observable con los umc.
 */
  selectUmc$ = this.select((state) => {
    return state.umcs;
  });

  /**
 * Selecciona el estado del umc.
 * @returns {Observable<any>} - Observable con los umc.
 */
  selectMasaBruta$ = this.select((state) => {
    return state.masaBruta;
  });

  /**
   * Selecciona los países bloqueados.
   * @returns {Observable<any>} - Observable con los países bloqueados.
   */
  selectPaisBloque$ = this.select((state) => {
    return state.paisBloques;
  });

  /**
   * Selecciona el idioma de los datos.
   * @returns {Observable<any>} - Observable con los datos del idioma seleccionado.
   */
  selectIdioma$ = this.select((state) => {
    return state.idiomaDatos;
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
   * Observable que emite la lista de países de destino
   * @returns Observable<Catalogo[]> con los países de destino disponibles
   */
  selectPaisDestino$ = this.select((state) => {
    return state.paisDestin;
  });

  /**
   * Observable que emite los valores del formulario de destinatario principal
   * @returns Observable<FormValues> con los valores actuales del formulario
   */
  selectFormDestinatario$ = this.select((state) => {
    return state.formDestinatario;
  });

  /**
   * Observable que emite los valores del formulario de datos del destinatario
   * @returns Observable<FormValues> con los valores actuales del formulario
   */
  selectFormDatosDelDestinatario$ = this.select((state) => {
    return state.formDatosDelDestinatario;
  });

  /**
   * Observable que emite la lista de medios de transporte disponibles
   * @returns Observable<Catalogo[]> con los medios de transporte
   */
  selectMedioDeTransporte$ = this.select((state) => {
    return state.medioDeTransporte;
  });

  /**
   * Observable que emite los valores del formulario de destinatario
   * @returns Observable<FormValues> con los valores actuales del formulario
   */
  selectDestinatarioForm$ = this.select((state) => {
    return state.destinatarioForm;
  });

  /**
   * Constructor del servicio TramiteQuery.
   * 
   * @param {Tramite110202Store} store - La instancia del store que se utiliza para obtener el estado.
   */
  constructor(protected override store: Tramite110202Store) {
    super(store);
  }
}
