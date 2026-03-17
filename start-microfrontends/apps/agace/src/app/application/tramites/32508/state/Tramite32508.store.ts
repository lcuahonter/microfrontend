import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { DictamenDisminucionDto, DictamenCompensacionDto } from '../models/adace.model';
import { DocumentoProcesado } from '@libs/shared/data-access-user/src/core/models/shared/cargar-documentos.model';

/**
 * Representa un catálogo con un identificador y una descripción.
 */
export interface Catalogo {
  /** Identificador único del catálogo. */
  id: number;
  /** Descripción del catálogo. */
  descripcion: string;
}

/**
 * Estado inicial para la interfaz del trámite 32508.
 */
export interface Solicitud32508State {
  /** Clave del fiscalizado. */
  claveFiscalizado: string;
  /** Clave de la unidad administrativa */
  cveUnidadAdministrativa: string;
  /** adace */
  adace: string;
  /** Tipo de dictamen. */
  tipoDictamen: string;
  /** RFC del fiscalizado. */
  rfc: string;
  /** RFC del CPI que elaboro el dictamen. */
  rfcCpi: string;
  /** nombre */
  nombre: string;
  /** Número de inscripción. */
  numeroInscripcion: string;
  /** Catálogo de años. */
  ano: Catalogo[] | null;
  /** Catálogo de meses. */
  mes: Catalogo[] | null;
  /** Opción seleccionada en el radio parcial. */
  radioParcial: string;
  /** Opción seleccionada en el radio total. */
  radioTotal: string;
  /** Saldo pendiente del dictamen anterior. */
  saldoPendienteDisminuirAnterior: string;
  /** Saldo pendiente compensar del dictamen anterior. */
  saldoPendienteCompensarAnterior: string;
  /** Aprovechamiento total a cargo. */
  aprovechamiento: string;
  /** Disminución aplicada. */
  disminucionAplicada: string;
  /** Compensación aplicada. */
  compensacionAplicada: string;
  /** Saldo pendiente por disminuir. */
  saldoPendienteDisminuir: string;
  /** Cantidad pagada. */
  cantidad: string;
  /** Llave de pago. */
  llaveDePago: string;
  /** Archivos adjuntos. */
  archivo: File[];
  /** Fecha de pago. */
  fechaPago: string;
  /** Fecha de elaboración. */
  fechaElaboracion: string;
  /** Saldo pendiente por compensar. */
  saldoPendienteCompensar: string;
  /** Ingresos */
  ingresos: string;
  /** Cantidad dictaminada */
  dictaminadaCantidad: string;
  /** Lista de dictámenes de disminución */
  listaDisminucion: DictamenDisminucionDto[];
  /** Lista de dictámenes de compensación */
  listaCompensacion: DictamenCompensacionDto[];
  /** Año seleccionado del periodo (ej: "2024", "2025") */
  anoSeleccionado: string;
  /** Mes seleccionado del periodo (ej: "MESES.01", "MESES.12") */
  mesSeleccionado: string;
  /** Nombre del Contador Público que elaboró el dictamen */
  nombreCpi: string;
  /** Clave de entidad federativa del solicitante */
  cveEntidadFederativa: string;
  /** Tipo de persona (M = Moral, F = Física) */
  tipoPersona: string;
  /** ID de la solicitud guardada en el backend */
  idSolicitud: string;
  /** Lista de documentos almacenados (cargados en el paso 2) */
  listadoDocsAlmacenados: DocumentoProcesado[];
}

/**
 * Crea el estado inicial para la solicitud del trámite 32508.
 * @returns Estado inicial de tipo `Solicitud32508State`.
 */
export function createInitialState(): Solicitud32508State {
  return {
    claveFiscalizado: '',
    cveUnidadAdministrativa: '',
    adace: '',
    tipoDictamen: '',
    rfc: '',
    rfcCpi: '',
    nombre: '',
    numeroInscripcion: '',
    ano: null,
    mes: null,
    radioParcial: '',
    radioTotal: '',
    saldoPendienteDisminuirAnterior: '',
    saldoPendienteCompensarAnterior: '',
    aprovechamiento: '',
    disminucionAplicada: '',
    compensacionAplicada: '',
    saldoPendienteDisminuir: '',
    cantidad: '',
    llaveDePago: '',
    archivo: [],
    fechaPago: '',
    fechaElaboracion: '',
    saldoPendienteCompensar: '',
    ingresos: '',
    dictaminadaCantidad: '',
    listaDisminucion: [],
    listaCompensacion: [],
    anoSeleccionado: '',
    mesSeleccionado: '',
    nombreCpi: '',
    cveEntidadFederativa: '',
    tipoPersona: '',
    idSolicitud: '',
    listadoDocsAlmacenados: []
  };
}

/**
 * Clase que representa el almacén de estado para el trámite 32508.
 * Gestiona el estado global de la solicitud y proporciona métodos para actualizarlo.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite32508', resettable: true })
export class Tramite32508Store extends Store<Solicitud32508State> {
  /**
   * Constructor del almacén.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza la clave del fiscalizado.
   * @param claveFiscalizado Nueva clave del fiscalizado.
   */
  public setClaveFiscalizador(claveFiscalizado: string): void {
    this.update((state) => ({ ...state, claveFiscalizado }));
  }

  /**
   * Actualiza clave de la unidad administrativa
   * @param cveUnidadAdministrativa nueva clave de la unidad administrativa
   */
  public setCveUnidadAdministrativa(cveUnidadAdministrativa: string): void {
    this.update((state) => ({ ...state, cveUnidadAdministrativa }));
  }

  /**
   * Actualiza el adace.
   * @param adace Nuevo adace.
   */
  public setAdace(adace: string): void {
    this.update((state) => ({ ...state, adace }));
  }

  /**
   * Actualiza el tipo de dictamen.
   * @param tipoDictamen Nuevo tipo de dictamen.
   */
  public setTipoDictamen(tipoDictamen: string): void {
    this.update((state) => ({ ...state, tipoDictamen }));
  }

  /**
   * Actualiza el RFC del fiscalizado.
   * @param rfc Nuevo RFC.
   */
  public setRfc(rfc: string): void {
    this.update((state) => ({ ...state, rfc }));
  }

  /**
   * Actualiza el nombre del fiscalizado.
   * @param nombre Nuevo nombre.
   */
  public setNombre(nombre: string): void {
    this.update((state) => ({ ...state, nombre }));
  }

  /**
   * Actualiza el número de inscripción.
   * @param numeroInscripcion Nuevo número de inscripción.
   */
  public setNumeroInscripcion(numeroInscripcion: string): void {
    this.update((state) => ({ ...state, numeroInscripcion }));
  }

  /**
   * Actualiza el catálogo de años.
   * @param ano Nuevo catálogo de años.
   */
  public setAno(ano: Catalogo[] | null): void {
    this.update((state) => ({ ...state, ano }));
  }

  /**
   * Actualiza el catálogo de meses.
   * @param mes Nuevo catálogo de meses.
   */
  public setMes(mes: Catalogo[] | null): void {
    this.update((state) => ({ ...state, mes }));
  }

  /**
   * Actualiza la opción seleccionada en el radio parcial.
   * @param radioPartial Nueva opción seleccionada.
   */
  public setRadioPartial(radioParcial: string): void {
    this.update((state) => ({ ...state, radioParcial }));
  }

  /**
   * Actualiza la opción seleccionada en el radio total.
   * @param radioTotal Nueva opción seleccionada.
   */
  public setRadioTotal(radioTotal: string): void {
    this.update((state) => ({ ...state, radioTotal }));
  }

  /**
   * Actualiza el saldo pendiente del dictamen anterior.
   * @param saldoPendienteDisminuirAnterior Nuevo saldo pendiente.
   */
  public setSaldoPendienteDisminuirAnterior(saldoPendienteDisminuirAnterior: string): void {
    this.update((state) => ({ ...state, saldoPendienteDisminuirAnterior }));
  }

  /**
   * Actualiza el saldo pendiente del dictamen anterior.
   * @param saldoPendienteCompensarAnterior Nuevo saldo pendiente.
   */
  public setSaldoPendienteCompensarAnterior(saldoPendienteCompensarAnterior: string): void {
    this.update((state) => ({ ...state, saldoPendienteCompensarAnterior }));
  }

  /**
   * Actualiza el aprovechamiento total a cargo.
   * @param aprovechamiento Nuevo aprovechamiento.
   */
  public setAprovechamiento(aprovechamiento: string): void {
    this.update((state) => ({ ...state, aprovechamiento }));
  }

  /**
   * Actualiza la disminución aplicada.
   * @param disminucionAplicada Nueva disminución aplicada.
   */
  public setDisminucionAplicada(disminucionAplicada: string): void {
    this.update((state) => ({ ...state, disminucionAplicada }));
  }
  /**
   * Actualiza la compensación aplicada.
   * @param compensacionAplicada Nueva compensación aplicada.
   */
  public setCompensacionAplicada(compensacionAplicada: string): void {
    this.update((state) => ({ ...state, compensacionAplicada }));
  }
  /**
   * Actualiza el saldo pendiente por compensar.
   * @param saldoPendienteCompensar Nuevo saldo pendiente por compensar.
   */
  public setSaldoPendienteCompensar(saldoPendienteCompensar: string): void {
    this.update((state) => ({ ...state, saldoPendienteCompensar }));
  }

  /**
   * Actualiza el saldo pendiente por disminuir.
   * @param saldoPendienteDisminuir Nuevo saldo pendiente por disminuir.
   */
  public setSaldoPendienteDisminuir(saldoPendienteDisminuir: string): void {
    this.update((state) => ({ ...state, saldoPendienteDisminuir }));
  }

  /**
   * Actualiza la cantidad pagada.
   * @param cantidad Nueva cantidad pagada.
   */
  public setCantidad(cantidad: string): void {
    this.update((state) => ({ ...state, cantidad }));
  }

  /**
   * Actualiza la llave de pago.
   * @param llaveDePago Nueva llave de pago.
   */
  public setLlaveDePago(llaveDePago: string): void {
    this.update((state) => ({ ...state, llaveDePago }));
  }

  /**
   * Actualiza los archivos adjuntos.
   * @param archivo Nuevos archivos adjuntos.
   */
  public setArchivo(archivo: File[]): void {
    this.update((state) => ({ ...state, archivo }));
  }

  /**
   * Actualiza la fecha de pago.
   * @param fechaPago Nueva fecha de pago.
   */
  public setFechaPago(fechaPago: string): void {
    this.update((state) => ({ ...state, fechaPago }));
  }

  /**
   * Actualiza la fecha de elaboración.
   * @param fechaElaboracion Nueva fecha de elaboración.
   */
  public setFechaElaboracion(fechaElaboracion: string): void {
    this.update((state) => ({ ...state, fechaElaboracion }));
  }

  /**
   * Actualiza los ingresos.
   * @param ingresos Nuevos ingresos.
   */
  public setIngresos(ingresos: string): void {
    this.update((state) => ({ ...state, ingresos }));
  }

  /**
   * Actualiza la cantidad dictaminada.
   * @param dictaminadaCantidad Nueva cantidad dictaminada.
   */
  public setDictaminadaCantidad(dictaminadaCantidad: string): void {
    this.update((state) => ({ ...state, dictaminadaCantidad }));
  }

  /**
   * Restaura el estado al valor inicial.
   */
  public limpiarSolicitud(): void {
    this.reset();
  }

  /**
   * Actualiza el RFC del CPI que elaboro el dictamen.
   * @param rfcCpi Nuevo RFC.
   */
  public setRfcCpi(rfcCpi: string): void {
    this.update((state) => ({ ...state, rfcCpi }));
  }

  /**
   * Actualiza la lista de dictámenes de disminución.
   * @param listaDisminucion Nueva lista de dictámenes de disminución.
   */
  public setListaDisminucion(listaDisminucion: DictamenDisminucionDto[]): void {
    this.update((state) => ({ ...state, listaDisminucion }));
  }

  /**
   * Actualiza la lista de dictámenes de compensación.
   * @param listaCompensacion Nueva lista de dictámenes de compensación.
   */
  public setListaCompensacion(listaCompensacion: DictamenCompensacionDto[]): void {
    this.update((state) => ({ ...state, listaCompensacion }));
  }

  /**
   * Actualiza el año seleccionado del periodo.
   * @param anoSeleccionado Año seleccionado (ej: "2024", "2025")
   */
  public setAnoSeleccionado(anoSeleccionado: string): void {
    this.update((state) => ({ ...state, anoSeleccionado }));
  }

  /**
   * Actualiza el mes seleccionado del periodo.
   * @param mesSeleccionado Mes seleccionado (ej: "MESES.01", "MESES.12")
   */
  public setMesSeleccionado(mesSeleccionado: string): void {
    this.update((state) => ({ ...state, mesSeleccionado }));
  }

  /**
   * Actualiza el nombre del CPI que elaboró el dictamen.
   * @param nombreCpi Nombre del Contador Público
   */
  public setNombreCpi(nombreCpi: string): void {
    this.update((state) => ({ ...state, nombreCpi }));
  }

  /**
   * Actualiza la clave de entidad federativa del solicitante.
   * @param cveEntidadFederativa Clave de la entidad federativa
   */
  public setCveEntidadFederativa(cveEntidadFederativa: string): void {
    this.update((state) => ({ ...state, cveEntidadFederativa }));
  }

  /**
   * Actualiza el tipo de persona del solicitante.
   * @param tipoPersona Tipo de persona (M = Moral, F = Física)
   */
  public setTipoPersona(tipoPersona: string): void {
    this.update((state) => ({ ...state, tipoPersona }));
  }

  /**
   * Actualiza el ID de la solicitud guardada.
   * @param idSolicitud ID de la solicitud
   */
  public setIdSolicitud(idSolicitud: string): void {
    this.update((state) => ({ ...state, idSolicitud }));
  }

  /**
   * Actualiza la lista de documentos almacenados (cargados en el paso 2).
   * @param listadoDocsAlmacenados Array de documentos procesados
   */
  public setListadoDocsAlmacenados(listadoDocsAlmacenados: DocumentoProcesado[]): void {
    this.update((state) => ({ ...state, listadoDocsAlmacenados }));
  }
}