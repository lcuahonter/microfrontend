import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interfaz que define el estado de la solicitud para el trámite 130118.
 */
export interface Solicitud130118State {
  /** Identificador de la solicitud, puede ser nulo si aún no se ha creado. */
  idSolicitud: number | null;
  /** Régimen de mercancía aplicado. */
  regimenMercancia: string;
  /** Clasificación del régimen de mercancía. */
  clasifiRegimen: string;
  /** Valor TA asociado a la mercancía. */
  valueTA: string;
  /** Fracción arancelaria correspondiente. */
  fraccionArancelaria: string;
  /** Número de Identificación Comercial (NICO). */
  nico: string | null;
  /** Unidad de medida tarifaria utilizada. */
  unidadMedidaTarifaria: string;
  /** Cantidad tarifaria declarada. */
  cantidadTarifaria: number | null;
  /** Valor de la factura en dólares estadounidenses. */
  valorFacturaUSD: number | null;
  /** Precio unitario en dólares estadounidenses. */
  precioUnitarioUSD: number | null;
  /** País de origen de la mercancía. */
  paisOrigen: string;
  /** País de destino de la mercancía. */
  paisDestino: string;
  /** Lote al que pertenece la mercancía. */
  lote: string;
  /** Fecha de salida de la mercancía. */
  fechaSalida: string;
  /** Observaciones generales del trámite. */
  observaciones: string;
  /** Observaciones específicas sobre la mercancía. */
  observacionMerc: string;
  /** Tipo de persona que realiza el trámite (física o moral). */
  tipoPersona: string;
  /** Nombre del solicitante (si aplica). */
  nombre: string;
  /** Apellido paterno del solicitante. */
  apellidoPaterno: string;
  /** Apellido materno del solicitante. */
  apellidoMaterno: string;
  /** Razón social de la empresa (si aplica). */
  razonSocial: string;
  /** Domicilio del solicitante o empresa. */
  domicilio: string;
  /** Estado donde se ubica el domicilio. */
  estado: string;
  /** Representación federal involucrada en el trámite. */
  representacionFederal: string;
}

/**
 * Crea el estado inicial del trámite 130118.
 * @returns Estado inicial de tipo `Solicitud130118State`.
 */
export function createInitialState(): Solicitud130118State {
  return {
    idSolicitud: 0,
    regimenMercancia: '',
    clasifiRegimen: '',
    valueTA: '',
    fraccionArancelaria: '',
    nico: null,
    unidadMedidaTarifaria: '',
    cantidadTarifaria: null,
    valorFacturaUSD: null,
    precioUnitarioUSD: null,
    paisOrigen: '',
    paisDestino: '',
    lote: '',
    fechaSalida: '',
    observaciones: '',
    observacionMerc: '',
    tipoPersona: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    razonSocial: '',
    domicilio: '',
    estado: '',
    representacionFederal: ''
  };
}

/**
 * Servicio de estado global para gestionar el trámite 130118 con Akita.
 * Proporciona métodos para actualizar cada campo del estado.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite130118', resettable: true })
export class Tramite130118Store extends Store<Solicitud130118State> {
  /**
   * Constructor que inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el régimen de mercancía.
   * @param regimenMercancia Nuevo régimen de mercancía.
   */
  public setRegimenMercancia(regimenMercancia: string): void {
    this.update((state) => ({
      ...state,
      regimenMercancia,
    }));
  }

  /**
   * Actualiza la clasificación del régimen.
   * @param clasifiRegimen Nueva clasificación del régimen.
   */
  public setClasifiRegimen(clasifiRegimen: string): void {
    this.update((state) => ({
      ...state,
      clasifiRegimen,
    }));
  }

  /**
   * Actualiza el valor TA.
   * @param valueTA Nuevo valor TA.
   */
  public setValueTA(valueTA: string): void {
    this.update((state) => ({
      ...state,
      valueTA
    }));
  }

  /**
   * Actualiza la fracción arancelaria.
   * @param fraccionArancelaria Nueva fracción arancelaria.
   */
  public setFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria,
    }));
  }

  /**
   * Actualiza el NICO.
   * @param nico Nuevo NICO.
   */
  public setNico(nico: string | null): void {
    this.update((state) => ({
      ...state,
      nico,
    }));
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
   * Actualiza la unidad de medida tarifaria.
   * @param unidadMedidaTarifaria Nueva unidad de medida tarifaria.
   */
  public setUnidadMedidaTarifaria(unidadMedidaTarifaria: string): void {
    this.update((state) => ({
      ...state,
      unidadMedidaTarifaria,
    }));
  }

  /**
   * Actualiza la cantidad tarifaria.
   * @param cantidadTarifaria Nueva cantidad tarifaria.
   */
  public setCantidadTarifaria(cantidadTarifaria: number | null): void {
    this.update((state) => ({
      ...state,
      cantidadTarifaria,
    }));
  }

  /**
   * Actualiza el valor de la factura en USD.
   * @param valorFacturaUSD Nuevo valor de la factura en USD.
   */
  public setValorFacturaUSD(valorFacturaUSD: number | null): void {
    this.update((state) => ({
      ...state,
      valorFacturaUSD,
    }));
  }

  /**
   * Actualiza el precio unitario en USD.
   * @param precioUnitarioUSD Nuevo precio unitario en USD.
   */
  public setPrecioUnitarioUSD(precioUnitarioUSD: number | null): void {
    this.update((state) => ({
      ...state,
      precioUnitarioUSD,
    }));
  }

  /**
   * Actualiza el país de origen.
   * @param paisOrigen Nuevo país de origen.
   */
  public setPaisOrigen(paisOrigen: string): void {
    this.update((state) => ({
      ...state,
      paisOrigen,
    }));
  }

  /**
   * Actualiza el país de destino.
   * @param paisDestino Nuevo país de destino.
   */
  public setPaisDestino(paisDestino: string): void {
    this.update((state) => ({
      ...state,
      paisDestino,
    }));
  }

  /**
   * Actualiza el lote.
   * @param lote Nuevo lote.
   */
  public setLote(lote: string): void {
    this.update((state) => ({
      ...state,
      lote,
    }));
  }

  /**
   * Actualiza la fecha de salida.
   * @param fechaSalida Nueva fecha de salida.
   */
  public setFechaSalida(fechaSalida: string): void {
    this.update((state) => ({
      ...state,
      fechaSalida,
    }));
  }

  /**
   * Actualiza las observaciones generales.
   * @param observaciones Nuevas observaciones.
   */
  public setObservaciones(observaciones: string): void {
    this.update((state) => ({
      ...state,
      observaciones,
    }));
  }

  /**
   * Actualiza la observación de mercancía.
   * @param observacionMerc Nueva observación de mercancía.
   */
  public setObservacionMerc(observacionMerc: string): void {
    this.update((state) => ({
      ...state,
      observacionMerc,
    }));
  }

  /**
   * Actualiza el tipo de persona.
   * @param tipoPersona Nuevo tipo de persona.
   */
  public setTipoPersona(tipoPersona: string): void {
    this.update((state) => ({
      ...state,
      tipoPersona,
    }));
  }

  /**
   * Actualiza el nombre del solicitante.
   * @param nombre Nuevo nombre.
   */
  public setNombre(nombre: string): void {
    this.update((state) => ({
      ...state,
      nombre,
    }));
  }

  /**
   * Actualiza el apellido paterno del solicitante.
   * @param apellidoPaterno Nuevo apellido paterno.
   */
  public setApellidoPaterno(apellidoPaterno: string): void {
    this.update((state) => ({
      ...state,
      apellidoPaterno,
    }));
  }

  /**
   * Actualiza el apellido materno del solicitante.
   * @param apellidoMaterno Nuevo apellido materno.
   */
  public setApellidoMaterno(apellidoMaterno: string): void {
    this.update((state) => ({
      ...state,
      apellidoMaterno,
    }));
  }

  /**
   * Actualiza la razón social.
   * @param razonSocial Nueva razón social.
   */
  public setRazonSocial(razonSocial: string): void {
    this.update((state) => ({
      ...state,
      razonSocial,
    }));
  }

  /**
   * Actualiza el domicilio.
   * @param domicilio Nuevo domicilio.
   */
  public setDomicilio(domicilio: string): void {
    this.update((state) => ({
      ...state,
      domicilio,
    }));
  }

  /**
   * Actualiza el estado.
   * @param estado Nuevo estado.
   */
  public setEstado(estado: string): void {
    this.update((state) => ({
      ...state,
      estado,
    }));
  }

  /**
   * Actualiza la representación federal.
   * @param representacionFederal Nueva representación federal.
   */
  public setRepresentacionFederal(representacionFederal: string): void {
    this.update((state) => ({
      ...state,
      representacionFederal,
    }));
  }
}