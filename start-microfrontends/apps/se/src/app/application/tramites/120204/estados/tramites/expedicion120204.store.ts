import { Store, StoreConfig } from '@datorama/akita';
  
import { Injectable } from '@angular/core';



/**
 * Interfaz que define la estructura del estado para el trámite de expedición 120204.
 *
 * @property {string} entidadFederativa - Nombre de la entidad federativa seleccionada.
 * @property {string} representacionFederal - Representación federal correspondiente.
 * @property {string} montoAExpedir - Monto que se va a expedir.
 * @property {boolean} montoAExpedirCheck - Indica si el monto a expedir ha sido verificado.
 * @property {string} totalAExpedir - Total a expedir.
 * @property {string} montoDisponible - Monto disponible para expedir.
 * @property {string} numeraDelicitacion - Número de la licitación.
 * @property {string} fechaDelEventoDelicitacion - Fecha del evento de licitación.
 * @property {string} descripcionDelProducto - Descripción del producto relacionado con la expedición.
 */
export interface Expedicion120204State {
  /** ID de la solicitud */
  idSolicitud: number | null;
  /** Nombre de la entidad federativa seleccionada */
  entidadFederativa: string;
  /** Representación federal correspondiente */
  representacionFederal: string;
  /** Monto que se va a expedir */
  montoAExpedir: string;
  /** Indica si el monto a expedir ha sido verificado */
  montoAExpedirCheck: boolean;
  /** Total a expedir */
  totalAExpedir: string;
  /** Monto disponible para expedir */
  montoDisponible: string;
  /** Número de la licitación */
  numeraDelicitacion: string;
  /** Fecha del evento de licitación */
  fechaDelEventoDelicitacion: string;
  /** Descripción del producto relacionado con la expedición */
  descripcionDelProducto: string;
  unidadMedidaTarifaria: string;
  /** Monto adjudicado */
  montoAdjudicado: string;
  /** Régimen aduanero */
  regimenAduanero: string;
  /** Fracción o fracciones arancelarias */
  fraccionArancelaria: string;
  /** Fecha de inicio de vigencia del cupo */
  fechaInicioVigenciaCupo: string;
  /** Fecha de fin de vigencia del cupo */
  fechaFinVigenciaCupo: string;
  /** Observaciones */
  observaciones: string;
  /** Bloque comercial */
  bloqueComercial: string;
  /** Países */
  paises: string;
}

/**
 * Crea y retorna el estado inicial para el trámite de expedición 120204.
 *
 * @returns {Expedicion120204State} Estado inicial con los valores predeterminados para cada propiedad.
 *
 * @property {string} entidadFederativa - Nombre de la entidad federativa.
 * @property {string} representacionFederal - Representación federal correspondiente.
 * @property {string} montoAExpedir - Monto que se va a expedir.
 * @property {boolean} montoAExpedirCheck - Indica si el monto a expedir ha sido verificado.
 * @property {string} totalAExpedir - Total a expedir.
 * @property {string} montoDisponible - Monto disponible para expedir.
 * @property {string} numeraDelicitacion - Número de la licitación.
 * @property {string} fechaDelEventoDelicitacion - Fecha del evento de licitación.
 * @property {string} descripcionDelProducto - Descripción del producto relacionado con la expedición.
 */
export function createInitialState(): Expedicion120204State {
  return{
      idSolicitud: 0,
      entidadFederativa:'',
      representacionFederal:'',
      montoAExpedir: '',
      montoAExpedirCheck:false,
      totalAExpedir: '',
      montoDisponible: '',
      numeraDelicitacion: '',
      fechaDelEventoDelicitacion: '',
      descripcionDelProducto: '',
      unidadMedidaTarifaria: '',
      montoAdjudicado: '',
      regimenAduanero: '',
      fraccionArancelaria: '',
      fechaInicioVigenciaCupo: '',
      fechaFinVigenciaCupo: '',
      observaciones: '',
      bloqueComercial: '',
      paises: '',
  }
}


/**
 * Clase `Expedicion120204Store` que extiende de `Store` y administra el estado relacionado con la expedición.
 * 
 * @extends {Store<Expedicion120204State>}
 * 
 * @description
 * Esta clase proporciona métodos para actualizar diferentes propiedades del estado, como la entidad federativa,
 * la representación federal, el monto a expedir, el chequeo del monto a expedir y el total a expedir.
 * 
 * @example
 * ```typescript
 * const store = new Expedicion120204Store();
 * store.setEntidadFederativa(entidad);
 * store.setMontoExpedir('1000');
 * ```
 */
@Injectable({
  providedIn: 'root',
})

@StoreConfig({ name: 'expedicion', resettable: true })
export class Expedicion120204Store extends Store<Expedicion120204State> {
  /**
   * Constructor de la clase `Expedicion120204Store`.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Guarda el ID de la solicitud en el estado.
   *
   * @param idSolicitud - El ID de la solicitud que se va a guardar.
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

  /**
   * Actualiza la entidad federativa en el estado.
   * 
   * @param entidadFederativa - Objeto de tipo `Catalogo` que representa la entidad federativa a establecer.
   */
  public setEntidadFederativa(entidadFederativa: string): void {
    this.update((state) => ({
      ...state,
      entidadFederativa,
    }));
  }

  /**
   * Actualiza la representación federal en el estado.
   * 
   * @param representacionFederal - Objeto de tipo `Catalogo` que representa la representación federal a establecer.
   */
  public setRepresentacionFederal(representacionFederal: string): void {
    this.update((state) => ({
      ...state,
      representacionFederal,
    }));
  }

  /**
   * Establece el monto a expedir en el estado.
   * 
   * @param montoAExpedir - Cadena que representa el monto a expedir.
   */
  public setMontoExpedir(montoAExpedir: string): void {
    this.update((state) => ({
      ...state,
      montoAExpedir,
    }));
  }

  /**
   * Establece el estado del chequeo del monto a expedir.
   * 
   * @param montoAExpedirCheck - Valor booleano que indica si el monto a expedir está chequeado.
   */
  public setMontoExpedirCheck(montoAExpedirCheck: boolean): void {
    this.update((state) => ({
      ...state,
      montoAExpedirCheck,
    }));
  }

  /**
   * Establece el total a expedir en el estado.
   * 
   * @param totalAExpedir - Cadena que representa el total a expedir.
   */
  public setTotalExpedir(totalAExpedir: string): void {
    this.update((state) => ({
      ...state,
      totalAExpedir,
    }));
  }

  /**
   * Establece el valor de `montoDisponible` en el estado.
   *
   * @param montoDisponible - El nuevo monto disponible que se asignará al estado.
   */
  public setMontoDisponsible(montoDisponible: string): void {
    this.update((state) => ({
      ...state,
      montoDisponible,
    }));
  }


  /**
   * Establece la fecha del evento de licitación en el estado.
   *
   * @param fechaDelEventoDelicitacion - La fecha del evento de licitación a establecer, en formato de cadena.
   */
  public setFechaDelEventoDelicitacion(fechaDelEventoDelicitacion: string): void {
    this.update((state) => ({
      ...state,
      fechaDelEventoDelicitacion,
    }));
  }

  /**
   * Establece la descripción del producto en el estado.
   *
   * @param descripcionDelProducto - La descripción del producto a establecer, en formato de cadena.
   */
  public setDescripcionDelProducto(descripcionDelProducto: string): void {
    this.update((state) => ({
      ...state,
      descripcionDelProducto,
    }));
  }

  /**
   * Establece el número de la licitación en el estado.
   *
   * @param numeraDelicitacion - El número de la licitación a establecer, en formato de cadena.
   */
  public setNumeraDelicitacion(numeraDelicitacion: string): void {
    this.update((state) => ({
      ...state,
      numeraDelicitacion,
    }));
  }

  /**
   * Establece la unidad de medida tarifaria en el estado.
   *
   * @param unidadMedidaTarifaria - La unidad de medida tarifaria a establecer, en formato de cadena.
   */
  public setUnidadMedidaTarifaria(unidadMedidaTarifaria: string): void {
    this.update((state) => ({
      ...state,
      unidadMedidaTarifaria,
    }));
  }

  /**
   * Establece el monto adjudicado en el estado.
   *
   * @param montoAdjudicado - El monto adjudicado a establecer, en formato de cadena.
   */
  public setMontoAdjudicado(montoAdjudicado: string): void {
    this.update((state) => ({
      ...state,
      montoAdjudicado,
    }));
  }

  /**
   * Establece el régimen aduanero en el estado.
   *
   * @param regimenAduanero - El régimen aduanero a establecer, en formato de cadena.
   */
  public setRegimenAduanero(regimenAduanero: string): void {
    this.update((state) => ({
      ...state,
      regimenAduanero,
    }));
  }

  /**
   * Establece la fracción arancelaria en el estado.
   *
   * @param fraccionArancelaria - La fracción arancelaria a establecer, en formato de cadena.
   */
  public setFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria,
    }));
  }

  /**
   * Establece la fecha de inicio de vigencia del cupo en el estado.
   *
   * @param fechaInicioVigenciaCupo - La fecha de inicio de vigencia del cupo a establecer, en formato de cadena.
   */
  public setFechaInicioVigenciaCupo(fechaInicioVigenciaCupo: string): void {
    this.update((state) => ({
      ...state,
      fechaInicioVigenciaCupo,
    }));
  }

  /**
   * Establece la fecha de fin de vigencia del cupo en el estado.
   *
   * @param fechaFinVigenciaCupo - La fecha de fin de vigencia del cupo a establecer, en formato de cadena.
   */
  public setFechaFinVigenciaCupo(fechaFinVigenciaCupo: string): void {
    this.update((state) => ({
      ...state,
      fechaFinVigenciaCupo,
    }));
  }

  /**
   * Establece las observaciones en el estado.
   *
   * @param observaciones - Las observaciones a establecer, en formato de cadena.
   */
  public setObservaciones(observaciones: string): void {
    this.update((state) => ({
      ...state,
      observaciones,
    }));
  }

  /**
   * Establece el bloque comercial en el estado.
   *
   * @param bloqueComercial - El bloque comercial a establecer, en formato de cadena.
   */
  public setBloqueComercial(bloqueComercial: string): void {
    this.update((state) => ({
      ...state,
      bloqueComercial,
    }));
  }

  /**
   * Establece los países en el estado.
   *
   * @param paises - Los países a establecer, en formato de cadena.
   */
  public setPaises(paises: string): void {
    this.update((state) => ({
      ...state,
      paises,
    }));
  }

  
  /**
   * Restablece el estado de la tienda al valor inicial.
   *
   * Esta función actualiza el estado utilizando el estado inicial generado por `createInitialState()`.
   * Úsala cuando necesites reiniciar todos los valores de la tienda a su configuración predeterminada.
   */
  public resetState(): void {
    this.update(createInitialState());
  }
}
