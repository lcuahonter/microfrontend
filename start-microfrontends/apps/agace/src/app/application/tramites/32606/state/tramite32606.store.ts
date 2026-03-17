import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Representa un catálogo con un identificador y una descripción.
 */
export interface Catalogo {
  /** Identificador único del catálogo. */
  id: number;
  /** Descripción del catálogo. */
  descripcion: string;
}

/*** Estado inicial para la interfaz del trámite 32606. */
export interface Solicitud32606State {
  tipoRadio01: string,
  tipoRadio02: string,
  tipoRadio03: string,
  tipoRadio04: string,
  tipoRadio05: string,
  tipoRadio06: string,
  tipoRadio07: string,
  tipoRadio08: string,
  tipoRadio09: string,
  tipoRadio10: string,
  tipoRadio11: string,
  tipoRadio12: string
  tipoRadio13: string
  tipoRadio14: string
  tipoRadio15: string
  tipoRadio16: string
  tipoRadio17: string
  tipoRadio18: string
  tipoRadio19: string
  tipoRadio20: string
  tipoRadio21: string
  tipoRadio22: string
  tipoRadio23: string
  tipoRadio24: string
  tipoRadio25: string
  tipoRadio26: string,
  tipoRadio27: string,
  tipoRadio28: string,
  tipoRadio29: string,
  tipoRadio30: string,
  tipoRadio31: string,
  tipoRadio32: string,
  tipoRadio33: string,
  tipoRadio34: string,
  sectorProductivo: string,
  servicio: string,
  domicilio: string,
  biomestre: string,
  numeroEmpleados: string,
  domicillio: string,
  file1: string,
  file2: string,
  actualmente: string,
  actualmente2: string,
  sistemaIdentificacion: string,
  lugarRadicacion: string,
  sistemaControlInventarios: boolean,
  rfcTercero: string,
  rfc: string,
  nombre: string,
  apellidoPaterno: string,
  apellidoMaterno: string,
  telefono: string,
  correoElectronico: string,
  monto: string,
  operacionesBancarias: string,
  llavePago: string,
  modalidad: string,
  fechaRegistro: string,
  numeroAutorizacion: string,
  radioAutorizo: string,
  radioClasificacion: string,
  caracter: string,
  nacionalidad: string,
  fechaInicio: string,
  fechaPago: string,
  entidadFederativa : string,
  municipio: string,
  tipoDeInstalacion: string,
  registroSESAT: string,
  descripcion: string,
  codigoPostal: string
}

/**
 * Crea el estado inicial para la solicitud del trámite 32606.
 * @returns Estado inicial de tipo `Solicitud32606State`.
 */
export function createInitialState(): Solicitud32606State {
  return {
    tipoRadio01: '',
    tipoRadio02: '',
    tipoRadio03: '',
    tipoRadio04: '',
    tipoRadio05: '',
    tipoRadio06: '',
    tipoRadio07: '',
    tipoRadio08: '',
    tipoRadio09: '',
    tipoRadio10: '',
    tipoRadio11: '',
    tipoRadio12: '',
    tipoRadio13: '',
    tipoRadio14: '',
    tipoRadio15: '',
    tipoRadio16: '',
    tipoRadio17: '',
    tipoRadio18: '',
    tipoRadio19: '',
    tipoRadio20: '',
    tipoRadio21: '',
    tipoRadio22: '',
    tipoRadio23: '',
    tipoRadio24: '',
    tipoRadio25: '',
    tipoRadio26: '',
    tipoRadio27: '',
    tipoRadio28: '',
    tipoRadio29: '',
    tipoRadio30: '',
    tipoRadio31: '',
    tipoRadio32: '',
    tipoRadio33: '',
    tipoRadio34: '',
    sectorProductivo: '',
    servicio: '', 
    domicilio: '', 
    biomestre: '',
    numeroEmpleados: '', 
    domicillio: '',
    file1: '', 
    file2: '', 
    actualmente: '', 
    actualmente2: '', 
    sistemaIdentificacion: '', 
    lugarRadicacion: '', 
    sistemaControlInventarios: false, 
    rfcTercero: '', 
    rfc: '', 
    nombre: '', 
    apellidoPaterno: '', 
    apellidoMaterno: '', 
    telefono: '', 
    correoElectronico: '', 
    monto: '', 
    operacionesBancarias: '',
    llavePago: '', 
    modalidad: '', 
    fechaRegistro: '', 
    numeroAutorizacion: '', 
    radioAutorizo: '',
    radioClasificacion: '', 
    caracter: '',
    nacionalidad: '',
    fechaInicio: '',
    fechaPago: '',
    entidadFederativa: '',
    municipio: '',
    tipoDeInstalacion: '',
    registroSESAT: '',
    descripcion: '',
    codigoPostal: ''
  };
}

/**
 * Clase que representa el almacén de estado para el trámite 32606.
 * Gestiona el estado global de la solicitud y proporciona métodos para actualizarlo.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite32606', resettable: true })
export class Tramite32606Store extends Store<Solicitud32606State> {
  /** Constructor que inicializa el estado con los valores predeterminados. */
  constructor() {
    super(createInitialState());
  }

  /** Actualiza el valor de tipoRadio01 en el estado. */
  public setTipoRadio01(tipoRadio01: string): void {
    this.update((state) => ({ ...state, tipoRadio01 }));
  }

  /** Actualiza el valor de tipoRadio02 en el estado. */
  public setTipoRadio02(tipoRadio02: string): void {
    this.update((state) => ({ ...state, tipoRadio02 }));
  }

  /** Actualiza el valor de tipoRadio03 en el estado. */
  public setTipoRadio03(tipoRadio03: string): void {
    this.update((state) => ({ ...state, tipoRadio03 }));
  }

  /** Actualiza el valor de tipoRadio04 en el estado. */
  public setTipoRadio04(tipoRadio04: string): void {
    this.update((state) => ({ ...state, tipoRadio04 }));
  }

  /** Actualiza el valor de tipoRadio05 en el estado. */
  public setTipoRadio05(tipoRadio05: string): void {
    this.update((state) => ({ ...state, tipoRadio05 }));
  }

  /** Actualiza el valor de tipoRadio06 en el estado. */
  public setTipoRadio06(tipoRadio06: string): void {
    this.update((state) => ({ ...state, tipoRadio06 }));
  }

  /** Actualiza el valor de tipoRadio07 en el estado. */
  public setTipoRadio07(tipoRadio07: string): void {
    this.update((state) => ({ ...state, tipoRadio07 }));
  }

  /** Actualiza el valor de tipoRadio08 en el estado. */
  public setTipoRadio08(tipoRadio08: string): void {
    this.update((state) => ({ ...state, tipoRadio08 }));
  }

  /** Actualiza el valor de tipoRadio09 en el estado. */
  public setTipoRadio09(tipoRadio09: string): void {
    this.update((state) => ({ ...state, tipoRadio09 }));
  }

  /** Actualiza el valor de tipoRadio10 en el estado. */
  public setTipoRadio10(tipoRadio10: string): void {
    this.update((state) => ({ ...state, tipoRadio10 }));
  }

  /** Actualiza el valor de tipoRadio11 en el estado. */
  public setTipoRadio11(tipoRadio11: string): void {
    this.update((state) => ({ ...state, tipoRadio11 }));
  }

  /** Actualiza el valor de tipoRadio12 en el estado. */
  public setTipoRadio12(tipoRadio12: string): void {
    this.update((state) => ({ ...state, tipoRadio12 }));
  }

  /** Actualiza el valor de tipoRadio13 en el estado. */
  public setTipoRadio13(tipoRadio13: string): void {
    this.update((state) => ({ ...state, tipoRadio13 }));
  }

  /** Actualiza el valor de tipoRadio14 en el estado. */
  public setTipoRadio14(tipoRadio14: string): void {
    this.update((state) => ({ ...state, tipoRadio14 }));
  }

  /** Actualiza el valor de tipoRadio15 en el estado. */
  public setTipoRadio15(tipoRadio15: string): void {
    this.update((state) => ({ ...state, tipoRadio15 }));
  }

  /** Actualiza el valor de tipoRadio16 en el estado. */
  public setTipoRadio16(tipoRadio16: string): void {
    this.update((state) => ({ ...state, tipoRadio16 }));
  }

  /** Actualiza el valor de tipoRadio17 en el estado. */
  public setTipoRadio17(tipoRadio17: string): void {
    this.update((state) => ({ ...state, tipoRadio17 }));
  }

  /** Actualiza el valor de tipoRadio18 en el estado. */
  public setTipoRadio18(tipoRadio18: string): void {
    this.update((state) => ({ ...state, tipoRadio18 }));
  }

  /** Actualiza el valor de tipoRadio19 en el estado. */
  public setTipoRadio19(tipoRadio19: string): void {
    this.update((state) => ({ ...state, tipoRadio19 }));
  }

  /** Actualiza el valor de tipoRadio20 en el estado. */
  public setTipoRadio20(tipoRadio20: string): void {
    this.update((state) => ({ ...state, tipoRadio20 }));
  }

  /** Actualiza el valor de tipoRadio21 en el estado. */
  public setTipoRadio21(tipoRadio21: string): void {
    this.update((state) => ({ ...state, tipoRadio21 }));
  }

  /** Actualiza el valor de tipoRadio22 en el estado. */
  public setTipoRadio22(tipoRadio22: string): void {
    this.update((state) => ({ ...state, tipoRadio22 }));
  }

  /** Actualiza el valor de tipoRadio23 en el estado. */
  public setTipoRadio23(tipoRadio23: string): void {
    this.update((state) => ({ ...state, tipoRadio23 }));
  }

  /** Actualiza el valor de tipoRadio24 en el estado. */
  public setTipoRadio24(tipoRadio24: string): void {
    this.update((state) => ({ ...state, tipoRadio24 }));
  }

  /** Actualiza el valor de tipoRadio25 en el estado. */
  public setTipoRadio25(tipoRadio25: string): void {
    this.update((state) => ({ ...state, tipoRadio25 }));
  }

  /** Actualiza el valor de tipoRadio26 en el estado. */
  public setTipoRadio26(tipoRadio26: string): void {
    this.update((state) => ({ ...state, tipoRadio26 }));
  }

  /** Actualiza el valor de tipoRadio27 en el estado. */
  public setTipoRadio27(tipoRadio27: string): void {
    this.update((state) => ({ ...state, tipoRadio27 }));
  }

  /** Actualiza el valor de tipoRadio28 en el estado. */
  public setTipoRadio28(tipoRadio28: string): void {
    this.update((state) => ({ ...state, tipoRadio28 }));
  }

  /** Actualiza el valor de tipoRadio29 en el estado. */
  public setTipoRadio29(tipoRadio29: string): void {
    this.update((state) => ({ ...state, tipoRadio29 }));
  }

  /** Actualiza el valor de tipoRadio30 en el estado. */
  public setTipoRadio30(tipoRadio30: string): void {
    this.update((state) => ({ ...state, tipoRadio30 }));
  }

  /** Actualiza el valor de tipoRadio31 en el estado. */
  public setTipoRadio31(tipoRadio31: string): void {
    this.update((state) => ({ ...state, tipoRadio31 }));
  }

  /** Actualiza el valor de tipoRadio32 en el estado. */
  public setTipoRadio32(tipoRadio32: string): void {
    this.update((state) => ({ ...state, tipoRadio32 }));
  }

  /** Actualiza el valor de tipoRadio33 en el estado. */
  public setTipoRadio33(tipoRadio33: string): void {
    this.update((state) => ({ ...state, tipoRadio33 }));
  }

  /** Actualiza el valor de tipoRadio34 en el estado. */
  public setTipoRadio34(tipoRadio34: string): void {
    this.update((state) => ({ ...state, tipoRadio34 }));
  }

  /** Actualiza el valor de sectorProductivo en el estado. */
  public setSectorProductivo(sectorProductivo: string): void {
    this.update((state) => ({ ...state, sectorProductivo }));
  }

  /** Actualiza el valor de servicio en el estado. */
  public setServicio(servicio: string): void {
    this.update((state) => ({ ...state, servicio }));
  }

  /** Actualiza el valor de domicilio en el estado. */
  public setDomicilio(domicilio: string): void {
    this.update((state) => ({ ...state, domicilio }));
  }

  /** Actualiza el valor de biomestre en el estado. */
  public setBiomestre(biomestre: string): void {
    this.update((state) => ({ ...state, biomestre }));
  }

  /** Actualiza el valor de numeroEmpleados en el estado. */
  public setNumeroEmpleados(numeroEmpleados: string): void {
    this.update((state) => ({ ...state, numeroEmpleados }));
  }

  /** Actualiza el valor de domicillio en el estado. */
  public setDomicillio(domicillio: string): void {
    this.update((state) => ({ ...state, domicillio }));
  }

  /** Actualiza el valor de file1 en el estado. */
  public setFile1(file1: string): void {
    this.update((state) => ({ ...state, file1 }));
  }

  /** Actualiza el valor de file2 en el estado. */
  public setFile2(file2: string): void {
    this.update((state) => ({ ...state, file2 }));
  }

  /** Actualiza el valor de actualmente en el estado. */
  public setActualmente(actualmente: string): void {
    this.update((state) => ({ ...state, actualmente }));
  }

  /** Actualiza el valor de actualmente2 en el estado. */
  public setActualmente2(actualmente2: string): void {
    this.update((state) => ({ ...state, actualmente2 }));
  }

  /** Actualiza el valor de sistemaIdentificacion en el estado. */
  public setSistemaIdentificacion(sistemaIdentificacion: string): void {
    this.update((state) => ({ ...state, sistemaIdentificacion }));
  }

  /** Actualiza el valor de lugarRadicacion en el estado. */
  public setLugarRadicacion(lugarRadicacion: string): void {
    this.update((state) => ({ ...state, lugarRadicacion }));
  }

  /** Actualiza el valor de sistemaControlInventarios en el estado. */
  public setSistemaControlInventarios(sistemaControlInventarios: boolean): void {
    this.update((state) => ({ ...state, sistemaControlInventarios }));
  }

  /** Actualiza el valor de rfcTercero en el estado. */
  public setRfcTercero(rfcTercero: string): void {
    this.update((state) => ({ ...state, rfcTercero }));
  }

  /** Actualiza el valor de rfc en el estado. */
  public setRfc(rfc: string): void {
    this.update((state) => ({ ...state, rfc }));
  }

  /** Actualiza el valor de nombre en el estado. */
  public setNombre(nombre: string): void {
    this.update((state) => ({ ...state, nombre }));
  }

  /** Actualiza el valor de apellidoPaterno en el estado. */
  public setApellidoPaterno(apellidoPaterno: string): void {
    this.update((state) => ({ ...state, apellidoPaterno }));
  }

  /** Actualiza el valor de apellidoMaterno en el estado. */
  public setApellidoMaterno(apellidoMaterno: string): void {
    this.update((state) => ({ ...state, apellidoMaterno }));
  }

  /** Actualiza el valor de telefono en el estado. */
  public setTelefono(telefono: string): void {
    this.update((state) => ({ ...state, telefono }));
  }

  /** Actualiza el valor de correoElectronico en el estado. */
  public setCorreoElectronico(correoElectronico: string): void {
    this.update((state) => ({ ...state, correoElectronico }));
  }

  /** Actualiza el valor de monto en el estado. */
  public setMonto(monto: string): void {
    this.update((state) => ({ ...state, monto }));
  }

  /** Actualiza el valor de operacionesBancarias en el estado. */
  public setOperacionesBancarias(operacionesBancarias: string): void {
    this.update((state) => ({ ...state, operacionesBancarias }));
  }

  /** Actualiza el valor de llavePago en el estado. */
  public setLlavePago(llavePago: string): void {
    this.update((state) => ({ ...state, llavePago }));
  }

  /** Actualiza el valor de modalidad en el estado. */
  public setModalidad(modalidad: string): void {
    this.update((state) => ({ ...state, modalidad }));
  }

  /** Actualiza el valor de fechaRegistro en el estado. */
  public setFechaRegistro(fechaRegistro: string): void {
    this.update((state) => ({ ...state, fechaRegistro }));
  }

  /** Actualiza el valor de numeroAutorizacion en el estado. */
  public setNumeroAutorizacion(numeroAutorizacion: string): void {
    this.update((state) => ({ ...state, numeroAutorizacion }));
  }

  /** Actualiza el valor de radioAutorizo en el estado. */
  public setRadioAutorizo(radioAutorizo: string): void {
    this.update((state) => ({ ...state, radioAutorizo }));
  }

  /** Actualiza el valor de radioClasificacion en el estado. */
  public setRadioClasificacion(radioClasificacion: string): void {
    this.update((state) => ({ ...state, radioClasificacion }));
  }

  /** Actualiza el valor de caracter en el estado. */
  public setCaracter(caracter: string): void {
    this.update((state) => ({ ...state, caracter }));
  }

  /** Actualiza el valor de nacionalidad en el estado. */
  public setNacionalidad(nacionalidad: string): void {
    this.update((state) => ({ ...state, nacionalidad }));
  }

  /** Actualiza el valor de fechaInicio en el estado. */
  public setFechaInicio(fechaInicio: string): void {
    this.update((state) => ({ ...state, fechaInicio }));
  }

  /** Actualiza el valor de fechaPago en el estado. */
  public setFechaPago(fechaPago: string): void {
    this.update((state) => ({ ...state, fechaPago }));
  }

  /** Actualiza el valor de entidadFederativa en el estado. */
  public setEntidadFederativa(entidadFederativa: string): void {
    this.update((state) => ({ ...state, entidadFederativa }));
  }

  /** Actualiza el valor de municipio en el estado. */
  public setMunicipio(municipio: string): void {
    this.update((state) => ({ ...state, municipio }));
  }

  /** Actualiza el valor de tipoDeInstalacion en el estado. */
  public setTipoDeInstalacion(tipoDeInstalacion: string): void {
    this.update((state) => ({ ...state, tipoDeInstalacion }));
  }

  /** Actualiza el valor de registroSESAT en el estado. */
  public setRegistroSESAT(registroSESAT: string): void {
    this.update((state) => ({ ...state, registroSESAT }));
  }

  /** Actualiza el valor de descripcion en el estado. */
  public setDescripcion(descripcion: string): void {
    this.update((state) => ({ ...state, descripcion }));
  }

  /** Actualiza el valor de codigoPostal en el estado. */
  public setCodigoPostal(codigoPostal: string): void {
    this.update((state) => ({ ...state, codigoPostal }));
  }

  /** Restaura el estado al valor inicial. */
  public limpiarSolicitud(): void {
    this.reset();
  }
}