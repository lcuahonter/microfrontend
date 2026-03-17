import { DatosSolicitudFormState, TablaMercanciasDatos, TablaOpcionConfig, TablaScianConfig } from '../../../../shared/models/datos-solicitud.model';
import { Destinatario ,Fabricante, Facturador, PagoDerechosFormState, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Cancelacion } from '../../models/cancelacion-de-solicitus.model';
import { Injectable } from '@angular/core';


/**
 * Creacion del estado inicial para la interfaz de tramite 260215
 * @returns Solicitud260215
 */
export interface Solicitud260215State {
   /**
   * Datos seleccionados de opciones en la tabla.
   * @type {TablaOpcionConfig[]}
   */
  seleccionadoopcionDatos: TablaOpcionConfig[];

  /**
   * Datos seleccionados de SCIAN en la tabla.
   * @type {TablaScianConfig[]}
   */
  seleccionadoScianDatos: TablaScianConfig[];

  /**
   * Datos seleccionados de mercancías en la tabla.
   * @type {TablaMercanciasDatos[]}
   */
  seleccionadoTablaMercanciasDatos: TablaMercanciasDatos[];

   /**
     * Configuración de opciones de la tabla.
     */
    opcionConfigDatos: TablaOpcionConfig[];
   /**
   * Lista de proveedores relacionados con el trámite.
   */
  proveedorTablaModificaDatos: Proveedor[];
    /**
   * Lista de facturadores relacionados con el trámite.
   */
  facturadorTablaModificaDatos: Facturador[];
    /**
   * Lista de fabricantes relacionados con el trámite.
   */
  fabricanteTablaModificaDatos: Fabricante[];
  /**
   * claveDeReferencia
   * @type {string}
   */
  claveDeReferencia: string;

  /**
   * cadenaDependencia
   * @type {string}
   */
  cadenaDependencia: string;
    datosSolicitudFormState: DatosSolicitudFormState;


  /**
   * banco
   * @type {string}
   */
  banco: string;

  /**
   * llaveDePago
   * @type {string}
   */
  llaveDePago: string;

  /**
   * fechaPago
   * @type {string}
   */
  fechaPago: string;

  /**
   * importePago
   * @type {string}
   */
  importePago: string;
 
   /**
     * El valor de rfcDel.
     */
   rfcDel: string;
   /**
    * El valor de denominacion.
    */
   denominacion: string;
   /**
    * El valor de correo.
    */
   correo:string;
   /**
    * El valor de codigoPostal.
    */
   codigoPostal:string;
   /**
    * El valor de estado.
    */
   estado:string;
   /**
    * El valor de muncipio.
    */
   muncipio:string;
   /**
    * El valor de localidad.
   */
   localidad:string;
   /**
    * El valor de colonia.
   */
   colonia:string;
   /**
    * El valor de calle.
   */
   calle:string;
   /**
    * El valor de lada.
   */
   lada:string;
   /**
    * El valor de telefono.
   */
   telefono:string;
   /**
    * El valor de claveScianModal.
   */
   claveScianModal: string;
   /**
    * El valor de claveDescripcionModal.
   */
   claveDescripcionModal: string;
   /**
    * El valor de avisoCheckbox.
   */
   avisoCheckbox: boolean;
     fabricanteTablaDatos: Fabricante[];
   /**
    * El valor de licenciaSanitaria.
   */
   licenciaSanitaria: string;
   /**
    * El valor de regimen.
   */
   regimen: string;
   /**
    * El valor de aduanasEntradas.
   */
   aduanasEntradas:string;
   /**
    * El valor de clasificacion.
   */
   clasificacion:string;
   /**
    * El valor de especificar.
   */
   especificar:string;
   /**
    * El valor de denominacionEspecifica.
   */
   denominacionEspecifica:string;
   /**
    * El valor de denominacionDistintiva.
   */
   denominacionDistintiva:string;
   /**
    * El valor de denominacionComun.
   */
   denominacionComun:string;
   /**
    * El valor de tipoDeProducto.
   */
   tipoDeProducto:string;
   /**
    * El valor de estadoFisico.
   */
   estadoFisico:string;
   /**
    * El valor de fraccionArancelaria.
   */
   fraccionArancelaria:string;
   /**
    * El valor de descripcionFraccion.
   */
   descripcionFraccion:string;
   /**
    * El valor de cantidadUMT.
   */
   cantidadUMT:string;
   /**
    * El valor de UMT.
   */
   UMT:string;
   /**
    * El valor de cantidadUMC.
   */
   cantidadUMC:string;
   /**
    * El valor de UMC.
   */
   UMC:string;
   /**
    * El valor de presentacion.
   */
   presentacion:string;
   /**
    * El valor de numeroRegistro.
   */
   numeroRegistro:string;
   /**
    * El valor de fechaCaducidad.
   */
   fechaCaducidad:string;
   /**
    * El valor de cumplimiento.
   */
   cumplimiento:string;
   /**
    * El valor de rfc.
   */
   rfc:string;
   /**
    * El valor de nombre.
   */
   nombre:string;
   /**
    * El valor de apellidoPaterno.
   */
   apellidoPaterno:string;
   /**
    * El valor de apellidoMaterno.
   */
   apellidoMaterno:string;
   /**
    * El valor de especifiqueTipoDeProducto.
   */
   especifiqueTipoDeProducto:string;
   /**
    * El valor de especifiqueEstado.
   */
   especifiqueEstado:string;
        
destinatarioFinalTablaDatos: Destinatario[];

  /**
   * Lista de proveedores relacionados con el trámite.
   */
  proveedorTablaDatos: Proveedor[];
    /**
     * Lista de facturadores relacionados con el trámite.
     */
    facturadorTablaDatos: Facturador[];
     /**
       * Configuración de datos de la tabla SCIAN.
       */
      scianConfigDatos: TablaScianConfig[];
        tablaMercanciasConfigDatos: TablaMercanciasDatos[];
    
    
  /**
   * Lista de destinatarios finales relacionados con el trámite.
   */
  destinatarioFinalTablaModificaDatos: Destinatario[];
    opcionesColapsableState: boolean;
    /** Datos de cancelación legacy */
  datos: Cancelacion[];
  /** ID del tipo de trámite */
  idTipoTramite: number;

   claveEntidadFederativa: string,

  /** Motivo de cancelación */
  motivoCancelacion: string;
  /** Identificador de la solicitud, puede ser nulo si aún no se ha creado. */
  idSolicitud: number | null;

   /**
     * Estado del formulario de pago de derechos.
     */
    pagoDerechos: PagoDerechosFormState;
    
  /**
   * Pestaña seleccionada actualmente (opcional).
   */
  tabSeleccionado?: number;

}

export function createInitialState(): Solicitud260215State {
  return {
     /**
   * Lista de proveedores relacionados con el trámite.
   */
    /**
   * Lista de facturadores relacionados con el trámite.
   */
   /**
   * Datos seleccionados de opciones en la tabla.
   * @type {TablaOpcionConfig[]}
   */
  seleccionadoopcionDatos:[],

  /**
   * Datos seleccionados de SCIAN en la tabla.
   * @type {TablaScianConfig[]}
   */
  seleccionadoScianDatos:[],

  /**
   * Datos seleccionados de mercancías en la tabla.
   * @type {TablaMercanciasDatos[]}
   */
  seleccionadoTablaMercanciasDatos:[],

    opcionesColapsableState:false,
    datosSolicitudFormState: {} as DatosSolicitudFormState,
    tablaMercanciasConfigDatos: [],
    scianConfigDatos: [],
    opcionConfigDatos: [],
    destinatarioFinalTablaModificaDatos:[],
    fabricanteTablaModificaDatos:[],
    facturadorTablaModificaDatos: [],
    proveedorTablaModificaDatos: [],
    fabricanteTablaDatos: [],
    facturadorTablaDatos: [],
    /**
     * claveDeReferencia
     * @type {string}
     */
    claveDeReferencia: '',
    /**
     * Inicialización de pagoDerechos
     */
   pagoDerechos: {
      claveReferencia: '',
      cadenaDependencia: '',
      estado: '',
      llavePago: '',
      fechaPago: '',
      importePago: '',
    },

    /**
     * cadenaDependencia
     * @type {string}
     * */
    cadenaDependencia: '',

    /**
     * banco
     * @type {string}
     */
    banco: '',

    /**
     * llaveDePago
     * @type {string}
     */
    llaveDePago: '',

    /**
     * fechaPago
     * @type {string}
     */
    fechaPago: '',

    /**
     * importePago
     * @type {string}
     */
    importePago: '',

      /**
         * El valor de rfcDel.
         */
      rfcDel: '',
      /**
       * El valor de denominacion.
       */
      denominacion: '',
      /**
      * El valor de correo.
      */
      correo:'',
      /**
       * El valor de codigoPostal.
       */
      codigoPostal:'',
      /**
       * El valor de estado.
       */
      estado:'',
      /**
       * El valor de muncipio.
       */
      muncipio:'',
      /**
       * El valor de localidad.
       */
      localidad:'',
      /**
       * El valor de colonia.
      */
      colonia:'',
      /**
       * El valor de calle.
      */
      calle:'',   
      /**
       * El valor de lada.
      */
      lada:'',
      /**
       * El valor de telefono.
      */
      telefono:'', 
      /**
       * El valor de claveScianModal.
      */
      claveScianModal: '', 
      /**
       * El valor de claveDescripcionModal.
      */
      claveDescripcionModal: '',
      /**
       * El valor de avisoCheckbox.
      */
      avisoCheckbox: false,
      /**
       * El valor de licenciaSanitaria.
      */
      licenciaSanitaria: '',
      /**
       * El valor de regimen.
      */
      regimen: '',
      /**
       * El valor de aduanasEntradas.
      */
      aduanasEntradas: '',
      /**
       * El valor de clasificacion.
      */
      clasificacion: '',
      /**
       * El valor de especificar.
      */
      especificar: '',
      /**
       * El valor de denominacionEspecifica.
      */
      denominacionEspecifica: '',
      /**
       * El valor de denominacionDistintiva.
      */
      denominacionDistintiva: '',
      /**
       * El valor de denominacionComun.
      */
      denominacionComun: '',
      /**
       * El valor de tipoDeProducto.
      */
      tipoDeProducto: '',
      /**
       * El valor de estadoFisico.
      */
      estadoFisico: '',
      /**
       * El valor de fraccionArancelaria.
      */
      fraccionArancelaria: '',
      /**
       * El valor de descripcionFraccion.
      */
      descripcionFraccion: '',
      /**
       * El valor de cantidadUMT.
      */
      cantidadUMT: '',
      /**
       * El valor de UMT.
      */
      UMT: '',
      /**
       * El valor de cantidadUMC.
      */
      cantidadUMC: '',
      /**
       * El valor de UMC.
      */
      UMC: '',
      /**
       * El valor de presentacion.
      */
      presentacion: '',
      /**
       * El valor de numeroRegistro.
      */
      numeroRegistro: '',
      /**
       * El valor de fechaCaducidad.
      */
      fechaCaducidad: '',
      /**
       * El valor de cumplimiento.
      */
      cumplimiento: '',
      /**
       * El valor de representante.
      */
      rfc: '',
      /**
       * El valor de nombre.
      */
      nombre: '',
      /**
       * El valor de apellidoPaterno.
      */
      apellidoPaterno: '',
      /**
       * El valor de apellidoMaterno.
      */
      apellidoMaterno: '',

        /**
         * El valor de especifiqueTipoDeProducto.
         */
        especifiqueTipoDeProducto: '',
        /**
         * El valor de especifiqueEstado.
         */
        especifiqueEstado: '',
          /**
           * Lista de destinatarios finales relacionados con el trámite.
           */
          destinatarioFinalTablaDatos: [],
          
            /**
             * Lista de proveedores relacionados con el trámite.
             */
            proveedorTablaDatos: [],
              datos: [],
    idTipoTramite: 260214,
    motivoCancelacion: '',
    idSolicitud: 0,
    claveEntidadFederativa: '09',
      tabSeleccionado: 1,

  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite260215', resettable: true })
export class Tramite260215Store extends Store<Solicitud260215State> {
  /**
   * Crea una instancia de Tramite260215Store.
   * @constructor
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * @method updateTabSeleccionado
   * @description Actualiza el índice de la pestaña seleccionada.
   * @param {number} tabSeleccionado - Nuevo índice de la pestaña.
   */
  public updateTabSeleccionado(tabSeleccionado: number): void {
    this.update((state) => ({
      ...state,
      tabSeleccionado: tabSeleccionado,
    }));
  }

  /**
   * @method setIdSolicitud
   * @description Actualiza el ID de la solicitud en el estado.
   * @param {number} idSolicitud - Nuevo ID de la solicitud.
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud: idSolicitud,
    }));
  }

   /**
   * @method updatePagoDerechos
   * @description Actualiza el estado del formulario de pago de derechos.
   * @param {PagoDerechosFormState} nuevoPagoDerechos - Nuevo estado del formulario.
   */
  public updatePagoDerechos(nuevoPagoDerechos: PagoDerechosFormState): void {
    this.update((state) => ({
      ...state,
      pagoDerechos: nuevoPagoDerechos,
    }));
  }

  /**
   * Guarda la clave de referencia en el estado.
   * @param claveDeReferencia
   */
  public setClaveDeReferencia(claveDeReferencia: string): void {
    this.update((state) => ({
      ...state,
      claveDeReferencia,
    }));
  }

/**
 * Guarda la cadena de dependencia en el estado.
 * @param cadenaDependencia
 * @returns void
 */
public setCadenaDependencia(cadenaDependencia: string): void {
    this.update((state) => ({
        ...state,
        cadenaDependencia,
    }));
}

/**
 * Guarda el banco en el estado.
 * @param banco
 * @returns void
 */
public setBanco(banco: string): void {
    this.update((state) => ({
        ...state,
        banco,
    }));
}

/**
 * Guarda la llave de pago en el estado.
 * @param llaveDePago
 * @returns void
 */
public setllaveDePago(llaveDePago: string): void {
    this.update((state) => ({
        ...state,
        llaveDePago,
    }));
}

/**
 * Guarda la fecha de pago en el estado.
 * @param fechaPago
 * @returns void
 */
public setFechaPago(fechaPago: string): void {
    this.update((state) => ({
        ...state,
        fechaPago,
    }));
}

/**
 * Guarda el importe de pago en el estado.
 * @param importePago
 * @returns void
 */
public setImportePago(importePago: string): void {
    this.update((state) => ({
        ...state,
        importePago,
    }));
}

/**
 * Establece el estado de rfcDel.
 * @param rfcDel - El valor de rfcDel.
 * @returns void
 */
public setRfcDel(rfcDel: string): void {
    this.update((state) => ({
        ...state,
        rfcDel,
    }));
}

/**
 * Establece el estado de denominacion.
 * @param denominacion - El valor de denominacion.
 * @returns void
 */
public setDenominacion(denominacion: string): void {
    this.update((state) => ({
        ...state,
        denominacion,
    }));
}

/**
 * Establece el estado de correo.
 * @param correo - El valor de correo.
 * @returns void
 */
public setCorreo(correo: string): void {
    this.update((state) => ({
        ...state,
        correo,
    }));
}

/**
 * Establece el estado de codigoPostal.
 * @param codigoPostal - El valor de codigoPostal.
 * @returns void
 */
public setCodigoPostal(codigoPostal: string): void {
    this.update((state) => ({
        ...state,
        codigoPostal,
    }));
}

/**
 * Establece el estado de estado.
 * @param estado - El valor de estado.
 * @returns void
 */
public setEstado(estado: string): void {
    this.update((state) => ({
        ...state,
        estado,
    }));
}

/**
 * Establece el muncipio de muncipio.
 * @param muncipio - El valor de muncipio.
 * @returns void
 */
public setMuncipio(muncipio: string): void {
    this.update((state) => ({
        ...state,
        muncipio,
    }));
}

/**
 * Establece el localidad de localidad.
 * @param localidad - El valor de localidad.
 * @returns void
 */
public setLocalidad(localidad: string): void {
    this.update((state) => ({
        ...state,
        localidad,
    }));
}

/**
 * Establece el estado de colonia.
 * @param colonia - El valor de colonia.
 * @returns void
 */
public setColonia(colonia: string): void {
    this.update((state) => ({
        ...state,
        colonia,
    }));
}

/**
 * Establece el estado de calle.
 * @param calle - El valor de calle.
 * @returns void
 */
public setCalle(calle: string): void {
    this.update((state) => ({
        ...state,
        calle,
    }));
}

/**
 * Establece el estado de lada.
 * @param lada - El valor de lada.
 * @returns void
 */
public setLada(lada: string): void {
    this.update((state) => ({
        ...state,
        lada,
    }));
}

/**
 * Establece el estado de telefono.
 * @param telefono - El valor de telefono.
 * @returns void
 */
public setTelefono(telefono: string): void {
    this.update((state) => ({
        ...state,
        telefono,
    }));
}

/**
 * Establece el estado de claveScianModal.
 * @param claveScianModal - El valor de claveScianModal.
 * @returns void
 */
public setClaveScianModal(claveScianModal: string): void {
    this.update((state) => ({
        ...state,
        claveScianModal,
    }));
}

/**
 * Establece el estado de claveDescripcionModal.
 * @param claveDescripcionModal - El valor de claveDescripcionModal.
 * @returns void
 */
public setClaveDescripcionModal(claveDescripcionModal: string): void {
    this.update((state) => ({
        ...state,
        claveDescripcionModal,
    }));
}

/**
 * Establece el estado de avisoCheckbox.
 * @param avisoCheckbox - El valor de avisoCheckbox.
 * @returns void
 */
public setAvisoCheckbox(avisoCheckbox: boolean): void {
    this.update((state) => ({
        ...state,
        avisoCheckbox,
    }));
}

/**
 * Establece el estado de licenciaSanitaria.
 * @param licenciaSanitaria - El valor de licenciaSanitaria.
 * @returns void
 */
public setLicenciaSanitaria(licenciaSanitaria: string): void {
    this.update((state) => ({
        ...state,
        licenciaSanitaria,
    }));
}

/**
 * Establece el estado de regimen.
 * @param regimen - El valor de regimen.
 * @returns void
 */
public setRegimen(regimen: string): void {
    this.update((state) => ({
        ...state,
        regimen,
    }));
}

/**
 * Establece el estado de aduanasEntradas.
 * @param aduanasEntradas - El valor de aduanasEntradas.
 * @returns void
 */
public setAduanasEntradas(aduanasEntradas: string): void {
    this.update((state) => ({
        ...state,
        aduanasEntradas,
    }));
}

/**
 * Establece el estado de clasificacion.
 * @param clasificacion - El valor de clasificacion.
 * @returns void
 */
public setClasificacion(clasificacion: string): void {
    this.update((state) => ({
        ...state,
        clasificacion,
    }));
}

/**
 * Establece el estado de especificar.
 * @param especificar - El valor de especificar.
 * @returns void
 */
public setEspecificar(especificar: string): void {
    this.update((state) => ({
        ...state,
        especificar,
    }));
}

/**
 * Establece el estado de denominacionEspecifica.
 * @param denominacionEspecifica - El valor de denominacionEspecifica.
 * @returns void
 */
public setDenominacionEspecifica(denominacionEspecifica: string): void {
    this.update((state) => ({
        ...state,
        denominacionEspecifica,
    }));
}

/**
 * Establece el estado de denominacionDistintiva.
 * @param denominacionDistintiva - El valor de denominacionDistintiva.
 * @returns void
 */
public setDenominacionDistintiva(denominacionDistintiva: string): void {
    this.update((state) => ({
        ...state,
        denominacionDistintiva,
    }));
}

/**
 * Establece el estado de denominacionComun.
 * @param denominacionComun - El valor de denominacionComun.
 * @returns void
 */
public setDenominacionComun(denominacionComun: string): void {
    this.update((state) => ({
        ...state,
        denominacionComun,
    }));
}

/**
 * Establece el estado de tipoDeProducto.
 * @param tipoDeProducto - El valor de tipoDeProducto.
 * @returns void
 */
public setTipoDeProducto(tipoDeProducto: string): void {
    this.update((state) => ({
        ...state,
        tipoDeProducto,
    }));
}

/**
 * Establece el estado de estadoFisico.
 * @param estadoFisico - El valor de estadoFisico.
 * @returns void
 */
public setEstadoFisico(estadoFisico: string): void {
    this.update((state) => ({
        ...state,
        estadoFisico,
    }));
}

/**
 * Establece el estado de fraccionArancelaria.
 * @param fraccionArancelaria - El valor de fraccionArancelaria.
 * @returns void
 */
public setFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
        ...state,
        fraccionArancelaria,
    }));
}

/**
 * Establece el estado de descripcionFraccion.
 * @param descripcionFraccion - El valor de descripcionFraccion.
 * @returns void
 */
public setDescripcionFraccion(descripcionFraccion: string): void {
    this.update((state) => ({
        ...state,
        descripcionFraccion,
    }));
}

/**
 * Establece el estado de cantidadUMT.
 * @param cantidadUMT - El valor de cantidadUMT.
 * @returns void
 */
public setCantidadUMT(cantidadUMT: string): void {
    this.update((state) => ({
        ...state,
        cantidadUMT,
    }));
}

/**
 * Establece el estado de UMT.
 * @param UMT - El valor de UMT.
 * @returns void
 */
public setUMT(UMT: string): void {
    this.update((state) => ({
        ...state,
        UMT,
    }));
}

/**
 * Establece el estado de cantidadUMC.
 * @param cantidadUMC - El valor de cantidadUMC.
 * @returns void
 */
public setCantidadUMC(cantidadUMC: string): void {
    this.update((state) => ({
        ...state,
        cantidadUMC,
    }));
}

/**
 * Establece el estado de UMC.
 * @param UMC - El valor de UMC.
 * @returns void
 */
public setUMC(UMC: string): void {
    this.update((state) => ({
        ...state,
        UMC,
    }));
}

/**
 * Establece el estado de presentacion.
 * @param presentacion - El valor de presentacion.
 * @returns void
 */
public setPresentacion(presentacion: string): void {
    this.update((state) => ({
        ...state,
        presentacion,
    }));
}

/**
 * Establece el estado de numeroRegistro.
 * @param numeroRegistro - El valor de numeroRegistro.
 * @returns void
 */
public setNumeroRegistro(numeroRegistro: string): void {
    this.update((state) => ({
        ...state,
        numeroRegistro,
    }));
}

/**
 * Establece el estado de fechaCaducidad.
 * @param fechaCaducidad - El valor de fechaCaducidad.
 * @returns void
 */
public setFechaCaducidad(fechaCaducidad: string): void {
    this.update((state) => ({
        ...state,
        fechaCaducidad,
    }));
}

/**
 * Establece el estado de cumplimiento.
 * @param cumplimiento - El valor de cumplimiento.
 * @returns void
 */
public setCumplimiento(cumplimiento: string): void {
    this.update((state) => ({
        ...state,
        cumplimiento,
    }));
}

/**
 * Establece el estado de rfc.
 * @param rfc - El valor de rfc.
 * @returns void
 */
public setRfc(rfc: string): void {
    this.update((state) => ({
        ...state,
        rfc,
    }));
}

/**
 * Establece el estado de nombre.
 * @param nombre - El valor de nombre.
 * @returns void
 */
public setNombre(nombre: string): void {
    this.update((state) => ({
        ...state,
        nombre,
    }));
}

/**
 * Establece el estado de apellidoPaterno.
 * @param apellidoPaterno - El valor de apellidoPaterno.
 * @returns void
 */
public setApellidoPaterno(apellidoPaterno: string): void {
    this.update((state) => ({
        ...state,
        apellidoPaterno,
    }));
}
  /**
   * Establece el estado de apellidoMaterno.
   * @param apellidoMaterno - El valor de apellidoMaterno.
   */
  public setApellidoMaterno(apellidoMaterno: string) : void {
      this.update((state) => ({
          ...state,
          apellidoMaterno,
      }));
  }

  /**
   * Establece el estado de especifiqueTipoDeProducto.
   * @param especifiqueTipoDeProducto - El valor de especifiqueTipoDeProducto.
   */
  public setEspecifiqueTipoDeProducto(especifiqueTipoDeProducto: string): void {
      this.update((state) => ({
          ...state,
          especifiqueTipoDeProducto,
      }));
  }

  /**
   * Establece el estado de especifiqueEstado.
   * @param especifiqueEstado - El valor de especifiqueEstado.
   */
  public setEspecifiqueEstado(especifiqueEstado: string): void {
      this.update((state) => ({
          ...state,
          especifiqueEstado,
      }));
  }

  public updateFabricanteTablaDatos(newFabricantes: Fabricante[]): void {
    this.update((state) => {
      const ACTUALIZADA = [...state.fabricanteTablaDatos];

      newFabricantes.forEach((nuevo) => {
        if (!nuevo?.id) {
          nuevo.id =
            ACTUALIZADA.length > 0
              ? Math.max(...ACTUALIZADA.map((f) => f.id ?? 0)) + 1
              : 1;
        }

        const INDICE = ACTUALIZADA.findIndex((f) => f.id === nuevo.id);

        if (INDICE > -1) {
          ACTUALIZADA[INDICE] = { ...ACTUALIZADA[INDICE], ...nuevo };
        } else {
          ACTUALIZADA.push(nuevo);
        }
      });

      return {
        ...state,
        fabricanteTablaDatos: ACTUALIZADA,
      };
    });
  }
public updateDestinatarioFinalTablaDatos(
    newDestinatarios: Destinatario[]
  ): void {
    this.update((state) => {
      const ACTUALIZADA = [...state.destinatarioFinalTablaDatos];

      newDestinatarios.forEach((nuevo) => {
        if (!nuevo?.id) {
          nuevo.id =
            ACTUALIZADA.length > 0
              ? Math.max(...ACTUALIZADA.map((f) => f.id ?? 0)) + 1
              : 1;
        }

        const INDICE = ACTUALIZADA.findIndex((f) => f.id === nuevo.id);

        if (INDICE > -1) {
          ACTUALIZADA[INDICE] = { ...ACTUALIZADA[INDICE], ...nuevo };
        } else {
          ACTUALIZADA.push(nuevo);
        }
      });

      return {
        ...state,
        destinatarioFinalTablaDatos: ACTUALIZADA,
      };
    });
  }
    public updateProveedorTablaDatos(newProveedores: Proveedor[]): void {
    this.update((state) => {
      const ACTUALIZADA = [...state.proveedorTablaDatos];

      newProveedores.forEach((nuevo) => {
        if (!nuevo?.id) {
          nuevo.id =
            ACTUALIZADA.length > 0
              ? Math.max(...ACTUALIZADA.map((f) => f.id ?? 0)) + 1
              : 1;
        }

        const INDICE = ACTUALIZADA.findIndex((f) => f.id === nuevo.id);

        if (INDICE > -1) {
          ACTUALIZADA[INDICE] = { ...ACTUALIZADA[INDICE], ...nuevo };
        } else {
          ACTUALIZADA.push(nuevo);
        }
      });

      return {
        ...state,
        proveedorTablaDatos: ACTUALIZADA,
      };
    });
  }
    public updateFacturadorTablaDatos(newFacturadores: Facturador[]): void {
    this.update((state) => {
      const ACTUALIZADA = [...state.facturadorTablaDatos];

      newFacturadores.forEach((nuevo) => {
        if (!nuevo?.id) {
          nuevo.id =
            ACTUALIZADA.length > 0
              ? Math.max(...ACTUALIZADA.map((f) => f.id ?? 0)) + 1
              : 1;
        }

        const INDICE = ACTUALIZADA.findIndex((f) => f.id === nuevo.id);

        if (INDICE > -1) {
          ACTUALIZADA[INDICE] = { ...ACTUALIZADA[INDICE], ...nuevo };
        } else {
          ACTUALIZADA.push(nuevo);
        }
      });

      return {
        ...state,
        facturadorTablaDatos: ACTUALIZADA,
      };
    });
  }
    public fabricanteTablaModificaDatos(tabSeleccionado: Fabricante[]): void {
    this.update((state) => ({
      ...state,
      fabricanteTablaModificaDatos: tabSeleccionado,
    }));
  }
    public destinatarioFinalTablaModificaDatos(
      tabSeleccionado: Destinatario[]
    ): void {
      this.update((state) => ({
        ...state,
        destinatarioFinalTablaModificaDatos: tabSeleccionado,
      }));
    }
     public proveedorTablaModificaDatos(tabSeleccionado: Proveedor[]): void {
    this.update((state) => ({
      ...state,
      proveedorTablaModificaDatos: tabSeleccionado,
    }));
  }
    public facturadorTablaModificaDatos(tabSeleccionado: Facturador[]): void {
      this.update((state) => ({
        ...state,
        facturadorTablaModificaDatos: tabSeleccionado,
      }));
    }
      public updateOpcionConfigDatos(opcionConfigDatos: TablaOpcionConfig[]): void {
    this.update((state) => ({
      ...state,
      opcionConfigDatos,
    }));
  }
    public updateScianConfigDatos(scianConfigDatos: TablaScianConfig[]): void {
    this.update((state) => ({
      ...state,
      scianConfigDatos,
    }));
  }
    public updateTablaMercanciasConfigDatos(
    tablaMercanciasConfigDatos: TablaMercanciasDatos[]
  ): void {
    this.update((state) => ({
      ...state,
      tablaMercanciasConfigDatos: tablaMercanciasConfigDatos,
      seleccionadoTablaMercanciasDatos: [],
    }));
  }
   public updateDatosSolicitudFormState(
      datosSolicitudFormState: DatosSolicitudFormState
    ): void {
      this.update((state) => ({
        ...state,
        datosSolicitudFormState,
      }));
    }

}