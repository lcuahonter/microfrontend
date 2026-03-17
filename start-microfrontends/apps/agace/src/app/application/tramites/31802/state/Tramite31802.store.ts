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

/**
 * Estado inicial para la interfaz del trámite 31803.
 */
export interface Solicitud31802State {
  /** Número de oficio asociado a la solicitud. */
  numeroOficio: string;
  /** Número de operación asociado a la solicitud. */
  numeroOperacion: string;
  /** Llave única asociada a la solicitud. */
  llave: string;
  /** Primer manifiesto asociado a la solicitud. */
  manifiesto1: boolean;
  /** Segundo manifiesto asociado a la solicitud. */
  manifiesto2: boolean;
  /** Segundo manifiesto asociado a la solicitud. */
  manifiesto3: boolean;
  /** Fecha de pago asociada a la solicitud. */
  fechaPago: string;
  /** Moneda nacional asociada a la solicitud. */
  monedaNacional: string;
  /** Indica si la solicitud es una renovación (`true` o `false`). */
  renovacion: boolean;
  /** Indica si la solicitud es una homologación (`true` o `false`). */
  homologacion: boolean;
  /** Fecha de inicio del trámite. */
  fechaInicio: string;
  /** Fecha final del trámite. */
  fechaFinal: string;
  /** Cuarto manifiesto asociado a la solicitud. */
  manifiesto4: boolean;
  /** Quinto manifiesto asociado a la solicitud. */
  manifiesto5: boolean;
  /** Valor actualmente seleccionado en algún campo dinámico. */
  valorSeleccionado: string | null;
  /** Opción seleccionada en el formulario. */
  opcion: string;
}

/**
 * Crea el estado inicial para la solicitud del trámite 31803.
 * @returns Estado inicial de tipo `Solicitud31802State`.
 */
export function createInitialState(): Solicitud31802State {
  return {
    numeroOficio: '2500301800220259912000043-000040',
    numeroOperacion: '',
    llave: '',
    manifiesto1: false,
    manifiesto2: false,
    manifiesto3: false,
    fechaPago: '',
    monedaNacional: '',
    renovacion: false,
    homologacion: false,
    fechaInicio: '09/06/2025',
    fechaFinal: '15/06/2025',
    manifiesto4: false,
    manifiesto5: false,
    valorSeleccionado: null,
    opcion: ''
  };
}

/**
 * Clase que representa el almacén de estado para el trámite 31803.
 * Gestiona el estado global de la solicitud y proporciona métodos para actualizarlo.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite31802', resettable: true })
export class Tramite31802Store extends Store<Solicitud31802State> {
  /**
   * Constructor del almacén.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }
  /**
   * Actualiza el número de oficio en el estado.
   * @param numeroOficio Número de oficio de tipo `string`.
   */
  public setNumeroOficio(numeroOficio: string): void {
    this.update((state) => ({ ...state, numeroOficio }));
  }
  /**
   * Actualiza el número de operación en el estado.
   * @param numeroOperacion Número de operación de tipo `string`.
   */
  public setNumeroOperacion(numeroOperacion: string): void {
    this.update((state) => ({ ...state, numeroOperacion }));
  }

  /**
   * Actualiza la llave en el estado.
   * @param llave Llave única de tipo `string`.
   */
  public setLlave(llave: string): void {
    this.update((state) => ({ ...state, llave }));
  }

  /**
   * Actualiza el primer manifiesto en el estado.
   * @param manifiesto1 Primer manifiesto de tipo `boolean`.
   */
  public setManifiesto1(manifiesto1: boolean): void {
    this.update((state) => ({ ...state, manifiesto1 }));
  }

  /**
   * Actualiza el segundo manifiesto en el estado.
   * @param manifiesto2 Segundo manifiesto de tipo `boolean`.
   */
  public setManifiesto2(manifiesto2: boolean): void {
    this.update((state) => ({ ...state, manifiesto2 }));
  }
  /**
 * Actualiza el segundo manifiesto en el estado.
 * @param manifiesto3 Segundo manifiesto de tipo `boolean`.
 */
  public setManifiesto3(manifiesto3: boolean): void {
    this.update((state) => ({ ...state, manifiesto3 }));
  }
  /**
   * Actualiza la fecha de pago en el estado.
   * @param fechaPago Fecha de pago de tipo `string`.
   */
  public setFechaPago(fechaPago: string): void {
    this.update((state) => ({ ...state, fechaPago }));
  }
  /**
   * Actualiza el valor de renovación en el estado.
   * @param renovacion Indica si la solicitud es una renovación (`true` o `false`).
   */
  setRenovacion(renovacion: boolean): void {
    this.update((state) => ({
      ...state,
      renovacion,
    }));
  }
  /**
 * Actualiza el valor de homologación en el estado.
 * @param homologacion Indica si la solicitud es una homologación (`true` o `false`).
 */
  setHomologacion(homologacion: boolean): void {
    this.update((state) => ({
      ...state,
      homologacion,
    }));
  }
  /**
 * Actualiza la moneda nacional en el estado.
 * @param monedaNacional Moneda nacional de tipo `string`.
 */
  public setMonedaNacional(monedaNacional: string): void {
    this.update((state) => ({ ...state, monedaNacional }));
  }

  /**
   * Actualiza la fecha de inicio del trámite en el estado.
   * @param fechaInicio Fecha de inicio de tipo `string`.
   */
  public setFechaInicio(fechaInicio: string): void {
    this.update((state) => ({ ...state, fechaInicio }));
  }
  /**
   * Actualiza la fecha final del trámite en el estado.
   * @param fechaFinal Fecha final de tipo `string`.
   */
  public setFechaFinal(fechaFinal: string): void {
    this.update((state) => ({ ...state, fechaFinal }));
  }
  /**
   * Restaura el estado al valor inicial.
   */
  public limpiarSolicitud(): void {
    this.reset();
  }

  /**
   * Actualiza el cuarto manifiesto en el estado.
   * @param manifiesto4 Cuarto manifiesto de tipo `boolean`.
   */
  public setManifiesto4(manifiesto4: boolean): void {
    this.update((state) => ({ ...state, manifiesto4 }));
  }

  /**
   * Actualiza el quinto manifiesto en el estado.
   * @param manifiesto5 Quinto manifiesto de tipo `boolean`.
   */
  public setManifiesto5(manifiesto5: boolean): void {
    this.update((state) => ({ ...state, manifiesto5 }));
  }

  /** Actualiza el valor actualmente seleccionado. */
  public setValorSeleccionado(valorSeleccionado: string): void {
    this.update((state) => ({ ...state, valorSeleccionado }));
  }

  /**
   * Actualiza la opción seleccionada en el formulario.
   * @param opcion Opción seleccionada de tipo `string`.
   */
  public setOpcion(opcion: string): void {
    this.update((state) => ({ ...state, opcion }));
  }
}
