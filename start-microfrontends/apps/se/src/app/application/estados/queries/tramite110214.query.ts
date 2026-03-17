import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite110214State } from '../tramites/tramite110214.store';
import { Tramite110214Store } from '../tramites/tramite110214.store';


/**
 * Servicio de consulta para el estado del trámite 110214.
 * 
 * Este servicio permite realizar consultas al estado del trámite 110214 utilizando Akita.
 */
@Injectable({ providedIn: 'root' })
export class Tramite110214Query extends Query<Tramite110214State> {
  /**
   * Selecciona los países bloqueados.
   * @returns {Observable<any>} - Observable con los países bloqueados.
   */
  selectPaisBloque$ = this.select((state) => {
    return state.paisBloques;
  });

  /**
   * Selecciona los países bloqueados.
   * @returns {Observable<any>} - Observable con los países bloqueados.
   */
  selectPaisBloqu$ = this.select((state) => {
    return state.paisBloqu;
  });

  
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
   * Selecciona el formulario del certificado.
   * @returns {Observable<any>} - Observable con el formulario del certificado.
   */
  formCertificado$ = this.select((state) => {    
    return state.formCertificado;
  });

    /**
   * Observable selector for retrieving the entire state.
   */
  allStoreData$ = this.select((state) => state);


  /**
   * Observable que selecciona el estado completo del trámite.
   * 
   * Este observable emite el estado actual del trámite 110214.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
 * Observable que expone la lista de productores exportador agregados al estado del trámite.
 */
  selectAgregarProductoresExportador$ = this.select((state) => {
    return state.agregarProductoresExportador;
  });

  /**
 * Observable que expone la lista de mercancías asociadas a los productores en el estado del trámite.
 */
  selectMercanciaProductores$ = this.select((state) => {
    return state.mercanciaProductores;
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
   * Observable que expone la tabla de mercancías asociadas al trámite.
   * @returns {Observable<any>} - Observable que emite los datos de la tabla de mercancías del estado del trámite.
   */
  selectMercanciaTabla$ = this.select((state) => {
    return state.mercanciaTabla;
  });
  
  /**
   * Constructor de la clase Tramite110214Query.
   * 
   * @param {Tramite110214Store} store - El store que contiene el estado del trámite 110214.
   */
  constructor(
    protected override store: Tramite110214Store) {
    super(store);
  }
}