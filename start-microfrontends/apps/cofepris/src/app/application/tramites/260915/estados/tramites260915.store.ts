import {Destinatario, Fabricante, Facturador, Proveedor } from '../../../shared/models/terceros-relacionados.model';
import { FilaData, FilaData2, ListaClave } from '../models/fila-modal';
import { Store, StoreConfig } from '@datorama/akita';
import { DatosSolicitudFormState } from '../../../shared/models/datos-solicitud.model';
import { PagoDerechosFormState } from '../../../shared/models/terceros-relacionados.model';
import { Injectable } from '@angular/core';
/**
 * Interfaz que define el estado de la solicitud 260915.
 * Contiene todas las propiedades necesarias para gestionar los datos del trámite.
 */
export interface Solicitud260915State {
  /**
         * Lista de fabricantes en la tabla de datos.
         */
        fabricanteTablaDatos: Fabricante[];
        /**
         * Lista de proveedores en la tabla de datos.
         */
        proveedorTablaDatos: Proveedor[];
         /**
         * Lista de destinatarios finales en la tabla de datos.
         */
        destinatarioFinalTablaDatos: Destinatario[];
       /**
         * Lista de facturadores en la tabla de datos.
         */
        facturadorTablaDatos: Facturador[];
  /** Clave de referencia del trámite */
  clavedereferencia: string;
  /** Cadena de la dependencia asociada al trámite */
  cadenadeladependencia: string;
  /** Banco relacionado con el pago */
  banco: string;
  /** Llave de pago del trámite */
  llavedepago: string;
  /** Fecha en la que se realizó el pago */
  fechadepago: string;
  /** Importe del pago realizado */
  importedepago: string;
  /** Tipo de persona (física o moral) */
  tipoPersona: string;
  /** Nombre de la persona o entidad */
  nombre: string;
  /** Primer apellido de la persona */
  primerApellido: string;
  /** Segundo apellido de la persona */
  segundoApellido: string;
  /** RFC del responsable sanitario */
  rfcdelResponsableSanitario: string;
  /** Denominación o razón social */
  denominacion: string;
  /** País de residencia */
  pais: string;
  /** Domicilio de la persona o entidad */
  domicilio: string;
  /** Estado de residencia */
  estado: string;
  /** Código postal del domicilio */
  codigopostal: string;
  /** Calle del domicilio */
  calle: string;
  /** Número exterior del domicilio */
  numeroExterior: string;
  /** Número interior del domicilio */
  numeroInterior: string;
  /** Lada telefónica */
  lada: number;
  /** Teléfono de contacto */
  telefono: string;
  /** Correo electrónico de contacto */
  correoElectronico: string;
  /** Justificación del trámite */
  justification: string;
  /** Municipio o alcaldía de residencia */
  municipoyalcaldia: string;
  /** Localidad de residencia */
  localidad: string;
  /** Colonia de residencia */
  colonia: string;
  /** Indica si se cuenta con aviso de funcionamiento */
  avisoDeFuncionamiento: boolean;
  /** Licencia sanitaria asociada */
  licenciaSanitaria: string;
  /** Régimen al que se destinarán las mercancías */
  regimenalque: string;
  /** Aduana relacionada con el trámite */
  aduana: string;
  /** Registro Federal de Contribuyentes (RFC) */
  rfc: string;
  /** Razón social legal */
  legalRazonSocial: string;
  /** Apellido paterno de la persona */
  apellidoPaterno: string;
  /** Apellido materno de la persona */
  apellidoMaterno: string;
  /** Datos de las mercancías */
  mercanciasDatos: FilaData2[];
  /** Configuración de las columnas de la tabla */
  configuracionColumnasoli: FilaData[];
  /** Lista de claves asociadas */
  listaClave: ListaClave[];
  /** Clave de los lotes */
  claveDeLosLotes: string;
  /** Fecha de fabricación de las mercancías */
  fechaDeFabricacion: string;
  /** Fecha de caducidad de las mercancías */
  fechaDeCaducidad: string;
  /** Descripción de la fracción arancelaria */
  descripcionFraccionArancelaria: string;
  /** Cantidad en la unidad de medida de tarifa (UMT) */
  cantidadUMT: string;
  /** Unidad de medida de tarifa (UMT) */
  umt: string;
  /** Cantidad en la unidad de medida de comercialización (UMC) */
  cantidadUMC: string;
  /** Unidad de medida de comercialización (UMC) */
  umc: string;
  /** Tipo de producto */
  tipoProducto: string;
  /** Clasificación de los productos */
  clasificaionProductos: string;
  /** Producto especificado */
  especificarProducto: string;
  /** Nombre específico del producto */
  nombreProductoEspecifico: string;
  /** Marca del producto */
  denominacionDistintiva: string;
  /** Fracción arancelaria del producto */
  fraccionArancelaria: string;
  /** Denominación del nombre del producto. */
  denominacionNombre: string;
  /** Estado físico del producto. */
  estadoFisico: string;
  /** Presentación farmacéutica del producto. */
  presentacionFarmaceutica: string;
  /** Tipo Operacion del producto. */
  tipoOperacion: string;
  /** Notificador de los datos */
  LosDatosNotifier: string;
  /** Indica si existen manifiestos */
  maniFestos: boolean;

  tableData: FilaData[];
  datosSolicitudFormState?: DatosSolicitudFormState;

  idSolicitud: number;
 /**
   * Estado del formulario de pago de derechos.
   */
  pagoDerechos: PagoDerechosFormState;

 /**
   * Identificador de la pestaña seleccionada (opcional).
   */
  tabSeleccionado?: number;
  }

/**
 * Función para crear el estado inicial de la solicitud 260915.
 * Retorna un objeto con valores predeterminados para todas las propiedades.
 *
 * @returns {Solicitud260915State} Estado inicial del trámite 260915.
 */
export function createInitialSolicitudState(): Solicitud260915State {
  return {

    /** Clave de referencia del trámite */
    clavedereferencia: '',
    /** Cadena de la dependencia asociada al trámite */
    cadenadeladependencia: '',
    /** Banco relacionado con el pago */
    banco: '',
    /** Llave de pago del trámite */
    llavedepago: '',
    /** Fecha en la que se realizó el pago */
    fechadepago: '',
    /** Importe del pago realizado */
    importedepago: '',
    /** Tipo de persona (física o moral) */
    tipoPersona: '',
    /** Nombre de la persona o entidad */
    nombre: '',
    /** Primer apellido de la persona */
    primerApellido: '',
    /** Segundo apellido de la persona */
    segundoApellido: '',
    /** RFC del responsable sanitario */
    rfcdelResponsableSanitario: '',
    /** Denominación o razón social */
    denominacion: '',
    /** País de residencia */
    pais: '',
    /** Domicilio de la persona o entidad */
    domicilio: '',
    /** Estado de residencia */
    estado: '',
    /** Código postal del domicilio */
    codigopostal: '',
    /** Calle del domicilio */
    calle: '',
    /** Número exterior del domicilio */
    numeroExterior: '',
    /** Número interior del domicilio */
    numeroInterior: '',
    /** Lada telefónica */
    lada: 0,
    /** Teléfono de contacto */
    telefono: '',
    /** Correo electrónico de contacto */
    correoElectronico: '',
    /** Justificación del trámite */
    justification: '',
    /** Municipio o alcaldía de residencia */
    municipoyalcaldia: '',
    /** Localidad de residencia */
    localidad: '',
    /** Colonia de residencia */
    colonia: '',
    /** Indica si se cuenta con aviso de funcionamiento */
    avisoDeFuncionamiento: false,
    /** Licencia sanitaria asociada */
    licenciaSanitaria: '',
    /** Régimen al que se destinarán las mercancías */
    regimenalque: '',
    /** Aduana relacionada con el trámite */
    aduana: '',
    /** Registro Federal de Contribuyentes (RFC) */
    rfc: '',
    /** Razón social legal */
    legalRazonSocial: '',
    /** Apellido paterno de la persona */
    apellidoPaterno: '',
    /** Apellido materno de la persona */
    apellidoMaterno: '',
    /** Datos de las mercancías */
    mercanciasDatos: [],
    /** Configuración de las columnas de la tabla */
    configuracionColumnasoli: [],
    /** Lista de claves asociadas */
    listaClave: [],
    /** Clave de los lotes */
    claveDeLosLotes: '',
    /** Fecha de fabricación de las mercancías */
    fechaDeFabricacion: '',
    /** Fecha de caducidad de las mercancías */
    fechaDeCaducidad: '',
    /** Descripción de la fracción arancelaria */
    descripcionFraccionArancelaria: '',
    /** Cantidad en la unidad de medida de tarifa (UMT) */
    cantidadUMT: '',
    /** Unidad de medida de tarifa (UMT) */
    umt: '',
    /** Cantidad en la unidad de medida de comercialización (UMC) */
    cantidadUMC: '',
    /** Unidad de medida de comercialización (UMC) */
    umc: '',
    /** Tipo de producto */
    tipoProducto: '',
    /** Clasificación de los productos */
    clasificaionProductos: '',
    /** Producto especificado */
    especificarProducto: '',
    /** Nombre específico del producto */
    nombreProductoEspecifico: '',
    /** Marca del producto */
    denominacionDistintiva: '',
    /** Fracción arancelaria del producto */
    fraccionArancelaria: '',
    /** Denominación del nombre del producto. */
    denominacionNombre: '',
    /** Estado físico del producto. */
    estadoFisico: '',
    /** Presentación farmacéutica del producto. */
    presentacionFarmaceutica: '',
    /** Tipo Operacion del producto. */
    tipoOperacion: '',
    /** Notificador de los datos */
    LosDatosNotifier: '',
    /** Indica si existen manifiestos */
    maniFestos: false,
    
    tableData: [],
    
   
    fabricanteTablaDatos: [],
    proveedorTablaDatos: [],
    destinatarioFinalTablaDatos: [],
    facturadorTablaDatos: [],

    datosSolicitudFormState: {
      rfcSanitario: '',
      denominacionRazon: '',
      correoElectronico: '',
      codigoPostal: '',
      estado: '',
      municipioAlcaldia: '',
      localidad: '',
      colonia: '',
      calle: '',
      lada: '',
      telefono: '',
      aviso: '',
      licenciaSanitaria: '',
      regimen: '',
      adunasDeEntradas: '',
      aeropuerto: false,
      publico: '',
      representanteRfc: '',
      representanteNombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
  },
  idSolicitud: 0,
  pagoDerechos: {
    claveReferencia: '',
    cadenaDependencia: '',
    estado: '',
    llavePago: '',
    fechaPago: '',
    importePago: '',
  },
  tabSeleccionado: 1,

  };
}

/**
 * Servicio que gestiona el estado de la solicitud 260915.
 * Utiliza Akita para manejar el estado de manera reactiva.
 * Permite actualizar, consultar y resetear el estado del trámite.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'Solicitud260915State', resettable: true })
export class Solicitud260915Store extends Store<Solicitud260915State> {
  /**
   * Constructor del store.
   * Inicializa el store padre con el estado inicial creado
   * por la función createInitialSolicitudState().
   */
  constructor() {
    super(createInitialSolicitudState());
  }

  /**
   * Método que actualiza parcialmente el estado del trámite 260915.
   * Permite actualizar uno o varios campos del estado sin afectar
   * los campos no especificados. Utiliza el patrón de spread operator
   * para mantener la inmutabilidad del estado.
   *
   * @param {Partial<Solicitud260915State>} valores - Objeto con los campos
   *        a actualizar. Puede contener cualquier combinación de propiedades
   *        del estado, no es necesario proporcionar todos los campos.
   *
   * @example
   * // Actualizar solo el nombre y correo
   * store.setTramite260915State({
   *   nombre: 'Juan',
   *   correoElectronico: 'juan@email.com'
   * });
   *
   * @example
   * // Actualizar información de pago
   * store.setTramite260915State({
   *   fechadepago: '2024-01-15',
   *   importedepago: '1500.00',
   *   llavedepago: 'LP123456'
   * });
   */
  setTramite260915State(valores: Partial<Solicitud260915State>): void {
    this.update((state => ({
      ...state,
      ...valores,
    })));
  }

       /**
     * Actualiza la tabla de fabricantes.
     * @param {Fabricante[]} newFabricantes - Nuevos fabricantes a agregar
     */
    public updateFabricanteTablaDatos(newFabricantes: Fabricante[]): void {
      this.update((state) => ({
        ...state,
        fabricanteTablaDatos: [ ...newFabricantes],
      }));
    }
  
     /**
     * @method fabricanteTablaModificaDatos
     * @description
     * Actualiza los datos seleccionados en la tabla de fabricantes en el estado del trámite.
     * Sustituye el arreglo actual por el nuevo conjunto de fabricantes.
     *
     * @param {Fabricante[]} tabSeleccionado - Lista de fabricantes seleccionados que se asignarán al estado.
     * @returns {void} Este método no retorna ningún valor.
     */
    public fabricanteTablaModificaDatos(tabSeleccionado: Fabricante[]): void {
      this.update((state) => ({
        ...state,
        fabricanteTablaModificaDatos: tabSeleccionado,
      }));
    }
  
  
      /**
     * Actualiza la tabla de proveedores.
     * @param {Proveedor[]} newProveedores - Nuevos proveedores a agregar
     */
    public updateProveedorTablaDatos(newProveedores: Proveedor[]): void {
      this.update((state) => ({
        ...state,
        proveedorTablaDatos: [...newProveedores],
      }));
    }
    /**
     * Actualiza la tabla de destinatarios finales.
     * @param {Destinatario[]} newDestinatarios - Nuevos destinatarios a agregar
     */
    public updateDestinatarioFinalTablaDatos(
      newDestinatarios: Destinatario[]
    ): void {
      this.update((state) => ({
        ...state,
        destinatarioFinalTablaDatos: [
          
          ...newDestinatarios,
        ],
      }));
    }
  
     /**
     * Actualiza la tabla de facturadores.
     * @param {Facturador[]} newFacturadores - Nuevos facturadores a agregar
     */
    public updateFacturadorTablaDatos(newFacturadores: Facturador[]): void {
      this.update((state) => ({
        ...state,
        facturadorTablaDatos: [...newFacturadores],
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

       /**
   * @method setIdSolicitud
   * @description Establece el identificador de la solicitud.
   * @param {number} idSolicitud - Nuevo identificador de la solicitud.
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
        ...state,
        idSolicitud,
    }));
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
}
  
  
