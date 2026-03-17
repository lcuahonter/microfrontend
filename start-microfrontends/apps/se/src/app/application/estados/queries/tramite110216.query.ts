import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite110216State } from '../tramites/tramite110216.store';
import { Tramite110216Store } from '../tramites/tramite110216.store';

/**
 * Servicio de consulta para el estado del trámite 110216.
 * 
 * Este servicio permite realizar consultas al estado del trámite 110216 utilizando Akita.
 */
@Injectable({ providedIn: 'root' })
export class Tramite110216Query extends Query<Tramite110216State> {

  /**
   * Observable selector for retrieving the entire state.
   */
  allStoreData$ = this.select((state) => state);

  /**
   * @descripcion
   *  Observable que selecciona los datos del formulario de certificado.
   */ 
    datosProductorFormulario$ = this.select((state) => {
      return state.datosProductorFormulario;
    });

  /**
   * @descripcion
   * Observable que selecciona los datos del formulario de certificado.
   */
    formulario$ = this.select((state) => {
      return state.formHistorico;
    });
    
    /**
   * Observable que expone la lista de mercancías asociadas a los productores en el estado del trámite.
   */
    selectMercanciaProductores$ = this.select((state) => {
      return state.mercanciaProductores;
    });

  /**
   * Observable que expone la lista de productores exportador agregados al estado del trámite.
   */
    selectAgregarProductoresExportador$ = this.select((state) => {
      return state.agregarProductoresExportador;
    });

  /**
   * Observable que selecciona el estado completo del trámite.
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
    return Object.values(state.formaValida ?? {}).every(value => value === true);
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
   * Selecciona la tabla de mercancías.
   * @returns {Observable<any>} - Observable con los datos de la tabla de mercancías.
   */
  selectmercanciaTabla$ = this.select((state) => {
    return state.mercanciaTabla;
  });
  
  /**
   * Selecciona las fechas del certificado.
   * @returns {Observable<any>} - Observable con las fechas del certificado.
   */
  formDatosCertificado$ = this.select((state) => {
    return state.formDatosCertificado;
  });

  /**
   * Constructor de la clase Tramite110216Query.
   * 
   * @param {Tramite110216Store} store - El store que contiene el estado del trámite 110216.
   */
  constructor(protected override store: Tramite110216Store) {
    super(store);
  }
}