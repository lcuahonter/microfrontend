import { Tramite110204Store, TramiteState } from './tramite110204.store';
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
export class Tramite110204Query extends Query<TramiteState> {

  selectState$ = this.select((state) => {
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
    return Object.values(state.formaValida).every(value => value === true);
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

  selectmercanciaTabla$ = this.select((state) => {
    return state.mercanciaTabla;
  });
  /**
   * Constructor del servicio TramiteQuery.
   * 
   * @param {Tramite110204Store} store - La instancia del store que se utiliza para obtener el estado.
   */
  constructor(protected override store: Tramite110204Store) {
    super(store);
  }
}
