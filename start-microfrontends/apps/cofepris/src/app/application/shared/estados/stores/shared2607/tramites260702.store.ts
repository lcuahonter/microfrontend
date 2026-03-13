import {FilaData,FilaData2,ListaClave, } from '../../../models/fila-modal';
import { Store, StoreConfig } from '@datorama/akita';
import { Destinatario } from '../../../models/destinatario.model';
import { Injectable } from '@angular/core';

import { TramitesAsociados } from '../../../models/destinatario.model';

/**
 * Interfaz que define el estado de la solicitud 260702.
 * Contiene todas las propiedades necesarias para gestionar los datos del trámite.
 */
export interface Solicitud260702State {
  tipoOperacion: string;
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

  /** País de residencia */
  pais: string;

  /** Domicilio de la persona o entidad */
  domicilio: string;

  /** Número exterior del domicilio */
  numeroExterior: string;

  /** Número interior del domicilio */
  numeroInterior: string;

  /** Correo electrónico de contacto */
  correoElectronico: string;

  /** Justificación del trámite */
  justification: string;

  /** Denominación o razón social */
  denominacion: string;

  /** Código postal del domicilio */
  codigopostal: string;

  /** Estado de residencia */
  estado: string;

  /** Municipio o alcaldía de residencia */
  municipoyalcaldia: string;

  /** Localidad de residencia */
  localidad: string;

  /** Colonia de residencia */
  colonia: string;

  /** Calle del domicilio */
  calle: string;

  /** Lada telefónica */
  lada: number;

  /** Teléfono de contacto */
  telefono: string;

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
  marca: string;

  /** Fracción arancelaria del producto */
  fraccionArancelaria: string;
  /**
   * Mensaje relacionado con el aviso de privacidad.
   */
  mensaje: boolean;
  /** Indica si los datos deben hacerse públicos. */
  hacerlosPublicos: string;

  /** Datos de la tabla */
  tableData: FilaData[];

  /** Datos de la tabla de destinatarios */
  tableData2: Destinatario[];

      /**
       * El valor de nicoTabla.
       */
      nicoTabla: FilaData[],
    
      /**
       * El valor de mercanciaTabla.
       */
      mercanciaTabla: FilaData2[],
      destinatarioDatos:Destinatario[],
      fabricanteDatos:Destinatario[],
      tablaFilaDatos:TramitesAsociados[],
/**
 * Método para actualizar la descripción del SCIAN en el estado.
 */
descripcionDelScian: string;
    /**
     * Cualquier otra propiedad dinámica que pueda ser añadida al estado.
     */
 [key: string]: unknown;
    idSolicitud: number;
  formValidity?: {
    datosDelSolicitud?: boolean;
    tercerosRelacionados?: boolean;
  }
  continuarTriggered?: boolean;
  mostraButton?: boolean;
}

/**
 * Función para crear el estado inicial de la solicitud 260702.
 * Retorna un objeto con valores predeterminados para todas las propiedades.
 */
/**
 * Función para crear el estado inicial de la solicitud 260702.
 * Retorna un objeto con valores predeterminados para todas las propiedades.
 */
export function createInitialSolicitudState(): Solicitud260702State {
  return {
    /** Tipo de operación del trámite */
    tipoOperacion: '',
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
    marca: '',

    /** Fracción arancelaria del producto */
    fraccionArancelaria: '',

   /** Mensaje relacionado con el aviso de privacidad. */
    mensaje: false,
    /** Indica si los datos deben hacerse públicos. */
    hacerlosPublicos: '',
    /** Datos de la tabla */
    tableData: [],
    /** Datos de la tabla de destinatarios */
    tableData2: [],
    /**
     * Método para actualizar la descripción del SCIAN en el estado.
     */
    descripcionDelScian: '',
    
  /**
   * El valor de nicoTabla.
   */
    nicoTabla: [],

  /**
   * El valor de mercanciaTabla.
   */
    mercanciaTabla: [],
/**
 * El ID de la solicitud.
 */
     idSolicitud: 0,
    /**
     * Validez de los formularios dentro del estado.
    */
    fabricanteDatos:[],
    destinatarioDatos:[],
    
    formValidity: {},
    tablaFilaDatos:[],

    /** Indica si se ha activado la acción de continuar */
    continuarTriggered:false,
    mostraButton: false,
  };
}
/**
 * Servicio que gestiona el estado de la solicitud 260702.
 * Utiliza Akita para manejar el estado de manera reactiva.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'Solicitud260702State', resettable: true })
export class Solicitud260702Store extends Store<Solicitud260702State> {
  constructor() {
    super(createInitialSolicitudState());
  }
  /**
   * Método para actualizar el tipo de operación en el estado.
   * @param tipoOperacion Tipo de operación a establecer.
   */
  public setTipoOperacion(tipoOperacion: string): void {
    this.update((state) => ({
      ...state,
      tipoOperacion,
    }));
  }

     /** Actualiza el estado con la nueva tabla de información Nico. */
      setNicoTabla(nicoTabla: FilaData[]): void {
        this.update((state) => ({
              ...state,
              nicoTabla,
          }));
      }
  /**
 * Establece los datos de la tabla de mercancías en el estado del store.
 *
 * @param mercanciaTabla - Array de objetos `FilaData2` que representa las filas de la tabla de mercancías.
 */
      setMercanciasTabla(mercanciaTabla: FilaData2[]): void {
        this.update((state) => ({
              ...state,
              mercanciaTabla,
          }));
      }
      /**
 * Establece los datos de los fabricantes en el estado del store.
 *
 * @param fabricanteDatos - Array de objetos `Destinatario` que representa los fabricantes.
 */
    setFabricanteDatos(fabricanteDatos: Destinatario[]): void {
        this.update((state) => ({
              ...state,
              fabricanteDatos,
          }));
      }
      /**
 * Establece los datos de los destinatarios en el estado del store.
 *
 * @param destinatarioDatos - Array de objetos `Destinatario` que representa los destinatarios.
 */
      setDestinatarioDatos(destinatarioDatos: Destinatario[]): void {
        this.update((state) => ({
              ...state,
              destinatarioDatos,
          }));
      }
  /**
   * Método para actualizar la clave de referencia en el estado.
   * @param clavedereferencia Clave de referencia a establecer.
   */
  public setClaveDeReferencia(clavedereferencia: string): void {
    this.update((state) => ({
      ...state,
      clavedereferencia,
    }));
  }

  /**
   * Método para actualizar la cadena de la dependencia en el estado.
   * @param cadenadeladependencia Cadena de la dependencia a establecer.
   */
  public setCadenaDelaDependencia(cadenadeladependencia: string): void {
    this.update((state) => ({
      ...state,
      cadenadeladependencia,
    }));
  }

  /**
   * Método para actualizar el banco en el estado.
   * @param banco Banco a establecer.
   */
  public setBanco(banco: string): void {
    this.update((state) => ({
      ...state,
      banco,
    }));
  }

  /**
   * Método para actualizar la llave de pago en el estado.
   * @param llavedepago Llave de pago a establecer.
   */
  public setLlavedoPago(llavedepago: string): void {
    this.update((state) => ({
      ...state,
      llavedepago,
    }));
  }

  /**
   * Método para actualizar la fecha de pago en el estado.
   * @param fechadepago Fecha de pago a establecer.
   */
  public setFechadePago(fechadepago: string): void {
    this.update((state) => ({
      ...state,
      fechadepago,
    }));
  }

  /**
   * Método para actualizar el importe de pago en el estado.
   * @param importedepago Importe de pago a establecer.
   */
  public setImportedePago(importedepago: string): void {
    this.update((state) => ({
      ...state,
      importedepago,
    }));
  }

  /**
   * Método para actualizar el tipo de persona en el estado.
   * @param tipoPersona Tipo de persona a establecer.
   */
  public setTipoPersona(tipoPersona: string): void {
    this.update((state) => ({
      ...state,
      tipoPersona,
    }));
  }

  /**
   * Método para actualizar el nombre en el estado.
   * @param nombre Nombre a establecer.
   */
  public setNombre(nombre: string): void {
    this.update((state) => ({
      ...state,
      nombre,
    }));
  }

  /**
   * Método para actualizar el primer apellido en el estado.
   * @param primerApellido Primer apellido a establecer.
   */
  public setPrimerApellido(primerApellido: string): void {
    this.update((state) => ({
      ...state,
      primerApellido,
    }));
  }

  /**
   * Método para actualizar el segundo apellido en el estado.
   * @param segundoApellido Segundo apellido a establecer.
   */
  public setSegundoApellido(segundoApellido: string): void {
    this.update((state) => ({
      ...state,
      segundoApellido,
    }));
  }

  /**
   * Método para actualizar la denominación en el estado.
   * @param denominacion Denominación a establecer.
   */
  public setDenominacion(denominacion: string): void {
    this.update((state) => ({
      ...state,
      denominacion,
    }));
  }

  /**
   * Método para actualizar el correo electrónico en el estado.
   * @param correoElectronico Correo electrónico a establecer.
   */
  public setCorreoElectronico(correoElectronico: string): void {
    this.update((state) => ({
      ...state,
      correoElectronico,
    }));
  }

  /**
   * Método para actualizar el país en el estado.
   * @param pais País a establecer.
   */
  public setPais(pais: string): void {
    this.update((state) => ({
      ...state,
      pais,
    }));
  }

  /**
   * Método para actualizar el domicilio en el estado.
   * @param domicilio Domicilio a establecer.
   */
  public setDomicilio(domicilio: string): void {
    this.update((state) => ({
      ...state,
      domicilio,
    }));
  }

  /**
   * Método para actualizar el estado en el estado.
   * @param estado Estado a establecer.
   */
  public setEstado(estado: string): void {
    this.update((state) => ({
      ...state,
      estado,
    }));
  }

  /**
   * Método para actualizar el código postal en el estado.
   * @param codigopostal Código postal a establecer.
   */
  public setCodigoPostal(codigopostal: string): void {
    this.update((state) => ({
      ...state,
      codigopostal,
    }));
  }

  /**
   * Método para actualizar la calle en el estado.
   * @param calle Calle a establecer.
   */
  public setCalle(calle: string): void {
    this.update((state) => ({
      ...state,
      calle,
    }));
  }

  /**
   * Método para actualizar el número exterior en el estado.
   * @param numeroExterior Número exterior a establecer.
   */
  public setNumeroExterior(numeroExterior: string): void {
    this.update((state) => ({
      ...state,
      numeroExterior,
    }));
  }

  /**
   * Método para actualizar el número interior en el estado.
   * @param numeroInterior Número interior a establecer.
   */
  public setNumeroInterior(numeroInterior: string): void {
    this.update((state) => ({
      ...state,
      numeroInterior,
    }));
  }

  /**
   * Método para actualizar la lada en el estado.
   * @param lada Lada a establecer.
   */
  public setLada(lada: number): void {
    this.update((state) => ({
      ...state,
      lada,
    }));
  }

  /**
   * Método para actualizar el teléfono en el estado.
   * @param telefono Teléfono a establecer.
   */
  public setTelefono(telefono: string): void {
    this.update((state) => ({
      ...state,
      telefono,
    }));
  }

  /**
   * Método para actualizar la justificación en el estado.
   * @param justification Justificación a establecer.
   */
  public setJustification(justification: string): void {
    this.update((state) => ({
      ...state,
      justification,
    }));
  }

  /**
   * Método para actualizar el municipio o alcaldía en el estado.
   * @param municipoyalcaldia Municipio o alcaldía a establecer.
   */
  public setMunicipoyalcaldia(municipoyalcaldia: string): void {
    this.update((state) => ({
      ...state,
      municipoyalcaldia,
    }));
  }

  /**
   * Método para actualizar la localidad en el estado.
   * @param localidad Localidad a establecer.
   */
  public setLocalidad(localidad: string): void {
    this.update((state) => ({
      ...state,
      localidad,
    }));
  }

  /**
   * Método para actualizar la colonia en el estado.
   * @param colonia Colonia a establecer.
   */
  public setColonia(colonia: string): void {
    this.update((state) => ({
      ...state,
      colonia,
    }));
  }

  /**
   * Método para actualizar el aviso de funcionamiento en el estado.
   * @param avisoDeFuncionamiento Aviso de funcionamiento a establecer.
   */
  public setAvisoDeFuncionamiento(avisoDeFuncionamiento: boolean): void {
    this.update((state) => ({
      ...state,
      avisoDeFuncionamiento,
    }));
  }

  /**
   * Método para actualizar la licencia sanitaria en el estado.
   * @param licenciaSanitaria Licencia sanitaria a establecer.
   */
  public setLicenciaSanitaria(licenciaSanitaria: string): void {
    this.update((state) => ({
      ...state,
      licenciaSanitaria,
    }));
  }

  /**
   * Método para actualizar el régimen al que se destinarán las mercancías en el estado.
   * @param regimenalque Régimen a establecer.
   */
  public setRegimenalque(regimenalque: string): void {
    this.update((state) => ({
      ...state,
      regimenalque,
    }));
  }

  /**
   * Método para actualizar la aduana en el estado.
   * @param aduana Aduana a establecer.
   */
  public setAduana(aduana: string): void {
    this.update((state) => ({
      ...state,
      aduana,
    }));
  }

  /**
   * Método para actualizar el RFC en el estado.
   * @param rfc RFC a establecer.
   */
  public setRfc(rfc: string): void {
    this.update((state) => ({
      ...state,
      rfc,
    }));
  }

  /**
   * Método para actualizar la razón social legal en el estado.
   * @param legalRazonSocial Razón social legal a establecer.
   */
  public setLegalRazonSocial(legalRazonSocial: string): void {
    this.update((state) => ({
      ...state,
      legalRazonSocial,
    }));
  }

  /**
   * Método para actualizar el apellido paterno en el estado.
   * @param apellidoPaterno Apellido paterno a establecer.
   */
  public setApellidoPaterno(apellidoPaterno: string): void {
    this.update((state) => ({
      ...state,
      apellidoPaterno,
    }));
  }

  /**
   * Método para actualizar el apellido materno en el estado.
   * @param apellidoMaterno Apellido materno a establecer.
   */
  public setApellidoMaterno(apellidoMaterno: string): void {
    this.update((state) => ({
      ...state,
      apellidoMaterno,
    }));
  }

  /**
   * Método para actualizar los datos de mercancías en el estado.
   * @param mercanciasDatos Datos de mercancías a establecer.
   */
  public setMercanciasDatos(mercanciasDatos: FilaData2[]): void {
    this.update((state) => ({
      ...state,
      mercanciasDatos,
    }));
  }

  /**
   * Método para actualizar la configuración de columnas en el estado.
   * @param configuracionColumnasoli Configuración de columnas a establecer.
   */
  public setConfiguracionColumnasoli(configuracionColumnasoli: FilaData[]): void {
    this.update((state) => ({
      ...state,
      configuracionColumnasoli,
    }));
  }

  /**
   * Método para actualizar la lista de claves en el estado.
   * @param listaClave Lista de claves a establecer.
   */
  public setListaClave(listaClave: ListaClave[]): void {
    this.update((state) => ({
      ...state,
      listaClave,
    }));
  }

  /**
   * Método para actualizar la clave de los lotes en el estado.
   * @param claveDeLosLotes Clave de los lotes a establecer.
   */
  public setClaveDeLosLotes(claveDeLosLotes: string): void {
    this.update((state) => ({
      ...state,
      claveDeLosLotes,
    }));
  }

  /**
   * Método para actualizar la fecha de fabricación en el estado.
   * @param fechaDeFabricacion Fecha de fabricación a establecer.
   */
  public setFechaDeFabricacion(fechaDeFabricacion: string): void {
    this.update((state) => ({
      ...state,
      fechaDeFabricacion,
    }));
  }

  /**
   * Método para actualizar la fecha de caducidad en el estado.
   * @param fechaDeCaducidad Fecha de caducidad a establecer.
   */
  public setFechaDeCaducidad(fechaDeCaducidad: string): void {
    this.update((state) => ({
      ...state,
      fechaDeCaducidad,
    }));
  }

  /**
   * Método para actualizar la descripción de la fracción arancelaria en el estado.
   * @param descripcionFraccionArancelaria Descripción de la fracción arancelaria a establecer.
   */
  public setDescripcionFraccionArancelaria(descripcionFraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      descripcionFraccionArancelaria,
    }));
  }

  /**
   * Método para actualizar la cantidad UMT en el estado.
   * @param cantidadUMT Cantidad UMT a establecer.
   */
  public setCantidadUMT(cantidadUMT: string): void {
    this.update((state) => ({
      ...state,
      cantidadUMT,
    }));
  }

  /**
   * Método para actualizar la unidad de medida de tarifa (UMT) en el estado.
   * @param umt Unidad de medida de tarifa a establecer.
   */
  public setUMT(umt: string): void {
    this.update((state) => ({
      ...state,
      umt,
    }));
  }

  /**
   * Método para actualizar la cantidad UMC en el estado.
   * @param cantidadUMC Cantidad UMC a establecer.
   */
  public setCantidadUMC(cantidadUMC: string): void {
    this.update((state) => ({
      ...state,
      cantidadUMC,
    }));
  }

  /**
   * Método para actualizar la unidad de medida de comercialización (UMC) en el estado.
   * @param umc Unidad de medida de comercialización a establecer.
   */
  public setUMC(umc: string): void {
    this.update((state) => ({
      ...state,
      umc,
    }));
  }

  /**
   * Método para actualizar el tipo de producto en el estado.
   * @param tipoProducto Tipo de producto a establecer.
   */
  public setTipoProducto(tipoProducto: string): void {
    this.update((state) => ({
      ...state,
      tipoProducto,
    }));
  }

  /**
   * Método para actualizar la clasificación de productos en el estado.
   * @param clasificaionProductos Clasificación de productos a establecer.
   */
  public setClasificaionProductos(clasificaionProductos: string): void {
    this.update((state) => ({
      ...state,
      clasificaionProductos,
    }));
  }

  /**
   * Método para actualizar el producto especificado en el estado.
   * @param especificarProducto Producto especificado a establecer.
   */
  public setEspecificarProducto(especificarProducto: string): void {
    this.update((state) => ({
      ...state,
      especificarProducto,
    }));
  }

  /**
   * Método para actualizar el nombre específico del producto en el estado.
   * @param nombreProductoEspecifico Nombre específico del producto a establecer.
   */
  public setNombreProductoEspecifico(nombreProductoEspecifico: string): void {
    this.update((state) => ({
      ...state,
      nombreProductoEspecifico,
    }));
  }

  /**
   * Método para actualizar la marca en el estado.
   * @param marca Marca a establecer.
   */
  public setMarca(marca: string): void {
    this.update((state) => ({
      ...state,
      marca,
    }));
  }

  /**
   * Método para actualizar la fracción arancelaria en el estado.
   * @param fraccionArancelaria Fracción arancelaria a establecer.
   */
  public setFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria,
    }));
  }


  /**
   * Método para actualizar si los datos deben hacerse públicos en el estado.
   * @param hacerlosPublicos Indica si los datos deben hacerse públicos.
   */
  public setHacerlosPublicos(hacerlosPublicos: string): void {
    this.update((state) => ({
      ...state,
      hacerlosPublicos,
    }));
  }
  /**
   * Método para actualizar los datos de la tabla en el estado.
   * @param tableData Datos de la tabla a establecer.
   */
  public setTableData(tableData: FilaData[]): void {
    this.update((state) => ({
      ...state,
      tableData,
    }));
  }
  /**
   * Método para actualizar los datos de la tabla de destinatarios en el estado.
   * @param tableData2 Datos de la tabla de destinatarios a establecer.
   */
  public setTableData2(tableData2: Destinatario[]): void {
    this.update((state) => ({
      ...state,
      tableData2,
    }));
  }

  /**
   *  Método para actualizar la descripción del SCIAN en el estado.
   * @param descripcionDelScian Descripción del SCIAN a establecer.
   */
  setDescripcionDelScian(descripcionDelScian: string): void {
    this.update((state) => ({
      ...state,
      descripcionDelScian,
    }));
  }

    /**
     * Set a value dynamically in the store by field name.
     * @param fieldName The name of the field to update.
     * @param value The value to set.
     */
    public setDynamicFieldValue(fieldName: string, value: any): void {
        this.update((state) => ({
        ...state,
        [fieldName]: value,
        }));
    }

  /**
 * Actualiza el estado de validez de un formulario específico dentro del trámite.
 * @param formName Nombre del formulario a actualizar.
 * @param isValid Indica si el formulario es válido o no.
 */
  setFormValidity(formName: string, isValid: boolean): void {
    this.update((state) => ({
      ...state,
      formValidity: {
        ...state.formValidity,
        [formName]: isValid,
      },
    }));
  }

  /** Establece el ID de la solicitud en el estado actual. */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({ ...state, idSolicitud }));
  }

  /**
* Establece el estado del botón continuar para activar o desactivar las validaciones del formulario.
* @param continuarTriggered Indica si el botón continuar ha sido activado.
*/
  public setContinuarTriggered(continuarTriggered: boolean): void {
    this.update((state) => ({ ...state, continuarTriggered }));
  }

  /**
   * Actualiza el estado con una nueva lista de destinatarios para el fabricante.
   *
   * @param fabricanteDatos - Arreglo de objetos de tipo Destinatario que contiene los datos del fabricante a establecer en el estado.
   */
  setFabricanteDatosTabla(fabricanteDatos: Destinatario[]): void {
    this.update((state) => ({
      ...state,
      fabricanteDatos,
    }));
  }
  /**
   * Actualiza el estado con una nueva lista de destinatarios.
   *
   * @param destinatarioDatos - Arreglo de objetos de tipo `Destinatario` que representa los datos de los destinatarios a establecer en la tabla.
   */
  setDestinatarioDatosTabla(destinatarioDatos: Destinatario[]): void {
    this.update((state) => ({
      ...state,
      destinatarioDatos,
    }));
  }
  /**
   * Actualiza el estado con los datos de las filas de la tabla de trámites asociados.
   *
   * @param tablaFilaDatos - Un arreglo de objetos de tipo `TramitesAsociados` que representa las filas de la tabla a almacenar en el estado.
   */
  setTablaFilaDatos(tablaFilaDatos: TramitesAsociados[]): void {
    this.update((state) => ({
      ...state,
      tablaFilaDatos,
    }));
  }

  /**
 * Establece el valor de la propiedad `mensaje` en el estado del store.
 *
 * @param mensaje - Valor booleano que indica el estado del mensaje.
 */
   public setMensaje(mensaje: boolean):void {
        this.update((state) => ({
            ...state,
            mensaje,
        }));
    }

  /** 
   * Establece el valor de la propiedad `mostraButton` en el estado del store.
 * @param mostraButton - Valor booleano que indica si se muestra el botón.
 */
  public setMostraButton(mostraButton: boolean): void {
    this.update((state) => ({
      ...state,
      mostraButton,
    }));
  }
     
}
