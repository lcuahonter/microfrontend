import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";
import { Tramite110221State} from "./tramite110221.store";
import { Tramite110221Store } from "./tramite110221.store";


/**
 * @descripcion
 * Query para gestionar el estado del certificado CAM.
 */
@Injectable({ providedIn: 'root' })
export class Tramite110221Query extends Query<Tramite110221State> {
  /**
   * @descripcion
   * Observable que selecciona el estado completo del certificado.
   */
  selectTramite$ = this.select((state) => {
    return state;
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

    /** @descripcion
   * Observable que selecciona los productores agregados por el exportador.
   */
   selectAgregarProductoresExportador$ = this.select((state) => {
    return state.agregarProductoresExportador;
  });
    /** @descripcion
   * Observable que selecciona la mercancía de los productores.
   */
    selectMercanciaProductores$ = this.select((state) => {
    return state.mercanciaProductores;
  });
   /**
   * @descripcion
   * Observable que selecciona los datos del formulario de destinatario.
   */
  selectFormDatosDelDestinatario$ = this.select((state) => {
    return state.formDatosDelDestinatario;
  });

  /** @descripcion
   * Observable que selecciona el formulario del exportador.
   */
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
  
  /**
   * Selecciona si todos los valores de la forma son válidos.
   * Verifica si todas las propiedades de `formaValida` son `true`.
   * @returns {Observable<boolean>} - Observable que indica si la forma es válida.
   */
  FormaValida$ = this.select((state) => {
    return Object.values(state.formaValida).every(value => value === true);
  });

  /**
   * @descripcion
   * Observable que selecciona la tabla de mercancías del estado.
   */
  selectmercanciaTabla$ = this.select((state) => {
    return state.mercanciaTabla;
  });

   /**
   * Selecciona el formulario del certificado.
   * @returns {Observable<any>} - Observable con el formulario del certificado.
   */
  formCertificado$ = this.select((state) => {    
    return state.formCertificado;
  });
 /**
   * Selecciona el estado del alta de la planta.
   * @returns {Observable<any>} - Observable con los datos de alta de la planta.
   */
  selectAltaPlanta$ = this.select((state) => {
    return state.altaPlanta;
  });

    /**
   * Selecciona los países bloqueados.
   * @returns {Observable<any>} - Observable con los países bloqueados.
   */
  selectPaisBloque$ = this.select((state) => {
    return state.paisBloques;
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
   * Selecciona todo el estado de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });
 /**
   * Selecciona la mercancía que se está buscando.
   * @returns {Observable<any>} - Observable con los datos de la mercancía a buscar.
   */
  selectBuscarMercancia$ = this.select((state) => {    
    return state.buscarMercancia;
  });
     /**
   * Selecciona las fechas del certificado.
   * @returns {Observable<any>} - Observable con las fechas del certificado.
   */
    formMercancia$ = this.select((state) => {    
      return state.mercanciaForm;
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
   * @descripcion
   * Constructor que inyecta el almacén `camCertificadoStore`.
   * @param store - Instancia de `camCertificadoStore`.
   */
  constructor(protected override store: Tramite110221Store) {
    super(store);
  }
}
/**
 * @descripcion
 * Exporta el store del trámite 110221 para su uso en otros módulos.
 */
export { Tramite110221Store };
