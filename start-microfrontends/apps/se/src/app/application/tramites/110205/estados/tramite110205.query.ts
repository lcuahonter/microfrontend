import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";
import { Tramite110205State } from "./tramite110205.store";
import { Tramite110205Store } from "./tramite110205.store";

/**
 * @descripcion
 * Query para gestionar el estado del certificado CAM.
 */
@Injectable({ providedIn: 'root' })
export class Tramite110205Query extends Query<Tramite110205State> {
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
  selectmercanciaTabla$ = this.select((state) => {
    return state.mercanciaTabla;
  });

  /**
   * @descripcion
   * Observable que selecciona la tabla de mercancías del estado.
   */
  selectmercanciaTablaUno$ = this.select((state) => {
    return state.disponiblesDatos;
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
  /**
   * @descripcion
   * Observable que selecciona el formulario de destinatario.
   */
  selectFormDestinatario$ = this.select((state) => {
    return state.formDestinatario;
  });

  /**
   * @descripcion
   * Observable que selecciona el formulario de destinatario.
   */
  selectproducto$ = this.select((state) => {
    return state.procductoUno;
  });

  /**
   * @descripcion
   * Observable que indica si todos los campos del formulario son válidos.
   * Retorna `true` solo si todos los valores en `formaValida` son verdaderos.
   */
  FormaValida$ = this.select((state) => {
    return Object.values(state.formaValida).every((value) => value === true);
  });

  /**
   * @propiedad selectCambioModalidad$
   * @tipo Observable<CambioModalidadState>
   * @descripción Selector que permite obtener el estado completo de `CambioModalidadState`.
   */
  selectCambioModalidad$ = this.select((state) => {
    return state;
  });

  /**
   * Selecciona la mercancía que se está buscando.
   * @returns {Observable<any>} - Observable con los datos de la mercancía a buscar.
   */
  selectBuscarMercancia$ = this.select((state) => {    
    return state.buscarMercancia;
  });

  selectAgregarProductoresExportador$ = this.select((state) => {
    return state.agregarProductoresExportador;
  });

  selectMercanciaProductores$ = this.select((state) => {
    return state.mercanciaProductores;
  });

  /**
   * @descripcion
   * Constructor que inyecta el almacén `camCertificadoStore`.
   * @param store - Instancia de `camCertificadoStore`.
   */
  constructor(protected override store: Tramite110205Store) {
    super(store);
  }
}