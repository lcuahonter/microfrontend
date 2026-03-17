import { Store, StoreConfig } from '@datorama/akita';
import { DocumentoAdicional } from '../models/datos-tramite.model';
import { Injectable } from '@angular/core';
/**
 * Interfaz que representa el estado de la solicitud 32401.
 * Incluye información sobre el tipo de búsqueda, RFC, y detalles del trámite.
 */
export interface Solicitud32401State {
  /** Tipo de búsqueda: puede ser un número o una cadena. */
  tipoBusqueda: string | number;

  /** RFC del usuario asociado al trámite. */
  rfc: string;

  /** Tipo de trámite realizado. */
  tipoDeTramite: string;

  /** Tipo de requerimiento en el trámite. */
  tipoDeRequerimiento: string;

  /** Folio del trámite. */
  folioDeTramite: string;

  /** Datos del contenedor relacionados con el trámite. */
  datosDelContenedor: [];

  /**
   * Lista de documentos adicionales asociados.
   */
  documentoAdicional: DocumentoAdicional[];

  /** Motivo opcional de cancelación del trámite. */
  motivoCancelacion?: string;

  /**
   * Representa el tipo de documento actualmente seleccionado.
   */
  tipoDeDocumento: string | number;
}

/**
 * Función para crear el estado inicial de la solicitud 32401.
 * Retorna los valores predeterminados para cada propiedad.
 */
export function createInitialState(): Solicitud32401State {
  return {
    /** Tipo de búsqueda predeterminado: número 0. */
    tipoBusqueda: 0,

    /** RFC inicial vacío. */
    rfc: '',

    /** Tipo de trámite inicial vacío. */
    tipoDeTramite: '',

    /** Tipo de requerimiento inicial vacío. */
    tipoDeRequerimiento: '',

    /** Folio del trámite inicial vacío. */
    folioDeTramite: '',

    /** Datos del contenedor inicial como una lista vacía. */
    datosDelContenedor: [],

    /**
     * Lista de documentos adicionales asociados.
     */
    documentoAdicional: [],

    /** Motivo de cancelación inicial vacío. */
    motivoCancelacion: '',

    /**
     * Representa el tipo de documento actualmente seleccionado.
     */
    tipoDeDocumento: '',
  };
}

/**
 * Servicio de inyección para gestionar el estado del trámite 32401.
 * Configurado como parte del sistema de inyección de dependencias en Angular.
 */
@Injectable({
  /** Define el ámbito del servicio como raíz. */
  providedIn: 'root',
})
/** Configuración del store para manejar el estado del trámite 32401. */
@StoreConfig({ name: 'tramite32401', resettable: true })
export class Tramite32401Store extends Store<Solicitud32401State> {
  /**
   * Constructor del store.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Establece el tipo de búsqueda en el estado de la tienda.
   *
   * @param tipoBusqueda - El tipo de búsqueda que se desea establecer.
   */
  public setTipoBusqueda(tipoBusqueda: string | number): void {
    this.update((state) => ({
      ...state,
      tipoBusqueda,
    }));
  }

  /**
   * Establece el RFC en el estado de la tienda.
   *
   * @param rfc - El RFC (Registro Federal de Contribuyentes) que se desea establecer.
   */
  public setRfc(rfc: string): void {
    this.update((state) => ({
      ...state,
      rfc,
    }));
  }

  /**
   * Establece el tipo de trámite en el estado de la tienda.
   *
   * @param tipoDeTramite - El tipo de trámite que se desea establecer.
   */
  public setTipoDeTramite(tipoDeTramite: string): void {
    this.update((state) => ({
      ...state,
      tipoDeTramite,
    }));
  }

  /**
   * Establece el tipo de requerimiento en el estado de la tienda.
   *
   * @param tipoDeRequerimiento - El tipo de requerimiento que se desea establecer.
   */
  public setTipoDeRequerimiento(tipoDeRequerimiento: string): void {
    this.update((state) => ({
      ...state,
      tipoDeRequerimiento,
    }));
  }

  /**
   * Establece el folio del trámite en el estado de la tienda.
   *
   * @param folioDeTramite - El folio del trámite que se desea establecer.
   */
  public setFolioDeTramite(folioDeTramite: string): void {
    this.update((state) => ({
      ...state,
      folioDeTramite,
    }));
  }

  /**
   * Establece los datos del contenedor en el estado de la tienda.
   *
   * @param datosDelContenedor - Un arreglo que contiene los datos del contenedor a establecer.
   *
   * Este método actualiza el estado de la tienda con los datos proporcionados.
   */
  public setDelContenedor(datosDelContenedor: []): void {
    this.update((state) => ({
      ...state,
      datosDelContenedor,
    }));
  }

  /**
   * Establece los datos del contenedor en el estado de la tienda.
   *
   * @param documentoAdicional - Un arreglo que contiene los datos del contenedor a establecer.
   *
   * Este método actualiza el estado de la tienda con los datos proporcionados.
   */
  public setDocumentoAdicional(documentoAdicional: DocumentoAdicional[]): void {
    this.update((state) => ({
      ...state,
      documentoAdicional,
    }));
  }

  /**
   * Establece el motivo de cancelación en el estado de la tienda.
   *
   * @param motivoCancelacion - El motivo de cancelación que se desea establecer.
   */
  public setMotivoCancelacion(motivoCancelacion: string): void {
    this.update((state) => ({
      ...state,
      motivoCancelacion,
    }));
  }

  /**
   * Establece el tipo de documento en el estado.
   *
   * Actualiza el estado del store con el valor proporcionado para `tipoDeDocumento`.
   *
   * @param {number | string} tipoDeDocumento - El identificador del tipo de documento. Puede ser `null` si no se ha seleccionado ninguno.
   */
  setTipoDeDocumento(tipoDeDocumento: string | number): void {
    this.update((state) => ({
      ...state,
      tipoDeDocumento: tipoDeDocumento,
    }));
  }

  /**
   * Método para limpiar la solicitud.
   * Reinicia el estado de la solicitud utilizando el método `reset()`.
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}
