import { Injectable } from '@angular/core';
import { PagoDerechosLista } from '../models/registro-muestras-mercancias.model';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * Estado de la solicitud 30901.
 * Contiene los datos necesarios para gestionar la solicitud.
 */
export interface Solicitud30901State {
  /** Opción seleccionada del importador. */
  opcionDeImportador: number;
  /** Indica si se toma muestra en despacho. */
  tomaMuestraDespacho: string;
  /** Descripción del motivo por el cual no se tomó muestra. */
  descMotivoFaltaMuestra: string;
  /** Código de la fracción concatenada. */
  comboFraccionConcatenada: number | null;
  /** Fracción concatenada. */
  fraccionConcatenada: string;
  /** Descripción de la fracción arancelaria. */
  fracciondescripcion: string;
  /** Código del NICOs (Números de Identificación Comercial). */
  comboNicos: number;
  /** Descripción del NICOs. */
  nicoDescripcion: string;
  /** Nombre químico del producto. */
  nombreQuimico: string;
  /** Nombre comercial del producto. */
  nombreComercial: string;
  /** Número CAS (Chemical Abstracts Service). */
  numeroCAS: string;
  /** Identificación genérica del producto. */
  ideGenerica: number;
  /** Descripción genérica del producto. */
  descClobGenerica: string;
  /** Fecha de inicio de vigencia de la solicitud. */
  fechaInicioVigencia: string;
  /** Fecha de finalización de vigencia de la solicitud. */
  fechaFinVigencia: string;
  /** Línea de captura para el pago. */
  lineaCaptura: string;
  /** Valor total del pago. */
  valorPago: string;
  /** Lista de pagos de derechos asociados a la solicitud. */
  pagoDerechosLista: PagoDerechosLista[];
}

/**
 * Función para crear el estado inicial de la solicitud.
 * Devuelve un objeto con los valores predeterminados.
 */
export function createInitialSolicitudState(): Solicitud30901State {
  return {
    opcionDeImportador: 1,
    tomaMuestraDespacho: '',
    descMotivoFaltaMuestra: '',
    comboFraccionConcatenada: null,
    fraccionConcatenada: '',
    fracciondescripcion: '',
    comboNicos: 0,
    nicoDescripcion: '',
    nombreQuimico: '',
    nombreComercial: '',
    numeroCAS: '',
    ideGenerica: 0,
    descClobGenerica: '',
    fechaInicioVigencia: '',
    fechaFinVigencia: '',
    lineaCaptura: '',
    valorPago: '',
    pagoDerechosLista: [] as PagoDerechosLista[],
  };
}

/**
 * Servicio de almacenamiento y gestión del estado de la solicitud 30901.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'solicitud30901', resettable: true })
export class Solicitud30901Store extends Store<Solicitud30901State> {
  constructor() {
    super(createInitialSolicitudState());
  }

  /** Actualiza la opción del importador. */
  public setOpcionDeImportador(opcionDeImportador: number): void {
    this.update((state) => ({
      ...state,
      opcionDeImportador,
    }));
  }

  /** Actualiza si se toma muestra en el despacho. */
  public setTomaMuestraDespacho(tomaMuestraDespacho: string): void {
    this.update((state) => ({
      ...state,
      tomaMuestraDespacho,
    }));
  }

  /** Actualiza la descripción del motivo de falta de muestra. */
  public setDescMotivoFaltaMuestra(descMotivoFaltaMuestra: string): void {
    this.update((state) => ({
      ...state,
      descMotivoFaltaMuestra,
    }));
  }

  /** Actualiza el código de la fracción concatenada. */
  public setComboFraccionConcatenada(comboFraccionConcatenada: number | null): void {
    this.update((state) => ({
      ...state,
      comboFraccionConcatenada,
    }));
  }

  /** Actualiza la fracción concatenada. */
  public setFraccionConcatenada(fraccionConcatenada: string): void {
    this.update((state) => ({
      ...state,
      fraccionConcatenada,
    }));
  }

  /** Actualiza el código NICOs. */
  public setComboNicos(comboNicos: number): void {
    this.update((state) => ({
      ...state,
      comboNicos,
    }));
  }

  /** Actualiza la descripción de la fracción. */
  public setFraccionDescripcion(fracciondescripcion: string): void {
    this.update((state) => ({
      ...state,
      fracciondescripcion,
    }));
  }

  /** Actualiza la descripción del NICOs. */
  public setNicoDescripcion(nicoDescripcion: string): void {
    this.update((state) => ({
      ...state,
      nicoDescripcion,
    }));
  }

  /** Actualiza el nombre químico. */
  public setNombreQuimico(nombreQuimico: string): void {
    this.update((state) => ({
      ...state,
      nombreQuimico,
    }));
  }

  /** Actualiza el nombre comercial. */
  public setNombreComercial(nombreComercial: string): void {
    this.update((state) => ({
      ...state,
      nombreComercial,
    }));
  }

  /** Actualiza el número CAS. */
  public setNumeroCAS(numeroCAS: string): void {
    this.update((state) => ({
      ...state,
      numeroCAS,
    }));
  }

  /** Actualiza la identificación genérica del producto. */
  public setIdeGenerica(ideGenerica: number): void {
    this.update((state) => ({
      ...state,
      ideGenerica,
    }));
  }

  /** Actualiza la descripción genérica del producto. */
  public setDescClobGenerica(descClobGenerica: string): void {
    this.update((state) => ({
      ...state,
      descClobGenerica,
    }));
  }

  /** Actualiza la fecha de inicio de vigencia de la solicitud. */
  public setFechaInicioVigencia(fechaInicioVigencia: string): void {
    this.update((state) => ({
      ...state,
      fechaInicioVigencia,
    }));
  }

  /** Actualiza la fecha de finalización de vigencia de la solicitud. */
  public setFechaFinVigencia(fechaFinVigencia: string): void {
    this.update((state) => ({
      ...state,
      fechaFinVigencia,
    }));
  }

  /** Actualiza la línea de captura para el pago. */
  public setLineaCaptura(lineaCaptura: string): void {
    this.update((state) => ({
      ...state,
      lineaCaptura,
    }));
  }

  /** Actualiza el valor total del pago. */
  public setValorPago(valorPago: string): void {
    this.update((state) => ({
      ...state,
      valorPago,
    }));
  }

  /**
   * Actualiza la lista de pagos de derechos, evitando duplicados.
   * Solo agrega nuevos elementos si no están ya en la lista existente.
   */
  public setPagoDerechosLista(pagoDerechosLista: PagoDerechosLista[]): void {
    this.update((state) => {
      // Obtiene la lista actual del estado
      const EXISTING_LIST = state.pagoDerechosLista;

      // Filtra los elementos nuevos que no están en la lista existente
      const NEW_ITEMS = pagoDerechosLista.filter(
        (newItem) =>
          !EXISTING_LIST.some(
            (existingItem) => existingItem.linea === newItem.linea
          )
      );

      // Si hay elementos nuevos, actualiza el estado
      return NEW_ITEMS.length > 0
        ? { ...state, pagoDerechosLista: [...EXISTING_LIST, ...NEW_ITEMS] }
        : { ...state, pagoDerechosLista: pagoDerechosLista };
    });
  }

  /**
   * Restablece el estado de la tienda a su estado inicial.
   */
  resetStore(): void {
    this.reset();
  }
}
