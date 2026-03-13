import { Store, StoreConfig } from '@datorama/akita';
import { EnlaceConfiguracionItem } from '../../tramites/31601/enum/enlance-tabla.enum';
import { Injectable } from '@angular/core';
import { MencioneConfiguracionItem } from '../../tramites/31601/enum/mencione-tabla.enum';

import { Antecesor } from '../../tramites/31601/modelos/antecesor.modal';
import { ControlInventariosItem } from '../../tramites/31601/models/models31601.model';

/**
 * Interfaz que representa el estado de Solicitud31601.
 */
export interface Solicitud31601State {
  nombreCompleto: string;
  tipoDePersonaMiembro: string;
  nombreMiembro: string;
  apellidoPaternoMiembro: string;
  apellidoMaternoMiembro: string;
  nombreDeLaEmpresaMiembro: string;
  miembrosSeleccionados: Antecesor[];
  autorizacionIVAIEPS: string;
  regimen_0: boolean;
  regimen_1: boolean;
  regimen_2: boolean;
  regimen_3: boolean;
  sectorProductivo: string;
  servicio: string;
  preOperativo: boolean;
  indiqueSi: boolean;
  senale: boolean;
  empPropios: string;
  bimestre: string;
  senaleSi: boolean;
  seMomento: boolean;
  cumplir: boolean;
  indique: boolean;
  encuentra: boolean;
  delMismo: boolean;
  senaleMomento: boolean;
  enCaso: boolean;
  comboBimestresIDCSeleccione: string;
  ingresar: boolean;
  encuentraSus: boolean;
  registrosQue: string;
  registrosQue2: string;
  momentoIngresar: boolean;
  indiqueCuenta: boolean;
  nombreDel: string;
  lugarDeRadicacion: string;
  contabilidad: boolean;
  rmfRadio: boolean;
  vinculacionRegistroCancelado: boolean;
  proveedoresListadoSAT: boolean;
  indiqueCheck: boolean;
  resigtro: string;
  telefono: string;
  correo: string;
  manifieste: string;
  indiqueIva: string;
  empleados: boolean;
  infraestructura: boolean;
  monto: boolean;
  antiguedad: boolean;
  tipoDe: string;
  valorPesos: string;
  descripcion: string;
  haContado: string;
  enCasoIva: string;
  numeroOperacion: string;
  banco: string;
  llavePago: string;
  importaciones: string;
  infraestructuraIndique: string;
  ultimosMeses: string;
  operacionesmeses: string;
  valor: string;
  transferencias: number;
  transferenciasVir: number;
  retornos: number;
  retornosSe: number;
  constancias: number;
  constanciasDe: number;
  empleadosPropiosRegimen: string;
  numeroEmpleadosUno: number;
  numeroEmpleadosDos: number;
  numeroEmpleadosTres: number;
  comboBimestresUno: string;
  comboBimestresDos: string;
  comboBimestresTres: string;
  proveedorCumplimiento: string;
  declaracionISR: string;
  cancelacion: string;
  cumplimientoReglas: string;
  recintoFiscalizado: string;
  recintoEstrategico: string;
  cumplimientoLineamientos: string;
  squemaIntegral: string;
  sidoModificadas: string;
  ensucaracterde: string;
  rfc: string;
  obligadoaTributarenMexico: string;
  nacionalidad: string;
  registroFederaldeContribuyentes: string;
  resigtroReprestantante: string;
  rfcReprestantante: string;
  nombreReprestante: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  cuidad: string;
  cargo: string;
  telefonoReprestantante: string;
  correoReprestantante: string;
  suplente: string;
  estadoResidencia: string;
  tipoDocumento: string;
  mencioneDatos: MencioneConfiguracionItem[];
  enlaceDatos: EnlaceConfiguracionItem[];
  controlInventariosDatos: ControlInventariosItem[];
  cancelacionProcedimiento: string;
  cumpleLineamientos: string;
  nombre: string;
  rfcDatos:string;
    indiques: string;
  cuenta: string;
  mismo: string;
  empresa: string;
  propios: string;
  empleadoss: string;
  socios: string;
  encuentras: string;
  cumplido: string;
  procedimiento: string;
  determinan: string;
   transferenciasDatos: string;
  transferenciasdos: string;
  retornosDatos: string;
  retornosdos: string;
  constanciasDatos: string;
  constanciasdos: string;
  monedaTotal: string;
  porcentajeTotal: string;
  capture:string;
  deEmpleados: string;
bimestreDatos: string;
numeroDeEmpleados: string;
bimestredos: string;
numeroDatos: string;
bimestres: string;

  fechaPago: string;
  acredite: string;
   principales: string;
  municipio: string;
  instalacion: string;
  federativa: string;
  registro: string;
  colonia: string;
  postal: string;
  proceso: string;
  inmueble: string;
  federativaSeleccionada: string;
}
/**
 * Función para crear el estado inicial de Solicitud31601.
 * @returns {Solicitud31601State} El estado inicial de Solicitud31601.
 */
export function createInitialState(): Solicitud31601State {
  return {
    nombreCompleto: '',
    tipoDePersonaMiembro: '',
    nombreMiembro: '',
    apellidoPaternoMiembro: '',
    apellidoMaternoMiembro: '',
    nombreDeLaEmpresaMiembro: '',
    miembrosSeleccionados: [],
    autorizacionIVAIEPS: '',
    regimen_0: false,
    regimen_1: false,
    regimen_2: false,
    regimen_3: false,
    sectorProductivo: '',
    servicio: '',
    preOperativo: false,
    indiqueSi: false,
    senale: false,
    empPropios: '',
    bimestre: '',
    senaleSi: false,
    seMomento: false,
    cumplir: false,
    indique: false,
    encuentra: false,
    delMismo: false,
    senaleMomento: false,
    enCaso: false,
    comboBimestresIDCSeleccione: '',
    ingresar: false,
    encuentraSus: false,
    registrosQue: '',
    registrosQue2: '',
    momentoIngresar: false,
    indiqueCuenta: false,
    nombreDel: '',
    lugarDeRadicacion: '',
    contabilidad: false,
    rmfRadio: false,
    vinculacionRegistroCancelado: false,
    proveedoresListadoSAT: false,
    indiqueCheck: false,
    resigtro: '',
    telefono: '',
    correo: '',
    manifieste: '',
    indiqueIva: '',
    empleados: false,
    infraestructura: false,
    monto: false,
    antiguedad: false,
    tipoDe: '',
    valorPesos: '',
    descripcion: '',
    haContado: '',
    enCasoIva: '',
    numeroOperacion: '',
    banco: '',
    llavePago: '',
    importaciones: '',
    infraestructuraIndique: '',
    ultimosMeses: '',
    operacionesmeses: '',
    valor: '',
    transferencias: 0,
    transferenciasVir: 0,
    retornos: 0,
    retornosSe: 0,
    constancias: 0,
    constanciasDe: 0,
    empleadosPropiosRegimen: '',
    numeroEmpleadosUno: 1,
    numeroEmpleadosDos: 1,
    numeroEmpleadosTres: 1,
    comboBimestresUno: '',
    comboBimestresDos: '',
    comboBimestresTres: '',
    proveedorCumplimiento: '',
    declaracionISR: '',
    cancelacion: '',
    cumplimientoReglas: '',
    recintoFiscalizado: '',
    recintoEstrategico: '',
    cumplimientoLineamientos: '',
    squemaIntegral: '',
    sidoModificadas: '',
    ensucaracterde: '',
    rfc: '',
    obligadoaTributarenMexico: '',
    nacionalidad: '',
    registroFederaldeContribuyentes: '',
    resigtroReprestantante: '',
    rfcReprestantante: '',
    nombreReprestante: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    cuidad: '',
    cargo: '',
    telefonoReprestantante: '',
    correoReprestantante: '',
    suplente: '',
    estadoResidencia: '',
    tipoDocumento: '',
    mencioneDatos: [],
    enlaceDatos: [],
    controlInventariosDatos: [],
    cancelacionProcedimiento: '',
    cumpleLineamientos: '',
    nombre:  '',
  rfcDatos: '',
   indiques: '',
      cuenta: '',
      mismo: '',
      empresa: '',
      propios: '',
      empleadoss: '',
      socios: '',
      encuentras: '',
      cumplido: '',
      procedimiento: '',
      determinan: '',
        transferenciasDatos: '',
    transferenciasdos: '',
    retornosDatos: '',
    retornosdos: '',
    constanciasDatos: '',
    constanciasdos: '',
    monedaTotal: '',
    porcentajeTotal: '',
    capture: '',
     bimestreDatos: '',
    numeroDeEmpleados: '',
    bimestredos: '',
    numeroDatos: '',
    bimestres: '',
    deEmpleados:'',
    fechaPago:'',
    acredite: '',
      principales: '',
  municipio: '',
  instalacion: '',
  federativa: '',
  registro: '',
  colonia: '',
  postal: '',
  proceso: '',
  inmueble: '',
  federativaSeleccionada: ''
  };
}
/**
 * Decorador Injectable para hacer que la tienda esté disponible a nivel raíz.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite31601', resettable: true })
export class Tramite31601Store extends Store<Solicitud31601State> {
  constructor() {
    super(createInitialState());
  }

  /**
 * Establece los datos de la tabla "Mencione" en el estado.
 * @param datosTablaMencione - Lista de elementos de configuración para la tabla Mencione.
 */
setMencioneTablaDatos(datosTablaMencione: MencioneConfiguracionItem[]): void {
  this.update((state) => ({
    ...state,
    mencioneDatos: datosTablaMencione,
  }));
}

/**
 * Establece los datos de la tabla "Enlace" en el estado.
 * @param datosTablaEnlace - Lista de elementos de configuración para la tabla Enlace.
 */
setEnlaceTablaDatos(datosTablaEnlace: EnlaceConfiguracionItem[]): void {
  this.update((state) => ({
    ...state,
    enlaceDatos: datosTablaEnlace,
  }));
}

/**
 * Establece los datos de la tabla "Control de Inventarios" en el estado.
 * @param datosTablaControlInventarios - Lista de elementos para control de inventarios.
 */
setControlInventariosTablaDatos(datosTablaControlInventarios: ControlInventariosItem[]): void {
  this.update((state) => ({
    ...state,
    controlInventariosDatos: datosTablaControlInventarios,
  }));
}

/**
 * Agrega un miembro de la empresa a la lista de miembros seleccionados.
 * @param miembro - Objeto del tipo Antecesor que representa al miembro a agregar.
 */
agregarMiembrodelaempresaTable(miembro: Antecesor): void {
  this.update((state) => ({
    ...state,
    miembrosSeleccionados: [...state.miembrosSeleccionados, miembro],
  }));
}

/**
 * Elimina un miembro de la empresa de la lista de miembros seleccionados.
 * @param miembro - Objeto del tipo Antecesor que representa al miembro a eliminar.
 */
eliminarMiembrodelaempresaTable(miembro: Antecesor): void {
  this.update((state) => ({
    ...state,
    miembrosSeleccionados: state.miembrosSeleccionados.filter((m) => m !== miembro),
  }));
}

/**
 * Establece el tipo de persona del miembro en el estado.
 * @param tipoDePersonaMiembro - Cadena que representa el tipo de persona.
 */
public setTipoDePersonaMiembro(tipoDePersonaMiembro: string): void {
  this.update((state) => ({
    ...state,
    tipoDePersonaMiembro,
  }));
}


  /* Establece el nombre del miembro en el estado */
public setNombreMiembro(nombreMiembro: string): void {
  this.update((state) => ({
    ...state,
    nombreMiembro,
  }));
}

/* Establece el apellido paterno del miembro en el estado */
public setApellidoPaternoMiembro(apellidoPaternoMiembro: string): void {
  this.update((state) => ({
    ...state,
    apellidoPaternoMiembro,
  }));
}

/* Establece el apellido materno del miembro en el estado */
public setApellidoMaternoMiembro(apellidoMaternoMiembro: string): void {
  this.update((state) => ({
    ...state,
    apellidoMaternoMiembro,
  }));
}

/* Establece el nombre de la empresa del miembro en el estado */
public setNombreDeLaEmpresaMiembro(nombreDeLaEmpresaMiembro: string): void {
  this.update((state) => ({
    ...state,
    nombreDeLaEmpresaMiembro,
  }));
}

/* Establece la autorización de IVA o IEPS en el estado */
public setAutorizacionIVAIEPS(autorizacionIVAIEPS: string): void {
  this.update((state) => ({
    ...state,
    autorizacionIVAIEPS,
  }));
}

/* Establece si el régimen 0 está activo en el estado */
public setRegimen_0(regimen_0: boolean): void {
  this.update((state) => ({
    ...state,
    regimen_0,
  }));
}

/* Establece si el régimen 1 está activo en el estado */
public setRegimen_1(regimen_1: boolean): void {
  this.update((state) => ({
    ...state,
    regimen_1,
  }));
}

/* Establece si el régimen 2 está activo en el estado */
public setRegimen_2(regimen_2: boolean): void {
  this.update((state) => ({
    ...state,
    regimen_2,
  }));
}

/* Establece si el régimen 3 está activo en el estado */
public setRegimen_3(regimen_3: boolean): void {
  this.update((state) => ({
    ...state,
    regimen_3,
  }));
}

/* Establece el sector productivo en el estado */
public setSectorProductivo(sectorProductivo: string): void {
  this.update((state) => ({
    ...state,
    sectorProductivo,
  }));
}

/* Establece el servicio en el estado */
public setServicio(servicio: string): void {
  this.update((state) => ({
    ...state,
    servicio,
  }));
}

 /* Establece el valor de preOperativo en el estado */
public setPreOperativo(preOperativo: boolean): void {
  this.update((state) => ({
    ...state,
    preOperativo,
  }));
}

/* Establece el valor de indiqueSi en el estado */
public setIndiqueSi(indiqueSi: boolean): void {
  this.update((state) => ({
    ...state,
    indiqueSi,
  }));
}

/* Establece el valor de senale en el estado */
public setSenale(senale: boolean): void {
  this.update((state) => ({
    ...state,
    senale,
  }));
}

/* Establece el valor de empPropios en el estado */
public setEmpPropios(empPropios: string): void {
  this.update((state) => ({
    ...state,
    empPropios,
  }));
}

/* Establece el valor de bimestre en el estado */
public setBimestre(bimestre: string): void {
  this.update((state) => ({
    ...state,
    bimestre,
  }));
}

/* Establece el valor de senaleSi en el estado */
public setSenaleSi(senaleSi: boolean): void {
  this.update((state) => ({
    ...state,
    senaleSi,
  }));
}

/* Establece el valor de seMomento en el estado */
public setSeMomento(seMomento: boolean): void {
  this.update((state) => ({
    ...state,
    seMomento,
  }));
}

/* Establece el valor de cumplir en el estado */
public setCumplir(cumplir: boolean): void {
  this.update((state) => ({
    ...state,
    cumplir,
  }));
}

/* Establece el valor de indique en el estado */
public setIndique(indique: boolean): void {
  this.update((state) => ({
    ...state,
    indique,
  }));
}

/* Establece el valor de encuentra en el estado */
public setEncuentra(encuentra: boolean): void {
  this.update((state) => ({
    ...state,
    encuentra,
  }));
}

/* Establece el valor de delMismo en el estado */
public setDelMismo(delMismo: boolean): void {
  this.update((state) => ({
    ...state,
    delMismo,
  }));
}

/* Establece el valor de senaleMomento en el estado */
public setSenaleMomento(senaleMomento: boolean): void {
  this.update((state) => ({
    ...state,
    senaleMomento,
  }));
}

/* Establece el valor de enCaso en el estado */
public setEnCaso(enCaso: boolean): void {
  this.update((state) => ({
    ...state,
    enCaso,
  }));
}

/* Establece el valor de comboBimestresIDCSeleccione en el estado */
public setComboBimestresIDCSeleccione(comboBimestresIDCSeleccione: string): void {
  this.update((state) => ({
    ...state,
    comboBimestresIDCSeleccione,
  }));
}

/* Establece el valor de ingresar en el estado */
public setIngresar(ingresar: boolean): void {
  this.update((state) => ({
    ...state,
    ingresar,
  }));
}

/* Establece el valor de encuentraSus en el estado */
public setEncuentraSus(encuentraSus: boolean): void {
  this.update((state) => ({
    ...state,
    encuentraSus,
  }));
}

/* Establece el valor de registrosQue en el estado */
public setRegistrosQue(registrosQue: string): void {
  this.update((state) => ({
    ...state,
    registrosQue,
  }));
}

/* Establece el valor de registrosQue2 en el estado */
public setRegistrosQue2(registrosQue2: string): void {
  this.update((state) => ({
    ...state,
    registrosQue2,
  }));
}

/* Establece el valor de momentoIngresar en el estado */
public setMomentoIngresar(momentoIngresar: boolean): void {
  this.update((state) => ({
    ...state,
    momentoIngresar,
  }));
}

/* Establece el valor de indiqueCuenta en el estado */
public setIndiqueCuenta(indiqueCuenta: boolean): void {
  this.update((state) => ({
    ...state,
    indiqueCuenta,
  }));
}

/* Establece el valor de nombreDel en el estado */
public setNombreDel(nombreDel: string): void {
  this.update((state) => ({
    ...state,
    nombreDel,
  }));
}

/* Establece el lugar de radicación en el estado */
public setLugarDeRadicacion(lugarDeRadicacion: string): void {
  this.update((state) => ({
    ...state,
    lugarDeRadicacion,
  }));
}

/* Establece si lleva contabilidad en el estado */
public setContabilidad(contabilidad: boolean): void {
  this.update((state) => ({
    ...state,
    contabilidad,
  }));
}

/* Establece el valor de rmfRadio en el estado */
public setRmfRadio(rmfRadio: boolean): void {
  this.update((state) => ({
    ...state,
    rmfRadio,
  }));
}

/* Establece si hay vinculación con registro cancelado en el estado */
public setVinculacionRegistroCancelado(vinculacionRegistroCancelado: boolean): void {
  this.update((state) => ({
    ...state,
    vinculacionRegistroCancelado,
  }));
}

/* Establece si aparece en el listado del SAT de proveedores en el estado */
public setProveedoresListadoSAT(proveedoresListadoSAT: boolean): void {
  this.update((state) => ({
    ...state,
    proveedoresListadoSAT,
  }));
}

/* Establece el valor del campo indiqueCheck en el estado */
public setIndiqueCheck(indiqueCheck: boolean): void {
  this.update((state) => ({
    ...state,
    indiqueCheck,
  }));
}

/* Establece el valor de resigtro en el estado */
public setResigtro(resigtro: string): void {
  this.update((state) => ({
    ...state,
    resigtro,
  }));
}

/* Establece el número de teléfono en el estado */
public setTelefono(telefono: string): void {
  this.update((state) => ({
    ...state,
    telefono,
  }));
}

/* Establece el correo electrónico en el estado */
public setCorreo(correo: string): void {
  this.update((state) => ({
    ...state,
    correo,
  }));
}

/* Establece el valor del campo manifieste en el estado */
public setManifieste(manifieste: string): void {
  this.update((state) => ({
    ...state,
    manifieste,
  }));
}

/* Establece el valor del campo indiqueIva en el estado */
public setIndiqueIva(indiqueIva: string): void {
  this.update((state) => ({
    ...state,
    indiqueIva,
  }));
}

/* Establece si tiene empleados en el estado */
public setEmpleados(empleados: boolean): void {
  this.update((state) => ({
    ...state,
    empleados,
  }));
}

/* Establece si tiene infraestructura en el estado */
public setInfraestructura(infraestructura: boolean): void {
  this.update((state) => ({
    ...state,
    infraestructura,
  }));
}

/* Establece el valor del campo monto en el estado */
public setMonto(monto: boolean): void {
  this.update((state) => ({
    ...state,
    monto,
  }));
}

/* Establece la antigüedad en el estado */
public setAntiguedad(antiguedad: boolean): void {
  this.update((state) => ({
    ...state,
    antiguedad,
  }));
}

/* Establece el tipo en el estado */
public setTipoDe(tipoDe: string): void {
  this.update((state) => ({
    ...state,
    tipoDe,
  }));
}

/* Establece el valor en pesos en el estado */
public setValorPesos(valorPesos: string): void {
  this.update((state) => ({
    ...state,
    valorPesos,
  }));
}

/* Establece la descripción en el estado */
public setDescripcion(descripcion: string): void {
  this.update((state) => ({
    ...state,
    descripcion,
  }));
}

/* Establece el valor de haContado en el estado */
public setHaContado(haContado: string): void {
  this.update((state) => ({
    ...state,
    haContado,
  }));
}

/* Establece el valor de enCasoIva en el estado */
public setEnCasoIva(enCasoIva: string): void {
  this.update((state) => ({
    ...state,
    enCasoIva,
  }));
}

/* Establece el número de operación en el estado */
public setNumeroOperacion(numeroOperacion: string): void {
  this.update((state) => ({
    ...state,
    numeroOperacion,
  }));
}

/* Establece el nombre del banco en el estado */
public setBanco(banco: string): void {
  this.update((state) => ({
    ...state,
    banco,
  }));
}

/* Establece la llave de pago en el estado */
public setLlavePago(llavePago: string): void {
  this.update((state) => ({
    ...state,
    llavePago,
  }));
}

/* Establece las importaciones en el estado */
public setImportaciones(importaciones: string): void {
  this.update((state) => ({
    ...state,
    importaciones,
  }));
}

/* Establece el detalle de infraestructura indicado en el estado */
public setInfraestructuraIndique(infraestructuraIndique: string): void {
  this.update((state) => ({
    ...state,
    infraestructuraIndique,
  }));
}

/* Establece los últimos meses en el estado */
public setUltimosMeses(ultimosMeses: string): void {
  this.update((state) => ({
    ...state,
    ultimosMeses,
  }));
}

/* Establece las operaciones por meses en el estado */
public setOperacionesmeses(operacionesmeses: string): void {
  this.update((state) => ({
    ...state,
    operacionesmeses,
  }));
}

/* Establece el valor en el estado */
public setValor(valor: string): void {
  this.update((state) => ({
    ...state,
    valor,
  }));
}


/* Establece el valor de transferencias en el estado */
public setTransferencias(transferencias: number): void {
  this.update((state) => ({
    ...state,
    transferencias,
  }));
}

/* Establece el valor de transferencias virtuales en el estado */
public setTransferenciasVir(transferenciasVir: number): void {
  this.update((state) => ({
    ...state,
    transferenciasVir,
  }));
}

/* Establece el valor de retornos en el estado */
public setRetornos(retornos: number): void {
  this.update((state) => ({
    ...state,
    retornos,
  }));
}

/* Establece el valor de retornos secundarios en el estado */
public setRetornosSe(retornosSe: number): void {
  this.update((state) => ({
    ...state,
    retornosSe,
  }));
}

/* Establece el número de constancias en el estado */
public setConstancias(constancias: number): void {
  this.update((state) => ({
    ...state,
    constancias,
  }));
}

/* Establece el número de constancias de un tipo específico en el estado */
public setConstanciasDe(constanciasDe: number): void {
  this.update((state) => ({
    ...state,
    constanciasDe,
  }));
}

/* Establece el régimen de empleados propios en el estado */
public setEmpleadosPropiosRegimen(empleadosPropiosRegimen: string): void {
  this.update((state) => ({
    ...state,
    empleadosPropiosRegimen,
  }));
}

/* Establece el número de empleados tipo uno en el estado */
public setNumeroEmpleadosUno(numeroEmpleadosUno: number): void {
  this.update((state) => ({
    ...state,
    numeroEmpleadosUno,
  }));
}

/* Establece el número de empleados tipo dos en el estado */
public setNumeroEmpleadosDos(numeroEmpleadosDos: number): void {
  this.update((state) => ({
    ...state,
    numeroEmpleadosDos,
  }));
}

/* Establece el número de empleados tipo tres en el estado */
public setNumeroEmpleadosTres(numeroEmpleadosTres: number): void {
  this.update((state) => ({
    ...state,
    numeroEmpleadosTres,
  }));
}

/* Establece el valor del primer combo de bimestres en el estado */
public setComboBimestresUno(comboBimestresUno: string): void {
  this.update((state) => ({
    ...state,
    comboBimestresUno,
  }));
}

/* Establece el valor del segundo combo de bimestres en el estado */
public setComboBimestresDos(comboBimestresDos: string): void {
  this.update((state) => ({
    ...state,
    comboBimestresDos,
  }));
}

/* Establece el valor del tercer combo de bimestres en el estado */
public setComboBimestresTres(comboBimestresTres: string): void {
  this.update((state) => ({
    ...state,
    comboBimestresTres,
  }));
}

/* Establece la información del proveedor de cumplimiento en el estado */
public setProveedorCumplimiento(proveedorCumplimiento: string): void {
  this.update((state) => ({
    ...state,
    proveedorCumplimiento,
  }));
}

/* Establece la declaración ISR en el estado */
public setDeclaracionISR(declaracionISR: string): void {
  this.update((state) => ({
    ...state,
    declaracionISR,
  }));
}

/* Establece el valor de cancelación en el estado */
public setCancelacion(cancelacion: string): void {
  this.update((state) => ({
    ...state,
    cancelacion,
  }));
}

/* Establece el cumplimiento de reglas en el estado */
public setCumplimientoReglas(cumplimientoReglas: string): void {
  this.update((state) => ({
    ...state,
    cumplimientoReglas,
  }));
}

/* Establece el valor del recinto fiscalizado en el estado */
public setRecintoFiscalizado(recintoFiscalizado: string): void {
  this.update((state) => ({
    ...state,
    recintoFiscalizado,
  }));
}

/* Establece el valor del recinto estratégico en el estado */
public setRecintoEstrategico(recintoEstrategico: string): void {
  this.update((state) => ({
    ...state,
    recintoEstrategico,
  }));
}

/* Establece el cumplimiento de lineamientos en el estado */
public setCumplimientoLineamientos(cumpleLineamientos: string): void {
  this.update((state) => ({
    ...state,
    cumpleLineamientos,
  }));
}


/* Establece el valor del esquema integral en el estado */
public setSquemaIntegral(squemaIntegral: string): void {
  this.update((state) => ({
    ...state,
    squemaIntegral,
  }));
}

/* Establece si han sido modificadas en el estado */
public setSidoModificadas(sidoModificadas: string): void {
  this.update((state) => ({
    ...state,
    sidoModificadas,
  }));
}

/* Establece el carácter de la persona o entidad en el estado */
public setEnsucaracterde(ensucaracterde: string): void {
  this.update((state) => ({
    ...state,
    ensucaracterde,
  }));
}

/* Establece el RFC en el estado */
public setRfc(rfc: string): void {
  this.update((state) => ({
    ...state,
    rfc,
  }));
}

/* Establece si está obligado a tributar en México en el estado */
public setObligadoaTributarenMexico(obligadoaTributarenMexico: string): void {
  this.update((state) => ({
    ...state,
    obligadoaTributarenMexico,
  }));
}

/* Establece la nacionalidad en el estado */
public setNacionalidad(nacionalidad: string): void {
  this.update((state) => ({
    ...state,
    nacionalidad,
  }));
}

/* Establece el registro federal de contribuyentes en el estado */
public setRegistroFederaldeContribuyentes(registroFederaldeContribuyentes: string): void {
  this.update((state) => ({
    ...state,
    registroFederaldeContribuyentes,
  }));
}

/* Establece el registro del representante en el estado */
public setResigtroReprestantante(resigtroReprestantante: string): void {
  this.update((state) => ({
    ...state,
    resigtroReprestantante,
  }));
}

/* Establece el RFC del representante en el estado */
public setRfcReprestantante(rfcReprestantante: string): void {
  this.update((state) => ({
    ...state,
    rfcReprestantante,
  }));
}

/* Establece el nombre del representante en el estado */
public setNombreReprestante(nombreReprestante: string): void {
  this.update((state) => ({
    ...state,
    nombreReprestante,
  }));
}

/* Establece el apellido paterno del representante en el estado */
public setApellidoPaterno(apellidoPaterno: string): void {
  this.update((state) => ({
    ...state,
    apellidoPaterno,
  }));
}

/* Establece el apellido materno del representante en el estado */
public setApellidoMaterno(apellidoMaterno: string): void {
  this.update((state) => ({
    ...state,
    apellidoMaterno,
  }));
}

/* Establece la ciudad en el estado */
public setCuidad(cuidad: string): void {
  this.update((state) => ({
    ...state,
    cuidad,
  }));
}

/* Establece el cargo en el estado */
public setCargo(cargo: string): void {
  this.update((state) => ({
    ...state,
    cargo,
  }));
}


/* Establece el teléfono del representante en el estado */
public setTelefonoReprestantante(telefonoReprestantante: string): void {
  this.update((state) => ({
    ...state,
    telefonoReprestantante,
  }));
}

/* Establece el correo del representante en el estado */
public setCorreoReprestantante(correoReprestantante: string): void {
  this.update((state) => ({
    ...state,
    correoReprestantante,
  }));
}

/* Establece el suplente en el estado */
public setSuplente(suplente: string): void {
  this.update((state) => ({
    ...state,
    suplente,
  }));
}

/* Establece el estado de residencia en el estado */
public setEstadoResidencia(estadoResidencia: string): void {
  this.update((state) => ({
    ...state,
    estadoResidencia,
  }));
}

/* Establece el tipo de documento en el estado */
public setTipoDocumento(tipoDocumento: string): void {
  this.update((state) => ({
    ...state,
    tipoDocumento,
  }));
}

/* Establece el motivo de cancelación del procedimiento en el estado */
public setCancelacionProcedimiento(cancelacionProcedimiento: string): void {
  this.update((state) => ({
    ...state,
    cancelacionProcedimiento,
  }));
}

/* Establece si cumple con los lineamientos en el estado */
public setCumpleLineamientos(cumpleLineamientos: string): void {
  this.update((state) => ({
    ...state,
    cumpleLineamientos,
  }));
}

/* Establece el RFC de los datos en el estado */
public setRfcDatos(rfcDatos: string): void {
  this.update((state) => ({
    ...state,
    rfcDatos,
  }));
}

/* Establece el nombre en el estado */
public setNombre(nombre: string): void {
  this.update((state) => ({
    ...state,
    nombre,
  }));
}

/* Establece el valor del campo 'indiques' en el estado */
setIndiques(val: string): void {
  this.update(state => ({
    ...state,
    indiques: val
  }));
}

/* Establece el valor del campo 'cuenta' en el estado */
setCuenta(val: string): void {
  this.update(state => ({
    ...state,
    cuenta: val
  }));
}

/* Establece el valor del campo 'mismo' en el estado */
setMismo(val: string): void {
  this.update(state => ({
    ...state,
    mismo: val
  }));
}

/* Establece el valor del campo 'empresa' en el estado */
setEmpresa(val: string): void {
  this.update(state => ({
    ...state,
    empresa: val
  }));
}

/* Establece el valor del campo 'propios' en el estado */
setPropios(val: string): void {
  this.update(state => ({
    ...state,
    propios: val
  }));
}

/* Establece el valor del campo 'empleadoss' en el estado */
setEmpleadoss(val: string): void {
  this.update(state => ({
    ...state,
    empleadoss: val
  }));
}

/* Establece el valor del campo 'socios' en el estado */
setSocios(val: string): void {
  this.update(state => ({
    ...state,
    socios: val
  }));
}

/* Establece el valor del campo 'encuentras' en el estado */
setEncuentras(val: string): void {
  this.update(state => ({
    ...state,
    encuentras: val
  }));
}

/* Establece el valor del campo 'cumplido' en el estado */
setCumplido(val: string): void {
  this.update(state => ({
    ...state,
    cumplido: val
  }));
}
/* Establece el valor del procedimiento en el estado */
setProcedimiento(val: string): void {
  this.update(state => ({
    ...state,
    procedimiento: val
  }));
}

/* Establece el valor de determinan en el estado */
setDeterminan(val: string): void {
  this.update(state => ({
    ...state,
    determinan: val
  }));
}

/* Establece los datos de transferencias en el estado */
setTransferenciasDatos(value: string): void {
  this.update((state) => ({
    ...state,
    transferenciasDatos: value,
  }));
}

/* Establece el segundo valor de transferencias en el estado */
setTransferenciasdos(value: string): void {
  this.update((state) => ({
    ...state,
    transferenciasdos: value,
  }));
}

/* Establece los datos de retornos en el estado */
setRetornosDatos(value: string): void {
  this.update((state) => ({
    ...state,
    retornosDatos: value,
  }));
}

/* Establece el segundo valor de retornos en el estado */
setRetornosdos(value: string): void {
  this.update((state) => ({
    ...state,
    retornosdos: value,
  }));
}

/* Establece los datos de constancias en el estado */
setConstanciasDatos(value: string): void {
  this.update((state) => ({
    ...state,
    constanciasDatos: value,
  }));
}

/* Establece el segundo valor de constancias en el estado */
setConstanciasdos(value: string): void {
  this.update((state) => ({
    ...state,
    constanciasdos: value,
  }));
}

/* Establece el total en moneda en el estado */
setMonedaTotal(value: string): void {
  this.update((state) => ({
    ...state,
    monedaTotal: value,
  }));
}

/* Establece el porcentaje total en el estado */
setPorcentajeTotal(value: string): void {
  this.update((state) => ({
    ...state,
    porcentajeTotal: value,
  }));
}

/* Establece el valor de capture en el estado */
setCapture(value: string): void {
  this.update((state) => ({
    ...state,
    capture: value,
  }));
}

/* Establece los datos del bimestre en el estado */
setBimestreDatos(bimestreDatos: string): void {
  this.update((state) => ({
    ...state,
    bimestreDatos,
  }));
}

/* Establece el número de empleados en el estado */
setNumeroDeEmpleados(numeroDeEmpleados: string): void {
  this.update((state) => ({
    ...state,
    numeroDeEmpleados,
  }));
}

/* Establece el segundo valor del bimestre en el estado */
setBimestredos(bimestredos: string): void {
  this.update((state) => ({
    ...state,
    bimestredos,
  }));
}

/* Establece el valor de número de datos en el estado */
setNumeroDatos(numeroDatos: string): void {
  this.update((state) => ({
    ...state,
    numeroDatos,
  }));
}

/* Establece el valor de bimestres en el estado */
setBimestres(bimestres: string): void {
  this.update((state) => ({
    ...state,
    bimestres,
  }));
}

/* Establece el valor de "de empleados" en el estado */
setDeEmpleados(deEmpleados: string): void {
  this.update((state) => ({
    ...state,
    deEmpleados,
  }));
}

  /**
   * Establece el valor de la fecha de pago en el estado.
   * @param fechaPago La fecha de pago a establecer.
   */
  public setFechaPago(fechaPago: string): void {
    this.update((state) => ({
      ...state,
      fechaPago,
    }));
  }

  /* Establece el valor de "de empleados" en el estado */
setAcredite(acredite: string): void {
  this.update((state) => ({
    ...state,
    acredite,
  }));
}
/**
 * Actualiza el estado con el valor proporcionado para `principales`.
 */
setPrincipales(principales: string): void {
  this.update((state) => ({
    ...state,
    principales,
  }));
}

/**
 * Actualiza el estado con el valor proporcionado para `municipio`.
 */
setMunicipio(municipio: string): void {
  this.update((state) => ({
    ...state,
    municipio,
  }));
}

/**
 * Actualiza el estado con el valor proporcionado para `instalacion`.
 */
setInstalacion(instalacion: string): void {
  this.update((state) => ({
    ...state,
    instalacion,
  }));
}

/**
 * Actualiza el estado con el valor proporcionado para `federativa`.
 */
setFederativa(federativa: string): void {
  this.update((state) => ({
    ...state,
    federativa,
  }));
}

/**
 * Actualiza el estado con el valor proporcionado para `registro`.
 */
setRegistro(registro: string): void {
  this.update((state) => ({
    ...state,
    registro,
  }));
}

/**
 * Actualiza el estado con el valor proporcionado para `colonia`.
 */
setColonia(colonia: string): void {
  this.update((state) => ({
    ...state,
    colonia,
  }));
}

/**
 * Actualiza el estado con el valor proporcionado para `postal`.
 */
setPostal(postal: string): void {
  this.update((state) => ({
    ...state,
    postal,
  }));
}

/**
 * Actualiza el estado con el valor proporcionado para `proceso`.
 */
setProceso(proceso: string): void {
  this.update((state) => ({
    ...state,
    proceso,
  }));
}

/**
 * Actualiza el estado con el valor proporcionado para `inmueble`.
 */
setInmueble(inmueble: string): void {
  this.update((state) => ({
    ...state,
    inmueble,
  }));
}

/**
 * Actualiza el estado con la entidad federativa seleccionada.
 */
setFederativaSeleccionada(federativaSeleccionada: string): void {
  this.update((state) => ({
    ...state,
    federativaSeleccionada,
  }));
}


}

