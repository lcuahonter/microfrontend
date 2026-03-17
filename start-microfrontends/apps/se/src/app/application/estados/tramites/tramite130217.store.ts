import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { PartidasDeLaMercanciaModelo } from '../../shared/models/partidas-de-la-mercancia.model';

/**
 * @description
 * Interfaz que define la estructura del estado para Tramite130217.
 */
export interface Tramite130217State {
  /**
   * ID de la solicitud asociada al trámite.
   */
  idSolicitud: number;
  /** Nombre del producto */
  producto: string;
  /** Descripción del producto */
  descripcion: string;
  /** Fracción o clasificación del producto */
  fraccion: string;
  /** Cantidad del producto */
  cantidad: string;
  /** Valor del producto en USD */
  valorPartidaUSD: number;
  /** Unidad de medida del producto */
  unidadMedida: string;
  /** Tipo de solicitud */
  solicitud: string;
  /** Selección predeterminada para los desplegables */
  defaultSelect: string;
  /** Tipo de producto predeterminado */
  defaultProducto: string;
  /** Tipo de régimen */
  regimen: string;
  /** Clasificación */
  clasificacion: string;
  /** Fila seleccionada en la tabla */
  filaSeleccionada: PartidasDeLaMercanciaModelo[];
  /** Cantidad de partidas de la mercancía */
  cantidadPartidasDeLaMercancia: string;
  /** Valor en USD de las partidas de la mercancía */
  valorPartidaUSDPartidasDeLaMercancia: string;
  /** Descripción de las partidas de la mercancía */
  descripcionPartidasDeLaMercancia: string;
  /** Valor de la factura en USD */
  valorFacturaUSD: string;
  /** Bloque o región */
  bloque: string;
  /** Uso específico del producto */
  usoEspecifico: string;
  /** Justificación para la importación/exportación */
  justificacionImportacionExportacion: string;
  /** Observaciones adicionales */
  observaciones: string;
  /** Información de la entidad */
  entidad: string;
  /** Información de la representación */
  representacion: string;
  /** Indicador para mostrar u ocultar la tabla */
  mostrarTabla: boolean;

  /** Lista de partidas de la mercancía asociadas al trámite. */
  tableBodyData: PartidasDeLaMercanciaModelo[];

  /**
   * Formulario para modificar las partidas de la mercancía.
   */
  modificarPartidasDelaMercanciaForm: {
    /** Cantidad de partidas de la mercancía */
    cantidadPartidasDeLaMercancia: string;
    /** Valor en USD de las partidas de la mercancía */
    valorPartidaUSDPartidasDeLaMercancia: string;
    /** Descripción de las partidas de la mercancía */
    descripcionPartidasDeLaMercancia: string;
  };

  /**   
   * Cantidad total de las partidas de la mercancía.
   */
  cantidadTotal: string;
  /**   
   * Valor total en USD de las partidas de la mercancía.
   */
  valorTotalUSD: string;

  /**   
    * Fechas seleccionadas en el formulario.
    */
  fechasSeleccionadas: string[];
  
}

/**
 * @description
 * Crea el estado inicial para Tramite130217.
 * @returns El objeto con el estado inicial.
 */
export function createInitialState(): Tramite130217State {
  return {
    idSolicitud: 0,
    filaSeleccionada: [],
    mostrarTabla: false,
    solicitud: '',
    fraccion: '',
    defaultSelect: 'TISOL.I',
    producto: 'CONDMER.U',
    descripcion: '',
    cantidad: '',
    valorPartidaUSD: 0,
    unidadMedida: '',
    defaultProducto: 'CONDMER.U',
    regimen: '',
    clasificacion: '',
    cantidadPartidasDeLaMercancia: '',
    valorPartidaUSDPartidasDeLaMercancia: '',
    descripcionPartidasDeLaMercancia: '',
    valorFacturaUSD: '',
    bloque: '',
    usoEspecifico: '',
    justificacionImportacionExportacion: '',
    observaciones: '',
    entidad: '',
    representacion: '',
    tableBodyData: [],
    modificarPartidasDelaMercanciaForm: {
      cantidadPartidasDeLaMercancia: '',
      valorPartidaUSDPartidasDeLaMercancia: '',
      descripcionPartidasDeLaMercancia: '',
    },
    cantidadTotal: '',
    valorTotalUSD: '',
    fechasSeleccionadas: [],
  };
}

/**
 * @description
 * Clase Store para gestionar el estado de Tramite130217 utilizando Akita.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite130217' })
export class Tramite130217Store extends Store<Tramite130217State> {
  constructor() {
    super(createInitialState());
  }

  
  /**
   * Actualiza el estado del store con los valores proporcionados.
   * Valores a actualizar en el estado.
   */
  public actualizarEstado(valores: Partial<Tramite130217State>): void {
    this.update((state) => ({
      ...state,
      ...valores,
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
    * Restablece el estado de la tienda a su estado inicial.
    */
  resetStore(): void {
    this.reset();
  }

}