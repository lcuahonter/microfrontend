import { BienesProducidos } from '../models/programas-reporte.model';
import { Injectable } from '@angular/core';
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * @description Interfaz que define el estado de la solicitud.
 * Contiene propiedades relacionadas con los datos de reporte anual.
 */
export interface Solicitud150102State {
   idSolicitud: number | null;
  /** Fecha de inicio del reporte */
  inicio: string;
  /** Fecha de fin del reporte */
  fin: string;
  /** Folio del programa asociado a la solicitud */
  folioPrograma: string;
  /**
   * Índice del registro del programa.
   * Este valor numérico representa la posición o el identificador del registro específico
   * dentro del conjunto de datos del programa.
   */
  indiceDeRegistroDelPrograma: number;
  /** Modalidad del programa */
  modalidad: string;
  /** Tipo de programa */
  tipoPrograma: string;
  /** Estatus del programa */
  estatus: string;
  /** Ventas totales */
  ventasTotales: string;
  /** Total de exportaciones */
  totalExportaciones: string;
  /** Total de importaciones */
  totalImportaciones: string;
  /** Saldo calculado */
  saldo: string;
  /** Porcentaje de exportación calculado */
  porcentajeExportacion: string;
  /** Lista de bienes producidos */
  producidosDatos: BienesProducidos[];
  /**
   * @description Arreglo que contiene los datos de los bienes producidos.
   * Cada elemento del arreglo es de tipo `BienesProducidos` y representa
   * un bien con sus respectivas características y detalles.
   */
  bienesProducidosDatos: BienesProducidos[];
  /** Identificador compuesto del programa */
  idProgramaCompuesto: string;
}

/**
 * @description Función que crea el estado inicial de la solicitud.
 * @returns El estado inicial de la solicitud con valores predeterminados.
 * @function createInitialState
 * @returns {Solicitud150102State} Estado inicial de la solicitud.
 *
 */
export function createInitialState(): Solicitud150102State {
  return {
    idSolicitud: 0,
    inicio: '',
    fin: '',
    folioPrograma: '',
    indiceDeRegistroDelPrograma:-1,
    modalidad: '',
    tipoPrograma: '',
    estatus: '',
    ventasTotales: '',
    totalExportaciones: '',
    totalImportaciones: '0',
    saldo: '0',
    porcentajeExportacion: '0',
    producidosDatos: [],
    bienesProducidosDatos: [],
    idProgramaCompuesto: '',
  };
}

/**
 * @description Servicio que gestiona el estado de la solicitud utilizando Akita.
 * Proporciona métodos para actualizar distintas propiedades del estado.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'solicitud150102Store', resettable: true })
/**
 * @description Servicio que gestiona el estado de la solicitud utilizando Akita.
 * Proporciona métodos para actualizar distintas propiedades del estado.
 * @class Solicitud150102Store
 */
export class Solicitud150102Store extends Store<Solicitud150102State> {
  /**
   * @description Constructor que inicializa el store con el estado inicial.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * @description Actualiza el identificador de la solicitud.
   * @param idSolicitud Identificador de la solicitud como un número.
   */
  actualizarIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }
  /**
   * @description Actualiza la fecha de fin del reporte.
   * @param fin Fecha de fin como una cadena.
   */
  actualizarFin(fin: string): void {
    this.update((state) => ({
      ...state,
      fin,
    }));
  }

  /**
   * @description Actualiza el folio del programa.
   * @param folioPrograma Folio del programa como una cadena.
   */
  actualizarFolioPrograma(folioPrograma: string): void {
    this.update((state) => ({
      ...state,
      folioPrograma,
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
   * @description Actualiza la modalidad del programa.
   * @param modalidad Modalidad del programa como una cadena.
   */
  actualizarModalidad(modalidad: string): void {
    this.update((state) => ({
      ...state,
      modalidad,
    }));
  }

  /**
   * @description Actualiza el tipo de programa.
   * @param tipoPrograma Tipo de programa como una cadena.
   */
  actualizarTipoPrograma(tipoPrograma: string): void {
    this.update((state) => ({
      ...state,
      tipoPrograma,
    }));
  }

  /**
   * @description Actualiza el estatus del programa.
   * @param estatus Estatus del programa como una cadena.
   */
  actualizarEstatus(estatus: string): void {
    this.update((state) => ({
      ...state,
      estatus,
    }));
  }

  /**
   * @description Actualiza la fecha de inicio del reporte.
   * @param inicio Fecha de inicio como una cadena.
   */
  actualizarInicio(inicio: string): void {
    this.update((state) => ({
      ...state,
      inicio,
    }));
  }

  /**
   * @description Actualiza las ventas totales.
   * @param ventasTotales Ventas totales como una cadena.
   */
  actualizarVentasTotales(ventasTotales: string): void {
    this.update((state) => ({
      ...state,
      ventasTotales,
    }));
  }

  /**
   * @description Actualiza el total de exportaciones.
   * @param totalExportaciones Total de exportaciones como una cadena.
   */
  actualizarTotalExportaciones(totalExportaciones: string): void {
    this.update((state) => ({
      ...state,
      totalExportaciones,
    }));
  }

  /**
   * @description Actualiza el total de importaciones.
   * @param totalImportaciones Total de importaciones como una cadena.
   */
  actualizarTotalImportaciones(totalImportaciones: string): void {
    this.update((state) => ({
      ...state,
      totalImportaciones,
    }));
  }

  /**
   * @description Actualiza el saldo calculado.
   * @param saldo Saldo como una cadena.
   */
  actualizarSaldo(saldo: string): void {
    this.update((state) => ({
      ...state,
      saldo,
    }));
  }

  /**
   * @description Actualiza el porcentaje de exportación calculado.
   * @param porcentajeExportacion Porcentaje de exportación como una cadena.
   */
actualizarPorcentajeExportacion(porcentajeExportacion: string): void {
  this.update((state) => {
    if (state.porcentajeExportacion === porcentajeExportacion) {
      return state;
    }

    return {
      ...state,
      porcentajeExportacion,
    };
  });
}


  /**
   * @description Actualiza la lista de bienes producidos.
   * @param producidosDatos Arreglo de bienes producidos.
   */
  actualizarProducidosDatos(producidosDatos: BienesProducidos[]): void {
    this.update((state) => ({
      ...state,
      producidosDatos,
    }));
  }

  /**
   * @description Actualiza la lista de bienes producidos.
   * @param bienesProducidosDatos Arreglo de bienes producidos.
   */
  actualizarBienesProducidosDatos(
    bienesProducidosDatos: BienesProducidos[]
  ): void {
    this.update((state) => ({
      ...state,
      bienesProducidosDatos,
    }));
  }

  /**
   * @description Actualiza el identificador compuesto del programa.
   * @param idProgramaCompuesto Identificador compuesto del programa como una cadena.
   */
  actualizarIdProgramaCompuesto(idProgramaCompuesto: string): void {
    this.update((state) => ({
      ...state,
      idProgramaCompuesto,
    }));
  }

  /**
   * Restablece el estado de la tienda a su estado inicial.
   */
  resetStore(): void {
    this.reset();
  }
}
