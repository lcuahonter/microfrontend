import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { ProgramasReporte } from '../models/programas-reporte.model';

/**
 * @description
 * Interfaz que define la estructura del estado de la solicitud 150103.
 * Contiene los campos requeridos para la gestión del reporte anual.
 */
export interface Solicitud150103State {
  /** ID de la solicitud */
  idSolicitud: number;

  /** Fecha de inicio del reporte */
  inicio: string;

  /** Fecha de fin del reporte */
  fin: string;

  /** Folio del programa asociado */
  folioPrograma: string;

  /** Modalidad del programa */
  modalidad: string;

  /** Tipo de programa */
  tipoPrograma: string;

  /** Estatus del programa */
  estatus: string;

  /** Total de ventas reportadas */
  ventasTotales: string;

  /** Total de exportaciones reportadas */
  totalExportaciones: string;

  /** Total de importaciones reportadas */
  totalImportaciones: string;

  /** Saldo calculado del reporte */
  saldo: string;

  /** Porcentaje de exportación calculado */
  porcentajeExportacion: string;

  /** solicitudDato */
  solicitudDato?: ProgramasReporte[];

  /**
   * Índice del registro del programa.
   * Este valor numérico representa la posición o el identificador del registro específico
   * dentro del conjunto de datos del programa.
   */
  indiceDeRegistroDelPrograma: number;
  
}

/**
 * @function createInitialState
 * @description
 * Función que crea y retorna el estado inicial para el store de la solicitud 150103.
 * Este estado inicial incluye valores por defecto para todos los campos relacionados con el reporte anual.
 *
 * @returns {Solicitud150103State} El objeto de estado inicial para la solicitud 150103.
 */
export function createInitialState(): Solicitud150103State {
  return {
    idSolicitud: 0,
    inicio: '',
    fin: '',
    folioPrograma: '',
    modalidad: '',
    tipoPrograma: '',
    estatus: '',
    ventasTotales: '',
    totalExportaciones: '',
    totalImportaciones: '0',
    saldo: '0',
    porcentajeExportacion: '0',
    solicitudDato: [],
    indiceDeRegistroDelPrograma:-1,
  };
}

/**
 * @class Solicitud150103Store
 * @extends Store<Solicitud150103State>
 * 
 * @description
 * Store especializado para gestionar el estado de la solicitud 150103.
 * Proporciona métodos para actualizar campos individuales del estado relacionados con el reporte,
 * como fechas, folio, modalidad, tipo, estatus, totales y porcentajes.
 * Incluye funcionalidad para restablecer el estado a sus valores iniciales, útil para limpiar formularios
 * o iniciar nuevas solicitudes.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'solicitud150103Store', resettable: true })
export class Solicitud150103Store extends Store<Solicitud150103State> {
  /**
   * @description
   * Constructor que inicializa el store con su estado inicial.
   */
  constructor() {
    super(createInitialState());
  }

  /** Actualiza la fecha de inicio del reporte. */
  actualizarInicio(inicio: string): void {
    this.update(state => ({ ...state, inicio }));
  }

  /** Actualiza la fecha de fin del reporte. */
  actualizarFin(fin: string): void {
    this.update(state => ({ ...state, fin }));
  }

  /** Actualiza el folio del programa asociado. */
  actualizarFolioPrograma(folioPrograma: string): void {
    this.update(state => ({ ...state, folioPrograma }));
  }

  /** Actualiza la modalidad del programa. */
  actualizarModalidad(modalidad: string): void {
    this.update(state => ({ ...state, modalidad }));
  }

  /** Actualiza el tipo de programa. */
  actualizarTipoPrograma(tipoPrograma: string): void {
    this.update(state => ({ ...state, tipoPrograma }));
  }

  /** Actualiza el estatus del programa. */
  actualizarEstatus(estatus: string): void {
    this.update(state => ({ ...state, estatus }));
  }

  /** Actualiza el total de ventas. */
  actualizarVentasTotales(ventasTotales: string): void {
    this.update(state => ({ ...state, ventasTotales }));
  }

  /** Actualiza el total de exportaciones. */
  actualizarTotalExportaciones(totalExportaciones: string): void {
    this.update(state => ({ ...state, totalExportaciones }));
  }

  /** Actualiza el total de importaciones. */
  actualizarTotalImportaciones(totalImportaciones: string): void {
    this.update(state => ({ ...state, totalImportaciones }));
  }

  /** Actualiza el saldo calculado del reporte. */
  actualizarSaldo(saldo: string): void {
    this.update(state => ({ ...state, saldo }));
  }

  /** Actualiza el porcentaje de exportación. */
  actualizarPorcentajeExportacion(porcentajeExportacion: string): void {
    this.update(state => ({ ...state, porcentajeExportacion }));
  }

  /** Actualiza el ID de la solicitud. */
  setIdSolicitud(idSolicitud: number): void {
    this.update(state => ({ ...state, idSolicitud }));
  }

  /**
   * Actualiza el estado de la solicitud anual con nuevos datos.
   * @param nuevoDatos Nuevo estado de la solicitud anual.
   */
  public setSolicitusDatos(solicitudDato: ProgramasReporte[]): void {
    this.update((state) => ({
      ...state,
      solicitudDato,
    }));
  }

  /**
 * Actualiza el índice del registro del programa en el estado.
 * 
 * @param indiceDeRegistroDelPrograma - Nuevo valor numérico que representa el índice del registro.
 */
  actualizarIndiceDeRegistroDelPrograma(indiceDeRegistroDelPrograma: number): void {
    this.update((state) => ({
      ...state,
      indiceDeRegistroDelPrograma,
    }));
  }

  /**
   * Restablece el estado del store a sus valores iniciales.
   * Se utiliza cuando se requiere limpiar el formulario o iniciar una nueva solicitud.
   */
  resetStore(): void {
    this.reset();
  }
}
