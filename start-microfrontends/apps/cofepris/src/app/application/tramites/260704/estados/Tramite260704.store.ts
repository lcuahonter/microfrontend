import { Destinatario, Mercancia } from '../models/consulta.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interfaz que define la estructura de un catálogo.
 */
export interface Catalogo {
  /** Identificador único del catálogo. */
  id: number;
  /** Descripción del catálogo. */
  descripcion: string;
}

/**
 * Interfaz que define el estado de la solicitud 260704.
 */
export interface Solicitud260704State {
  /** Lista de datos de mercancías. */
  mercanciasDatos: Mercancia[];

  /** Lista de datos de destinatarios. */
  destinatarioDatos: Destinatario[];

  /** Tipo de operación (puede ser cadena o número). */
  tipoOperacion: string | number;

  /** Justificación proporcionada por el usuario. */
  justificacion: string;

  /** Nombre del establecimiento. */
  establecimiento: string;

  /** Razón social del establecimiento. */
  razonSocial: string;

  /** Correo electrónico del solicitante. */
  correoElectronico: string;

  /** Código postal del establecimiento. */
  codigoPostal: string;

  /** Estado (entidad federativa) del establecimiento. */
  estado: string;

  /** Municipio del establecimiento. */
  municipio: string;

  /** Localidad del establecimiento. */
  localidad: string;

  /** Colonia del establecimiento. */
  colonia: string;

  /** Calle del establecimiento. */
  calle: string;

  /** Lada telefónica del establecimiento. */
  lada: string;

  /** Teléfono del establecimiento. */
  telefono: string;

  /** Indica si se utiliza SCIAN. */
  scian: boolean;

  /** Indica si los datos SCIAN están disponibles. */
  scianDatos: boolean;

  /** Clave SCIAN seleccionada. */
  claveScian: string;

  /** Descripción de la clave SCIAN seleccionada. */
  descripcionScian: string;

  /** Indica si se cuenta con aviso de funcionamiento. */
  avisoDeFuncionamiento: boolean;

  /** Licencia sanitaria del establecimiento. */
  licenciaSanitaria: string;

  /** Régimen del establecimiento. */
  regimen: string;

  /** Aduana relacionada con la operación. */
  aduana: string;

  /** Valor IMMEX relacionado con la operación. */
  immex: string;

  /** Año relacionado con la operación. */
  ano: string;

  /** Descripción de la mercancía. */
  mercancia: string;

  /** Clasificación del producto. */
  clasificacionProducto: string;

  /** Especificación de la clasificación del producto. */
  especificarClasificacionProducto: string;

  /** Denominación del producto. */
  denominacionProducto: string;

  /** Marca del producto. */
  marca: string;

  /** Tipo de producto. */
  tipoProducto: string;

  /** Especificación adicional del producto. */
  especifique: string;

  /** Fracción arancelaria del producto. */
  fraccionArancelaria: string;

  /** Descripción de la fracción arancelaria. */
  descripcionFraccionArancelaria: string;

  /** Cantidad en la unidad de medida de tarifa (UMT). */
  cantidadUMT: string;

  /** Unidad de medida de tarifa (UMT). */
  umt: string;

  /** Cantidad en la unidad de medida de comercialización (UMC). */
  cantidadUMC: string;

  /** Unidad de medida de comercialización (UMC). */
  umc: string;

  /** Clave del lote relacionado con la mercancía. */
  claveLote: string;

  /** Lista de claves relacionadas con la mercancía. */
  listaClave: string;

  /** Indica si se incluyen manifiestos y declaraciones. */
  manfestosYDeclaraciones: boolean;

  /** Indica si los datos deben hacerse públicos. */
  hacerlosPublicos: string;

  /** RFC del solicitante o establecimiento. */
  rfc: string;

  /** Clave de referencia de la operación. */
  claveDeReferencia: string;

  /** Cadena de dependencia relacionada con la operación. */
  cadenaDependecia: string;

  /** Banco relacionado con el pago. */
  banco: string;

  /** Llave de pago de la operación. */
  liaveDePago: string;

  /** Importe del pago realizado. */
  importeDePago: string;

  /** Nombre del destinatario. */
  destinatario: string;

  /** Nombre del fabricante. */
  fabricante: string;

  /** Tipo de persona (física o moral). */
  tipoPersona: string;

  /** Nombre del solicitante. */
  nombre: string;

  /** Primer apellido del solicitante. */
  primerApellido: string;

  /** Segundo apellido del solicitante. */
  segundoApellido: string;

  /** Denominación del solicitante o establecimiento. */
  denominacion: string;

  /** País relacionado con la operación. */
  pais: string;

  /** Estado (entidad federativa) relacionado con la operación. */
  estados: string;

  /** Código postal relacionado con la operación. */
  codigoDeZip: string;

  /** Camino o dirección relacionada con la operación. */
  camino: string;

  /** Número exterior del domicilio relacionado. */
  numeroExterior: string;

  /** Número interior del domicilio relacionado. */
  numeroInterior: string;

  /** Lada telefónica de terceros. */
  ladaDeTerceros: string;

  /** Teléfono de terceros. */
  fon: string;

  /** Correo electrónico de terceros. */
  email: string;

  /** Fecha de pago de la operación. */
  fechaPago: string;
  /** Nombre o razón social del solicitante. */
  nombreRazon : string;
  /** Apellido paterno del solicitante. */
  apellidoPaterno: string;
  /** Apellido materno del solicitante. */
  apellidoMaterno: string;
}

/**
 * Función para crear el estado inicial de la solicitud 260704.
 *
 * @returns Estado inicial de tipo Solicitud260704State.
 */
export function createInitialState(): Solicitud260704State {
  return {
    mercanciasDatos: [],
    destinatarioDatos: [],
    tipoOperacion: '',
    justificacion: '',
    establecimiento: '',
    razonSocial: '',
    correoElectronico: '',
    codigoPostal: '',
    estado: '',
    municipio: '',
    localidad: '',
    colonia: '',
    calle: '',
    lada: '',
    telefono: '',
    scian: false,
    scianDatos: false,
    claveScian: '',
    descripcionScian: '',
    avisoDeFuncionamiento: false,
    licenciaSanitaria: '',
    regimen: '',
    aduana: '',
    immex: '',
    ano: '',
    mercancia: '',
    clasificacionProducto: '',
    especificarClasificacionProducto: '',
    denominacionProducto: '',
    marca: '',
    tipoProducto: '',
    especifique: '',
    fraccionArancelaria: '',
    descripcionFraccionArancelaria: '',
    cantidadUMT: '',
    umt: '',
    cantidadUMC: '',
    umc: '',
    claveLote: '',
    listaClave: '',
    manfestosYDeclaraciones: false,
    hacerlosPublicos: '',
    rfc: '',
    claveDeReferencia: '',
    cadenaDependecia: '',
    banco: '',
    liaveDePago: '',
    importeDePago: '',
    destinatario: '',
    fabricante: '',
    tipoPersona: '',
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    denominacion: '',
    pais: '',
    estados: '',
    codigoDeZip: '',
    camino: '',
    numeroExterior: '',
    numeroInterior: '',
    ladaDeTerceros: '',
    fon: '',
    email: '',
    fechaPago: '',
    nombreRazon : '',
    apellidoPaterno: '',
    apellidoMaterno: '',
  };
}

/**
 * Store para gestionar el estado de Tramite260704.
 *
 * Se utiliza Akita para gestionar el estado de la solicitud.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite260704', resettable: true })
export class Tramite260704Store extends Store<Solicitud260704State> {
  /**
   * Constructor del store que inicializa el estado con createInitialState.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el estado con el tipo de operación.
   * @param tipoOperacion Tipo de operación (cadena o número).
   */
  setTipoOperacion(tipoOperacion: string | number): void {
    this.update((state) => ({
      ...state,
      tipoOperacion,
    }));
  }

  /**
   * Actualiza el estado con la clave de los lotes.
   * @param claveDeLosLotes Clave de los lotes.
   */
  setClaveDeLosLotes(claveDeLosLotes: string): void {
    this.update((state) => ({
      ...state,
      claveDeLosLotes,
    }));
  }

  /**
   * Agrega una nueva mercancía a la lista en el estado.
   * @param newMercancia Nueva mercancía a agregar.
   */
  addMercanciasDatos(newMercancia: Mercancia): void {
    this.update((state) => ({
      ...state,
      mercanciasDatos: [...state.mercanciasDatos, newMercancia],
    }));
  }

  /**
   * Remueve un destinatario de la lista de datos en el estado.
   * @param destinatarioToRemove Destinatario a remover.
   */
  removeDestinatarioDato(destinatarioToRemove: Destinatario): void {
    this.update((state) => ({
      ...state,
      destinatarioDatos: state.destinatarioDatos.filter(
        (destinatario) => destinatario.rfc !== destinatarioToRemove.rfc
      ),
    }));
  }

  /**
   * Actualiza la justificación en el estado.
   * @param justificacion Justificación a establecer.
   */
  setJustificacion(justificacion: string): void {
    this.update((state) => ({
      ...state,
      justificacion,
    }));
  }

  /**
   * Actualiza el establecimiento en el estado.
   * @param establecimiento Establecimiento a establecer.
   */
  setEstablecimiento(establecimiento: string): void {
    this.update((state) => ({
      ...state,
      establecimiento,
    }));
  }

  /**
   * Actualiza la razón social en el estado.
   * @param razonSocial Razón social a establecer.
   */
  setRazonSocial(razonSocial: string): void {
    this.update((state) => ({
      ...state,
      razonSocial,
    }));
  }

  /**
   * Actualiza el correo electrónico en el estado.
   * @param correoElectronico Correo electrónico a establecer.
   */
  setCorreoElectronico(correoElectronico: string): void {
    this.update((state) => ({
      ...state,
      correoElectronico,
    }));
  }

  /**
   * Actualiza el código postal en el estado.
   * @param codigoPostal Código postal a establecer.
   */
  setCodigoPostal(codigoPostal: string): void {
    this.update((state) => ({
      ...state,
      codigoPostal,
    }));
  }

  /**
   * Actualiza el estado en el estado.
   * @param estado Estado a establecer.
   */
  setEstado(estado: string): void {
    this.update((state) => ({
      ...state,
      estado,
    }));
  }

  /**
   * Actualiza el municipio en el estado.
   * @param municipio Municipio a establecer.
   */
  setMunicipio(municipio: string): void {
    this.update((state) => ({
      ...state,
      municipio,
    }));
  }

  /**
   * Actualiza la localidad en el estado.
   * @param localidad Localidad a establecer.
   */
  setLocalidad(localidad: string): void {
    this.update((state) => ({
      ...state,
      localidad,
    }));
  }

  /**
   * Actualiza la colonia en el estado.
   * @param colonia Colonia a establecer.
   */
  setColonia(colonia: string): void {
    this.update((state) => ({
      ...state,
      colonia,
    }));
  }

  /**
   * Actualiza la calle en el estado.
   * @param calle Calle a establecer.
   */
  setCalle(calle: string): void {
    this.update((state) => ({
      ...state,
      calle,
    }));
  }

  /**
   * Actualiza la lada en el estado.
   * @param lada Lada a establecer.
   */
  setLada(lada: string): void {
    this.update((state) => ({
      ...state,
      lada,
    }));
  }

  /**
   * Actualiza el teléfono en el estado.
   * @param telefono Teléfono a establecer.
   */
  setTelefono(telefono: string): void {
    this.update((state) => ({
      ...state,
      telefono,
    }));
  }

  /**
   * Actualiza el valor booleano 'scian' en el estado.
   * @param scian Valor booleano para scian.
   */
  setScian(scian: boolean): void {
    this.update((state) => ({
      ...state,
      scian,
    }));
  }

  /**
   * Actualiza el valor booleano 'scianDatos' en el estado.
   * @param scianDatos Valor booleano para scianDatos.
   */
  setScianDatos(scianDatos: boolean): void {
    this.update((state) => ({
      ...state,
      scianDatos,
    }));
  }

  /**
   * Actualiza la clave SCIAN en el estado.
   * @param claveScian Clave SCIAN a establecer.
   */
  setClaveScian(claveScian: string): void {
    this.update((state) => ({
      ...state,
      claveScian,
    }));
  }

  /**
   * Actualiza la descripción SCIAN en el estado.
   * @param descripcionScian Descripción SCIAN a establecer.
   */
  setDescripcionScian(descripcionScian: string): void {
    this.update((state) => ({
      ...state,
      descripcionScian,
    }));
  }

  /**
   * Actualiza el aviso de funcionamiento en el estado.
   * @param avisoDeFuncionamiento Valor booleano para avisoDeFuncionamiento.
   */
  setAvisoDeFuncionamiento(avisoDeFuncionamiento: boolean): void {
    this.update((state) => ({
      ...state,
      avisoDeFuncionamiento,
    }));
  }

  /**
   * Actualiza la licencia sanitaria en el estado.
   * @param licenciaSanitaria Licencia sanitaria a establecer.
   */
  setLicenciaSanitaria(licenciaSanitaria: string): void {
    this.update((state) => ({
      ...state,
      licenciaSanitaria,
    }));
  }

  /**
   * Actualiza el régimen en el estado.
   * @param regimen Régimen a establecer.
   */
  setRegimen(regimen: string): void {
    this.update((state) => ({
      ...state,
      regimen,
    }));
  }

  /**
   * Actualiza la aduana en el estado.
   * @param aduana Aduana a establecer.
   */
  setAduana(aduana: string): void {
    this.update((state) => ({
      ...state,
      aduana,
    }));
  }

  /**
   * Actualiza el valor de immex en el estado.
   * @param immex Valor de immex a establecer.
   */
  setImmex(immex: string): void {
    this.update((state) => ({
      ...state,
      immex,
    }));
  }

  /**
   * Actualiza el año en el estado.
   * @param ano Año a establecer.
   */
  setAno(ano: string): void {
    this.update((state) => ({
      ...state,
      ano,
    }));
  }

  /**
   * Actualiza la mercancía en el estado.
   * @param mercancia Mercancía a establecer.
   */
  setMercancia(mercancia: string): void {
    this.update((state) => ({
      ...state,
      mercancia,
    }));
  }

  /**
   * Actualiza la clasificación del producto en el estado.
   * @param clasificacionProducto Clasificación del producto a establecer.
   */
  setClasificacionProducto(clasificacionProducto: string): void {
    this.update((state) => ({
      ...state,
      clasificacionProducto,
    }));
  }

  /**
   * Actualiza el valor para especificar la clasificación del producto en el estado.
   * @param especificarClasificacionProducto Valor a establecer.
   */
  setEspecificarClasificacionProducto(especificarClasificacionProducto: string): void {
    this.update((state) => ({
      ...state,
      especificarClasificacionProducto,
    }));
  }

  /**
   * Actualiza la denominación del producto en el estado.
   * @param denominacionProducto Denominación del producto a establecer.
   */
  setDenominacionProducto(denominacionProducto: string): void {
    this.update((state) => ({
      ...state,
      denominacionProducto,
    }));
  }

  /**
   * Actualiza la marca en el estado.
   * @param marca Marca a establecer.
   */
  setMarca(marca: string): void {
    this.update((state) => ({
      ...state,
      marca,
    }));
  }

  /**
   * Actualiza el tipo de producto en el estado.
   * @param tipoProducto Tipo de producto a establecer.
   */
  setTipoProducto(tipoProducto: string): void {
    this.update((state) => ({
      ...state,
      tipoProducto,
    }));
  }

  /**
   * Actualiza el valor 'especifique' en el estado.
   * @param especifique Valor a establecer para especifique.
   */
  setEspecifique(especifique: string): void {
    this.update((state) => ({
      ...state,
      especifique,
    }));
  }

  /**
   * Actualiza la fracción arancelaria en el estado.
   * @param fraccionArancelaria Fracción arancelaria a establecer.
   */
  setFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria,
    }));
  }

  /**
   * Actualiza la descripción de la fracción arancelaria en el estado.
   * @param descripcionFraccionArancelaria Descripción a establecer.
   */
  setDescripcionFraccionArancelaria(descripcionFraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      descripcionFraccionArancelaria,
    }));
  }

  /**
   * Actualiza la cantidad UMT en el estado.
   * @param cantidadUMT Cantidad UMT a establecer.
   */
  setCantidadUMT(cantidadUMT: string): void {
    this.update((state) => ({
      ...state,
      cantidadUMT,
    }));
  }

  /**
   * Actualiza la unidad de medida de tarifa (UMT) en el estado.
   * @param umt Unidad de medida de tarifa a establecer.
   */
  setUMT(umt: string): void {
    this.update((state) => ({
      ...state,
      umt,
    }));
  }

  /**
   * Actualiza la cantidad UMC en el estado.
   * @param cantidadUMC Cantidad UMC a establecer.
   */
  setCantidadUMC(cantidadUMC: string): void {
    this.update((state) => ({
      ...state,
      cantidadUMC,
    }));
  }

  /**
   * Actualiza la unidad de medida de comercialización (UMC) en el estado.
   * @param umc Unidad de medida de comercialización a establecer.
   */
  setUMC(umc: string): void {
    this.update((state) => ({
      ...state,
      umc,
    }));
  }

  /**
   * Actualiza la clave del lote en el estado.
   * @param claveLote Clave del lote a establecer.
   */
  setClaveLote(claveLote: string): void {
    this.update((state) => ({
      ...state,
      claveLote,
    }));
  }

  /**
   * Actualiza la lista clave en el estado.
   * @param listaClave Lista clave a establecer.
   */
  setListaClave(listaClave: string): void {
    this.update((state) => ({
      ...state,
      listaClave,
    }));
  }

  /**
   * Actualiza el valor booleano de manifiestos y declaraciones en el estado.
   * @param manfestosYDeclaraciones Valor booleano a establecer.
   */
  setManfestosYDeclaraciones(manfestosYDeclaraciones: boolean): void {
    this.update((state) => ({
      ...state,
      manfestosYDeclaraciones,
    }));
  }

  /**
   * Actualiza el valor de "hacerlos públicos" en el estado.
   * @param hacerlosPublicos Valor a establecer para hacerlos públicos.
   */
  setHacerlosPublicos(hacerlosPublicos: string): void {
    this.update((state) => ({
      ...state,
      hacerlosPublicos,
    }));
  }

  /**
   * Actualiza el RFC en el estado.
   * @param rfc RFC a establecer.
   */
  setRFC(rfc: string): void {
    this.update((state) => ({
      ...state,
      rfc,
    }));
  }

  /**
   * Actualiza la clave de referencia en el estado.
   * @param claveDeReferencia Clave de referencia a establecer.
   */
  setClaveDeReferencia(claveDeReferencia: string): void {
    this.update((state) => ({
      ...state,
      claveDeReferencia,
    }));
  }

  /**
   * Actualiza la cadena de dependencia en el estado.
   * @param cadenaDependecia Cadena de dependencia a establecer.
   */
  setCadenaDependecia(cadenaDependecia: string): void {
    this.update((state) => ({
      ...state,
      cadenaDependecia,
    }));
  }

  /**
   * Actualiza el banco en el estado.
   * @param banco Banco a establecer.
   */
  setBanco(banco: string): void {
    this.update((state) => ({
      ...state,
      banco,
    }));
  }

  /**
   * Actualiza la llave de pago en el estado.
   * @param liaveDePago Llave de pago a establecer.
   */
  setLiaveDePago(liaveDePago: string): void {
    this.update((state) => ({
      ...state,
      liaveDePago,
    }));
  }

  /**
   * Actualiza el importe de pago en el estado.
   * @param importeDePago Importe de pago a establecer.
   */
  setImporteDePago(importeDePago: string): void {
    this.update((state) => ({
      ...state,
      importeDePago,
    }));
  }

  /**
   * Actualiza el destinatario en el estado.
   * @param destinatario Destinatario a establecer.
   */
  setDestinatario(destinatario: string): void {
    this.update((state) => ({
      ...state,
      destinatario,
    }));
  }

  /**
   * Actualiza el fabricante en el estado.
   * @param fabricante Fabricante a establecer.
   */
  setFabricante(fabricante: string): void {
    this.update((state) => ({
      ...state,
      fabricante,
    }));
  }

  /**
   * Actualiza el tipo de persona en el estado.
   * @param tipoPersona Tipo de persona a establecer.
   */
  setTipoPersona(tipoPersona: string): void {
    this.update((state) => ({
      ...state,
      tipoPersona,
    }));
  }

  /**
   * Actualiza el nombre en el estado.
   * @param nombre Nombre a establecer.
   */
  setNombre(nombre: string): void {
    this.update((state) => ({
      ...state,
      nombre,
    }));
  }

  /**
   * Actualiza el primer apellido en el estado.
   * @param primerApellido Primer apellido a establecer.
   */
  setPrimerApellido(primerApellido: string): void {
    this.update((state) => ({
      ...state,
      primerApellido,
    }));
  }

  /**
   * Actualiza el segundo apellido en el estado.
   * @param segundoApellido Segundo apellido a establecer.
   */
  setSegundoApellido(segundoApellido: string): void {
    this.update((state) => ({
      ...state,
      segundoApellido,
    }));
  }

  /**
   * Actualiza la denominación en el estado.
   * @param denominacion Denominación a establecer.
   */
  setDenominacion(denominacion: string): void {
    this.update((state) => ({
      ...state,
      denominacion,
    }));
  }

  /**
   * Actualiza el país en el estado.
   * @param pais País a establecer.
   */
  setPais(pais: string): void {
    this.update((state) => ({
      ...state,
      pais,
    }));
  }

  /**
   * Actualiza el estado (entidad federativa) en el estado.
   * @param estados Estado a establecer.
   */
  setEstados(estados: string): void {
    this.update((state) => ({
      ...state,
      estados,
    }));
  }

  /**
   * Actualiza el código de ZIP en el estado.
   * @param codigoDeZip Código de ZIP a establecer.
   */
  setCodigoDeZip(codigoDeZip: string): void {
    this.update((state) => ({
      ...state,
      codigoDeZip,
    }));
  }

  /**
   * Actualiza el camino en el estado.
   * @param camino Camino a establecer.
   */
  setCamino(camino: string): void {
    this.update((state) => ({
      ...state,
      camino,
    }));
  }

  /**
   * Actualiza el número exterior en el estado.
   * @param numeroExterior Número exterior a establecer.
   */
  setNumeroExterior(numeroExterior: string): void {
    this.update((state) => ({
      ...state,
      numeroExterior,
    }));
  }

  /**
   * Actualiza el número interior en el estado.
   * @param numeroInterior Número interior a establecer.
   */
  setNumeroInterior(numeroInterior: string): void {
    this.update((state) => ({
      ...state,
      numeroInterior,
    }));
  }

  /**
   * Actualiza la lada de terceros en el estado.
   * @param ladaDeTerceros Lada de terceros a establecer.
   */
  setLadaDeTerceros(ladaDeTerceros: string): void {
    this.update((state) => ({
      ...state,
      ladaDeTerceros,
    }));
  }

  /**
   * Actualiza el teléfono (fon) en el estado.
   * @param fon Teléfono a establecer.
   */
  setFon(fon: string): void {
    this.update((state) => ({
      ...state,
      fon,
    }));
  }

  /**
   * Actualiza el email en el estado.
   * @param email Email a establecer.
   */
  setEmail(email: string): void {
    this.update((state) => ({
      ...state,
      email,
    }));
  }

  /**
   * Actualiza la fecha de pago en el estado.
   * @param fechaPago Fecha de pago a establecer.
   */
  setFechaPago(fechaPago: string): void {
    this.update((state) => ({
      ...state,
      fechaPago,
    }));
  }
/**
   * Actualiza el nombre o razón social en el estado.
   * @param nombreRazon Nombre o razón social a establecer.
   */
  setNombreRazon(nombreRazon: string): void {
    this.update((state) => ({
      ...state,
      nombreRazon,
    }));
  }

  /**
   * Actualiza el apellido paterno en el estado.
   * @param apellidoPaterno Apellido paterno a establecer.
   */
  setApellidoPaterno(apellidoPaterno: string): void {
    this.update((state) => ({
      ...state,
      apellidoPaterno,
    }));
  }

  /**
   * Actualiza el apellido materno en el estado.
   * @param apellidoMaterno Apellido materno a establecer.
   */
  setApellidoMaterno(apellidoMaterno: string): void {
    this.update((state) => ({
      ...state,
      apellidoMaterno,
    }));
  }
}
