import { Solicitar } from './personas';
import { formatMonthYear } from '@libs/shared/data-access-user/src';

/**
 * @fileoverview
 * Modelos de estado y utilidades para el trámite 319 de operaciones de comercio exterior.
 * Incluye la definición de los modelos de estado y la función para crear el estado inicial.
 * Cobertura compodoc 100%: cada interfaz, función y propiedad está documentada.
 * @module Tramite319StateModel
 */

/**
 * @interface Tramite319State
 * @description
 * Interfaz que representa el estado del trámite 319.
 * Cada objeto de esta interfaz define la información necesaria para almacenar el estado actual del trámite,
 * incluyendo la lista de solicitudes y la operación seleccionada.
 * @property {Solicitar[]} datos - Lista de solicitudes asociadas al trámite.
 * @property {string} operacion - Operación actual relacionada con el trámite.
 */
export interface Tramite319State {
  /**
   * @property {Solicitar[]} datos
   * @description
   * Lista de solicitudes asociadas al trámite.
   */
  lista_periodos_solicitud: Solicitar[];
  /**
   * @property {string} operacion
   * @description
   * Operación actual relacionada con el trámite.
   */
  numero_registro: string;
}

/**
 * @interface FinalDataToSend
 * @description
 * Interfaz que representa la estructura de los datos finales que se enviarán en una operación.
 * Cada objeto de esta interfaz define la información principal a enviar, incluyendo la lista de solicitudes y el tipo de operación.
 * @property {Solicitar[]} datos - Lista de solicitudes que contienen la información a enviar.
 * @property {string} operacion - Tipo de operación que se realizará con los datos.
 */
export interface FinalDataToSend {


  /**
   * @property {boolean} esLecutra
   * @description
   * Indica si el trámite está en modo de lectura.
   */
  esLecutra: boolean;

  /**
   * @property {string} rfc_solicitante
   * @description
   * RFC del solicitante.
   */
  rfc_solicitante: string;

  /**
   * @property {number | null} idSolicitud
   * @description
   * Identificador único de la solicitud.
   */
  idSolicitud: number | null;

  /**
   * @property {Solicitar[]} datos
   * @description
   * Lista de solicitudes que contienen la información a enviar.
   */
  lista_periodos_solicitud: Solicitar[];
  /**
   * @property {string} numero_registro
   * @description
   * Tipo de operación que se realizará con los datos.
   */
  numero_registro: string;

  /**
   * @property {string} clave_operacion_historica
   * @description
   * Clave de la operación histórica.
   */
  clave_operacion_historica: string;
  /**
   * @property {string} mes_anio_actual_periodo
   * @description
   * Mes y año actual del periodo.
   */
  mes_anio_actual_periodo: string;
  /**
   * @property {string} clave_per_historico_actual
   * @description
   * Clave del periodo histórico actual.
   */
  clave_per_historico_actual: string;
  /**
   * @property {boolean} puede_capturar_representante_legal_cg
   * @description
   * Indica si se puede capturar el representante legal de la compañía general.
   */
  puede_capturar_representante_legal_cg: boolean;
}

/**
 * Inicializa el estado con los datos y operación proporcionados o valores por defecto
 * @function createDatosState
 * @description
 * Crea un estado inicial para los datos de tipo `FinalDataToSend`.
 * Este método inicializa el estado con un arreglo vacío y una cadena vacía si no se proporcionan valores.
 * @param {Partial<FinalDataToSend>} [params={}] - Un objeto parcial que contiene los datos iniciales para construir el estado.
 * @returns {FinalDataToSend} Un objeto que representa el estado inicial con los datos proporcionados o valores por defecto.
 * @example
 * const estadoInicial = createDatosState({ operacion: 'crear' });
 * console.log(estadoInicial);
 * // { datos: [], operacion: 'crear' }
 */
export function createDatosState(
  params: Partial<FinalDataToSend> = {}
): FinalDataToSend {
  return {
    esLecutra: params.esLecutra ?? false,
    rfc_solicitante: params.rfc_solicitante ?? '',
    idSolicitud: params.idSolicitud ?? null,
    lista_periodos_solicitud: params.lista_periodos_solicitud ?? [],
    numero_registro: params.numero_registro ?? '',
    clave_operacion_historica: params.clave_operacion_historica ?? '',
    mes_anio_actual_periodo:
      params.mes_anio_actual_periodo ?? formatMonthYear(new Date()),
    clave_per_historico_actual: params.clave_per_historico_actual ?? '',
    puede_capturar_representante_legal_cg:
      params.puede_capturar_representante_legal_cg ?? false,
  };
}

export interface PeriodoCatalogo {
  /** Identificador único del catálogo. */
  id: number;
  /** Descripción del catálogo. */
  descripcion: string;
  /** Clave opcional del catálogo. */
  clave?: string;
  /** Tamaño opcional del catálogo. */
  relacionadaUmtId?: number;
  /** Identificador relacionado con acotación opcional. */
  relacionadaAcotacionId?: number;
  /** Decripcion del titulo del select, cuando se requiera. */
  title?: string;
  /** Año inicial del periodo. */
  inicial?: number;
  /** Año final del periodo. */
  final?: number;
}
