import { Tramite110223Store, TramiteState } from '../estados/Tramite110223.store';
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
export class Tramite110223Query extends Query<TramiteState> {

  selectPexim$ = this.select((state) => {
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
   * Selecciona los productores exportador agregados.
   * @returns {Observable<any>} - Observable con los productores exportador agregados.
   */
  selectAgregarProductoresExportador$ = this.select((state) => {
    return state.agregarProductoresExportador;
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
   * Selecciona todo el estado de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
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
   * @descripcion
   *  Observable que selecciona los datos del formulario de certificado.
   */ 
    agregarDatosProductorFormulario$ = this.select((state) => {
      return state.agregarDatosProductorFormulario;
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
   * Observable que selecciona los datos del formulario de destinatario.
   */
  setGrupoReceptor$ = this.select((state) => {
    return state.grupoReceptor;
  });

  /**
   * @descripcion
   * Observable que selecciona el formulario de destinatario.
   */
  selectFormDestinatario$ = this.select((state) => {
    return state.formDestinatario;
  });

  /**
   * Constructor del servicio TramiteQuery.
   * 
   * @param {Tramite110223Store} store - La instancia del store que se utiliza para obtener el estado.
   */
  constructor(protected override store: Tramite110223Store) {
    super(store);
  }
}
