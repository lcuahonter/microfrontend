import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";
import { Tramite110222State } from "./tramite110222.store";
import { Tramite110222Store } from "./tramite110222.store";

/**
 * @descripcion
 * Query para gestionar el estado del certificado CAM.
 */
@Injectable({ providedIn: 'root' })
export class Tramite110222Query extends Query<Tramite110222State> {
  /**
   * @descripcion
   * Observable que selecciona el estado completo del certificado.
   */
  selectTramite$ = this.select((state) => {
    return state;
  });

  selectAgregarProductoresExportador$ = this.select((state) => {
    return state.agregarProductoresExportador;
  });

   selectMercanciaProductores$ = this.select((state) => {
    return state.mercanciaProductores;
  });

  /**
   * @descripcion
   * Observable que selecciona el estado completo del certificado.
   */
  selectPeru$ = this.select((state) => {
    return state;
  });

   /**
   * @descripcion
   * Observable que selecciona la tabla de mercancías del estado.
   */
  selectmercanciaTablaUno$ = this.select((state) => {
    return state.disponiblesDatos;
  });

  /**
   * Selecciona si todos los valores de la forma son válidos.
   * Verifica si todas las propiedades de `formaValida` son `true`.
   * @returns {Observable<boolean>} - Observable que indica si la forma es válida.
   */
  FormaValida$ = this.select((state) => {
    return Object.values(state.formaValida ?? {}).every(value => value === true);
  });

  /**
   * @descripcion
   * Observable que selecciona la tabla de mercancías del estado.
   */
  selectmercanciaTabla$ = this.select((state) => {
    return state.mercanciaTabla;
  });

  /**
   * @descripcion
   * Observable que selecciona los datos del formulario de certificado.
   */
  formCertificado$ = this.select((state) => {
    return state.formCertificado;
  });

  /**
 * @descripcion
 * Observable que selecciona los datos del formulario de certificado.
 */
  formulario$ = this.select((state) => {
    return state.formulario;
  });

  /**
 * @descripcion
 *  Observable que selecciona los datos del formulario de certificado.
 */
  agregarDatosProductorFormulario$ = this.select((state) => {
    return state.agregarDatosProductorFormulario;
  });

  /**
   * @descripcion
   * Observable que selecciona los datos del formulario de datos del certificado.
   */
  formDatosCertificado$ = this.select((state) => {
    return state.formDatosCertificado;
  });

  /**
   * @descripcion
   * Observable que selecciona los datos del formulario de destinatario.
   */
  selectFormDatosDelDestinatario$ = this.select((state) => {
    return state.formDatosDelDestinatario;
  });

  selectFormExportador$ = this.select((state) => {
    return state.formExportor;
  });

  /**
   * @descripcion
   * Observable que selecciona el formulario de destinatario.
   */
  selectFormDestinatario$ = this.select((state) => {
    return state.formDestinatario;
  });

  /**
   * Selecciona el idioma de los datos.
   * @returns {Observable<any>} - Observable con los datos del idioma seleccionado.
   */
  selectIdioma$ = this.select((state) => {
    return state.idiomaDatos;
  });

   /**
   * Selecciona el idioma de los datos.
   * @returns {Observable<any>} - Observable con los datos del idioma seleccionado.
   */
  bloque$ = this.select((state) => {
    return state.bloque;
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
   * @descripcion
   * Constructor que inyecta el almacén `camCertificadoStore`.
   * @param store - Instancia de `camCertificadoStore`.
   */
  constructor(protected override store: Tramite110222Store) {
    super(store);
  }
}