import { FilaData, FilaData2 } from '../models/fila-modal';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interfaz que define el estado de la solicitud 260919.
 * Contiene todas las propiedades necesarias para gestionar los datos del trámite.
 */
export interface Solicitud260919State {
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

  nacionalidad: string;

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

  /** RFC del */
  rfcDel: string;

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
  /**
   * Indica el tipo de operación a realizar en el trámite.
   * Puede ser utilizado para diferenciar entre operaciones como alta, modificación o baja.
   */
  tipoOperacion: string;
  /** Número de registro sanitario */
  numeroDeRegistoSanitario: string;
  /** Presentación del producto */
  presentacion: string;
  /** Forma farmacéutica del producto */
  formaFarmaceutica: string;
  /** Número de registro sanitario del producto */
  numeroDeRegistroSanitario: string;

  /** CURP de la persona */
  curp: string;
  /** Clave del SCIAN */
  claveScian: string;
  /** Descripción del SCIAN */
  descripcionDelScian: string;
  // fechaPago: string,
  cumplocon: boolean;
  /** Opciones del radio de "Hacerlos" */
  hacerlosRadioOptions: string;
}

/**
 * Función para crear el estado inicial de la solicitud 260919.
 * Retorna un objeto con valores predeterminados para todas las propiedades.
 */
/**
 * Función para crear el estado inicial de la solicitud 260919.
 * Retorna un objeto con valores predeterminados para todas las propiedades.
 */
export function createInitialSolicitudState(): Solicitud260919State {
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

    nacionalidad: '',

    /** Nombre de la persona o entidad */
    nombre: '',

    /** Primer apellido de la persona */
    primerApellido: '',

    /** Segundo apellido de la persona */
    segundoApellido: '',

    /** Denominación o razón social */
    denominacion: '',

    rfcDel: '',

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

    /**
     * Valor inicial para el tipo de operación en el trámite.
     * Indica si la operación es de alta, modificación o baja.
     */
    tipoOperacion: '',

    /** Número de registro sanitario */
    numeroDeRegistoSanitario: '',
    /** Presentación del producto */
    presentacion: '',
    /** Forma farmacéutica del producto */
    formaFarmaceutica: '',
    /** Número de registro sanitario del producto */
    numeroDeRegistroSanitario: '',

    /** CURP de la persona */
    curp: '',
    /** Clave del SCIAN */
    claveScian: '',
    /** Descripción del SCIAN */
    descripcionDelScian: '',

    /** Indica si se cumple con los requisitos del trámite */
    cumplocon: true,

    /** Opciones del radio de "Hacerlos" */
    hacerlosRadioOptions: '',
  };
}
/**
 * Servicio que gestiona el estado de la solicitud 260919.
 * Utiliza Akita para manejar el estado de manera reactiva.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'Solicitud260919State', resettable: true })
export class Solicitud260919Store extends Store<Solicitud260919State> {
  constructor() {
    super(createInitialSolicitudState());
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
   * Método para actualizar el tipo de operación en el estado.
   * @param tipoOperacion Tipo de operación a establecer.
   */
  public setTipoOperacion(tipoOperacion: string): void {
    this.update((state) => ({
      ...state,
      tipoOperacion,
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
  public setConfiguracionColumnasoli(
    configuracionColumnasoli: FilaData[]
  ): void {
    this.update((state) => ({
      ...state,
      configuracionColumnasoli,
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
  public setDescripcionFraccionArancelaria(
    descripcionFraccionArancelaria: string
  ): void {
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
  public setDenominacionDistintiva(denominacionDistintiva: string): void {
    this.update((state) => ({
      ...state,
      denominacionDistintiva,
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
  /** Actualiza la denominación del nombre del producto en el estado. */
  public setDenominacionNombre(denominacionNombre: string): void {
    this.update((state) => ({
      ...state,
      denominacionNombre,
    }));
  }

  /** Actualiza el estado físico del producto en el estado. */
  public setEstadoFisico(estadoFisico: string): void {
    this.update((state) => ({
      ...state,
      estadoFisico,
    }));
  }

  /** Actualiza la presentación farmacéutica del producto en el estado. */
  public setPresentacionFarmaceutica(presentacionFarmaceutica: string): void {
    this.update((state) => ({
      ...state,
      presentacionFarmaceutica,
    }));
  }
  /**
   * Actualiza el RFC del en el estado.
   * @param rfcDel RFC del a establecer.
   */
  public setRfcDel(rfcDel: string): void {
    this.update((state) => ({
      ...state,
      rfcDel,
    }));
  }

  /**
   * Actualiza el número de registro sanitario en el estado.
   * @param numeroDeRegistoSanitario Número de registro sanitario a establecer.
   */
  public setNumeroDeRegistoSanitario(numeroDeRegistoSanitario: string): void {
    this.update((state) => ({
      ...state,
      numeroDeRegistoSanitario,
    }));
  }

  /**
   * Actualiza la presentación del producto en el estado.
   * @param presentacion Presentación a establecer.
   */
  public setPresentacion(presentacion: string): void {
    this.update((state) => ({
      ...state,
      presentacion,
    }));
  }
  /**
   * Actualiza la forma farmacéutica del producto en el estado.
   * @param formaFarmaceutica Forma farmacéutica a establecer.
   */
  public setFormaFarmaceutica(formaFarmaceutica: string): void {
    this.update((state) => ({
      ...state,
      formaFarmaceutica,
    }));
  }
  /**
   * Actualiza el número de registro sanitario en el estado.
   * @param numeroDeRegistroSanitario Número de registro sanitario a establecer.
   */
  public setNumeroDeRegistroSanitario(numeroDeRegistroSanitario: string): void {
    this.update((state) => ({
      ...state,
      numeroDeRegistroSanitario,
    }));
  }
  /**
   * Actualiza el CURP en el estado.
   * @param curp CURP a establecer.
   */
  public setClaveScian(claveScian: string): void {
    this.update((state) => ({
      ...state,
      claveScian,
    }));
  }
  /**
   * Actualiza la descripción del SCIAN en el estado.
   * @param descripcionDelScian Descripción del SCIAN a establecer.
   */
  public setDescripcionDelScian(descripcionDelScian: string): void {
    this.update((state) => ({
      ...state,
      descripcionDelScian,
    }));
  }

  /**
   * Actualiza el cumplimiento en el estado.
   * @param cumplocon Cumplimiento a establecer.
   */
  public setCumplocon(cumplocon: boolean): void {
    this.update((state) => ({
      ...state,
      cumplocon,
    }));
  }
  /**
   * Actualiza las opciones del radio de "Hacerlos" en el estado.
   * @param hacerlosRadioOptions Opciones del radio a establecer.
   */
  public setHacerlosRadioOptions(hacerlosRadioOptions: string): void {
    this.update((state) => ({
      ...state,
      hacerlosRadioOptions,
    }));
  }
  /**
   * Actualiza la nacionalidad en el estado.
   * @param nacionalidad Nacionalidad a establecer.
   */
  public setNacionalidad(nacionalidad: string): void {
    this.update((state) => ({
      ...state,
      nacionalidad,
    }));
  }

  /**
   * Actualiza el CURP en el estado.
   * @param curp CURP a establecer.
   */
  public setCurp(curp: string): void {
    this.update((state) => ({
      ...state,
      curp,
    }));
  }
}
